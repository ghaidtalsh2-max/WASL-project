import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { generateDefaultStages } from '@/lib/data/defaultJourneys';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, city, purpose, duration, persona, additionalNeeds, apiKey, provider } = await req.json();

    const prompt = `Origin: ${origin}\nDestination: ${destination}\nCity: ${city || 'Capital'}\nPurpose: ${purpose}\nDuration: ${duration}\nPersona: ${persona}\nSpecific notes: ${additionalNeeds || 'None'}\nGenerate the personalized 6-stage journey timeline in valid JSON matching the schema.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.journeyGeneration,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    if (aiRes.error) {
      const fallbackStages = generateDefaultStages(origin || 'Origin', destination || 'Destination', purpose || 'study', city);
      return NextResponse.json({
        success: false,
        warning: aiRes.error,
        errorCode: aiRes.errorCode,
        stages: fallbackStages,
      });
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (parsed && parsed.stages && Array.isArray(parsed.stages)) {
      return NextResponse.json({
        success: true,
        provider: aiRes.provider,
        stages: parsed.stages,
      });
    }

    const fallbackStages = generateDefaultStages(origin || 'Origin', destination || 'Destination', purpose || 'study', city);
    return NextResponse.json({ success: true, stages: fallbackStages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Journey generation failed' }, { status: 500 });
  }
}

