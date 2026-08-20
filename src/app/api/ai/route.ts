import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { COUNTRIES, findCountry } from '@/lib/data/countries';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

function buildFallbackExtraction(text: string) {
  const textLower = text.toLowerCase();
  
  // 1. Detect Destination Country & City
  const matchedDest = findCountry(text) || null;
  let matchedCity: string | null = matchedDest ? matchedDest.capital : null;

  if (matchedDest) {
    for (const city of matchedDest.famousCities) {
      if (
        textLower.includes(city.name.toLowerCase()) ||
        text.includes(city.nameAr) ||
        text.includes(city.nameAr.replace(/[أإآ]/g, 'ا'))
      ) {
        matchedCity = city.nameAr || city.name;
        break;
      }
    }
  }

  // 2. Detect Origin
  let matchedOrigin = null;
  if (text.includes('سعودي') || text.includes('السعودية') || text.includes('الرياض') || text.includes('جدة') || textLower.includes('saudi')) {
    matchedOrigin = findCountry('saudi-arabia') || null;
  } else if (text.includes('مصر') || text.includes('مصري') || text.includes('القاهرة') || textLower.includes('egypt')) {
    matchedOrigin = findCountry('egypt') || null;
  } else if (text.includes('امارات') || text.includes('إمارات') || text.includes('دبي') || textLower.includes('uae')) {
    matchedOrigin = findCountry('uae') || null;
  }

  // If origin equals destination, reset origin to default Saudi Arabia if destination is foreign
  if (matchedOrigin && matchedDest && matchedOrigin.id === matchedDest.id) {
    matchedOrigin = findCountry('saudi-arabia') || null;
  }

  // 3. Detect Purpose & Persona
  let purpose: 'study' | 'work' | 'travel' | 'relocation' | 'visit' = 'travel';
  let persona = 'Traveler';

  if (text.includes('دراس') || text.includes('ابتعاث') || text.includes('مبتعث') || text.includes('جامع') || text.includes('طالب') || textLower.includes('study') || textLower.includes('student')) {
    purpose = 'study';
    persona = 'Student / مبتعث طالب';
  } else if (text.includes('عمل') || text.includes('شغل') || text.includes('وظيفة') || text.includes('مهن') || text.includes('انتداب') || textLower.includes('work') || textLower.includes('job')) {
    purpose = 'work';
    persona = 'Professional / منتدب عمل';
  } else if (text.includes('هجرة') || text.includes('استقرار') || text.includes('نقل') || text.includes('معيشة') || text.includes('اقامة') || textLower.includes('relocat')) {
    purpose = 'relocation';
    persona = 'Expat / مقيم ومستقر';
  } else if (text.includes('زيارة') || text.includes('مؤتمر') || text.includes('معرض') || textLower.includes('visit')) {
    purpose = 'visit';
    persona = 'Visitor / زائر';
  } else {
    purpose = 'travel';
    persona = 'Traveler / سائح ومستكشف';
  }

  // 4. Detect Duration
  const hasYear = text.includes('سنة') || text.includes('سنتين') || text.includes('سنوات') || text.includes('عام') || text.includes('أعوام') || textLower.includes('year');
  const hasMonths = text.includes('شهر') || text.includes('شهرين') || text.includes('أشهر') || text.includes('شهور') || textLower.includes('month');
  const hasWeeks = text.includes('أسبوع') || text.includes('اسبوع') || text.includes('أسبوعين') || text.includes('اسبوعين') || text.includes('أسابيع') || text.includes('اسابيع') || textLower.includes('week');
  const hasDays = text.includes('يوم') || text.includes('يومين') || text.includes('أيام') || text.includes('ايام') || textLower.includes('day');
  
  const hasDuration = hasYear || hasMonths || hasWeeks || hasDays;
  const durationCategory = hasYear ? 'yearPlus' : hasMonths ? 'months' : hasWeeks ? 'weeks' : hasDays ? 'days' : (purpose === 'study' ? 'yearPlus' : null);

  // 5. Detect Accommodation Status
  const hasBookedHotel = text.includes('حجزت') || text.includes('عندي سكن') || text.includes('سكن محجوز') || text.includes('جاهز السكن') || textLower.includes('booked');
  const isLookingHotel = text.includes('ما حجزت') || text.includes('بدون سكن') || text.includes('ادور') || text.includes('أدور') || text.includes('ابحث') || text.includes('أبحث');
  const accommodationStatus = hasBookedHotel ? 'booked' : isLookingHotel ? 'not_booked' : 'unknown';
  const hasAccommodation = hasBookedHotel;

  // 6. Detect Interests
  const interests: string[] = [];
  if (text.includes('ثقاف') || text.includes('متحف') || text.includes('تاريخ') || textLower.includes('culture') || textLower.includes('history')) {
    interests.push('culture', 'history');
  }
  if (text.includes('اكل') || text.includes('أكل') || text.includes('طعام') || text.includes('مطاعم') || textLower.includes('food')) {
    interests.push('food');
  }
  if (text.includes('طبيع') || text.includes('حديق') || text.includes('جبال') || textLower.includes('nature')) {
    interests.push('nature');
  }
  if (text.includes('تسوق') || text.includes('سوق') || text.includes('مول') || textLower.includes('shop')) {
    interests.push('shopping');
  }
  if (interests.length === 0) {
    interests.push('culture', 'food');
  }

  const hasDestination = !!matchedDest;

  const missing: any[] = [];
  if (!hasDuration && !durationCategory) {
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
  if (!hasAccommodation && accommodationStatus === 'unknown') {
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
      origin: matchedOrigin,
      destination: matchedDest,
      destinationCity: matchedCity,
      duration: durationCategory,
      accommodationStatus,
      hasDestination,
      hasDuration: Boolean(hasDuration || durationCategory),
      hasAccommodation,
      interests,
      travelStyle: purpose === 'study' ? 'solo' : 'cultural',
      dates: null,
      purpose,
      persona,
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
