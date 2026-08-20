import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { COUNTRIES, findCountry } from '@/lib/data/countries';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

function buildFallbackExtraction(text: string) {
  const textLower = text.toLowerCase();
  const hasDays = textLower.includes('day') || textLower.includes('يوم') || textLower.includes('أيام');
  const hasWeeks = textLower.includes('week') || textLower.includes('أسبوع') || textLower.includes('اسبوع');
  const hasMonths = textLower.includes('month') || textLower.includes('شهر') || textLower.includes('أشهر');
  const hasYear = textLower.includes('year') || textLower.includes('سنة') || textLower.includes('عام');
  const hasDuration = hasDays || hasWeeks || hasMonths || hasYear;
  const durationCategory = hasDays ? 'days' : hasWeeks ? 'weeks' : hasMonths ? 'months' : hasYear ? 'yearPlus' : null;

  const hasHotel = textLower.includes('hotel') || textLower.includes('فندق') || textLower.includes('airbnb') || textLower.includes('سكن') || textLower.includes('booked') || textLower.includes('حجزت');
  const hasAccommodation = hasHotel;

  const matchedDest = COUNTRIES.find(
    (c) =>
      textLower.includes(c.name.toLowerCase()) ||
      textLower.includes(c.nameAr) ||
      c.famousCities.some((fc) => textLower.includes(fc.name.toLowerCase()) || textLower.includes(fc.nameAr))
  );
  const hasDestination = !!matchedDest;

  const missing: any[] = [];
  if (!hasDuration) {
    missing.push({
      id: 'duration',
      questionEn: 'How long will you be traveling?',
      questionAr: 'كم المدة المقررة لرحلتك؟',
      type: 'choice',
      choices: [
        { value: 'days', labelEn: 'A few days (3-7 days)', labelAr: 'عدة أيام (3-7 أيام)' },
        { value: 'weeks', labelEn: '1-3 Weeks', labelAr: '1-3 أسابيع' },
        { value: 'months', labelEn: 'A few months', labelAr: 'عدة أشهر' },
        { value: 'yearPlus', labelEn: '1+ Year', labelAr: 'سنة فأكثر' },
      ],
    });
  }
  if (!hasDestination) {
    missing.push({
      id: 'destination_status',
      questionEn: 'Do you already have a destination / city in mind?',
      questionAr: 'هل لديك وجهة أو مدينة محددة في بالك؟',
      type: 'choice',
      choices: [
        { value: 'yes', labelEn: 'Yes, I have a destination in mind', labelAr: 'نعم، لدي وجهة محددة' },
        { value: 'no_plan', labelEn: 'No, create a plan for me', labelAr: 'لا، صمم لي خطة متكاملة' },
      ],
    });
  }
  if (!hasAccommodation) {
    missing.push({
      id: 'accommodation',
      questionEn: 'Do you already have accommodation arranged?',
      questionAr: 'هل قمت بحجز مكان الإقامة بالفعل؟',
      type: 'choice',
      choices: [
        { value: 'booked', labelEn: 'Yes, already booked', labelAr: 'نعم، قمت بالحجز مسبقاً' },
        { value: 'not_booked', labelEn: 'No, looking for recommendations', labelAr: 'لا، أبحث عن توصيات' },
      ],
    });
  }

  return {
    success: true,
    extracted: {
      origin: null,
      destination: matchedDest || null,
      destinationCity: matchedDest?.capital || null,
      duration: durationCategory || null,
      accommodationStatus: hasHotel ? 'booked' : 'unknown',
      hasDestination,
      hasDuration,
      hasAccommodation,
      interests: [],
      travelStyle: null,
      dates: null,
      purpose: 'travel',
      persona: 'Traveler',
      preferences: '',
      additionalNeeds: text,
    },
    missingQuestions: missing,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, provider, conversationHistory } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }

    const prompt = `User statement: "${text}"
Analyze what information is already specified and determine which of the 3 required items are still missing:
1. Trip duration ("How long will you be traveling?")
2. Destination status ("Do you already have a destination/city in mind?")
3. Accommodation status ("Do you already have accommodation?")

Return strictly valid JSON matching:
{
  "knownInfo": {
    "origin": "Country name or null",
    "destination": "Country name or null",
    "destinationCity": "City name or null",
    "hasDestination": boolean,
    "duration": "e.g. 7 days or null",
    "durationCategory": "days" | "weeks" | "months" | "yearPlus" | null,
    "hasDuration": boolean,
    "accommodationStatus": "booked" | "not_booked" | "unknown",
    "hasAccommodation": boolean,
    "dates": "dates or season or null",
    "interests": ["culture", "food", "museums", "nature", "shopping", "history", "relaxation"],
    "travelStyle": "budget" | "luxury" | "solo" | "family" | "couple" | "adventure" | null,
    "preferences": "specific user preferences or dietary notes",
    "purpose": "study" | "work" | "travel" | "relocation" | "visit" | "business" | "other",
    "persona": "Short description of traveler persona"
  },
  "missingQuestions": [
    {
      "id": "duration" | "destination_status" | "accommodation",
      "questionEn": "Conversational question in English",
      "questionAr": "سؤال محادثة ذكي بالعربية",
      "type": "choice",
      "choices": [
        { "value": "days", "labelEn": "A few days", "labelAr": "عدة أيام" }
      ]
    }
  ]
}`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.intentExtraction,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.2,
    });

    if (aiRes.error) {
      return NextResponse.json(buildFallbackExtraction(text));
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (!parsed) {
      // Fallback seamlessly if model output is not valid JSON
      return NextResponse.json(buildFallbackExtraction(text));
    }

    const known = parsed.knownInfo || parsed.extracted || parsed;
    const destMatch = known.destination ? findCountry(known.destination) : null;
    const originMatch = known.origin ? findCountry(known.origin) : null;

    const missingQuestions = Array.isArray(parsed.missingQuestions) ? parsed.missingQuestions : [];

    if (!known.hasDuration && !known.duration && !missingQuestions.some((q: any) => q.id === 'duration')) {
      missingQuestions.unshift({
        id: 'duration',
        questionEn: 'How long will you be traveling?',
        questionAr: 'كم المدة المقررة لرحلتك؟',
        type: 'choice',
        choices: [
          { value: 'days', labelEn: 'A few days (3-7 days)', labelAr: 'عدة أيام (3-7 أيام)' },
          { value: 'weeks', labelEn: '1-3 Weeks', labelAr: '1-3 أسابيع' },
          { value: 'months', labelEn: 'A few months', labelAr: 'عدة أشهر' },
          { value: 'yearPlus', labelEn: '1+ Year', labelAr: 'سنة فأكثر' },
        ],
      });
    }

    if (!known.hasDestination && !known.destination && !missingQuestions.some((q: any) => q.id === 'destination_status')) {
      missingQuestions.unshift({
        id: 'destination_status',
        questionEn: 'Do you already have a destination / city in mind?',
        questionAr: 'هل لديك وجهة أو مدينة محددة في بالك؟',
        type: 'choice',
        choices: [
          { value: 'yes', labelEn: 'Yes, I have a destination in mind', labelAr: 'نعم، لدي وجهة محددة' },
          { value: 'no_plan', labelEn: 'No, create a plan for me', labelAr: 'لا، صمم لي خطة متكاملة' },
        ],
      });
    }

    if (!known.hasAccommodation && known.accommodationStatus === 'unknown' && !missingQuestions.some((q: any) => q.id === 'accommodation')) {
      missingQuestions.push({
        id: 'accommodation',
        questionEn: 'Do you already have accommodation arranged?',
        questionAr: 'هل قمت بحجز مكان الإقامة بالفعل؟',
        type: 'choice',
        choices: [
          { value: 'booked', labelEn: 'Yes, already booked', labelAr: 'نعم، قمت بالحجز مسبقاً' },
          { value: 'not_booked', labelEn: 'No, looking for recommendations', labelAr: 'لا، أبحث عن توصيات' },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      extracted: {
        origin: originMatch,
        destination: destMatch,
        destinationCity: known.destinationCity || destMatch?.capital || null,
        duration: known.durationCategory || known.duration || null,
        hasDuration: Boolean(known.hasDuration || known.duration),
        hasDestination: Boolean(known.hasDestination || destMatch),
        hasAccommodation: Boolean(known.hasAccommodation || known.accommodationStatus === 'booked'),
        accommodationStatus: known.accommodationStatus || 'unknown',
        interests: Array.isArray(known.interests) ? known.interests : [],
        travelStyle: known.travelStyle || null,
        dates: known.dates || null,
        purpose: known.purpose || 'travel',
        persona: known.persona || 'Traveler',
        preferences: known.preferences || '',
        additionalNeeds: text,
      },
      missingQuestions,
    });
  } catch (error: any) {
    return NextResponse.json(buildFallbackExtraction(''));
  }
}
