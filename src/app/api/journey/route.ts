import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { generateDefaultStages } from '@/lib/data/defaultJourneys';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, city, purpose, duration, persona, additionalNeeds, apiKey, provider } = await req.json();

    const prompt = `Origin: ${origin}\nDestination: ${destination}\nCity: ${city || 'Capital'}\nPurpose: ${purpose}\nDuration: ${duration}\nPersona: ${persona}\nSpecific notes: ${additionalNeeds || 'None'}\nGenerate the 6-stage journey timeline in valid JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.journeyGeneration,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    if (aiRes.error) {
      // Return default stages gracefully with error notice
      const fallbackStages = generateDefaultStages(origin || 'Origin', destination || 'Destination', purpose || 'study');
      return NextResponse.json({
        success: false,
        warning: aiRes.error,
        stages: fallbackStages,
      });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      if (parsed.stages && Array.isArray(parsed.stages)) {
        return NextResponse.json({ success: true, stages: parsed.stages });
      }
      throw new Error('Invalid stages format');
    } catch {
      const fallbackStages = generateDefaultStages(origin || 'Origin', destination || 'Destination', purpose || 'study');
      return NextResponse.json({ success: true, stages: fallbackStages });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Journey generation failed' }, { status: 500 });
  }
}
