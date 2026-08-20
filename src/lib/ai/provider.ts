export interface AICompletionOptions {
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  apiKey?: string;
  provider?: string;
}

export interface AIResponse {
  content: string;
  error?: string;
  errorCode?: 'AI_KEY_MISSING' | 'AI_AUTH_ERROR' | 'AI_QUOTA_ERROR' | 'AI_PROVIDER_ERROR';
  provider: string;
  modelUsed?: string;
  latencyMs?: number;
}

// In-memory cache to optimize response latency and minimize redundant API usage
const responseCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes cache

// Candidate Gemini models to cascade through if 429 quota or 503 spike occurs
const GEMINI_FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
];


/**
 * Agnostic AI Completion caller supporting Gemini, OpenAI, Anthropic with automatic model failover
 */
export async function callAI(options: AICompletionOptions): Promise<AIResponse> {
  const startTime = Date.now();
  const provider = (options.provider || process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const apiKey = (options.apiKey || process.env.LLM_API_KEY || '').trim();

  if (!apiKey) {
    return {
      content: '',
      error: 'AI API key is not configured. Please set your API key in Settings (⚙️) or .env.local',
      errorCode: 'AI_KEY_MISSING',
      provider,
      latencyMs: Date.now() - startTime,
    };
  }

  // Check cache
  const cacheKey = `${provider}:${options.jsonMode ? 'json' : 'text'}:${options.systemPrompt || ''}:${options.prompt}`;
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      content: cached.content,
      provider: `${provider} (cached)`,
      latencyMs: Date.now() - startTime,
    };
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[WASL-AI] Calling provider: ${provider}, jsonMode: ${!!options.jsonMode}, promptLength: ${options.prompt.length}`);
  }

  try {
    let result: AIResponse;
    if (provider === 'gemini' || provider === 'google') {
      result = await callGeminiWithFallbacks(apiKey, options);
    } else if (provider === 'openai') {
      result = await callOpenAI(apiKey, options);
    } else if (provider === 'anthropic') {
      result = await callAnthropic(apiKey, options);
    } else {
      result = await callGeminiWithFallbacks(apiKey, options);
    }

    result.latencyMs = Date.now() - startTime;

    // Cache successful response
    if (result.content && !result.error) {
      responseCache.set(cacheKey, { content: result.content, timestamp: Date.now() });
      if (process.env.NODE_ENV === 'development') {
        console.log(`[WASL-AI] Success via ${result.provider} in ${result.latencyMs}ms`);
      }
    }

    return result;
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`[WASL-AI] Error calling provider [${provider}]:`, err.message);

    let errorCode: AIResponse['errorCode'] = 'AI_PROVIDER_ERROR';
    if (err.message.includes('400') || err.message.includes('API key not valid') || err.message.includes('INVALID_ARGUMENT')) {
      errorCode = 'AI_AUTH_ERROR';
    } else if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      errorCode = 'AI_QUOTA_ERROR';
    }

    return {
      content: '',
      error: err.message || 'AI request failed. Please check your connection and API key.',
      errorCode,
      provider,
      latencyMs,
    };
  }
}

/**
 * Google Gemini API Multi-Model Cascade
 */
async function callGeminiWithFallbacks(apiKey: string, options: AICompletionOptions): Promise<AIResponse> {
  const configuredModel = process.env.GEMINI_MODEL;
  const modelsToTry = configuredModel
    ? [configuredModel, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== configuredModel)]
    : GEMINI_FALLBACK_MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const contents: any[] = [];
      if (options.systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `[SYSTEM INSTRUCTIONS]:\n${options.systemPrompt}` }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I will strictly adhere to these instructions and format requirements.' }],
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: options.prompt }],
      });

      const body: any = {
        contents,
        generationConfig: {
          temperature: options.temperature ?? 0.2,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      };

      if (options.jsonMode) {
        body.generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        // If Model Not Found (404) or Rate Limited (429) or Busy (503), try next candidate model
        if (res.status === 404 || res.status === 429 || res.status === 503) {
          lastError = new Error(`Gemini (${model}) status ${res.status}: ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { content: text, provider: `gemini (${model})`, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      if (err.message.includes('400') || err.message.includes('API key not valid')) {
        // Invalid key applies to all models, so throw immediately
        throw err;
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models exhausted.');
}

/**
 * OpenAI API Integration
 */
async function callOpenAI(apiKey: string, options: AICompletionOptions): Promise<AIResponse> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const messages: any[] = [];

  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: options.prompt });

  const body: any = {
    model: 'gpt-4o-mini',
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 2048,
  };

  if (options.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { content: text, provider: 'openai', modelUsed: 'gpt-4o-mini' };
}

/**
 * Anthropic API Integration
 */
async function callAnthropic(apiKey: string, options: AICompletionOptions): Promise<AIResponse> {
  const url = 'https://api.anthropic.com/v1/messages';

  const body: any = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.2,
    system: options.systemPrompt || '',
    messages: [{ role: 'user', content: options.prompt }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { content: text, provider: 'anthropic', modelUsed: 'claude-3-5-sonnet-20241022' };
}

