import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { getDefaultCulture } from '@/lib/data/defaultJourneys';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, destinationCity, purpose, apiKey, provider } = await req.json();

    const destCountry = destination || 'Japan';
    const city = destinationCity || 'Tokyo';
    const originCountry = origin || 'Saudi Arabia';

    const prompt = `Origin: ${originCountry}\nDestination: ${destCountry}\nCity/Area: ${city}\nPurpose: ${purpose || 'Study/Travel'}\nGenerate comprehensive WASL Culture Sense guidance in JSON according to the schema (Part A: knowTheCulture with 11 dimensions, Part B: howToBehave with dos, donts, goodToKnow, and disclaimer).`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.cultureGuidance,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    if (aiRes.error) {
      const fallback = getDefaultCulture(destCountry, city);
      return NextResponse.json({ success: true, culture: fallback, warning: aiRes.error });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      // Validate schema has knowTheCulture and howToBehave
      if (parsed.knowTheCulture && parsed.howToBehave) {
        return NextResponse.json({ success: true, culture: parsed });
      }
      const fallback = getDefaultCulture(destCountry, city);
      return NextResponse.json({ success: true, culture: fallback });
    } catch {
      const fallback = getDefaultCulture(destCountry, city);
      return NextResponse.json({ success: true, culture: fallback });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Culture generation failed' }, { status: 500 });
  }
}
