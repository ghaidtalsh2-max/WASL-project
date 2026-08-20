import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { getDefaultPhrases } from '@/lib/data/defaultJourneys';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, destinationCity, purpose, apiKey, provider } = await req.json();

    const destCountry = destination || 'Japan';
    const city = destinationCity || 'Tokyo';
    const originCountry = origin || 'Saudi Arabia';

    const prompt = `Origin: ${originCountry}\nDestination: ${destCountry}\nCity/Area: ${city}\nPurpose: ${purpose || 'Study/Travel'}\nGenerate practical everyday situational phrases and distinct Local Favorites in JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.localLanguage,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    if (aiRes.error) {
      const fallback = getDefaultPhrases(destCountry, city);
      return NextResponse.json({ success: true, languageData: fallback, warning: aiRes.error, errorCode: aiRes.errorCode });
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (parsed && parsed.phrases && Array.isArray(parsed.phrases)) {
      return NextResponse.json({
        success: true,
        provider: aiRes.provider,
        languageData: {
          phrases: parsed.phrases,
          localFavorites: parsed.localFavorites || [],
          languageName: parsed.languageName || `Local Language (${destCountry})`,
          languageCode: parsed.languageCode || 'en-US',
        },
      });
    }

    const fallback = getDefaultPhrases(destCountry, city);
    return NextResponse.json({ success: true, languageData: fallback });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Local language generation failed' }, { status: 500 });
  }
}

