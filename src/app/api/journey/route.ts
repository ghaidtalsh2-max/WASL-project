import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { generateDefaultStages, getDefaultTourismOptions, parseDurationToDays } from '@/lib/data/defaultJourneys';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

export async function POST(req: NextRequest) {
  try {
    const {
      origin,
      destination,
      destinationCity,
      city,
      purpose,
      duration,
      durationText,
      travelParty,
      budget,
      interests,
      persona,
      additionalNeeds,
      apiKey,
      provider,
    } = await req.json();

    const targetCity = destinationCity || city || 'Capital';
    const normPurpose = (purpose || 'tourism').toLowerCase();
    const activeDuration = durationText || duration || '2 weeks';
    const totalDays = parseDurationToDays(activeDuration);

    const prompt = `Origin: ${origin}\nDestination: ${destination}\nCity: ${targetCity}\nPurpose: ${purpose}\nTravel Party: ${travelParty || 'solo'}\nBudget: ${budget || 'moderate'}\nDuration: ${activeDuration} (${totalDays} full days)\nInterests: ${(interests || []).join(', ')}\nPersona: ${persona}\nSpecific notes: ${additionalNeeds || 'None'}\nGenerate the personalized 5-phase journey timeline (01 Before You Go, 02 Travel Day, 03 When You Arrive, 04 While You're There, 05 Before You Return) and two full-duration tourism options (Option A Balanced Highlights vs Option B Relaxed & Hidden Gems) for all ${totalDays} days in strictly valid JSON matching schema.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.journeyGeneration,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.3,
    });

    const fallbackStages = generateDefaultStages(origin || 'Origin', destination || 'Destination', normPurpose, targetCity);
    const fallbackTourismOptions = getDefaultTourismOptions(destination || 'Destination', targetCity, activeDuration, interests, travelParty);

    if (aiRes.error) {
      return NextResponse.json({
        success: false,
        warning: aiRes.error,
        errorCode: aiRes.errorCode,
        stages: fallbackStages,
        tourismOptions: fallbackTourismOptions,
      });
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (parsed && parsed.stages && Array.isArray(parsed.stages)) {
      return NextResponse.json({
        success: true,
        provider: aiRes.provider,
        stages: parsed.stages,
        tourismOptions: Array.isArray(parsed.tourismOptions) && parsed.tourismOptions.length > 0
          ? parsed.tourismOptions
          : fallbackTourismOptions,
      });
    }

    return NextResponse.json({
      success: true,
      stages: fallbackStages,
      tourismOptions: fallbackTourismOptions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Journey generation failed' }, { status: 500 });
  }
}

