import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json();
    const effectiveKey = apiKey || process.env.LLM_API_KEY;

    if (!effectiveKey) {
      return NextResponse.json(
        { success: false, error: 'No API key provided or configured in environment.' },
        { status: 400 }
      );
    }

    const response = await callAI({
      provider: provider || process.env.LLM_PROVIDER || 'gemini',
      apiKey: effectiveKey,
      prompt: 'Respond with the word "CONNECTED" only.',
      maxTokens: 10,
    });

    if (response.error) {
      return NextResponse.json(
        { success: false, error: response.error, provider: response.provider },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      provider: response.provider,
      sampleResponse: response.content.trim(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal connection error' },
      { status: 500 }
    );
  }
}
