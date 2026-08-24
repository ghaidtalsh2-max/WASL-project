import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { COUNTRIES, findCountry, createDynamicCountry } from '@/lib/data/countries';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

function buildFallbackExtraction(text: string) {
  const textLower = text.toLowerCase();
  
  // 1. Detect Origin / Nationality first
  let matchedOrigin = null;
  if (text.includes('كويت') || text.includes('كويتية') || text.includes('كويتي') || textLower.includes('kuwait')) {
    matchedOrigin = findCountry('kuwait') || null;
  } else if (text.includes('سعودي') || text.includes('سعودية') || text.includes('السعودية') || text.includes('الرياض') || text.includes('جدة') || textLower.includes('saudi')) {
    matchedOrigin = findCountry('saudi-arabia') || null;
  } else if (text.includes('قطر') || text.includes('قطري') || textLower.includes('qatar')) {
    matchedOrigin = findCountry('qatar') || null;
  } else if (text.includes('امارات') || text.includes('إمارات') || text.includes('إماراتي') || text.includes('اماراتي') || text.includes('دبي') || textLower.includes('uae')) {
    matchedOrigin = findCountry('uae') || null;
  } else if (text.includes('مصر') || text.includes('مصري') || text.includes('مصرية') || text.includes('القاهرة') || textLower.includes('egypt')) {
    matchedOrigin = findCountry('egypt') || null;
  }

  // 2. Detect Destination Country & City
  let matchedDest = null;
  // If destination is China
  if (text.includes('صين') || text.includes('الصين') || text.includes('بكين') || text.includes('شنغهاي') || text.includes('قوانغتشو') || textLower.includes('china') || textLower.includes('beijing') || textLower.includes('shanghai')) {
    matchedDest = findCountry('china');
  } else if (text.includes('يابان') || text.includes('اليابان') || text.includes('طوكيو') || text.includes('كيوتو') || text.includes('اوساكا') || text.includes('أوساكا') || textLower.includes('japan') || textLower.includes('tokyo')) {
    matchedDest = findCountry('japan');
  } else if (text.includes('تركيا') || text.includes('اسطنبول') || text.includes('إسطنبول') || textLower.includes('turkey') || textLower.includes('istanbul')) {
    matchedDest = findCountry('turkey');
  } else if (text.includes('بريطانيا') || text.includes('لندن') || text.includes('انجلترا') || textLower.includes('uk') || textLower.includes('london')) {
    matchedDest = findCountry('united-kingdom');
  } else if (text.includes('أمريكا') || text.includes('امريكا') || text.includes('نيويورك') || textLower.includes('usa') || textLower.includes('york')) {
    matchedDest = findCountry('united-states');
  } else {
    // Search general text without origin words
    matchedDest = findCountry(text) || null;
  }

  // If origin equals destination, reset
  if (matchedOrigin && matchedDest && matchedOrigin.id === matchedDest.id) {
    if (text.includes('بروح') || text.includes('مسافر') || text.includes('سفر')) {
      matchedOrigin = findCountry('saudi-arabia') || null;
    }
  }

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

  // 3. Detect Travel Party
  let travelParty: 'solo' | 'couple' | 'family' | 'friends' | 'group' = 'solo';
  let hasTravelParty = false;
  if (text.includes('صديق') || text.includes('اصدقاء') || text.includes('أصدقاء') || text.includes('صحباتي') || text.includes('صديقاتي') || text.includes('اخوياي') || textLower.includes('friend')) {
    travelParty = 'friends';
    hasTravelParty = true;
  } else if (text.includes('عائل') || text.includes('اهلي') || text.includes('أهلي') || text.includes('اسرتي') || text.includes('أولادي') || text.includes('اطفالي') || textLower.includes('family')) {
    travelParty = 'family';
    hasTravelParty = true;
  } else if (text.includes('زوجي') || text.includes('زوجتي') || text.includes('شهر عسل') || textLower.includes('couple') || textLower.includes('honeymoon')) {
    travelParty = 'couple';
    hasTravelParty = true;
  } else if (text.includes('قروب') || text.includes('مجموعة') || textLower.includes('group')) {
    travelParty = 'group';
    hasTravelParty = true;
  } else if (text.includes('لحالي') || text.includes('لوحدي') || text.includes('بمفردي') || textLower.includes('solo')) {
    travelParty = 'solo';
    hasTravelParty = true;
  }

  // 4. Detect Purpose & Persona
  let purpose: 'tourism' | 'study' | 'work' | 'relocation' | 'medical' | 'recovery' | 'visit' = 'tourism';
  let persona = 'Traveler';
  let hasPurpose = false;

  if (text.includes('دراس') || text.includes('ابتعاث') || text.includes('مبتعث') || text.includes('جامع') || text.includes('طالب') || textLower.includes('study') || textLower.includes('student')) {
    purpose = 'study';
    persona = 'Student / مبتعث طالب';
    hasPurpose = true;
  } else if (text.includes('علاج') || text.includes('مستشف') || text.includes('طبي') || text.includes('فحوصات') || text.includes('نقاهة') || text.includes('استشفاء') || textLower.includes('medical') || textLower.includes('health') || textLower.includes('clinic')) {
    purpose = 'medical';
    persona = 'Medical & Recovery / رعاية صحية واستشفاء';
    hasPurpose = true;
  } else if (text.includes('عمل') || text.includes('شغل') || text.includes('وظيفة') || text.includes('مهن') || text.includes('انتداب') || textLower.includes('work') || textLower.includes('job')) {
    purpose = 'work';
    persona = 'Professional / منتدب عمل';
    hasPurpose = true;
  } else if (text.includes('هجرة') || text.includes('استقرار') || text.includes('نقل') || text.includes('معيشة') || text.includes('اقامة') || textLower.includes('relocat')) {
    purpose = 'relocation';
    persona = 'Expat / مقيم ومستقر';
    hasPurpose = true;
  } else if (text.includes('سياح') || text.includes('تمشية') || text.includes('استكشاف') || text.includes('اجازة') || text.includes('إجازة') || text.includes('عطلة') || textLower.includes('tourism') || textLower.includes('vacation')) {
    purpose = 'tourism';
    persona = 'Traveler / سائح ومستكشف';
    hasPurpose = true;
  } else if (text.includes('زيارة') || text.includes('مؤتمر') || text.includes('معرض') || textLower.includes('visit')) {
    purpose = 'visit';
    persona = 'Visitor / زائر';
    hasPurpose = true;
  }

  // 5. Detect Duration
  const hasYear = text.includes('سنة') || text.includes('سنتين') || text.includes('سنوات') || text.includes('عام') || text.includes('أعوام') || textLower.includes('year');
  const hasMonths = text.includes('شهر') || text.includes('شهرين') || text.includes('أشهر') || text.includes('شهور') || textLower.includes('month');
  const hasWeeks = text.includes('أسبوع') || text.includes('اسبوع') || text.includes('أسبوعين') || text.includes('اسبوعين') || text.includes('أسابيع') || text.includes('اسابيع') || textLower.includes('week');
  const hasDays = text.includes('يوم') || text.includes('يومين') || text.includes('أيام') || text.includes('ايام') || textLower.includes('day');
  
  const hasDuration = hasYear || hasMonths || hasWeeks || hasDays;
  const durationCategory = hasYear ? 'yearPlus' : hasMonths ? 'months' : hasWeeks ? 'weeks' : hasDays ? 'days' : 'weeks';

  // 6. Detect Accommodation Status & Negation
  const isNegatedAccommodation = 
    text.includes('ما عندي حجز') || 
    text.includes('ما عندي سكن') || 
    text.includes('ما حجزت') || 
    text.includes('بدون حجز') || 
    text.includes('بدون سكن') || 
    text.includes('ما حجزنا') || 
    text.includes('لم أحجز') || 
    text.includes('لم احجز') || 
    text.includes('ادور') || 
    text.includes('أدور') || 
    text.includes('ابحث') || 
    text.includes('أبحث') || 
    textLower.includes('no hotel') || 
    textLower.includes('not booked') || 
    textLower.includes('no booking');

  const isConfirmedBooked = !isNegatedAccommodation && (
    text.includes('حجزت') || 
    text.includes('حجزنا') || 
    text.includes('عندي سكن') || 
    text.includes('عندي فندق') || 
    text.includes('سكن محجوز') || 
    text.includes('جاهز السكن') || 
    textLower.includes('booked') || 
    textLower.includes('have hotel')
  );

  const accommodationStatus: 'booked' | 'not_booked' | 'unknown' = isConfirmedBooked 
    ? 'booked' 
    : isNegatedAccommodation 
      ? 'not_booked' 
      : 'unknown';
      
  const hasAccommodation = isConfirmedBooked || isNegatedAccommodation;

  // Plan preference detection
  const hasExplicitNoPlan = text.includes('ما عندي خطة') || text.includes('بدون خطة') || text.includes('ما عندي جدول') || text.includes('صمم لي خطة') || text.includes('اقترح لي');

  // 7. Detect Interests
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

  if (!hasPurpose) {
    missing.push({
      id: 'purpose',
      questionEn: 'What is the primary purpose of your trip?',
      questionAr: 'ما هو الهدف أو الغرض الأساسي من رحلتك؟',
      type: 'choice',
      choices: [
        { value: 'tourism', labelEn: 'Tourism & Cultural Discovery', labelAr: 'سياحة وزيارة واستكشاف' },
        { value: 'medical', labelEn: 'Medical Care & Recovery', labelAr: 'علاج واستشفاء صحي وفحوصات' },
        { value: 'study', labelEn: 'Study & University', labelAr: 'دراسة وابتعاث جامعي' },
        { value: 'work', labelEn: 'Work & Professional Assignment', labelAr: 'عمل وانتداب مهني' },
        { value: 'relocation', labelEn: 'Relocation & Long-term Stay', labelAr: 'استقرار وهجرة ومعيشة' },
      ],
    });
  }

  if (!hasDuration) {
    missing.push({
      id: 'duration',
      questionEn: 'How long do you plan to stay?',
      questionAr: 'كم المدة المقررة لإقامتك؟',
      type: 'choice',
      choices: [
        { value: '3_5_days', labelEn: '3 – 5 Days (Short Break)', labelAr: '3 – 5 أيام (عطلة قصيرة)' },
        { value: '1_week', labelEn: '1 Week (7 Days)', labelAr: 'أسبوع واحد (7 أيام)' },
        { value: '2_weeks', labelEn: '2 Weeks (14 Days)', labelAr: 'أسبوعين (14 يوماً)' },
        { value: '1_month', labelEn: '1 Month (30 Days)', labelAr: 'شهر كامل (30 يوماً)' },
        { value: 'yearPlus', labelEn: '1+ Year (Extended Living)', labelAr: 'سنة أو أكثر' },
      ],
    });
  }

  if (!hasTravelParty) {
    missing.push({
      id: 'travel_party',
      questionEn: 'Who are you traveling with?',
      questionAr: 'من يسافر معك في هذه الرحلة؟',
      type: 'choice',
      choices: [
        { value: 'solo', labelEn: 'Solo (Just me)', labelAr: 'بمفردي (سفر فردي)' },
        { value: 'couple', labelEn: 'Couple / Partner', labelAr: 'مع شريك الحياة (زوج/زوجة)' },
        { value: 'family', labelEn: 'Family (with children)', labelAr: 'مع العائلة والأطفال' },
        { value: 'friends', labelEn: 'Friends', labelAr: 'مع الأصدقاء' },
        { value: 'group', labelEn: 'Group tour / Colleagues', labelAr: 'ضمن مجموعة أو زملاء' },
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
        { value: 'not_booked', labelEn: 'No, looking for recommendations & booking links', labelAr: 'لا، لم أحجز (أبحث عن توصيات وروابط مباشرة)' },
      ],
    });
  }

  return {
    success: true,
    extracted: {
      origin: matchedOrigin || findCountry('saudi-arabia'),
      destination: matchedDest,
      destinationCity: matchedCity,
      travelParty,
      budget: 'moderate',
      duration: durationCategory,
      accommodationStatus,
      hasDestination,
      hasDuration: Boolean(hasDuration || durationCategory),
      hasAccommodation,
      hasTravelParty,
      interests,
      travelStyle: travelParty,
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
    const { text, apiKey, provider, allowFallback } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }

    const prompt = `User raw input:
"""
${text}
"""

Extract all travel parameters with strict precision. Nationality/origin is NOT the destination. Return strictly valid JSON matching schema.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.intentExtraction,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.1,
    });

    if (aiRes.error) {
      if (allowFallback) {
        return NextResponse.json(buildFallbackExtraction(text));
      }
      return NextResponse.json({
        success: false,
        error: aiRes.error,
        errorCode: aiRes.errorCode || 'AI_PROVIDER_ERROR',
        provider: aiRes.provider,
      }, { status: 400 });
    }

    const parsed = safeParseJSON<any>(aiRes.content);
    if (!parsed) {
      if (allowFallback) {
        return NextResponse.json(buildFallbackExtraction(text));
      }
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI structured response. Please try again.',
        errorCode: 'AI_PROVIDER_ERROR',
      }, { status: 500 });
    }

    const known = parsed.knownInfo || parsed.extracted || parsed;

    // Resolve Origin
    let originMatch = known.origin ? findCountry(known.origin) : null;
    if (!originMatch && known.originAr) {
      originMatch = findCountry(known.originAr);
    }
    if (!originMatch) {
      if (text.includes('كويت') || text.includes('كويتية') || text.includes('كويتي')) originMatch = findCountry('kuwait');
      else if (text.includes('سعودي') || text.includes('سعودية') || text.includes('السعودية')) originMatch = findCountry('saudi-arabia');
      else if (text.includes('قطر') || text.includes('قطري')) originMatch = findCountry('qatar');
      else if (text.includes('امارات') || text.includes('إمارات') || text.includes('اماراتي')) originMatch = findCountry('uae');
      else if (text.includes('مصر') || text.includes('مصري')) originMatch = findCountry('egypt');
    }

    // Resolve Destination (Dynamic for ANY country worldwide)
    let destMatch = null;
    if (known.destination) {
      destMatch = findCountry(known.destination) || (known.destinationAr ? findCountry(known.destinationAr) : null);
      if (!destMatch) {
        destMatch = createDynamicCountry(known.destination, known.destinationAr, known.destinationCity);
      }
    } else if (known.destinationAr) {
      destMatch = findCountry(known.destinationAr) || createDynamicCountry(known.destinationAr, known.destinationAr, known.destinationCity);
    } else {
      destMatch = findCountry(text);
    }

    // If destination matches origin, re-verify
    if (originMatch && destMatch && originMatch.id === destMatch.id) {
      if (text.includes('صين') || text.includes('الصين')) destMatch = findCountry('china');
      else if (text.includes('يابان') || text.includes('اليابان')) destMatch = findCountry('japan');
    }

    // Normalize duration category
    let durationCategory = known.durationCategory || null;
    if (!durationCategory && known.duration) {
      const durStr = String(known.duration).toLowerCase();
      if (durStr.includes('year') || durStr.includes('سنة') || durStr.includes('عام')) durationCategory = 'yearPlus';
      else if (durStr.includes('month') || durStr.includes('شهر')) durationCategory = 'months';
      else if (durStr.includes('week') || durStr.includes('أسبوع') || durStr.includes('اسبوع')) durationCategory = 'weeks';
      else if (durStr.includes('day') || durStr.includes('يوم')) durationCategory = 'days';
    }

    const travelParty = known.travelParty || 'solo';
    const rawMissing = Array.isArray(parsed.missingQuestions) ? parsed.missingQuestions : [];

    // Helper to supply standard rich choices for any question id
    const getStandardChoices = (qId: string, destCountryName?: string) => {
      const id = (qId || '').toLowerCase();
      if (id.includes('purpose') || id.includes('reason') || id.includes('غرض') || id.includes('سبب')) {
        return [
          { value: 'tourism', labelEn: 'Tourism & Exploration', labelAr: 'سياحة وزيارة واستكشاف' },
          { value: 'medical', labelEn: 'Medical & Recovery Care', labelAr: 'علاج واستشفاء صحي وفحوصات' },
          { value: 'study', labelEn: 'Study & University', labelAr: 'دراسة وابتعاث جامعي' },
          { value: 'work', labelEn: 'Work & Business', labelAr: 'عمل وانتداب مهني' },
          { value: 'relocation', labelEn: 'Relocation & Living', labelAr: 'استقرار وهجرة ومعيشة' },
        ];
      }
      if (id.includes('duration') || id.includes('stay') || id.includes('مدة') || id.includes('وقت') || id.includes('ايام') || id.includes('أيام')) {
        return [
          { value: '3_5_days', labelEn: '3 – 5 Days (Short Trip)', labelAr: '3 – 5 أيام (عطلة قصيرة)' },
          { value: '1_week', labelEn: '1 Week (7 Days)', labelAr: 'أسبوع واحد (7 أيام)' },
          { value: '2_weeks', labelEn: '2 Weeks (14 Days)', labelAr: 'أسبوعين (14 يوماً)' },
          { value: '1_month', labelEn: '1 Month (30 Days)', labelAr: 'شهر واحد (30 يوماً)' },
          { value: 'yearPlus', labelEn: '1+ Year (Long Stay)', labelAr: 'سنة فأكثر (إقامة طويلة)' },
        ];
      }
      if (id.includes('party') || id.includes('companion') || id.includes('مرافق') || id.includes('معك')) {
        return [
          { value: 'solo', labelEn: 'Solo (Just me)', labelAr: 'بمفردي (سفر فردي)' },
          { value: 'couple', labelEn: 'Couple / Partner', labelAr: 'مع شريك الحياة (زوجين)' },
          { value: 'family', labelEn: 'Family (with children)', labelAr: 'مع العائلة والأطفال' },
          { value: 'friends', labelEn: 'Friends', labelAr: 'مع الأصدقاء' },
        ];
      }
      if (id.includes('accommodation') || id.includes('hotel') || id.includes('سكن') || id.includes('فندق') || id.includes('إقامة') || id.includes('اقامة')) {
        return [
          { value: 'booked', labelEn: 'Yes, already booked', labelAr: 'نعم، قمت بالحجز مسبقاً' },
          { value: 'not_booked', labelEn: 'No, need lodging links', labelAr: 'لا، أبحث عن توصيات سكن بروابط حجز' },
          { value: 'not_sure', labelEn: 'Not sure yet', labelAr: 'لست متأكداً حتى الآن' },
        ];
      }
      if (id.includes('budget') || id.includes('ميزانية') || id.includes('مستوى')) {
        return [
          { value: 'moderate', labelEn: 'Balanced / Moderate', labelAr: 'متوسطة متوازنة' },
          { value: 'budget', labelEn: 'Economy / Budget', labelAr: 'ميزانية اقتصادية موفرة' },
          { value: 'luxury', labelEn: 'Luxury & Premium', labelAr: 'فاخرة ومميزة' },
        ];
      }
      if (id.includes('medical') || id.includes('treatment') || id.includes('علاج') || id.includes('صحي')) {
        return [
          { value: 'cardiology', labelEn: 'Cardiology & Heart Care', labelAr: 'أمراض وجراحة القلب والأوعية' },
          { value: 'orthopedics', labelEn: 'Orthopedics & Joint Care', labelAr: 'العظام والمفاصل والعلاج الطبيعي' },
          { value: 'wellness', labelEn: 'Comprehensive Health Checkup', labelAr: 'فحوصات شاملة ونقاهة واستجمام' },
          { value: 'cosmetics', labelEn: 'Aesthetic & Dental Procedures', labelAr: 'تجميل وزراعة الشعر والأسنان' },
          { value: 'general', labelEn: 'Other Medical Specialties', labelAr: 'تخصصات طبية وعلاجية أخرى' },
        ];
      }
      return [
        { value: 'yes', labelEn: 'Yes', labelAr: 'نعم' },
        { value: 'no', labelEn: 'No', labelAr: 'لا' },
        { value: 'not_sure', labelEn: 'Not sure', labelAr: 'غير متأكد' },
      ];
    };

    // Synthesize complete missing questions list based on text analysis
    const textLower = text.toLowerCase();
    const hasExplicitDuration =
      text.includes('يوم') ||
      text.includes('أيام') ||
      text.includes('ايام') ||
      text.includes('أسبوع') ||
      text.includes('اسبوع') ||
      text.includes('أسابيع') ||
      text.includes('اسابيع') ||
      text.includes('شهر') ||
      text.includes('شهور') ||
      text.includes('أشهر') ||
      text.includes('سنة') ||
      text.includes('عام') ||
      textLower.includes('day') ||
      textLower.includes('week') ||
      textLower.includes('month') ||
      textLower.includes('year') ||
      /\b\d+\s*(days|weeks|months|years|d|w|m|y)\b/i.test(text);

    const hasExplicitPurpose =
      text.includes('سياح') ||
      text.includes('علاج') ||
      text.includes('استشفاء') ||
      text.includes('دراس') ||
      text.includes('جامع') ||
      text.includes('مبتعث') ||
      text.includes('عمل') ||
      text.includes('شغل') ||
      text.includes('وظيفة') ||
      text.includes('استقرار') ||
      text.includes('هجرة') ||
      text.includes('زيارة') ||
      textLower.includes('touris') ||
      textLower.includes('medic') ||
      textLower.includes('study') ||
      textLower.includes('work') ||
      textLower.includes('relocat');

    const hasExplicitParty =
      text.includes('لحالي') ||
      text.includes('لوحدي') ||
      text.includes('بمفردي') ||
      text.includes('زوج') ||
      text.includes('زوجة') ||
      text.includes('شهر عسل') ||
      text.includes('عائل') ||
      text.includes('أهل') ||
      text.includes('اهل') ||
      text.includes('اسرة') ||
      text.includes('أسرة') ||
      text.includes('أطفال') ||
      text.includes('اطفال') ||
      text.includes('أصدقاء') ||
      text.includes('اصدقاء') ||
      text.includes('صديق') ||
      text.includes('صحبات') ||
      text.includes('اخويا') ||
      text.includes('قروب') ||
      text.includes('مجموعة') ||
      textLower.includes('solo') ||
      textLower.includes('couple') ||
      textLower.includes('family') ||
      textLower.includes('friend') ||
      textLower.includes('group');

    const hasExplicitAccommodation =
      text.includes('حجزت') ||
      text.includes('سكن محجوز') ||
      text.includes('عندي سكن') ||
      text.includes('جاهز السكن') ||
      text.includes('ما حجزت') ||
      text.includes('بدون سكن') ||
      textLower.includes('booked');

    const hasExplicitBudget =
      text.includes('ميزانية') ||
      text.includes('اقتصادي') ||
      text.includes('متوسط') ||
      text.includes('فاخر') ||
      text.includes('رخيص') ||
      textLower.includes('budget') ||
      textLower.includes('luxury');

    const missingQuestions: any[] = [];

    // 1. Purpose question
    if (!hasExplicitPurpose) {
      missingQuestions.push({
        id: 'purpose',
        questionEn: `What is the primary purpose of your journey to ${destMatch?.name || 'your destination'}?`,
        questionAr: `ما هو الغرض الأساسي من رحلتك إلى ${destMatch?.nameAr || 'وجهتك'}؟`,
        type: 'choice',
        choices: getStandardChoices('purpose'),
      });
    }

    // 2. Duration question
    if (!hasExplicitDuration) {
      missingQuestions.push({
        id: 'duration',
        questionEn: `How long do you plan to stay in ${destMatch?.name || 'your destination'}?`,
        questionAr: `كم المدة أو عدد الأيام المقررة لرحلتك في ${destMatch?.nameAr || 'وجهتك'}؟`,
        type: 'choice',
        choices: getStandardChoices('duration'),
      });
    }

    // 3. Travel party question
    if (!hasExplicitParty) {
      missingQuestions.push({
        id: 'travel_party',
        questionEn: 'Who is traveling with you on this journey?',
        questionAr: 'من يسافر معك في هذه الرحلة؟',
        type: 'choice',
        choices: getStandardChoices('travel_party'),
      });
    }

    // 4. Accommodation question
    if (!hasExplicitAccommodation) {
      missingQuestions.push({
        id: 'accommodation',
        questionEn: `Have you already booked your accommodation in ${destMatch?.name || 'your destination'}?`,
        questionAr: `هل قمت بحجز مكان الإقامة والفندق في ${destMatch?.nameAr || 'وجهتك'} بالفعل؟`,
        type: 'choice',
        choices: getStandardChoices('accommodation'),
      });
    }

    // 5. Budget question
    if (!hasExplicitBudget) {
      missingQuestions.push({
        id: 'budget',
        questionEn: 'What is your preferred budget range for this trip?',
        questionAr: 'ما هو مستوى الميزانية المفضل لرحلتك؟',
        type: 'choice',
        choices: getStandardChoices('budget'),
      });
    }

    // 6. Include any special questions returned by AI (e.g. medical specialty if user stated medical) with guaranteed choices
    for (const q of rawMissing) {
      if (!missingQuestions.some((m) => m.id === q.id) && (q.questionAr || q.questionEn)) {
        const enrichedChoices = Array.isArray(q.choices) && q.choices.length >= 2
          ? q.choices
          : getStandardChoices(q.id);

        missingQuestions.push({
          id: q.id || `q_${Math.random().toString(36).substring(7)}`,
          questionEn: q.questionEn || q.questionAr,
          questionAr: q.questionAr || q.questionEn,
          type: 'choice',
          choices: enrichedChoices,
        });
      }
    }

    const hasDestination = Boolean(destMatch || known.hasDestination);
    const hasDuration = Boolean(durationCategory || known.duration || known.hasDuration || hasExplicitDuration);
    const hasAccommodation = Boolean(known.accommodationStatus === 'booked' || known.hasAccommodation || hasExplicitAccommodation);

    return NextResponse.json({
      success: true,
      provider: aiRes.provider,
      modelUsed: aiRes.modelUsed,
      latencyMs: aiRes.latencyMs,
      extracted: {
        origin: originMatch || findCountry('saudi-arabia'),
        destination: destMatch,
        destinationCity: known.destinationCity || known.destinationCityAr || destMatch?.capital || null,
        travelParty,
        budget: known.budget || 'moderate',
        duration: durationCategory || known.duration || 'weeks',
        hasDuration,
        hasDestination,
        hasAccommodation,
        hasTravelParty: Boolean(known.hasTravelParty || known.travelParty || hasExplicitParty),
        accommodationStatus: known.accommodationStatus || 'unknown',
        accommodationArea: known.accommodationArea || '',
        interests: Array.isArray(known.interests) ? known.interests : ['culture', 'food'],
        travelStyle: known.travelStyle || travelParty,
        dates: known.dates || null,
        purpose: hasExplicitPurpose ? (known.purpose || 'tourism') : 'tourism',
        persona: known.persona || 'Traveler',
        preferences: known.preferences || '',
        additionalNeeds: text,
      },
      missingQuestions,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'AI Intent extraction failed',
      errorCode: 'AI_PROVIDER_ERROR',
    }, { status: 500 });
  }
}

