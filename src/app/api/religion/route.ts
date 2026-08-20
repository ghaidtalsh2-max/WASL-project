import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { getDefaultReligion } from '@/lib/data/defaultJourneys';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

export async function POST(req: NextRequest) {
  try {
    const { destination, destinationCity, apiKey, provider } = await req.json();

    const destCountry = destination || 'Japan';
    const city = destinationCity || 'Tokyo';

    const prompt = `Destination Country: ${destCountry}\nCity/Area: ${city}\nProvide objective, respectful Religious Landscape insights and a dedicated, practical Muslim Traveler Guide in JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.religionContext,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    if (aiRes.error) {
      const fallback = getDefaultReligion(destCountry, city);
      return NextResponse.json({ success: true, religion: fallback, warning: aiRes.error, errorCode: aiRes.errorCode });
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (parsed && parsed.religiousLandscape && parsed.muslimTravelerGuide) {
      return NextResponse.json({ success: true, religion: parsed, provider: aiRes.provider });
    }

    const fallback = getDefaultReligion(destCountry, city);
    return NextResponse.json({ success: true, religion: fallback });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Religion context generation failed' }, { status: 500 });
  }
}

