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
  provider: string;
}

// In-memory cache to avoid re-querying identical prompts
const responseCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

// Candidate Gemini models to cascade through if 429 quota or 503 spike occurs
const GEMINI_FALLBACK_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
];

/**
 * Agnostic AI Completion caller supporting Gemini, OpenAI, Anthropic with automatic model failover
 */
export async function callAI(options: AICompletionOptions): Promise<AIResponse> {
  const provider = (options.provider || process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const apiKey = options.apiKey || process.env.LLM_API_KEY || '';

  if (!apiKey) {
    return {
      content: '',
      error: 'AI_KEY_MISSING: No LLM_API_KEY provided in environment or request.',
      provider,
    };
  }

  // Check cache
  const cacheKey = `${provider}:${options.jsonMode ? 'json' : 'text'}:${options.systemPrompt || ''}:${options.prompt}`;
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { content: cached.content, provider };
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

    // Cache successful response
    if (result.content && !result.error) {
      responseCache.set(cacheKey, { content: result.content, timestamp: Date.now() });
    }

    return result;
  } catch (err: any) {
    console.error(`Error calling AI provider [${provider}]:`, err);
    return {
      content: '',
      error: err.message || 'AI request failed. Please check your API key and connection.',
      provider,
    };
  }
}

/**
 * Google Gemini API Multi-Model Cascade
 * Automatically rotates to another active model if 429 quota or 503 high demand occurs
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
          parts: [{ text: `[SYSTEM INSTRUCTIONS]: ${options.systemPrompt}` }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I will strictly follow these instructions.' }],
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: options.prompt }],
      });

      const body: any = {
        contents,
        generationConfig: {
          temperature: options.temperature ?? 0.3,
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
        // If Rate Limit (429) or Service Busy (503) or Not Found (404), try the next model in cascade
        if (res.status === 429 || res.status === 503 || res.status === 404) {
          lastError = new Error(`Gemini model ${model} returned (${res.status}): ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { content: text, provider: `gemini (${model})` };
    } catch (err: any) {
      lastError = err;
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
    temperature: options.temperature ?? 0.3,
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
  return { content: text, provider: 'openai' };
}

/**
 * Anthropic API Integration
 */
async function callAnthropic(apiKey: string, options: AICompletionOptions): Promise<AIResponse> {
  const url = 'https://api.anthropic.com/v1/messages';

  const body: any = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.3,
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
  return { content: text, provider: 'anthropic' };
}
