import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, provider } = await req.json().catch(() => ({}));

    const testPrompt = 'Respond with JSON {"status": "ok", "echo": "WASL AI operational", "timestamp": ' + Date.now() + '}';
    
    const res = await callAI({
      systemPrompt: 'You are an AI connectivity tester. Respond strictly with the requested JSON.',
      prompt: testPrompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.1,
    });

    if (res.error) {
      return NextResponse.json({
        success: false,
        error: res.error,
        errorCode: res.errorCode,
        provider: res.provider,
        latencyMs: res.latencyMs,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      provider: res.provider,
      modelUsed: res.modelUsed,
      latencyMs: res.latencyMs,
      rawReply: res.content,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Diagnostic connection test failed',
    }, { status: 500 });
  }
}
