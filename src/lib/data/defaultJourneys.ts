export type JourneyPhaseId =
  | 'before_you_go'
  | 'travel_day'
  | 'when_you_arrive'
  | 'while_you_are_there'
  | 'before_you_return';

export interface JourneyStage {
  id: string;
  stageNumber: string;
  phaseId: JourneyPhaseId;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  thingsToCheck: {
    id: string;
    text: string;
    textAr: string;
    completed?: boolean;
    mandatory?: boolean;
    category?: 'visa' | 'finance' | 'housing' | 'health' | 'apps' | 'culture' | 'transit' | 'departure';
  }[];
  officialResources: {
    name: string;
    nameAr: string;
    url: string;
    description: string;
    descriptionAr: string;
  }[];
  quickTip: {
    title: string;
    titleAr: string;
    text: string;
    textAr: string;
  };
}

export interface AccommodationRecommendation {
  id: string;
  name: string;
  nameAr: string;
  type: 'hotel' | 'apartment' | 'student_housing' | 'serviced_apartment' | 'medical_lodging' | 'resort';
  priceEstimate: string;
  priceEstimateAr: string;
  location: string;
  locationAr: string;
  whyItFits: string;
  whyItFitsAr: string;
  directUrl: string;
  rating?: number;
  image?: string;
  sourceProvider: 'Booking.com' | 'Trip.com' | 'Airbnb' | 'Student.com' | 'Direct Provider';
}

export interface MedicalGuidance {
  specialty: string;
  patientAge?: number | string;
  purpose: string;
  hospitals: {
    name: string;
    nameAr: string;
    city: string;
    specialtyFocus: string;
    websiteUrl: string;
    contactPhone?: string;
    appointmentUrl?: string;
    accessibilityNotes: string;
    accessibilityNotesAr: string;
  }[];
  nearbyPharmaciesNote: string;
  nearbyPharmaciesNoteAr: string;
  recoveryPlaces: {
    name: string;
    nameAr: string;
    type: string;
    description: string;
    descriptionAr: string;
  }[];
  visaMedicalAdvice: string;
  visaMedicalAdviceAr: string;
  disclaimer: string;
  disclaimerAr: string;
}

export interface MultiCityLeg {
  city: string;
  cityAr: string;
  durationDays: number;
  transportMode: string;
  transportModeAr: string;
  highlights: string[];
}

export interface TourismOptionDay {
  dayNumber: number;
  title: string;
  titleAr: string;
  theme?: string;
  themeAr?: string;
  neighborhood?: string;
  estimatedCost?: string;
  city: string;
  cityAr: string;
  morning: string;
  morningAr: string;
  afternoon: string;
  afternoonAr: string;
  evening: string;
  eveningAr: string;
  diningTip?: string;
  diningTipAr?: string;
  diningRecommendation?: string;
  diningRecommendationAr?: string;
  highlights: string[];
  transitNote?: string;
  transitNoteAr?: string;
}

export interface TourismItineraryOption {
  id: string;
  style: 'balanced' | 'relaxed';
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  description?: string;
  descriptionAr?: string;
  durationDays: number;
  budgetEstimate?: string;
  cities: string[];
  citiesAr: string[];
  days: TourismOptionDay[];
  highlights: string[];
  highlightsAr: string[];
  estimatedBudgetLevel: 'budget' | 'moderate' | 'premium';
}

export interface EmergencyContactInfo {
  police: string;
  ambulance: string;
  fire: string;
  touristPolice?: string;
  touristHelpline: string;
  medicalHotline?: string;
  generalEmergency: string;
  embassyPhone: string;
  embassyEmergencyLine: string;
  embassyAddress: string;
  embassyHours: string;
  embassy: {
    name: string;
    nameAr: string;
    address: string;
    phone: string;
    emergencyHotline?: string;
    workingHours?: string;
    website?: string;
  };
  emergencyPhrases: {
    phrase: string;
    native: string;
    phonetic: string;
    textEn: string;
    textAr: string;
    transliteration?: string;
    meaningEn?: string;
    meaningAr?: string;
  }[];
  emergencyClinicsNote: string;
  emergencyClinicsNoteAr: string;
}

export interface CultureTopic {
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
}

export interface CultureGuidance {
  knowTheCulture: {
    history: CultureTopic;
    clothing: CultureTopic;
    foodCulture: CultureTopic;
    familySocial: CultureTopic;
    dailyLifestyle: CultureTopic;
    greetings: CultureTopic;
    communication: CultureTopic;
    traditions: CultureTopic;
    celebrations: CultureTopic;
    socialValues: CultureTopic;
    modernVsTraditional: CultureTopic;
  };
  howToBehave: {
    dos: { title: string; titleAr: string; desc: string; descAr: string }[];
    donts: { title: string; titleAr: string; desc: string; descAr: string }[];
    goodToKnow: { title: string; titleAr: string; desc: string; descAr: string }[];
  };
  disclaimer: string;
  disclaimerAr: string;
}

export interface LocalPhrase {
  id: string;
  category:
    | 'mostUsed'
    | 'common'
    | 'useful'
    | 'greetings'
    | 'courtesy'
    | 'dining'
    | 'shopping'
    | 'transport'
    | 'emergency'
    | 'social'
    | 'slang';
  phrase: string;
  transliteration: string;
  meaningEn: string;
  meaningAr: string;
  formality: 'casual' | 'polite' | 'formal' | 'honorific';
  whenToUse: string;
  whenToUseAr: string;
  whenToAvoid?: string;
  whenToAvoidAr?: string;
  culturalNote?: string;
  culturalNoteAr?: string;
}

export interface LocalFavoritePhrase {
  phrase: string;
  transliteration: string;
  meaningEn: string;
  meaningAr: string;
  whySpecialEn: string;
  whySpecialAr: string;
}

export interface LocalLanguageData {
  phrases: LocalPhrase[];
  localFavorites: LocalFavoritePhrase[];
  languageName: string;
  languageCode: string;
}

export interface ReligionContextData {
  overview: string;
  overviewAr: string;
  religiousLandscape: {
    tradition: string;
    traditionAr: string;
    percentageEstimate?: string;
    description: string;
    descriptionAr: string;
  }[];
  practicesAndHolidays: {
    name: string;
    nameAr: string;
    timing: string;
    timingAr: string;
    impact: string;
    impactAr: string;
  }[];
  placesOfWorship: {
    type: string;
    typeAr: string;
    guidance: string;
    guidanceAr: string;
    etiquette: string[];
    etiquetteAr: string[];
  }[];
  dietaryAndPublicBehavior: {
    dietaryOverview: string;
    dietaryOverviewAr: string;
    dressExpectations: string;
    dressExpectationsAr: string;
    publicEtiquette: string;
    publicEtiquetteAr: string;
  };
  muslimTravelerGuide: {
    halalOverview: string;
    halalOverviewAr: string;
    halalVerificationTips: string[];
    halalVerificationTipsAr: string[];
    mosquesAndPrayer: string;
    mosquesAndPrayerAr: string;
    publicPrayerEtiquette: string;
    publicPrayerEtiquetteAr: string;
    ramadanConsiderations: string;
    ramadanConsiderationsAr: string;
    localInquiryPhrases: {
      phrase: string;
      pronunciation: string;
      meaningEn: string;
      meaningAr: string;
    }[];
  };
  disclaimer: string;
  disclaimerAr: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  addressAr?: string;
  description: string;
  descriptionAr?: string;
  photoUrl: string;
  isOpenNow?: boolean;
  googleMapsUri: string;
  websiteUri?: string;
  halalVerificationStatus?: 'certified' | 'muslim_friendly' | 'unverified';
  halalNote?: string;
  halalNoteAr?: string;
  distance?: string;
  types?: string[];
}

export function generateDefaultStages(
  originName: string,
  destinationName: string,
  purpose: string = 'tourism',
  cityName: string = 'Capital'
): JourneyStage[] {
  const normPurpose = (purpose || 'tourism').toLowerCase();
  const isStudy = normPurpose === 'study';
  const isWork = normPurpose === 'work';
  const isRelocation = normPurpose === 'relocation';
  const isMedical = normPurpose === 'medical' || normPurpose === 'recovery';

  return [
    // 1. BEFORE YOU GO
    {
      id: 'phase-before',
      stageNumber: '01',
      phaseId: 'before_you_go',
      title: 'Before You Go',
      titleAr: 'قبل السفر',
      subtitle: `Readiness, visa, official documents & preparations for ${cityName}, ${destinationName}`,
      subtitleAr: `التجهيزات والوثائق الرسمية والجاهزية قبل السفر إلى ${cityName}`,
      thingsToCheck: [
        { id: 'b1', text: 'Passport validity verified (minimum 6 months validity from departure date)', textAr: 'التحقق من سريان الجواز لمدة لا تقل عن 6 أشهر قبل السفر', mandatory: true, category: 'visa' },
        { id: 'b2', text: `Apply & confirm official visa / eVisa / electronic travel authorization for ${destinationName}`, textAr: `استخراج التأشيرة الرسمية أو تصريح الدخول لـ ${destinationName}`, mandatory: true, category: 'visa' },
        { id: 'b3', text: isMedical ? 'Obtain medical acceptance letter, doctor reports in English & hospital appointment confirmation' : isStudy ? 'Obtain university admission letters, student visa certificate & scholarship guarantee' : isWork ? 'Confirm employment contract, work visa approval & employer sponsor contacts' : isRelocation ? 'Attest birth/marriage certificates, degree certificates & tenancy deposits' : 'Confirm flight tickets and accommodation bookings with verified addresses', textAr: isMedical ? 'تجهيز التقارير الطبية المعتمدة بالإنجليزية وتأكيد موعد المستشفى' : isStudy ? 'تجهيز قبول الجامعة والضمان المالي ووثائق الابتعاث' : isWork ? 'تأكيد عقد العمل وتصريح العمل الرسمي' : isRelocation ? 'تصديق الشهادات الرسمية والوثائق العائلية وعقود الانتقال' : 'تأكيد تذاكر الطيران وتأكيد حجز السكن بالعناوين المعتمدة', mandatory: true, category: 'visa' },
        { id: 'b4', text: 'Purchase comprehensive international medical & travel insurance covering your entire stay', textAr: 'شراء وثيقة تأمين طبي دولي شاملة تغطي فترة الرحلة بالكامل', mandatory: true, category: 'health' },
        { id: 'b5', text: 'Notify home bank of international card usage & set up backup multi-currency payment cards', textAr: 'إبلاغ البنك بالسفر وتجهيز بطاقات سفر متعددة العملات مع تفعيل Apple/Google Pay', category: 'finance' },
        { id: 'b6', text: `Pre-order destination eSIM / local SIM and download offline navigation & translation apps for ${destinationName}`, textAr: `تجهيز شريحة إلكترونية eSIM وتحميل تطبيقات الخرائط والترجمة والمواصلات`, category: 'apps' },
        { id: 'b7', text: 'Pack prescription medications in original labeled boxes with official doctor prescription', textAr: 'تجهيز الأدوية المصروفة بعبواتها الأصلية مع تقرير طبي رسمي بالإنجليزية', category: 'health' },
        { id: 'b8', text: `Register trip with Embassy of ${originName} in ${destinationName} and save 24/7 hotline`, textAr: `تسجيل الرحلة في منصة وزارة الخارجية وسفارة ${originName} وحفظ خط الطوارئ`, mandatory: true, category: 'visa' },
      ],
      officialResources: [
        {
          name: `Official Visa & Entry Portal (${destinationName})`,
          nameAr: `البوابة الرسمية للتأشيرات والهجرة (${destinationName})`,
          url: `https://www.google.com/search?q=official+visa+entry+portal+${encodeURIComponent(destinationName)}`,
          description: 'Official government visa requirements, processing times and digital entry forms',
          descriptionAr: 'المتطلبات الرسمية للتأشيرات ونماذج الدخول الإلكترونية المعتمدة',
        },
        {
          name: `Ministry of Foreign Affairs (${originName} Citizen Care abroad)`,
          nameAr: `وزارة الخارجية - رعاية المواطنين في الخارج`,
          url: 'https://www.mofa.gov.sa',
          description: 'Citizen registration, emergency consular lines, and travel advisories',
          descriptionAr: 'تسجيل الرحلة في السفارة والتواصل المباشر في حالات الطوارئ',
        },
        {
          name: `Customs & Border Control (${destinationName})`,
          nameAr: `هيئة الجمارك والمنافذ الرسمية (${destinationName})`,
          url: `https://www.google.com/search?q=customs+declarations+duty+free+allowance+${encodeURIComponent(destinationName)}`,
          description: 'Restricted items, medication allowance and customs declaration rules',
          descriptionAr: 'لوائح المواد المقيدة والأدوية المسموحة والإفصاح الجمركي',
        },
      ],
      quickTip: {
        title: 'Pre-Departure Readiness',
        titleAr: 'مؤشر الجاهزية قبل الإقلاع',
        text: `Keep digital copies of all essential documents in secure cloud storage and carry physical printed copies in your hand luggage.`,
        textAr: `احتفظ بنسخ إلكترونية من وثائقك على السحابة، واحتفظ بنسخ ورقية مطبوعة في حقيبة اليد.`,
      },
    },

    // 2. TRAVEL DAY
    {
      id: 'phase-travel-day',
      stageNumber: '02',
      phaseId: 'travel_day',
      title: 'Travel Day',
      titleAr: 'يوم السفر',
      subtitle: `Airport departure, baggage drop, boarding, in-flight prep & transit to ${cityName}`,
      subtitleAr: `إجراءات المطار، تسليم الحقائب، صعود الطائرة والرحلة باتجاه ${cityName}`,
      thingsToCheck: [
        { id: 'td1', text: 'Arrive at departure airport 3 hours prior to international flight', textAr: 'الوصول للمطار قبل 3 ساعات من موعد الإقلاع الدولي لتفادي الازدحام', mandatory: true, category: 'transit' },
        { id: 'td2', text: 'Complete online check-in and save mobile boarding passes to wallet', textAr: 'إنهاء تسجيل الوصول الإلكتروني وحفظ بطاقات الصعود على المحفظة الرقمية', category: 'apps' },
        { id: 'td3', text: 'Ensure luggage weights match airline allowance and tag baggage with name/phone', textAr: 'التحقق من أوزان الأمتعة ومطابقتها للتذكرة ووضع ملصقات تعريفية على الحقائب', category: 'transit' },
        { id: 'td4', text: 'Keep passport, visas, medicine and power banks in hand carry (do not pack in checked bags)', textAr: 'الاحتفاظ بالجواز، التأشيرة، الأدوية وبنوك الطاقة في حقيبة اليد فقط', mandatory: true, category: 'departure' },
        { id: 'td5', text: `Fill in digital customs / arrival declaration card before or during flight for ${destinationName}`, textAr: `تعبئة بطاقة الإقرار الجمركي أو الإقرار الرقمي للوصول أثناء الرحلة`, category: 'visa' },
        { id: 'td6', text: 'Set watch and mobile clock to destination local time zone upon takeoff', textAr: 'ضبط الساعة على التوقيت المحلي لمدينة الوجهة للتكيف مع فارق التوقيت', category: 'culture' },
      ],
      officialResources: [
        {
          name: `Departure Airport & Flight Status Guide`,
          nameAr: `بوابة تتبع الرحلات المباشرة وحالة المطار`,
          url: `https://www.google.com/search?q=flight+tracker+airport+departure+status`,
          description: 'Live flight tracking, terminal maps, gate status, and baggage carousel updates',
          descriptionAr: 'متابعة مباشرة لحالة الرحلات وبوابات الصعود واستلام الأمتعة',
        },
        {
          name: `International Air Transport Association (IATA Travel Center)`,
          nameAr: `مركز معلومات اتحاد النقل الجوي الدولي (IATA)`,
          url: 'https://www.iatatravelcentre.com',
          description: 'Official airline travel rules, transit requirements, and passport validation',
          descriptionAr: 'الشروط الرسمية لشركات الطيران وقواعد العبور (الترانزيت)',
        },
      ],
      quickTip: {
        title: 'Smooth Airport Transition',
        titleAr: 'سلاسة يوم السفر',
        text: 'Keep all liquid containers under 100ml in a clear sealable bag for security screening.',
        textAr: 'ضع السوائل في عبوات لا تتجاوز 100 مل داخل كيس شفاف قابل للإغلاق لتسهيل التفتيش الأمني.',
      },
    },

    // 3. WHEN YOU ARRIVE
    {
      id: 'phase-arrive',
      stageNumber: '03',
      phaseId: 'when_you_arrive',
      title: 'When You Arrive',
      titleAr: 'عند الوصول',
      subtitle: `Immigration, airport transfer, connectivity & first essentials in ${cityName}`,
      subtitleAr: `إجراءات الدخول، المواصلات الأولى، تفعيل الاتصال والوصول للسكن في ${cityName}`,
      thingsToCheck: [
        { id: 'a1', text: 'Clear immigration and customs with completed digital arrival pass and passport', textAr: 'إنهاء إجراءات الجوازات والجمارك ببطاقة الدخول الرقمية', mandatory: true, category: 'visa' },
        { id: 'a2', text: 'Activate eSIM or insert local physical SIM card for immediate data access', textAr: 'تفعيل الشريحة الإلكترونية eSIM أو استلام الشريحة المحلية للاتصال الفوري', mandatory: true, category: 'apps' },
        { id: 'a3', text: `Take official licensed airport transport or express train directly to accommodation in ${cityName}`, textAr: `استخدام التاكسي المرخص أو قطار المطار السريع للوصول إلى مقر الإقامة في ${cityName}`, category: 'transit' },
        { id: 'a4', text: 'Purchase contactless transit card (IC Card / Metro Pass) or setup mobile wallet transit tap', textAr: 'شراء بطاقة المواصلات الذكية أو تفعيل الدفع اللاتلامسي للمترو والحافلات', category: 'transit' },
        { id: 'a5', text: 'Withdraw small amount of local currency cash from airport/station ATM for small shops', textAr: 'سحب مبلغ نقدي بسيط من صراف المطار لتغطية المشتريات الصغيرة ومحلات النقد', category: 'finance' },
        { id: 'a6', text: 'Check-in to accommodation, inspect room amenities & note emergency exit routes', textAr: 'تسجيل الوصول في مقر السكن ومعاينة المرافق ومخارج الطوارئ', category: 'housing' },
        { id: 'a7', text: 'Locate nearest 24h pharmacy, hospital, and halal/suitable food dining within walking distance', textAr: 'تحديد موقع أقرب صيدلية طوارئ ومستشفى ومطاعم مناسبة قريبة من السكن', mandatory: true, category: 'health' },
      ],
      officialResources: [
        {
          name: `Airport Transfer & Transit Network (${cityName})`,
          nameAr: `دليل مطار ${cityName} وشبكة المواصلات الرسمية`,
          url: `https://www.google.com/search?q=official+airport+express+transit+train+taxi+${encodeURIComponent(cityName)}`,
          description: 'Official airport express rail, licensed taxi stands and shuttle schedules',
          descriptionAr: 'مواعيد القطارات السريعة وحافلات المطار ومكاتب التاكسي المرخصة',
        },
        {
          name: `City Municipal & Tourist Welcome Services (${cityName})`,
          nameAr: `بوابة خدمات مدينة ${cityName} ومراكز المعلومات السياحية`,
          url: `https://www.google.com/search?q=city+tourist+information+center+${encodeURIComponent(cityName)}`,
          description: 'Official tourist information centers, free city maps, and transit passes',
          descriptionAr: 'مراكز الإرشاد السياحي المعتمدة وخرائط المدينة وتذاكر المترو المخفضة',
        },
      ],
      quickTip: {
        title: 'Arrival Settling-in Tip',
        titleAr: 'نصيحة الاستقرار الأولى',
        text: `Pin your accommodation address in both English and the local language in your maps app for taxi drivers and emergency navigation.`,
        textAr: `احفظ عنوان سكنك باللغتين الإنجليزية والمحلية في تطبيق الخرائط لتسهيل العودة وإرشاد التاكسي.`,
      },
    },

    // 4. WHILE YOU'RE THERE
    {
      id: 'phase-there',
      stageNumber: '04',
      phaseId: 'while_you_are_there',
      title: 'While You’re There',
      titleAr: 'أثناء إقامتك',
      subtitle: `Daily living, cultural harmony, exploring, dining & local navigation in ${cityName}, ${destinationName}`,
      subtitleAr: `المعيشة اليومية، الاندماج الثقافي، التنقل والتجربة الشاملة في ${cityName}`,
      thingsToCheck: [
        { id: 't1', text: 'Follow local transit etiquette (quiet carriages, standing on correct escalator side, priority seats)', textAr: 'إتقان آداب المواصلات العامة (الهدوء في القطارات، التزام جانب السلالم، احترام المقاعد المخصصة)', category: 'transit' },
        { id: 't2', text: 'Explore local food markets, verified Halal dining, and neighborhood specialty cafes', textAr: 'استكشاف الأسواق المحلية والمطاعم المعتمدة والأطباق التقليدية العريقة', category: 'culture' },
        { id: 't3', text: isMedical ? 'Attend scheduled medical appointments, keep prescription logs & utilize quiet recovery parks' : isStudy ? 'Engage with international student office, campus library & academic study groups' : isWork ? 'Navigate professional workplace protocols, punctual meetings & business networking' : isRelocation ? 'Complete resident registration at municipality, set up home utilities & establish neighborhood ties' : 'Experience top cultural landmarks, UNESCO heritage sites, museums & curated day tours', textAr: isMedical ? 'حضور المواعيد الطبية المجدولة والالتزام بالراحة في الأماكن الهادئة والحدائق' : isStudy ? 'الاستفادة من مرافق الجامعة والمكتبات والأندية الطلابية' : isWork ? 'الالتزام بدقة المواعيد وآداب بيئة العمل الرسمية' : isRelocation ? 'تسجيل العنوان بالبلدية وتفعيل الخدمات المنزلية والاندماج المجتمعي' : 'زيارة أبرز المعالم التراثية والمتاحف والحدائق والأنشطة السياحية المميزة', category: 'culture' },
        { id: 't4', text: 'Practice everyday conversational expressions with locals, shopkeepers, and service staff', textAr: 'ممارسة العبارات اليومية والكلمات الودية مع السكان المحليين وأصحاب المتاجر', category: 'culture' },
        { id: 't5', text: 'Practice digital safety: never click unsolicited SMS/email payment links and avoid unofficial Wi-Fi', textAr: 'اتباع إرشادات الأمان الرقمي وتجنب الروابط المشبوهة أو شبكات الواي فاي غير الآمنة', category: 'health' },
      ],
      officialResources: [
        {
          name: `National Tourism & Cultural Heritage Authority (${destinationName})`,
          nameAr: `الهيئة الرسمية للسياحة والآثار والتراث (${destinationName})`,
          url: `https://www.google.com/search?q=official+tourism+board+cultural+heritage+${encodeURIComponent(destinationName)}`,
          description: 'Official cultural calendars, museum passes, and heritage guides',
          descriptionAr: 'جدول الفعاليات والمعارض الرسمية وتذاكر المواقع الأثرية',
        },
        {
          name: `Public Transport Journey Planner (${cityName})`,
          nameAr: `مخطط الرحلات وشبكة المترو والمواصلات (${cityName})`,
          url: `https://www.google.com/search?q=metro+subway+public+transport+map+${encodeURIComponent(cityName)}`,
          description: 'Real-time transit navigation, train timetables, and delay alerts',
          descriptionAr: 'خرائط المترو التفاعلية والمسارات وتنبيهات مواعيد القطارات',
        },
      ],
      quickTip: {
        title: 'Cultural Wisdom',
        titleAr: 'حكمة الاندماج الثقافي',
        text: 'When in doubt about local customs or social etiquette, observe what locals do and ask politely with a smile.',
        textAr: 'عندما تتردد في موقف اجتماعي، راقب تصرف السكان المحليين واسأل بأدب وابتسامة صادقة.',
      },
    },

    // 5. BEFORE YOU RETURN
    {
      id: 'phase-return',
      stageNumber: '05',
      phaseId: 'before_you_return',
      title: 'Before You Return',
      titleAr: 'قبل العودة',
      subtitle: `Check-out, tax refunds, airport transit, luggage & departure procedures from ${destinationName}`,
      subtitleAr: `تسجيل المغادرة، استرداد الضرائب، المواصلات للمطار وإجراءات العودة للوطن`,
      thingsToCheck: [
        { id: 'r1', text: 'Confirm return flight schedule and complete online check-in 24h before departure', textAr: 'تأكيد موعد رحلة العودة وإنهاء تسجيل الوصول الإلكتروني قبل 24 ساعة', mandatory: true, category: 'departure' },
        { id: 'r2', text: 'Process airport tax refund / duty-free purchases with receipts and passport ready', textAr: 'إنهاء إجراءات استرداد ضريبة القيمة المضافة (Tax Refund) في المطار بالفواتير والجواز', category: 'finance' },
        { id: 'r3', text: 'Coordinate hotel/apartment check-out, settle outstanding incidentals & return room keys', textAr: 'تسجيل الخروج من مقر السكن وتسليم المفاتيح وتسوية الحسابات المتبقية', category: 'housing' },
        { id: 'r4', text: 'Return rented devices (pocket Wi-Fi, transit cards, adapters) at airport drop points', textAr: 'إرجاع الأجهزة المستأجرة (راوتر الواي فاي أو بطاقات العبور) في نقاط تسليم المطار', category: 'departure' },
        { id: 'r5', text: 'Re-weigh luggage to prevent excess baggage fees at check-in counters', textAr: 'وزن الحقائب والتأكد من مطابقتها لوزن التذكرة لتفادي رسوم الوزن الزائد', category: 'transit' },
        { id: 'r6', text: 'Ensure passport, immigration slips, medication and boarding passes are accessible in hand carry', textAr: 'التأكد من وجود الجواز وبطاقة الصعود والأدوية في حقيبة اليد للمرور عبر الجوازات', mandatory: true, category: 'departure' },
      ],
      officialResources: [
        {
          name: `Customs & Tax Refund Office (${destinationName})`,
          nameAr: `مكتب استرداد الضرائب والجمارك بالمطار (${destinationName})`,
          url: `https://www.google.com/search?q=airport+vat+tax+refund+customs+${encodeURIComponent(destinationName)}`,
          description: 'Official tax refund validation booths and duty-free departure customs regulations',
          descriptionAr: 'مواقع مكاتب استرداد الضرائب في صالات المغادرة بالمطار',
        },
        {
          name: `Official Departure Airport Passenger Guide (${cityName})`,
          nameAr: `دليل المسافرين في صالات المغادرة بمطار ${cityName}`,
          url: `https://www.google.com/search?q=departure+airport+terminal+guide+${encodeURIComponent(cityName)}`,
          description: 'Terminal departure maps, security fast-track, and airline check-in counters',
          descriptionAr: 'خريطة صالات المغادرة ومكاتب شحن الأمتعة والمطاعم قبل البوابات',
        },
      ],
      quickTip: {
        title: 'Stress-Free Departure',
        titleAr: 'مغادرة هادئة ومنظمة',
        text: 'Allow extra time for airport tax refund validation and security screening before international departure.',
        textAr: 'خصّص وقتاً كافياً إضافياً في المطار لإنهاء إجراءات استرداد الضرائب قبل التوجه لبوابة الصعود.',
      },
    },
  ];
}

export function getDefaultCulture(destinationName: string, cityName: string = 'Tokyo'): CultureGuidance {
  const norm = destinationName.toLowerCase();
  const isChina = norm.includes('china') || destinationName.includes('الصين');
  const isJapan = norm.includes('japan') || destinationName.includes('اليابان');

  if (isChina) {
    return {
      knowTheCulture: {
        history: {
          title: '5,000 Years of Civilization & Dynasty Heritage',
          titleAr: '5,000 عام من الحضارة والتاريخ الإمبراطوري',
          content: 'China is one of the world\'s oldest continuous civilizations, with a rich tapestry of philosophical schools (Confucianism, Daoism), dynastic architecture (The Forbidden City, Great Wall), and unprecedented modern technological innovation.',
          contentAr: 'تعد الصين إحدى أقدم الحضارات المتصلة في العالم، وتجمع بين الفلسفات الكلاسيكية (الكونفوشية والطاوية)، والإرث المعماري الإمبراطوري العريق، مع قفزات تكنولوجية واقتصادية رائدة.',
        },
        clothing: {
          title: 'Contemporary Smart Casual & Traditional Hanfu',
          titleAr: 'الأناقة العصرية والهانفو التقليدي',
          content: 'Traditional Hanfu and Qipao are celebrated during cultural festivals and scenic photoshoots. In daily urban life across Beijing and Shanghai, clean, comfortable smart casual wear is standard.',
          contentAr: 'يُحتفى بالهانفو والتشيباو التقليديين في المهرجانات والمناسبات التراثية. وفي الحياة اليومية بالمدن، تسود الملابس الأنيقة والمريحة المحتشمة.',
        },
        foodCulture: {
          title: 'Culinary Diversity & Communal Banquets',
          titleAr: 'تنوع المطابخ الصينية والموائد المشتركة',
          content: 'Dining is central to social life and business. Meals are shared on rotating lazy Susan round tables, celebrating eight major regional culinary traditions from savory Beijing to spicy Sichuan and Cantonese dim sum.',
          contentAr: 'تناول الطعام هو قلب التفاعل الاجتماعي؛ تُقدم الأطباق على طاولات مستديرة دوارة للمشاركة، ويتميز المطبخ بتنوع هائل يشمل 8 أقاليم طهي رئيسية.',
        },
        familySocial: {
          title: 'Filial Piety (Xiao) & Social Harmony',
          titleAr: 'بر الوالدين (شياو) والترابط الأسري',
          content: 'Deep respect for parents and elders (Filial Piety) is a foundational moral pillar. Family reunions during festivals like Lunar New Year are sacred traditions.',
          contentAr: 'احترام الوالدين وكبار السن (شياو) من أقدس القيم الأخلاقية في المجتمع. وتعد اللقاءات العائلية في الأعياد مثل رأس السنة الصينية ركيزة أساسية.',
        },
        dailyLifestyle: {
          title: 'Cashless Convenience & Urban Dynamism',
          titleAr: 'مجتمع غير نقدي وسرعة الإيقاع الحضري',
          content: 'China is almost 100% cashless; WeChat Pay and Alipay power everything from high-speed trains to street vendors. High-speed rail connects vast metropolitan hubs seamlessly.',
          contentAr: 'تعتمد الحياة اليومية بالكامل على الدفع الرقمي عبر الهاتف (Alipay و WeChat Pay). وتتميز المدن بشبكات قطارات فائقة السرعة وأمان فائق.',
        },
        greetings: {
          title: 'Nod, Smile & Respectful Handshakes',
          titleAr: 'التحية والمصافحة اللبقة',
          content: 'A polite nod, smile, or gentle handshake is standard. When receiving business cards or gifts, using both hands is a mark of utmost respect.',
          contentAr: 'المصافحة اللبقة أو الإيماءة والابتسامة هي العرف السائد. وعند تسليم أو استلام بطاقات العمل أو الهدايا، يُفضل استخدام كلتا اليدين دلالةً على الاحترام.',
        },
        communication: {
          title: 'Saving Face (Mianzi) & Polite Courtesy',
          titleAr: 'حفظ ماء الوجه (ميانزي) واللباقة في الحوار',
          content: 'Preserving dignity and mutual respect (Mianzi) is vital. Direct public criticism or confrontation is avoided, favoring diplomatic and polite wording.',
          contentAr: 'يعد حفظ ماء الوجه والكرامة المتبادلة (ميانزي) مفهوماً جوهرياً؛ يُفضل تجنب الإحراج العلني واستخدام أسلوب حوار مرن ولبق.',
        },
        traditions: {
          title: 'Tea Culture (Cha Dao), Calligraphy & Martial Arts',
          titleAr: 'ثقافة الشاي وفنون الخط والكونغ فو',
          content: 'Tea appreciation is an art form of hospitality and meditation. Calligraphy, traditional Chinese medicine, and Tai Chi reflect centuries of holistic balance (Yin and Yang).',
          contentAr: 'تقديم الشاي الصيني فن عريق يعبر عن الضيافة والتأمل، وترتبط الفنون التقليدية والطب الصيني بمفهوم توازن الطاقة والحياة.',
        },
        celebrations: {
          title: 'Spring Festival (Chunyun) & Mid-Autumn Moon',
          titleAr: 'عيد الربيع ومهرجان منتصف الخريف',
          content: 'The Spring Festival (Lunar New Year) and Mid-Autumn Festival bring spectacular red lanterns, dragon dances, mooncakes, and nationwide family gatherings.',
          contentAr: 'يشهد عيد الربيع (رأس السنة القمرية) وعيد منتصف الخريف احتفالات مهيبة بالفوانيس الحمراء ورقصات التنين وحلوى كعك القمر.',
        },
        socialValues: {
          title: 'Hospitality, Hard Work & Collective Pride',
          titleAr: 'كرم الضيافة والاجتهاد والاعتزاز الوطني',
          content: 'Chinese hosts take immense pride in generous hospitality. Hard work, educational achievement, and national pride are deeply ingrained social values.',
          contentAr: 'يحرص المضيفون الصينيون على إكرام الضيوف وتقديم أشهى المأكولات، ويحظى الاجتهاد والتعليم بتقدير مجتمعي استثنائي.',
        },
        modernVsTraditional: {
          title: 'High-Tech Mega-Cities amidst Ancient Temples',
          titleAr: 'ناطحات السحاب الذكية بجوار المعابد التاريخية',
          content: 'Futuristic Maglev trains, AI-driven retail, and cloud towers stand in harmonious coexistence with classical pagoda gardens and peaceful water towns.',
          contentAr: 'تتناغم قطارات الماغليف والذكاء الاصطناعي وناطحات السحاب مع المعابد والحدائق التاريخية وقرى الماء التراثية.',
        },
      },
      howToBehave: {
        dos: [
          { title: 'Use both hands when giving or receiving business cards and gifts', titleAr: 'استخدم كلتا اليدين عند تقديم أو استلام البطاقات والهدايا', desc: 'Handing items with both hands signals sincerity and high esteem.', descAr: 'تقديم الأشياء باليدين معاً يعبر عن التقدير والاهتمام الصادق.' },
          { title: 'Set up Alipay / WeChat Pay with your international bank card before arrival', titleAr: 'تفعيل بطاقة البنك الدولية في تطبيقي Alipay و WeChat Pay قبل السفر', desc: 'Cashless mobile payments are accepted universally across transportation, dining, and shops.', descAr: 'الدفع الإلكتروني عبر الهاتف هو الوسيلة المعتمدة في كافة المتاجر والمواصلات.' },
          { title: 'Taste a small portion of shared dishes when hosted by locals', titleAr: 'تذوق الأطباق المقدمة عند استضافتك للتعبير عن الامتنان', desc: 'Accepting food graciously demonstrates respect and friendship.', descAr: 'تذوق أطباق المضيف يعبر عن الامتنان والود وبناء العلاقات الطيبة.' },
          { title: 'Carry your passport with you for intercity trains and attractions', titleAr: 'حمل جواز السفر الأصلي عند ركوب القطارات وزيارة المعالم', desc: 'High-speed rail stations and major museums require real-name passport scanning at gates.', descAr: 'محطات القطارات السريعة والمتاحف تعتمد على فحص الجواز الإلكتروني عند البوابات.' },
        ],
        donts: [
          { title: 'Never stick chopsticks vertically into a bowl of rice', titleAr: 'تجنب غرس أعواد الطعام عمودياً في الأرز', desc: 'This resembles incense sticks offered at ancestor memorials and is considered taboo.', descAr: 'يشبه غرس الأعواد عمودياً طقوس البخور الجنائزية ويعد تصرفاً غير لائق.' },
          { title: 'Avoid public confrontation or causing someone to lose face', titleAr: 'تجنب الجدال الحاد أو التسبب في إحراج الآخرين علناً', desc: 'Address misunderstandings quietly and diplomatically with patience.', descAr: 'عالج أي سوء تفاهم بهدوء ولطف وحوار خاص تجنباً للإحراج.' },
          { title: 'Do not tip at standard restaurants or taxis', titleAr: 'تجنب دفع البقشيش في المطاعم وسيارات الأجرة', desc: 'Tipping is not customary in mainland China and can confuse service staff.', descAr: 'البقشيش غير معتاد في الصين وجميع الخدمات مشمولة في الأسعار.' },
        ],
        goodToKnow: [
          { title: 'Hot water is widely preferred for health and digestion', titleAr: 'الماء الدافئ هو المشروب المفضل في المطاعم', desc: 'Restaurants commonly serve warm water or hot green/jasmine tea by default.', descAr: 'تقدم المطاعم الصينية الماء الدافئ أو شاي الياسمين مجاناً مع الوجبات.' },
          { title: 'Halal dining (Qingzhen) is well-established across all major cities', titleAr: 'المطاعم الحلال (تشينغ-جين) منتشرة ومعروفة في كافة المدن', desc: 'Look for the green Qingzhen (清真) sign indicating certified Muslim-owned dining.', descAr: 'ابحث عن العلامة الخضراء (清真 Qingzhen) التي تدل على المطاعم الحلال المعتمدة.' },
        ],
      },
      disclaimer: 'Social customs and dining protocols can vary by region. When uncertain, ask politely with a smile.',
      disclaimerAr: 'تختلف العادات بين المدن والمقاطعات. عند الشك، يُرحب دائماً بالسؤال اللبق والابتسامة.',
    };
  }

  if (isJapan) {
    return {
      knowTheCulture: {
        history: {
          title: 'Deep History & Ancient Roots',
          titleAr: 'التاريخ العريق والجذور التاريخية',
          content: 'Japan blends over two millennia of imperial heritage, samurai traditions, and rapid post-war modernization. Preserving ancient shrines alongside cutting-edge urban architecture defines Japanese society.',
          contentAr: 'تجمع اليابان بين أكثر من ألفي عام من التاريخ الإمبراطوري وتقاليد الساموراي، مع نهضة حديثة رائدة. يتميز المجتمع بالحفاظ على المعابد التاريخية جنباً إلى جنب مع أحدث مظاهر التطور الحضري.',
        },
        clothing: {
          title: 'Traditional Attire & Modern Modesty',
          titleAr: 'الملابس التقليدية والمظهر العصري',
          content: 'Traditional Kimono and Yukata are worn during seasonal festivals and tea ceremonies. In daily urban life, neat, wrinkle-free, and modest attire is universally appreciated across offices and public spaces.',
          contentAr: 'يُرتدى الكيمونو واليوكاتا في المهرجانات الموسمية ومراسم الشاي. وفي الحياة اليومية بالمدن، تحظى الملابس الأنيقة والساترة والمرتبة باحترام كبير في العمل والأماكن العامة.',
        },
        foodCulture: {
          title: 'Washoku Culinary Philosophy',
          titleAr: 'فلسفة المطبخ الياباني (واشوكو)',
          content: 'Washoku emphasizes fresh, seasonal ingredients and delicate presentation. Respect for food is deeply ingrained; meals begin with "Itadakimasu" (gratitude) and finish with "Gochisousama".',
          contentAr: 'يركز المطبخ الياباني التقليدي على المكونات الموسمية الطازجة ودقة التقديم. يبدأ تناول الطعام بعبارة الامتنان "إيتاداكيماس" وينتهي بعبارة الشكر "غوتشيسوساما".',
        },
        familySocial: {
          title: 'Family Dynamics & Social Harmony (Wa)',
          titleAr: 'الأسرة والترابط والتناغم الاجتماعي (وا)',
          content: 'Social harmony (Wa) and consideration for others (Omoiyari) are central. Group cohesion, respect for elders, and avoiding public confrontation are key societal values.',
          contentAr: 'يعد التناغم الاجتماعي (Wa) ومراعاة مشاعر الآخرين (Omoiyari) أساس الحياة. تحظى العائلة وروح الجماعة واحترام كبار السن بمكانة محورية.',
        },
        dailyLifestyle: {
          title: 'Punctuality & Neighborhood Rhythm',
          titleAr: 'الدقة في المواعيد وإيقاع الحياة اليومية',
          content: 'Punctuality is uncompromising: trains run to the second, and arriving 5 minutes early to appointments is standard. Public spaces are remarkably clean, orderly, and quiet.',
          contentAr: 'الدقة في المواعيد مقدسة؛ القطارات تسير بالثانية بدقة متناهية، والوصول قبل الموعد بـ 5 دقائق هو العرف السائد. الأماكن العامة نظيفة ومنظمة وهادئة جداً.',
        },
        greetings: {
          title: 'Bowing (Ojigi) & Polite Introductions',
          titleAr: 'الانحناء (أوجيغي) وآداب التعارف',
          content: 'Bowing expresses greeting, gratitude, and respect. A slight 15-degree nod is used for casual greetings, while 30 degrees is used in formal or business contexts. Handshakes are also common with international visitors.',
          contentAr: 'الانحناء يعبر عن التحية والتقدير؛ تكفي انحناءة خفيفة 15 درجة للتحيات العادية، و30 درجة في المواقف الرسمية. والمصافحة مقبولة ومفهومة مع الزوار الأجانب.',
        },
        communication: {
          title: 'Indirect Politeness & Non-Verbal Cues',
          titleAr: 'أسلوب التواصل غير المباشر واللباقة',
          content: 'Direct confrontation or saying an outright "No" is softened to avoid embarrassment. Subtlety, active listening, and attentiveness to atmosphere (Kuuki o yomu) are deeply appreciated.',
          contentAr: 'يُفضل التواصل اللبق غير المباشر لتجنب إحراج الطرف الآخر. يُقدر اليابانيون الإنصات باهتمام وقراءة السياق العام للموقف بلباقة.',
        },
        traditions: {
          title: 'Tea Ceremony, Onsen & Seasonal Living',
          titleAr: 'مراسم الشاي والينابيع الحارة والاحتفاء بالطبيعة',
          content: 'Traditional practices like Chado (tea ceremony), Ikebana (flower arranging), and Onsen (hot spring bathing) celebrate mindfulness, nature, and peaceful reflection.',
          contentAr: 'فنون مثل مراسم الشاي (شادو) وتنسيق الزهور (إيكيبانا) والينابيع الحارة (أونسن) تعكس التأمل والارتباط بالطبيعة.',
        },
        celebrations: {
          title: 'Matsuri Festivals & Seasonal Milestones',
          titleAr: 'مهرجانات الماتسوري والمواسم الطبيعية',
          content: 'From Hanami (spring cherry blossom viewing) to vibrant summer neighborhood Matsuri and Shogatsu (New Year), seasonal celebrations bring communities together.',
          contentAr: 'من تأمل أزهار الكرز (هانامي) في الربيع إلى مهرجانات الصيف الصاخبة ورأس السنة (شوغاتسو)، تشكل الاحتفالات الموسمية روح التفاعل المجتمعي.',
        },
        socialValues: {
          title: 'Public Cleanliness & Personal Responsibility',
          titleAr: 'المسؤولية الفردية والنظافة العامة',
          content: 'Citizens carry their trash home if public bins are unavailable. Vandalism and littering are virtually nonexistent, reflecting high civic responsibility.',
          contentAr: 'يحتفظ الأفراد بنفاياتهم في حقائبهم حتى العودة للمنزل في حال عدم وجود حاويات. يعكس ذلك إحساساً عميقاً بالمسؤولية المجتمعية المشتركة.',
        },
        modernVsTraditional: {
          title: 'High-Tech Modernity alongside Ancient Shrines',
          titleAr: 'التكنولوجيا الفائقة مع الحفاظ على الأصالة',
          content: 'Historic wooden shrines seamlessly coexist with bullet trains (Shinkansen) and robotics, reflecting Japan’s unique mastery of embracing the future while cherishing heritage.',
          contentAr: 'تتعايش المعابد الخشبية العريقة بتناغم مذهل مع قطارات الرصاصة والروبوتات والذكاء الاصطناعي، في نموذج فريد يجمع بين المستقبل والأصالة.',
        },
      },
      howToBehave: {
        dos: [
          { title: 'Remove shoes when entering traditional interiors', titleAr: 'خلع الحذاء عند دخول المنازل وأرضيات التاتامي', desc: 'Always take off outdoor shoes at the genkan entrance and step onto slippers or tatami mats.', descAr: 'اخلع حذاءك دائماً عند عتبة المدخل (جينكان) وارتدِ الخفاف المخصصة داخل المنازل والنزل التراثية.' },
          { title: 'Keep mobile phones on "Manner Mode" on trains', titleAr: 'وضع الهاتف على الصامت في القطارات ووسائل النقل', desc: 'Switch your device to silent mode and refrain from taking phone calls on public transit.', descAr: 'ضع هاتفك على الوضع الصامت وتجنب إجراء المكالمات الهاتفية داخل عربات القطارات والحافلات.' },
          { title: 'Place money and cards into payment trays', titleAr: 'استخدام صواني المحاسبة لدفع النقود والبطاقات', desc: 'Use the small tray provided at cash registers rather than handing currency directly to staff.', descAr: 'ضع النقود أو البطاقة في الصينية الصغيرة المخصصة عند صندوق المحاسبة بدلاً من تسليمها باليد مباشرة.' },
          { title: 'Sort garbage according to local neighborhood rules', titleAr: 'فرز النفايات بدقة حسب جداول الحي', desc: 'Separate recyclables (PET bottles, cans, paper) from burnable household waste.', descAr: 'افصل المواد القابلة لإعادة التدوير (العلب والزجاجات) عن النفايات العادية.' },
        ],
        donts: [
          { title: 'Never stick chopsticks vertically into rice bowls', titleAr: 'تجنب غرس أعواد الطعام عمودياً في الأرز', desc: 'Vertical chopsticks resemble funeral incense rituals (Tsukitate-bashi) and are considered bad luck.', descAr: 'غرس الأعواد عمودياً يرتبط بطقوس الجنائز؛ ضعها دائماً على حامل الأعواد المخصص.' },
          { title: 'Avoid walking while eating or drinking on busy streets', titleAr: 'تجنب المشي أثناء الأكل والشرب في الشارع', desc: 'Consume snacks and drinks near the convenience store or vending machine where purchased.', descAr: 'تناول وجبتك الخفيفة أو مشروبك بجانب المتجر أو آلة البيع بدلاً من المشي بها في الطرقات المزدحمة.' },
          { title: 'Do not leave restaurant tips on tables', titleAr: 'تجنب ترك إكرامية (بقشيش) على طاولات المطاعم', desc: 'Tipping is not customary in Japan; service staff take pride in standard excellence and may run after you to return forgotten money.', descAr: 'البقشيش غير معمول به في اليابان والخدمة الممتازة مشمولة؛ قد يلحق بك النادل لإعادة المبلغ ظناً منه أنك نسيته.' },
          { title: 'Avoid talking loudly in elevators and shared quiet spaces', titleAr: 'تجنب التحدث بصوت مرتفع في المصاعد والأماكن الهادئة', desc: 'Keep your speaking volume subdued to respect others sharing the space.', descAr: 'حافظ على نبرة صوت هادئة ومنخفضة احتراماً لراحة الآخرين في الأماكن المغلقة والمشتركة.' },
        ],
        goodToKnow: [
          { title: 'Bowing angle indicates degree of formality', titleAr: 'زاوية الانحناء تدل على مستوى التقدير', desc: 'A quick 15° nod works for greetings; a 30° bow is standard for appreciation or apologies.', descAr: 'إيماءة 15 درجة تكفي للتحية العادية، بينما انحناءة 30 درجة تعبر عن الامتنان أو الاعتذار الرسمي.' },
          { title: 'Escalator standing sides differ by region', titleAr: 'جانب الوقوف في السلالم المتحركة يختلف بين المدن', desc: 'Commuters stand on the left in Tokyo, but stand on the right in Osaka to let walking passengers pass.', descAr: 'يقف المشاة على الجانب الأيسر في طوكيو، بينما يقفون على اليمين في أوساكا لإفساح المجال للمستعجلين.' },
          { title: 'Cash is still handy in smaller shops', titleAr: 'النقود الورقية والعملات مفيدة في المتاجر الصغيرة', desc: 'While digital IC cards and credit cards are widely accepted in cities, carrying 10,000 JPY cash is wise for small shrines and ticket machines.', descAr: 'رغم انتشار الدفع الرقمي، يُفضل دائماً الاحتفاظ ببعض العملات النقدية للمتاجر الصغيرة وآلات التذاكر.' },
        ],
      },
      disclaimer: 'Social norms can vary between people, regions and situations. When unsure, it is okay to politely ask.',
      disclaimerAr: 'تختلف الأعراف والممارسات الاجتماعية بين الأفراد والمناطق والمواقف. عندما تكون في شك، يُرحب دائماً بالسؤال بأدب ولطف.',
    };
  }

  // Generic cultural guidance
  return {
    knowTheCulture: {
      history: {
        title: 'Heritage & Historical Foundations',
        titleAr: 'التاريخ والجذور التراثية',
        content: `${destinationName} boasts a rich historical legacy shaped by diverse civilizations, architectural wonders, and cultural milestones that define the pride of its people today.`,
        contentAr: `تتمتع ${destinationName} بإرث تاريخي عريق شكلته الحضارات المتعاقبة والمعالم المعمارية التي تمثل مصدر اعتزاز لأهل البلد اليوم.`,
      },
      clothing: {
        title: 'Local Dress & Public Appearance',
        titleAr: 'الملابس والمظهر العام',
        content: `Everyday attire leans toward comfortable and respectful styles. Dressing modestly when visiting cultural sites or historic districts is warmly appreciated.`,
        contentAr: `يميل المظهر العام إلى الأناقة والاحتشام. ارتداء ملابس لائقة عند زيارة المعالم التراثية أو دور العبادة يحظى بتقدير الجميع.`,
      },
      foodCulture: {
        title: 'Culinary Traditions & Shared Meals',
        titleAr: 'ثقافة الطعام والمائدة',
        content: `Dining is a central social event in ${destinationName}, celebrating local spices, traditional recipes, and warm hospitality shared with family and guests.`,
        contentAr: `يشكل تناول الطعام مناسبة اجتماعية دافئة في ${destinationName}، تحتفي بالأطباق التقليدية وكرم الضيافة مع العائلة والضيوف.`,
      },
      familySocial: {
        title: 'Family Ties & Community Structure',
        titleAr: 'الترابط الأسري والمجتمعي',
        content: `Family and community support play an essential role in daily life, with high respect paid to elders and warm generosity toward international guests.`,
        contentAr: `للأسرة والترابط المجتمعي مكانة أساسية في الحياة اليومية، مع تقدير كبير لكبار السن وترحيب حار بالضيوف والزوار.`,
      },
      dailyLifestyle: {
        title: 'Daily Pace & Neighborhood Life',
        titleAr: 'إيقاع الحياة اليومية وتفاصيل الحي',
        content: `In ${cityName}, life balances vibrant commerce with relaxed social cafes and evening family gatherings in public plazas and parks.`,
        contentAr: `في ${cityName}، يتناغم النشاط التجاري والحضري مع المقاهي التفاعلية واللقاءات المسائية في الساحات والحدائق العامة.`,
      },
      greetings: {
        title: 'Greetings & First Encounters',
        titleAr: 'التحية وآداب اللقاء الأول',
        content: `A warm greeting accompanied by a smile and polite eye contact establishes an immediate bond of friendship and respect.`,
        contentAr: `التحية الودية المقترنة بالابتسامة والتواصل البصري اللبق تترك انطباعاً إيجابياً وتبني جسور التفاهم فوراً.`,
      },
      communication: {
        title: 'Communication Nuance & Courtesy',
        titleAr: 'أسلوب الحوار واللباقة',
        content: `Polite, respectful inquiries and patience are the golden standard when speaking with locals and service staff.`,
        contentAr: `اللباقة والصبر واستخدام الكلمات المهذبة هي المعيار الذهبي في التعامل مع السكان ومقدمي الخدمات.`,
      },
      traditions: {
        title: 'Honoring Cultural Customs',
        titleAr: 'العادات والتقاليد الأصيلة',
        content: `Local traditions reflect centuries of hospitality, artisanal crafts, and music that bring stories of the past to life.`,
        contentAr: `تعكس العادات المحلية قروناً من الضيافة والحرف التراثية والموسيقى التي تحيي قصص الماضي وتاريخ الوطن.`,
      },
      celebrations: {
        title: 'National & Cultural Holidays',
        titleAr: 'الأعياد والاحتفالات الوطنية',
        content: `Major cultural festivals and holidays bring colorful community gatherings, traditional performances, and seasonal festive cuisine.`,
        contentAr: `تجمع الأعياد والمهرجانات الوطنية المجتمعات في أجواء مبهجة من الفنون الشعبية والأطباق الاحتفالية الموسمية.`,
      },
      socialValues: {
        title: 'Hospitality & Mutual Respect',
        titleAr: 'كرم الضيافة والاحترام المتبادل',
        content: `Mutual respect, pride in heritage, and warm generosity to travelers are celebrated social values across ${destinationName}.`,
        contentAr: `الاحترام المتبادل، والاعتزاز بالهوية، وإكرام الضيف من أبرز القيم الاجتماعية التي يعتز بها أهل ${destinationName}.`,
      },
      modernVsTraditional: {
        title: 'Modern Growth with Cultural Identity',
        titleAr: 'التطور العصري مع الحفاظ على الهوية',
        content: `Cities in ${destinationName} embrace modern technology and international trade while vigorously preserving historic landmarks and authentic customs.`,
        contentAr: `تتبنى مدن ${destinationName} أحدث التقنيات والخدمات العصرية مع المحافظة الوثيقة على المعالم التاريخية والعادات الأصيلة.`,
      },
    },
    howToBehave: {
      dos: [
        { title: 'Learn basic everyday greetings in the local language', titleAr: 'تعلم كلمات التحية البسيطة باللغة المحلية', desc: 'Greeting shopkeepers and drivers in their native language demonstrates genuine appreciation.', descAr: 'إلقاء التحية باللغة المحلية يعبر عن التقدير والاحترام لأهل البلد.' },
        { title: 'Ask permission before photographing individuals', titleAr: 'الاستئذان قبل تصوير الأشخاص في الأماكن العامة', desc: 'Always respect personal privacy, particularly in traditional markets and residential areas.', descAr: 'احترم خصوصية الناس واستأذن بلطف قبل التقاط الصور في الأسواق والأحياء.' },
        { title: 'Dress respectfully when visiting sacred and heritage sites', titleAr: 'ارتداء ملابس لائقة ومحتشمة عند زيارة المعالم التاريخية', desc: 'Cover shoulders and knees when entering religious monuments or formal institutions.', descAr: 'احرص على تغطية الكتفين والركبتين عند دخول المعالم الدينية أو المؤسسات الرسمية.' },
      ],
      donts: [
        { title: 'Avoid public arguments or speaking loudly on speakerphone', titleAr: 'تجنب الجدال المرتفع واستخدام مكبر الصوت في الأماكن العامة', desc: 'Maintain a calm, measured tone in shared public spaces and public transport.', descAr: 'حافظ على نبرة صوت هادئة في وسائل النقل والأماكن العامة المشتركة.' },
        { title: 'Avoid assuming everyone understands your language', titleAr: 'تجنب افتراض تحدث الجميع بلغتك الأم', desc: 'Begin with a polite inquiry or use a translation companion app to assist communication.', descAr: 'ابدأ بسؤال مهذب عما إذا كان الطرف الآخر يتحدث لغتك أو استعن بتطبيق المساعد.' },
        { title: 'Avoid ignoring local queuing and safety instructions', titleAr: 'تجنب تجاوز طوابير الانتظار أو تجاهل لافتات الإرشاد', desc: 'Respect line order at ticket counters, registers, and transit boarding points.', descAr: 'التزم بالطوابير الرسمية في محطات النقل والمتاجر وشبابيك التذاكر.' },
      ],
      goodToKnow: [
        { title: 'Local payment customs and tipping norms', titleAr: 'أنظمة الدفع وقواعد البقشيش المحلية', desc: 'Check local tipping customs: some destinations include service charges, while others appreciate 10-15% gratuity.', descAr: 'تحقق من أعراف البقشيش: بعض البلدان تدرجه في الفاتورة بينما يُقدر في بلدان أخرى كإكرامية اختيارية.' },
        { title: 'Carrying emergency embassy contacts', titleAr: 'الاحتفاظ بأرقام طوارئ سفارة بلدك', desc: 'Always save your embassy hotline and local emergency dispatch numbers in your phone.', descAr: 'احتفظ دائماً بأرقام طوارئ سفارة بلدك وأرقام الطوارئ المحلية في هاتفك.' },
      ],
    },
    disclaimer: 'Social norms can vary between people, regions and situations. When unsure, it is okay to politely ask.',
    disclaimerAr: 'تختلف الأعراف والممارسات الاجتماعية بين الأفراد والمناطق والمواقف. عندما تكون في شك، يُرحب دائماً بالسؤال بأدب ولطف.',
  };
}

export function getDefaultPhrases(destinationName: string, cityName: string = 'Tokyo'): LocalLanguageData {
  const norm = destinationName.toLowerCase();
  const isChina = norm.includes('china') || destinationName.includes('الصين');
  const isJapan = norm.includes('japan') || destinationName.includes('اليابان');

  if (isChina) {
    return {
      languageName: 'Mandarin Chinese (普通话)',
      languageCode: 'zh-CN',
      localFavorites: [
        {
          phrase: '辛苦了',
          transliteration: 'Xīnkǔle',
          meaningEn: 'Thank you for your hard work / You’ve worked hard',
          meaningAr: 'يعطيك العافية / شكراً لجهدك وتعبك',
          whySpecialEn: 'A warm, affectionate Chinese expression used to thank drivers, delivery staff, and colleagues at the end of a task.',
          whySpecialAr: 'عبارة تقدير صينية دافئة تُقال للسائقين ومقدمي الخدمات والزملاء امتناناً لجهودهم.',
        },
        {
          phrase: '慢慢吃',
          transliteration: 'Màn man chī',
          meaningEn: 'Enjoy your meal / Eat slowly and savor',
          meaningAr: 'بالعافية / بالهناء والشفاء',
          whySpecialEn: 'Warm hospitality phrase said by restaurant hosts wishing guests a relaxed, delicious dining experience.',
          whySpecialAr: 'عبارة كرم ضيافة تُقال للضيوف لتمني وجبة هنيئة ومريحة.',
        },
        {
          phrase: '没问题',
          transliteration: 'Méi wèntí',
          meaningEn: 'No problem / Absolutely',
          meaningAr: 'لا مشكلة / بكل سرور / من دواعي سروري',
          whySpecialEn: 'The friendliest, most common everyday reassurance in conversations and service.',
          whySpecialAr: 'العبارة الأكثر شيوعاً وبثاً للطمأنينة في كافة التعاملات اليومية.',
        },
      ],
      phrases: [
        {
          id: 'zh-1',
          category: 'greetings',
          phrase: '你好',
          transliteration: 'Nǐ hǎo',
          meaningEn: 'Hello / Greetings',
          meaningAr: 'مرحباً / أهلاً بك',
          formality: 'polite',
          whenToUse: 'Universal greeting for anyone, anywhere at any time.',
          whenToUseAr: 'التحية العامة الأكثر استخداماً في كل مكان ووقت.',
          culturalNote: 'Pronounced with falling-rising then falling-rising pitch with a friendly smile.',
          culturalNoteAr: 'انطقها بابتسامة دافئة كمدخل لأي محادثة.',
        },
        {
          id: 'zh-2',
          category: 'courtesy',
          phrase: '谢谢',
          transliteration: 'Xièxie',
          meaningEn: 'Thank you',
          meaningAr: 'شكراً جزيلاً',
          formality: 'polite',
          whenToUse: 'Standard polite thank you for any favor or service.',
          whenToUseAr: 'للتعبير عن الشكر والامتنان عند تلقي أي خدمة.',
          culturalNote: 'Accompany with a polite nod of the head.',
          culturalNoteAr: 'ارفقها بإيماءة رأس خفيفة.',
        },
        {
          id: 'zh-3',
          category: 'courtesy',
          phrase: '不好意思',
          transliteration: 'Bù hǎoyìsi',
          meaningEn: 'Excuse me / Sorry to bother',
          meaningAr: 'عذراً / لو سمحت / أعتذر للإزعاج',
          formality: 'polite',
          whenToUse: 'Polite way to catch someone’s attention or apologize for moving through crowds.',
          whenToUseAr: 'لجذب انتباه النادل، أو للمرور بين الحشود بلباقة.',
        },
        {
          id: 'zh-4',
          category: 'dining',
          phrase: '请问有清真餐吗？',
          transliteration: 'Qǐngwèn yǒu qīngzhēn cān ma?',
          meaningEn: 'Do you have halal (Qingzhen) food?',
          meaningAr: 'هل يتوفر لديكم طعام حلال (تشينغ-جين)؟',
          formality: 'polite',
          whenToUse: 'Asking about halal certified cuisine in restaurants.',
          whenToUseAr: 'للسؤال عن الطعام الحلال المعتمد في المطاعم.',
        },
        {
          id: 'zh-5',
          category: 'dining',
          phrase: '这个不要猪肉',
          transliteration: 'Zhège bù yào zhūròu',
          meaningEn: 'No pork in this dish please',
          meaningAr: 'بدون لحم خنزير في هذا الطبق رجاءً',
          formality: 'polite',
          whenToUse: 'Confirming dietary exclusion of pork or lard.',
          whenToUseAr: 'للتأكيد على خلو الوجبة من لحم الخنزير أو دهنه.',
        },
        {
          id: 'zh-6',
          category: 'shopping',
          phrase: '多少钱？',
          transliteration: 'Duōshǎo qián?',
          meaningEn: 'How much is this?',
          meaningAr: 'بكم هذا؟ / كم السعر؟',
          formality: 'polite',
          whenToUse: 'Inquiring prices in shops, markets, and taxis.',
          whenToUseAr: 'للسؤال عن السعر في المتاجر والأسواق.',
        },
        {
          id: 'zh-7',
          category: 'transport',
          phrase: '请问洗手间在哪里？',
          transliteration: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?',
          meaningEn: 'Where is the restroom, please?',
          meaningAr: 'أين دورة المياه لو سمحت؟',
          formality: 'polite',
          whenToUse: 'Essential directions phrase in train stations and shopping malls.',
          whenToUseAr: 'السؤال عن مكان دورة المياه في المحطات والمجمعات.',
        },
        {
          id: 'zh-8',
          category: 'emergency',
          phrase: '救命！',
          transliteration: 'Jiùmìng!',
          meaningEn: 'Help! (Emergency)',
          meaningAr: 'النجدة! / أنقذوني!',
          formality: 'formal',
          whenToUse: 'Urgent emergency situations requiring immediate help.',
          whenToUseAr: 'في حالات الطوارئ القصوى لطلب المساعدة الفورية.',
        },
      ],
    };
  }

  if (isJapan) {
    return {
      languageName: 'Japanese (日本語)',
      languageCode: 'ja-JP',
      localFavorites: [
        {
          phrase: 'お疲れ様です',
          transliteration: 'Otsukaresama desu',
          meaningEn: 'Thank you for your hard work / Good job',
          meaningAr: 'يعطيك العافية / شكراً لجهودك الكريمة',
          whySpecialEn: 'The quintessential Japanese greeting for colleagues, service partners, and end of day.',
          whySpecialAr: 'العبارة الأكثر تميزاً في اليابان لتقدير جهود الآخرين في نهاية العمل أو المهام المشتركة.',
        },
        {
          phrase: 'いただきます',
          transliteration: 'Itadakimasu',
          meaningEn: 'I gratefully receive this meal',
          meaningAr: 'بسم الله / أتقبل هذا الطعام بامتنان',
          whySpecialEn: 'Said before every meal with hands together to thank the chef, nature, and farmers.',
          whySpecialAr: 'تُقال قبل كل وجبة طعام مع ضم اليدين كتحية شكر وامتنان لمن أعد الطعام وللطبيعة.',
        },
        {
          phrase: 'よろしくお願いします',
          transliteration: 'Yoroshiku onegaishimasu',
          meaningEn: 'Please treat me favorably / Looking forward to working with you',
          meaningAr: 'تشرفت بالتعامل معك / أرجو منك حسن الرعاية والتعاون',
          whySpecialEn: 'Untranslatable essential phrase for new introductions, asking favors, or starting projects.',
          whySpecialAr: 'عبارة جوهرية في الثقافة اليابانية تُقال عند التعارف، طلب مساعدة، أو بدء تعاون جديد.',
        },
        {
          phrase: '大丈夫です',
          transliteration: 'Daijoubu desu',
          meaningEn: 'It is all right / No problem / I am okay',
          meaningAr: 'كل شيء تمام / لا بأس / لست بحاجة لمزيد',
          whySpecialEn: 'Extremely versatile: used for "I’m fine", "No problem", or declining a plastic bag politely.',
          whySpecialAr: 'عبارة يومية متعددة الاستخدامات: لطمأنة الآخرين أو للاعتذار اللبق عن كيس البلاستيك.',
        },
      ],
      phrases: [
        {
          id: 'p1',
          category: 'greetings',
          phrase: 'こんにちは',
          transliteration: 'Konnichiwa',
          meaningEn: 'Hello / Good afternoon',
          meaningAr: 'مرحباً / طاب يومك',
          formality: 'polite',
          whenToUse: 'General daytime greeting (10:00 AM – 5:00 PM) with shopkeepers, hotel staff, and acquaintances.',
          whenToUseAr: 'تحية عامة نهارية مناسبة في المتاجر ومع الفنادق والمعارف.',
          whenToAvoid: 'Early morning (use Ohayou gozaimasu) or late night (use Konbanwa).',
          whenToAvoidAr: 'الصباح الباكر أو المساء المتأخر.',
          culturalNote: 'Pronounce each syllable evenly with a polite nod.',
          culturalNoteAr: 'انطق كل مقطع بوضوح وبنبرة هادئة مع إيماءة رأس خفيفة.',
        },
        {
          id: 'p2',
          category: 'courtesy',
          phrase: 'ありがとうございます',
          transliteration: 'Arigatou gozaimasu',
          meaningEn: 'Thank you very much',
          meaningAr: 'شكراً جزيلاً لك',
          formality: 'polite',
          whenToUse: 'Standard polite thank you for any service, meal, or assistance.',
          whenToUseAr: 'عبارة الشكر الرسمية والمهذبة بعد تلقي خدمة أو مساعدة.',
          whenToAvoid: 'Do not shorten to just "Arigatou" with older individuals or service staff.',
          whenToAvoidAr: 'لا تختصرها إلى Arigatou فقط مع كبار السن أو مقدمي الخدمة.',
          culturalNote: 'Accompany with a small nod or 15° bow for maximum courtesy.',
          culturalNoteAr: 'ارفقها بانحناءة رأس خفيفة لإظهار التقدير.',
        },
        {
          id: 'p3',
          category: 'courtesy',
          phrase: 'すみません',
          transliteration: 'Sumimasen',
          meaningEn: 'Excuse me / Sorry / Pardon',
          meaningAr: 'عذراً / لو سمحت / أعتذر',
          formality: 'polite',
          whenToUse: 'The #1 versatile daily phrase: call a waiter, apologize for bumping, or start an inquiry.',
          whenToUseAr: 'أهم عبارة يومية: لمناداة النادل، للاعتذار الخفيف، أو لبدء أي سؤال.',
          whenToAvoid: 'For major formal apologies, use "Moushiwake arimasen".',
          whenToAvoidAr: 'في حالات الاعتذار الرسمي الكبير يُفضل Moushiwake arimasen.',
          culturalNote: 'Essential for navigating crowded train platforms and stores.',
          culturalNoteAr: 'ضرورية جداً عند المرور في المحطات المزدحمة.',
        },
        {
          id: 'p4',
          category: 'dining',
          phrase: 'これをお願いします',
          transliteration: 'Kore o onegaishimasu',
          meaningEn: 'This one, please (pointing to menu item)',
          meaningAr: 'هذا الطلب من فضلك (مع الإشارة للقائمة)',
          formality: 'polite',
          whenToUse: 'Ordering food at restaurants or items at counters while pointing.',
          whenToUseAr: 'طلب الطعام في المطاعم أو المتاجر مع الإشارة للصنف في القائمة.',
          culturalNote: 'Saying "Kore o kudasai" is equally natural and polite.',
          culturalNoteAr: 'يمكن أيضاً قول Kore o kudasai بنفس المعنى.',
        },
        {
          id: 'p5',
          category: 'dining',
          phrase: 'ハラール対応はありますか？',
          transliteration: 'Haraaru taiou wa arimasu ka?',
          meaningEn: 'Do you have halal or Muslim-friendly options?',
          meaningAr: 'هل يتوفر لديكم خيارات حلال أو مناسبة للمسلمين؟',
          formality: 'polite',
          whenToUse: 'Asking restaurant staff if dishes contain pork or cooking alcohol (Mirin/Sake).',
          whenToUseAr: 'للسؤال في المطاعم عما إذا كانت الوجبات خالية من مشتقات الخنزير وكحول الطبخ.',
          culturalNote: 'You can also ask "Butaniku wa haitte imasu ka?" (Does this contain pork?).',
          culturalNoteAr: 'يمكنك أيضاً السؤال: Butaniku wa haitte imasu ka? (هل يحتوي على لحم خنزير؟).',
        },
        {
          id: 'p6',
          category: 'transport',
          phrase: '〜はどこですか？',
          transliteration: '... wa doko desu ka?',
          meaningEn: 'Where is ...? (e.g. Eki wa doko desu ka = Where is the station?)',
          meaningAr: 'أين يوجد ...؟ (مثال: أين محطة القطار؟)',
          formality: 'polite',
          whenToUse: 'Asking directions to a station (Eki), restroom (Toire), or mosque (Masujido).',
          whenToUseAr: 'للسؤال عن اتجاه محطة (Eki)، دورة مياه (Toire)، أو مسجد (Masujido).',
          culturalNote: 'Toire wa doko desu ka? (Where is the restroom?) is the most critical survival phrase.',
          culturalNoteAr: 'السؤال عن دورة المياه: Toire wa doko desu ka؟',
        },
        {
          id: 'p7',
          category: 'emergency',
          phrase: '助けてください',
          transliteration: 'Tasukete kudasai',
          meaningEn: 'Please help me (Urgent)',
          meaningAr: 'أرجوك ساعدني (حالة طارئة)',
          formality: 'formal',
          whenToUse: 'In genuine emergencies, accidents, or urgent medical situations.',
          whenToUseAr: 'في الحالات الطارئة الحقيقية والحوادث لطلب المساعدة الفورية.',
          whenToAvoid: 'Do not use for trivial casual requests.',
          whenToAvoidAr: 'لا تستخدمها للطلبات البسيطة العادية.',
          culturalNote: 'Instantly alerts nearby police (Koban) and bystanders.',
          culturalNoteAr: 'تستنفر انتباه المارة والشرطة في كشك الكوبان فوراً.',
        },
        {
          id: 'p8',
          category: 'shopping',
          phrase: 'いくらですか？',
          transliteration: 'Ikura desu ka?',
          meaningEn: 'How much does this cost?',
          meaningAr: 'كم سعر هذا الشيء؟',
          formality: 'polite',
          whenToUse: 'Asking price at markets, boutiques, or souvenir shops.',
          whenToUseAr: 'للسؤال عن الأسعار في المتاجر والأسواق التراثية.',
          culturalNote: 'Prices in Japan are usually fixed; bargaining is not customary except at flea markets.',
          culturalNoteAr: 'الأسعار في اليابان ثابتة ولا يُقبل التفاوض عليها إلا في أسواق السلع المستعملة.',
        },
      ],
    };
  }

  // Generic local language dataset
  return {
    languageName: `Local Language (${destinationName})`,
    languageCode: 'en-US',
    localFavorites: [
      {
        phrase: 'Welcome / Greetings',
        transliteration: 'Marhaban / Greetings',
        meaningEn: 'Warm welcome and respect',
        meaningAr: 'أهلاً وسهلاً والترحيب الدافئ',
        whySpecialEn: 'Reflects the hospitality and warmth of the nation to travelers.',
        whySpecialAr: 'يعكس كرم الضيافة والترحيب بالمسافرين والزوار.',
      },
    ],
    phrases: [
      {
        id: 'p1',
        category: 'greetings',
        phrase: 'Hello & Good Day',
        transliteration: 'Hello',
        meaningEn: 'General greeting',
        meaningAr: 'مرحباً / طاب يومك',
        formality: 'polite',
        whenToUse: 'Greeting locals, store clerks, and hotel staff.',
        whenToUseAr: 'تحية عامة لبقة عند دخول المتاجر والفنادق.',
      },
      {
        id: 'p2',
        category: 'courtesy',
        phrase: 'Thank you very much',
        transliteration: 'Thank you',
        meaningEn: 'Expression of gratitude',
        meaningAr: 'شكراً جزيلاً لك',
        formality: 'polite',
        whenToUse: 'After every service, payment, or assistance.',
        whenToUseAr: 'بعد كل معاملة أو خدمة.',
      },
      {
        id: 'p3',
        category: 'dining',
        phrase: 'Is there a Halal option?',
        transliteration: 'Halal inquiry',
        meaningEn: 'Asking about halal or vegetarian ingredients',
        meaningAr: 'هل يتوفر طعام حلال أو نباتي خالي من المشتقات؟',
        formality: 'polite',
        whenToUse: 'Ordering in restaurants and food markets.',
        whenToUseAr: 'عند طلب الطعام في المطاعم والأسواق.',
      },
      {
        id: 'p4',
        category: 'transport',
        phrase: 'Where is the station / restroom?',
        transliteration: 'Directions inquiry',
        meaningEn: 'Asking for directions',
        meaningAr: 'أين محطة المواصلات / دورة المياه؟',
        formality: 'polite',
        whenToUse: 'Navigating city streets and transit hubs.',
        whenToUseAr: 'للسؤال عن الاتجاهات والمحطات.',
      },
      {
        id: 'p5',
        category: 'emergency',
        phrase: 'I need urgent assistance',
        transliteration: 'Emergency help',
        meaningEn: 'Urgent help request',
        meaningAr: 'أحتاج مساعدة عاجلة / طوارئ',
        formality: 'formal',
        whenToUse: 'Medical emergencies or police assistance.',
        whenToUseAr: 'في حالات الطوارئ الطبية أو الأمنية.',
      },
    ],
  };
}

export function getDefaultReligion(destinationName: string, cityName: string = 'Tokyo'): ReligionContextData {
  const norm = destinationName.toLowerCase();
  const isChina = norm.includes('china') || destinationName.includes('الصين');
  const isJapan = norm.includes('japan') || destinationName.includes('اليابان');

  if (isChina) {
    return {
      overview: 'China is a multi-religious country where Buddhism, Taoism, Islam, and Christianity coexist with rich historical roots. Historic mosques date back over 1,300 years to the Tang dynasty along the ancient Silk Road.',
      overviewAr: 'الصين بلد متعدد الثقافات والديانات؛ تتعايش فيه البوذية والطاوية والإسلام والمسيحية بإرث تاريخي عريق. وتعود المساجد التاريخية مثل مسجد نيوجيه في بكين ومسجد الحنين في غوانغتشو إلى أكثر من 1300 عام.',
      religiousLandscape: [
        {
          tradition: 'Buddhism & Traditional Philosophies',
          traditionAr: 'البوذية والفلسفات الصينية',
          percentageEstimate: 'Cultural tradition',
          description: 'Mahayana Buddhism and Taoism have deeply influenced Chinese art, medicine, and architecture.',
          descriptionAr: 'أثرت البوذية والطاوية بعمق في الفنون المعمارية والتأمل والطب الصيني التقليدي.',
        },
        {
          tradition: 'Islam (Hui & Uyghur communities)',
          traditionAr: 'الإسلام والمجتمعات المسلمة العريقة',
          percentageEstimate: 'Over 25 million Muslims',
          description: 'Islam has a 1,300-year heritage in China with over 39,000 mosques nationwide and a widespread Qingzhen (halal) culinary tradition.',
          descriptionAr: 'يمتلك الإسلام تاريخاً يمتد لأكثر من 1300 عام، وتضم الصين أكثر من 39 ألف مسجد ومطاعم تشينغ-جين الحلال المنتشرة.',
        },
      ],
      practicesAndHolidays: [
        {
          name: 'Spring Festival (Lunar New Year)',
          nameAr: 'عيد الربيع (رأس السنة الصينية)',
          timing: 'January / February',
          timingAr: 'يناير / فبراير',
          impact: 'Nationwide public holiday with peak travel, temple fairs, and family reunions. Book tickets far in advance.',
          impactAr: 'عطلة وطنية شاملة تشهد حركة سفر ضخمة؛ يُنصح بحجز القطارات والفنادق مبكراً جداً.',
        },
        {
          name: 'Eid al-Fitr & Eid al-Adha in Muslim Districts',
          nameAr: 'عيد الفطر وعيد الأضحى في الأحياء الإسلامية',
          timing: 'Islamic Lunar Calendar',
          timingAr: 'التقويم الهجري',
          impact: 'Celebrated with festive bazaars, morning prayers, and communal feasts around major mosques like Niujie.',
          impactAr: 'تُقام صلوات العيد وبازارات المأكولات التراثية في محيط المساجد التاريخية كمسجد نيوجيه.',
        },
      ],
      placesOfWorship: [
        {
          type: 'Historic Mosques (Qingzhen Si)',
          typeAr: 'المساجد التاريخية (تشينغ-جين سي)',
          guidance: 'Blend traditional Chinese imperial pagoda roofs with Islamic calligraphy. Women’s prayer sections are available.',
          guidanceAr: 'تتميز بعمارة إمبراطورية صينية فريدة مع خطوط عربية بديعة ومصليات مخصصة للرجال والنساء.',
          etiquette: [
            'Remove shoes before stepping into carpeted prayer halls.',
            'Dress modestly with long pants and covered shoulders.',
          ],
          etiquetteAr: [
            'خلع الأحذية قبل الدخول إلى قاعات الصلاة المفروشة.',
            'ارتداء ملابس ساترة ولائقة بالمسجد.',
          ],
        },
      ],
      dietaryAndPublicBehavior: {
        dietaryOverview: 'Chinese culinary heritage has a dedicated Halal category called Qingzhen (清真). Over 100,000 Halal restaurants operate across China, identified by clear green signage.',
        dietaryOverviewAr: 'يتميز المطبخ الصيني بتصنيف رسمي خاص للطعام الحلال يُعرف باسم "تشينغ-جين" (清真)، وتضم المدن آلاف المطاعم الحلال المميزة بالشعار الأخضر.',
        dressExpectations: 'Casual, modest clothing is standard and welcomed everywhere.',
        dressExpectationsAr: 'الملابس الأنيقة والمحتشمة مألوفة ومرحب بها في كافة الأماكن العامة.',
        publicEtiquette: 'Public order and queuing etiquette are widely respected in modern transit and attractions.',
        publicEtiquetteAr: 'الالتزام بالنظام والاصطفاف في المحطات والمعالم السياحية يعكس تجربة سفر مريحة.',
      },
      muslimTravelerGuide: {
        halalOverview: 'Finding Halal food in China is convenient by looking for the green "清真" (Qingzhen) sign or searching for Lanzhou Lamian (兰州拉面) noodle shops, present on almost every city street.',
        halalOverviewAr: 'العثور على الطعام الحلال في الصين ميسر جداً؛ ابحث عن علامة "清真" أو مطاعم نودلز لانتشو الشهيرة (兰州拉面) المتوفرة في كل شارع تقريباً.',
        halalVerificationTips: [
          'Look for the green "清真" (Qingzhen) certification plate above the restaurant door.',
          'Lanzhou Beef Noodles (兰州牛肉拉面) and Xinjiang Lamb Skewers (新疆羊肉串) are universally halal.',
          'Avoid dishes cooked with standard cooking wine (Liaojiu) by requesting Qingzhen certified kitchens.',
        ],
        halalVerificationTipsAr: [
          'ابحث عن لوحة الاعتماد الخضراء المكتوب عليها "清真" فوق مدخل المطعم.',
          'مطاعم نودلز لانتشو ومطاعم شينجيانغ للمشويات حلال ومعتمدة بالكامل.',
          'في المطاعم العامة، احرص على التأكد من عدم استخدام كحول الطبخ (لياو-جيو).',
        ],
        mosquesAndPrayer: 'Major cities have iconic central mosques: Niujie Mosque in Beijing, Xiaotaoyuan Mosque in Shanghai, and Huaisheng Mosque in Guangzhou.',
        mosquesAndPrayerAr: 'تضم المدن مساجد كبرى شهيرة: مسجد نيوجيه في بكين، مسجد شياوتاويوان في شنغهاي، ومسجد الحنين في غوانغتشو.',
        publicPrayerEtiquette: 'Perform daily prayers in mosques, airport prayer rooms, or inside your private hotel room.',
        publicPrayerEtiquetteAr: 'يُنصح بأداء الصلوات في المساجد أو غرف الصلاة في المطارات أو مقر السكن الخاص.',
        ramadanConsiderations: 'Community Iftars and festive Halal food markets surround major mosques every evening during Ramadan.',
        ramadanConsiderationsAr: 'تُقام موائد إفطار يومية وأسواق مأكولات شعبية دافئة حول المساجد الرئيسية طوال شهر رمضان المبارك.',
        localInquiryPhrases: [
          {
            phrase: '请问这是清真餐厅吗？',
            pronunciation: 'Qǐngwèn zhè shì qīngzhēn cāntīng ma?',
            meaningEn: 'Is this a Halal certified restaurant?',
            meaningAr: 'هل هذا مطعم حلال معتمد؟',
          },
        ],
      },
      disclaimer: 'Halal options and prayer amenities are widely available across major metropolitan districts.',
      disclaimerAr: 'تتوفر الخيارات الحلال والمساجد بسهولة في مختلف المدن والمناطق الكبرى.',
    };
  }

  if (isJapan) {
    return {
      overview: 'Japan’s spiritual culture is predominantly a harmonious blend of Shinto (indigenous reverence for nature) and Buddhism, functioning primarily as cultural traditions, seasonal rites of passage, and heritage rather than dogmatic daily obligation. Freedom of religion is constitutionally protected, and society is safe, peaceful, and respectful of diverse international beliefs.',
      overviewAr: 'تمتزج الثقافة الروحية في اليابان بين الشنتو (احترام الطبيعة) والبوذية كتقاليد ثقافية وممارسات موسمية ومحطات تراثية. يكفل الدستور حرية الأديان كاملة، ويتميز المجتمع بالأمان والهدوء والاحترام المتبادل لكافة المعتقدات والزوار.',
      religiousLandscape: [
        {
          tradition: 'Shinto (Indigenous Traditions)',
          traditionAr: 'الشنتو (التقاليد الأصيلة)',
          percentageEstimate: 'Cultural observance',
          description: 'Focuses on reverence for nature, ancestors, and kami (spirits). Centered around Jinja (shrines) marked by red Torii gates.',
          descriptionAr: 'تركز على توقير الطبيعة والأسلاف وإقامة الطقوس في أضرحة الجينجا المميزة ببوابات التوري الحمراء.',
        },
        {
          tradition: 'Buddhism (Mahayana Traditions)',
          traditionAr: 'البوذية (تقاليد الماهايانا)',
          percentageEstimate: 'Cultural observance',
          description: 'Introduced in the 6th century, Buddhism influences architecture, memorial rites, mindfulness, and historic temples (O-tera).',
          descriptionAr: 'دخلت اليابان في القرن السادس الميلادي، وتؤثر في العمارة والمراسم التذكارية والتأمل والمعابد التاريخية.',
        },
        {
          tradition: 'Islam & International Faiths',
          traditionAr: 'الإسلام والديانات الدولية',
          percentageEstimate: 'Growing community',
          description: 'Home to vibrant international mosques such as Tokyo Camii, Otsuka Mosque, and Kobe Mosque, with an expanding halal and Muslim-friendly infrastructure.',
          descriptionAr: 'تضم اليابان مساجد ومراكز إسلامية عريقة مثل مسجد طوكيو كامي ومسجد كوبي، مع تزايد البنية التحتية للمطاعم والخدمات الحلال.',
        },
      ],
      practicesAndHolidays: [
        {
          name: 'Hatsumode (New Year Shrine/Temple Visit)',
          nameAr: 'هاتسومودي (زيارة رأس السنة للأضرحة والمعابد)',
          timing: 'January 1–3',
          timingAr: '1–3 يناير',
          impact: 'Millions visit Shinto shrines and Buddhist temples to pray for safety and good fortune in the new year.',
          impactAr: 'يقوم الملايين بزيارة الأضرحة والمعابد طلباً للتوفيق والسلامة في العام الجديد مع رمي العملات المعدنية والتمني.',
        },
        {
          name: 'Obon Festival',
          nameAr: 'مهرجان الأوبون (تخليد ذكرى الأسلاف)',
          timing: 'Mid-August (or mid-July in Tokyo)',
          timingAr: 'منتصف أغسطس (أو منتصف يوليو في طوكيو)',
          impact: 'Buddhist tradition honoring ancestral spirits with lantern floating (Toro Nagashi) and traditional Bon Odori folk dancing.',
          impactAr: 'تقليد بوذي لتكريم الأسلاف، وتزيين الممرات بالفوانيس المائية ورقصات البون أودوري التراثية.',
        },
      ],
      placesOfWorship: [
        {
          type: 'Historic Mosques & Islamic Centers (e.g., Tokyo Camii)',
          typeAr: 'المساجد والمراكز الإسلامية التاريخية (مثل مسجد طوكيو كامي)',
          guidance: 'Welcoming Ottoman-style architecture with visitor information center and halal market.',
          guidanceAr: 'عمارة عثمانية مهيبة مع مركز معلومات للزوار ومتجر للمنتجات الحلال.',
          etiquette: ['Dress modestly and remove shoes upon entering prayer halls.'],
          etiquetteAr: ['ارتداء ملابس محتشمة وخلع الأحذية عند دخول قاعات الصلاة.'],
        },
      ],
      dietaryAndPublicBehavior: {
        dietaryOverview: 'Japan has clear allergen and ingredient labeling; Muslim-friendly and certified halal dining is expanding rapidly.',
        dietaryOverviewAr: 'تتميز اليابان بتوضيح المكونات بدقة مع تزايد كبير في المطاعم الحلال والمعتمدة.',
        dressExpectations: 'Standard respectful attire is welcomed everywhere.',
        dressExpectationsAr: 'الملابس الأنيقة والمريحة ملائمة لكافة الأماكن والوجهات.',
        publicEtiquette: 'Quiet consideration and queue etiquette are highly appreciated.',
        publicEtiquetteAr: 'الهدوء والالتزام بالنظام والاصطفاف يحظى بتقدير كبير في المجتمع الياباني.',
      },
      muslimTravelerGuide: {
        halalOverview: 'Certified Halal dining is available across Tokyo, Osaka, Kyoto, and Nagoya.',
        halalOverviewAr: 'تتوفر المطاعم الحلال المعتمدة في طوكيو وأوساكا وكيوتو وناغويا.',
        halalVerificationTips: ['Look for Japan Muslim Association (JMA) or Halal Gourmet Japan app certifications.'],
        halalVerificationTipsAr: ['ابحث عن اعتماد جمعية مسلمي اليابان أو تطبيق Halal Gourmet Japan المعتمد.'],
        mosquesAndPrayer: 'Prayer rooms are located in major airports (Haneda, Narita, Kansai), Tokyo Station, and Tokyo Camii.',
        mosquesAndPrayerAr: 'تتوفر مصليات مجهزة في مطارات هانيدا وناريتا وكانساي ومحطة طوكيو المركزية ومسجد طوكيو كامي الشهير.',
        publicPrayerEtiquette: 'Carry a travel prayer mat; discreet prayer in quiet designated lounges is welcomed.',
        publicPrayerEtiquetteAr: 'يُفضل حمل سجادة صلاة خفيفة واستخدام غرف الصلاة المخصصة في المجمعات والمطارات.',
        ramadanConsiderations: 'Tokyo Camii and local Islamic centers host vibrant international community Iftars with Turkish and Japanese halal hospitality.',
        ramadanConsiderationsAr: 'يقيم مسجد طوكيو كامي والمراكز الإسلامية موائد إفطار جماعية وترحيباً رائعاً بالمسافرين طوال شهر رمضان المبارك.',
        localInquiryPhrases: [
          {
            phrase: 'これはハラール対応ですか？',
            pronunciation: 'Kore wa harāru taiō desu ka?',
            meaningEn: 'Is this Halal suitable / Halal certified?',
            meaningAr: 'هل هذا مناسب للحلال / معتمد كطعام حلال؟',
          },
          {
            phrase: '豚肉とお酒は入っていませんか？',
            pronunciation: 'Butaniku to osake wa haitte imasen ka?',
            meaningEn: 'Does this contain pork or alcohol/mirin?',
            meaningAr: 'هل يحتوي هذا على لحم خنزير أو كحول/ميرين؟',
          },
        ],
      },
      disclaimer: 'Japan is known for its safety, cleanliness, and hospitality; dietary and religious needs are respected with courteous attention.',
      disclaimerAr: 'تتميز اليابان بالأمان العالي وحسن الضيافة، وتُلبى الاحتياجات الغذائية والثقافية بكل احترام وعناية.',
    };
  }

  // Universal Worldwide Fallback
  return {
    overview: `Spiritual and cultural traditions in ${destinationName || 'your destination'} encompass diverse faith communities living in peaceful coexistence with dedicated places of worship and heritage centers.`,
    overviewAr: `تتنوع الثقافات والتقاليد الدينية في ${destinationName || 'وجهتك'} بين معالم تراثية ومراكز عبادة متعددة مع احترام متبادل للزوار والسياح الدوليين.`,
    religiousLandscape: [
      {
        tradition: 'National Heritage & Cultural Traditions',
        traditionAr: 'التراث الوطني والتقاليد الثقافية',
        percentageEstimate: 'Majority Tradition',
        description: 'Historic cultural architecture, national holidays, and traditional community gatherings.',
        descriptionAr: 'المعالم الدينية والتاريخية العريقة والاحتفالات والمناسبات الوطنية التراثية.',
      },
      {
        tradition: 'Islam & Global Faith Communities',
        traditionAr: 'الإسلام والديانات العالمية',
        percentageEstimate: 'Active Communities',
        description: 'Established mosques, multi-faith prayer centers, and certified international cuisine options.',
        descriptionAr: 'مساجد ومصليات معتمدة وخيارات طعام ومرافق ملائمة للزوار.',
      },
    ],
    practicesAndHolidays: [
      {
        name: 'National Cultural Heritage Day & Seasonal Festivals',
        nameAr: 'الأعياد والمهرجانات الوطنية والموسمية',
        timing: 'Throughout the year',
        timingAr: 'على مدار العام',
        impact: 'Public cultural celebrations, illuminated city squares, and traditional music and cuisine.',
        impactAr: 'احتفالات تراثية وثقافية عامة وتزيين الساحات والأسواق بالأنوار والفعاليات.',
      },
    ],
    placesOfWorship: [
      {
        type: 'Historic Heritage Places & Central Mosques',
        typeAr: 'المعالم الدينية التاريخية والمساجد المركزية',
        guidance: 'Open to respectful visitors with designated areas for daily prayers and community reflection.',
        guidanceAr: 'مفتوحة للزوار باحترام مع توفر مصليات مخصصة للصلوات اليومية.',
        etiquette: ['Dress respectfully and observe local visitor guidelines.'],
        etiquetteAr: ['ارتداء ملابس لائقة ومراعاة إرشادات الزوار المعتمدة.'],
      },
    ],
    dietaryAndPublicBehavior: {
      dietaryOverview: `Halal dining options and diverse international cuisines are accessible across central districts in ${cityName}.`,
      dietaryOverviewAr: `تتوفر خيارات طعام حلال ومطابخ عالمية متنوعة في مختلف أحياء ${cityName}.`,
      dressExpectations: 'Standard respectful attire appropriate for local cultural settings.',
      dressExpectationsAr: 'الملابس الأنيقة والمناسبة للثقافة المحلية مرحب بها دائماً.',
      publicEtiquette: 'Courtesy, personal space, and considerate behavior in public transport and venues.',
      publicEtiquetteAr: 'اللباقة ومراعاة الخصوصية والنظام في الأماكن العامة ووسائل النقل.',
    },
    muslimTravelerGuide: {
      halalOverview: `Halal restaurants and certified dining choices are accessible in central commercial zones across ${cityName}.`,
      halalOverviewAr: `تتوفر خيارات ومطاعم حلال معتمدة في وسط المدينة والمناطق السياحية في ${cityName}.`,
      halalVerificationTips: ['Verify Halal certification logos or inquire politely with restaurant management.'],
      halalVerificationTipsAr: ['التأكد من شعارات الاعتماد الحلال أو الاستفسار بلباقة من إدارة المطعم.'],
      mosquesAndPrayer: `Central mosques and quiet prayer rooms operate in major transport terminals and cultural centers across ${cityName}.`,
      mosquesAndPrayerAr: `تتوفر مساجد ومصليات في الموانئ والمطارات والمراكز الثقافية الرئيسية في ${cityName}.`,
      publicPrayerEtiquette: 'Discreet prayer in quiet locations or official prayer facilities is fully respected.',
      publicPrayerEtiquetteAr: 'أداء الصلاة بهدوء في المصليات المعتمدة أو الأماكن المخصصة يحظى بالاحترام والتقدير.',
      ramadanConsiderations: 'Community mosques host evening prayers and festive Iftar gatherings during Ramadan.',
      ramadanConsiderationsAr: 'تنظم المساجد والمراكز الإسلامية موائد إفطار جماعية وصلاة التراويح طوال الشهر الكريم.',
      localInquiryPhrases: [
        {
          phrase: 'Do you have Halal certified food options?',
          pronunciation: 'Do you have Halal certified food options?',
          meaningEn: 'Do you have Halal certified food options?',
          meaningAr: 'هل لديكم خيارات طعام حلال معتمدة؟',
        },
      ],
    },
    disclaimer: 'Spiritual and cultural traditions are provided for peaceful cross-cultural understanding and helpful traveler orientation.',
    disclaimerAr: 'المعلومات الثقافية والدينية مقدمة للتوجيه العملي وتسهيل تجربة السفر والتعايش الإيجابي بكل يسر.',
  };
}

export function getDefaultAccommodation(
  destinationName: string,
  cityName: string = 'Capital',
  durationStr?: string,
  purpose: string = 'tourism',
  budget: string = 'moderate',
  travelerType: string = 'solo'
): AccommodationRecommendation[] {
  const normDest = (destinationName || '').toLowerCase();
  const city = cityName || 'Central District';
  const isFamily = travelerType === 'family' || travelerType === 'group';
  const isMedical = purpose === 'medical' || purpose === 'recovery';
  const isStudy = purpose === 'study';
  const isRelocation = purpose === 'relocation' || purpose === 'work';

  const bookingBase = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city + ' ' + destinationName)}`;
  const tripBase = `https://www.trip.com/hotels/list?keyword=${encodeURIComponent(city + ' ' + destinationName)}`;
  const airbnbBase = `https://www.airbnb.com/s/${encodeURIComponent(city + '--' + destinationName)}/homes`;

  if (isMedical) {
    return [
      {
        id: 'acc-med-1',
        name: `${city} Central Medical Suites & Serviced Lodging`,
        nameAr: `أجنحة الإقامة الفندقية بالقرب من المراكز الطبية في ${city}`,
        type: 'medical_lodging',
        priceEstimate: '$130 - $210 / night',
        priceEstimateAr: '130 - 210 دولار / ليلة',
        location: `Hospital District, ${city}`,
        locationAr: `حي المرافق والمستشفيات، ${city}`,
        whyItFits: 'Wheelchair accessible with elevator, quiet soundproofed rooms, close to specialist clinics and 24h pharmacies.',
        whyItFitsAr: 'مهيأ بالكامل للكراسي المتحركة وغرف هادئة عازلة للصوت وقريب جداً من العيادات والصيدليات على مدار 24 ساعة.',
        directUrl: bookingBase,
        rating: 4.8,
        sourceProvider: 'Booking.com',
      },
      {
        id: 'acc-med-2',
        name: `Quiet Recovery Garden Serviced Residences`,
        nameAr: `شقق فندقية هادئة بإطلالة حدائق الاستشفاء`,
        type: 'apartment',
        priceEstimate: '$110 - $175 / night',
        priceEstimateAr: '110 - 175 دولار / ليلة',
        location: `Green District, ${city}`,
        locationAr: `حي الحدائق والهدوء، ${city}`,
        whyItFits: 'Equipped with full private kitchen for dietary control, peaceful surroundings, and companion sofa beds.',
        whyItFitsAr: 'مزودة بمطبخ متكامل للتحكم بالنظام الغذائي وأسرّة مريحة للمرافق ومحيط أخضر يساعد على الراحة والتعافي.',
        directUrl: tripBase,
        rating: 4.7,
        sourceProvider: 'Trip.com',
      },
    ];
  }

  if (isStudy) {
    return [
      {
        id: 'acc-stu-1',
        name: `${city} University Quarter Student Residence`,
        nameAr: `سكن الطلاب المعتمد بالقرب من الجامعات في ${city}`,
        type: 'student_housing',
        priceEstimate: '$650 - $1,100 / month',
        priceEstimateAr: '650 - 1,100 دولار / شهرياً',
        location: `University Campus Belt, ${city}`,
        locationAr: `نطاق الجامعات والمكتبات، ${city}`,
        whyItFits: 'High-speed Wi-Fi, study lounges, laundry facilities, and safe international student community.',
        whyItFitsAr: 'إنترنت فائق السرعة، صالات دراسة جماعية، مرافق غسيل ومجتمع طلابي دولي آمن.',
        directUrl: `https://www.student.com/search?q=${encodeURIComponent(city)}`,
        rating: 4.6,
        sourceProvider: 'Student.com',
      },
      {
        id: 'acc-stu-2',
        name: `Modern Studio Student Apartments in ${city}`,
        nameAr: `استوديو حديث ومفروش للطلاب والباحثين في ${city}`,
        type: 'apartment',
        priceEstimate: '$750 - $1,350 / month',
        priceEstimateAr: '750 - 1,350 دولار / شهرياً',
        location: `Subway Line 1 Station, ${city}`,
        locationAr: `بجوار محطة المترو الرئيسية، ${city}`,
        whyItFits: 'Direct subway access to major university campuses, private kitchenette, and included utility bills.',
        whyItFitsAr: 'ربط مباشر بالمترو لمختلف الكليات مع مطبخ خاص وشامل الفواتير والخدمات.',
        directUrl: airbnbBase,
        rating: 4.7,
        sourceProvider: 'Airbnb',
      },
    ];
  }

  if (isRelocation) {
    return [
      {
        id: 'acc-rel-1',
        name: `${city} Premium Serviced Executive Apartments`,
        nameAr: `شقق تنفيذية مخدومة للإقامة المتوسطة والطويلة في ${city}`,
        type: 'serviced_apartment',
        priceEstimate: '$1,400 - $2,600 / month',
        priceEstimateAr: '1,400 - 2,600 دولار / شهرياً',
        location: `Central Business District, ${city}`,
        locationAr: `حي الأعمال والخدمات، ${city}`,
        whyItFits: 'Ideal for initial 1-3 months relocation: weekly housekeeping, registered lease contracts for city registration, and fitness center.',
        whyItFitsAr: 'مثالي للشهر الأول حتى الاستقرار التام: تنظيف دوري، عقود معتمدة لتسجيل البلدية، وصالة رياضية.',
        directUrl: bookingBase,
        rating: 4.8,
        sourceProvider: 'Booking.com',
      },
    ];
  }

  // Tourism Options (Solo / Couple / Family)
  return [
    {
      id: 'acc-tour-1',
      name: isFamily ? `${city} Family-Friendly Grand Suites Hotel` : `${city} Central Boutique Heritage Hotel`,
      nameAr: isFamily ? `أجنحة فندقية فسيحة للعائلات في ${city}` : `فندق بوتيك مركزي في قلب ${city}`,
      type: 'hotel',
      priceEstimate: budget === 'luxury' ? '$240 - $450 / night' : '$90 - $160 / night',
      priceEstimateAr: budget === 'luxury' ? '240 - 450 دولار / ليلة' : '90 - 160 دولار / ليلة',
      location: `City Center / Historic Quarter, ${city}`,
      locationAr: `وسط المدينة والحي التاريخي، ${city}`,
      whyItFits: isFamily
        ? 'Spacious interconnected family suites, child-friendly amenities, and walking distance to metro lines.'
        : 'Steps away from major landmarks, cafes, certified halal dining options, and public transport hubs.',
      whyItFitsAr: isFamily
        ? 'أجنحة عائلية متصلة ومرافق للأطفال مع سهولة الوصول لمحطات المترو والمطاعم.'
        : 'موقع استراتيجي وسط المعالم والمقاهي ومحطات النقل وخيارات الطعام المناسبة.',
      directUrl: bookingBase,
      rating: 4.8,
      sourceProvider: 'Booking.com',
    },
    {
      id: 'acc-tour-2',
      name: `${city} Panorama Residences & Self-Check Apartment`,
      nameAr: `شقق بانوراما الذكية المجهزة بالكامل في ${city}`,
      type: 'apartment',
      priceEstimate: '$85 - $145 / night',
      priceEstimateAr: '85 - 145 دولار / ليلة',
      location: `Trendy Arts & Dining Quarter, ${city}`,
      locationAr: `حي الفنون والمطاعم العصري، ${city}`,
      whyItFits: 'Private washing machine, kitchen for home cooking, contactless self check-in, and vibrant cafe neighborhood.',
      whyItFitsAr: 'غسالة ملابس خاصة، مطبخ مجهز، تسجيل دخول ذاتي ذكي، وحي مفعم بالمقاهي.',
      directUrl: airbnbBase,
      rating: 4.7,
      sourceProvider: 'Airbnb',
    },
  ];
}

export function parseDurationToDays(durationStr?: string): number {
  if (!durationStr) return 7;
  const match = durationStr.match(/(\d+)/);
  if (!match) return 7;
  const num = parseInt(match[1], 10);
  if (durationStr.toLowerCase().includes('month') || durationStr.includes('شهر')) {
    return Math.min(num * 30, 30);
  }
  if (durationStr.toLowerCase().includes('week') || durationStr.includes('أسبوع') || durationStr.includes('اسبوع')) {
    return Math.min(num * 7, 30);
  }
  return Math.min(Math.max(num, 1), 30);
}

export function getDefaultMedicalGuidance(
  destinationName: string,
  cityName: string = 'Capital',
  specialty: string = 'General Medicine & Recovery',
  purpose: string = 'treatment',
  patientAge?: number | string
): MedicalGuidance & { recommendedHospitals: any[] } {
  const normDest = (destinationName || '').toLowerCase();
  const city = cityName || 'Central City';

  let hospitals: any[] = [];

  if (normDest.includes('turkey') || normDest.includes('تركيا') || normDest.includes('istanbul') || normDest.includes('أنقرة')) {
    hospitals = [
      {
        id: 'tr-hosp-1',
        name: 'Acıbadem Maslak Hospital & International Patient Center',
        nameAr: 'مستشفى أجيبادم مسلك ومركز رعاية المرضى الدوليين',
        city: 'Istanbul / Maslak',
        specialtyFocus: specialty || 'Comprehensive Oncology, Neurosurgery & Robotics',
        specialtyFocusAr: 'علاج الأورام المتقدم، جراحة المخ والأعصاب، والجراحة الروبوتية',
        leadDoctor: 'Prof. Dr. Ahmet Taner (Head of Surgery & Oncology Board)',
        leadDoctorAr: 'البروفيسور د. أحمد تانير (رئيس هيئة الجراحة والأورام)',
        rating: 4.9,
        accreditation: 'JCI Accredited Gold Seal (USA Standard)',
        contactPhone: '+90 212 304 4444',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Acibadem+Maslak+Hospital+Istanbul',
        websiteUrl: 'https://www.acibadem.com.tr/en/',
        appointmentUrl: 'https://www.acibadem.com.tr/en/appointment/',
        accessibilityNotes: 'Wheelchair accessible, dedicated Arab patient relations liaison, free private airport ambulance transfer.',
        accessibilityNotesAr: 'مجهز بالكامل للكراسي المتحركة، مع قسم خاص للمرضى العرب وتوفير نقل طبي مجاني من المطار.',
      },
      {
        id: 'tr-hosp-2',
        name: 'Memorial Şişli Hospital & Cardiac Sciences',
        nameAr: 'مستشفى ميموريال شيشلي ومركز علوم القلب المتقدم',
        city: 'Istanbul / Şişli',
        specialtyFocus: 'Organ Transplant, Cardiovascular Surgery & IVF',
        specialtyFocusAr: 'زراعة الأعضاء، جراحة القلب والشرايين، وعلاج العقم وأطفال الأنابيب',
        leadDoctor: 'Prof. Dr. Semih Aytekin (Senior Cardiologist)',
        leadDoctorAr: 'البروفيسور د. سميح أيتكين (كبير استشاريي أمراض القلب)',
        rating: 4.8,
        accreditation: 'JCI Accredited & ISO 15189 Certified Labs',
        contactPhone: '+90 212 314 6666',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Memorial+Sisli+Hospital+Istanbul',
        websiteUrl: 'https://www.memorial.com.tr/en',
        appointmentUrl: 'https://www.memorial.com.tr/en/e-appointment',
        accessibilityNotes: 'Full elevator and step-free access, 24/7 in-house Arabic medical translators, companion deluxe suites.',
        accessibilityNotesAr: 'مداخل ومصاعد مجهزة، مترجمون طبيون باللغة العربية على مدار الساعة، وأجنحة فندقية للمرافقين.',
      },
    ];
  } else if (normDest.includes('egypt') || normDest.includes('مصر') || normDest.includes('cairo')) {
    hospitals = [
      {
        id: 'eg-hosp-1',
        name: 'Dar Al Fouad Hospital (6th of October & Nasr City)',
        nameAr: 'مستشفى دار الفؤاد (مدينة 6 أكتوبر ومدينة نصر)',
        city: 'Cairo / Giza',
        specialtyFocus: specialty || 'Cardiology, Orthopedics & Organ Transplant',
        specialtyFocusAr: 'جراحة القلب المفتوح، العظام والمفاصل، وزراعة الكبد والكلى',
        leadDoctor: 'Prof. Dr. Magdy Yacoub Foundation Associated Consultants',
        leadDoctorAr: 'نخبة من كبار استشاريي وجراحي القلب والأوعية الدموية',
        rating: 4.8,
        accreditation: 'JCI Accredited Pioneer in Middle East',
        contactPhone: '+20 2 3824 7247',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dar+Al+Fouad+Hospital+Cairo',
        websiteUrl: 'https://daralfouad.org',
        appointmentUrl: 'https://daralfouad.org/appointment',
        accessibilityNotes: 'Full handicap accessible ramps, dedicated patient guidance desk for Gulf travelers, private recovery rooms.',
        accessibilityNotesAr: 'مداخل مهيأة بالكامل، مكتب خاص لاستقبال وتسهيل إجراءات الزوار من دول الخليج، وغرف خاصة.',
      },
    ];
  } else {
    hospitals = [
      {
        id: 'uni-hosp-1',
        name: `${city} Central University Hospital & Specialty Medical Complex`,
        nameAr: `المستشفى الجامعي المركزي والمجمع الطبي التخصصي في ${city}`,
        city,
        specialtyFocus: specialty || 'Specialized Diagnostic, Surgical & Therapeutic Care',
        specialtyFocusAr: 'التشخيص الطبي المتقدم، الجراحة التخصصية، والرعاية الاستشفائية',
        leadDoctor: 'Senior Medical Faculty & Specialized Consultants',
        leadDoctorAr: 'كبار الاستشاريين ورؤساء الأقسام الطبية المعتمدة',
        rating: 4.8,
        accreditation: 'National & International JCI Accredited Facility',
        contactPhone: '+1 800 456 7890',
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' central hospital international medical center ' + destinationName)}`,
        websiteUrl: `https://www.google.com/search?q=${encodeURIComponent('hospital international patient center ' + city + ' ' + destinationName)}`,
        appointmentUrl: `https://www.google.com/search?q=${encodeURIComponent('doctor appointment booking medical ' + city + ' ' + destinationName)}`,
        accessibilityNotes: 'Full wheelchair accessibility, international patient translation coordinators, and private recovery suites.',
        accessibilityNotesAr: 'مهيأ بالكامل للكراسي المتحركة، مع مترجمين للمرضى الدوليين وأجنحة إقامة واستشفاء خاصة.',
      },
    ];
  }

  return {
    specialty: specialty || 'Specialized Medical Care',
    patientAge: patientAge || 'Not specified',
    purpose: purpose || 'Medical Consultation & Recovery',
    hospitals,
    recommendedHospitals: hospitals,
    nearbyPharmaciesNote: `24/7 on-duty emergency pharmacies operate across ${city} with prescription fulfillment services.`,
    nearbyPharmaciesNoteAr: `تعمل صيدليات الطوارئ المناوبة على مدار 24 ساعة في ${city} لصرف الوصفات الطبية المعتمدة.`,
    recoveryPlaces: [
      {
        name: `${city} Botanical Gardens & Serene Walking Grounds`,
        nameAr: `حدائق ${city} النباتية ومسارات المشي الهادئة`,
        type: 'Green Park & Pure Air',
        description: 'Paved level paths, shaded seating benches, pure fresh air, and calming fountains ideal for gentle walking rehabilitation.',
        descriptionAr: 'مسارات ممهدة خالية من الدرج، مقاعد مظللة، وهواء نقي يساعد على الاسترخاء والتأهيل الحركي.',
      },
      {
        name: `${city} Thermal Wellness & Hydrotherapy Center`,
        nameAr: `مركز المياه المعدنية والعلاج المائي في ${city}`,
        type: 'Wellness & Relaxation',
        description: 'Supervised warm mineral baths and gentle circulation therapies.',
        descriptionAr: 'جلسات استرخاء ومياه معدنية دافئة تنشط الدورة الدموية بإشراف مختصين.',
      },
    ],
    visaMedicalAdvice: `For medical journeys, travelers can request official hospital appointment letters to support medical entry visas or visa extensions via official immigration portals.`,
    visaMedicalAdviceAr: `للرحلات العلاجية، يمكن للمسافر طلب خطاب رسمي بموعد المستشفى لتقديمه في طلبات تأشيرة العلاج أو التمديد الرسمي.`,
    disclaimer: 'Medical information provided by WASL is strictly for informational and logistical guidance, not professional medical advice or diagnosis. Always consult certified healthcare practitioners.',
    disclaimerAr: 'المعلومات الطبية المقدمة عبر وَصل هي إرشادات توجيهية وتنظيمية عامة، ولا تعد بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص السريري. استشر دائماً أطباءك المعتمدين.',
  };
}

export function getDefaultTourismOptions(
  destinationName: string,
  cityName?: string,
  durationStr?: string,
  interests?: string[],
  party?: string
): TourismItineraryOption[] {
  const { findCountry, createDynamicCountry } = require('./countries');
  const countryInfo = findCountry(destinationName) || createDynamicCountry(destinationName, destinationName, cityName);

  const rawCity = cityName && !cityName.toLowerCase().includes('capital') && !cityName.toLowerCase().includes('central')
    ? cityName
    : countryInfo.capital || 'Main City';

  const rawCityAr = cityName && !cityName.toLowerCase().includes('capital') && !cityName.toLowerCase().includes('central')
    ? cityName
    : countryInfo.capitalAr || countryInfo.capital || 'المدينة الرئيسية';

  const totalDays = parseDurationToDays(durationStr);

  const { buildCustomDays } = require('./itineraryDaysMatrix');

  const planADays = buildCustomDays(destinationName, rawCity, totalDays, 'balanced');
  const planBDays = buildCustomDays(destinationName, rawCity, totalDays, 'relaxed');

  const countryNameEn = countryInfo.name || destinationName;
  const countryNameAr = countryInfo.nameAr || destinationName;

  return [
    {
      id: 'plan-a-balanced',
      style: 'balanced',
      title: `${countryNameEn} (${rawCity}): Iconic Heritage & Complete Highlights`,
      titleAr: `${countryNameAr} (${rawCityAr}): المسار المتوازن وأبرز المعالم الأيقونية`,
      tagline: `Comprehensive ${totalDays}-day journey covering top cultural landmarks, famous districts, UNESCO sites & curated dining`,
      taglineAr: `برنامج شامل يغطي ${totalDays} يوماً متكاملة لأبرز المعالم التراثية والأسواق والمطاعم الشهيرة في ${rawCityAr}`,
      description: `Carefully structured day-by-day itinerary balancing major attractions with comfortable travel rhythms for the entire duration.`,
      descriptionAr: `مسار متوازن ومدروس يغطي كامل مدة رحلتك (${totalDays} يوماً) يومياً من الصباح حتى المساء في ${rawCityAr}.`,
      durationDays: totalDays,
      budgetEstimate: `Moderate ($80 - $140 / day)`,
      cities: [rawCity],
      citiesAr: [rawCityAr],
      highlights: ['UNESCO Heritage Sites', 'Famous Districts', 'Scenic Observation Decks', 'Top Halal & Local Dining'],
      highlightsAr: ['مواقع التراث العالمي', 'الأحياء التاريخية', 'المطلات البانورامية', 'أشهر المطاعم المعتمدة'],
      estimatedBudgetLevel: 'moderate',
      days: planADays,
    },
    {
      id: 'plan-b-relaxed',
      style: 'relaxed',
      title: `${countryNameEn} (${rawCity}): Nature Retreat, Food & Hidden Gems`,
      titleAr: `${countryNameAr} (${rawCityAr}): المسار الهادئ، الطبيعة والأماكن الخفية والتذوق`,
      tagline: `Immersive ${totalDays}-day slow-paced journey through botanical havens, artisan cafes, local crafts & serene retreats`,
      taglineAr: `برنامج هادئ ومريح يغطي ${totalDays} يوماً للاسترخاء بين أحضان الطبيعة والمقاهي المميزة والحرف التراثية في ${rawCityAr}`,
      description: `Unrushed exploration focused on authentic neighborhood culture, scenic coastal/green spots, and peaceful moments.`,
      descriptionAr: `رحلة هادئة تركز على الاستمتاع بالبيئة الطبيعية والمقاهي والأماكن التراثية دون إرهاق التنقل السريع.`,
      durationDays: totalDays,
      budgetEstimate: `Relaxed ($60 - $110 / day)`,
      cities: [rawCity],
      citiesAr: [rawCityAr],
      highlights: ['Botanical & Forest Reserves', 'Artisan Coffee & Tea Culture', 'Hidden Coastal Trails', 'Local Craft Markets'],
      highlightsAr: ['المحميات والحدائق الطبيعية', 'ثقافة القهوة والشاي التراثي', 'المسارات الساحلية الهادئة', 'أسواق الحرفيين'],
      estimatedBudgetLevel: 'moderate',
      days: planBDays,
    },
  ];
}

export function getEmergencyData(destinationId: string, originId?: string): EmergencyContactInfo {
  return getDefaultEmergency(destinationId, 'Capital', originId || 'Saudi Arabia');
}

export function getDefaultEmergency(
  destinationName: string,
  cityName: string = 'Capital',
  originName: string = 'Saudi Arabia'
): EmergencyContactInfo {
  const normDest = (destinationName || '').toLowerCase();

  // 1. Turkey (تركيا)
  if (normDest.includes('turkey') || normDest.includes('تركيا') || normDest.includes('istanbul') || normDest.includes('ankara')) {
    return {
      police: '155 (Polis) / 112',
      ambulance: '112 (Ambulans)',
      fire: '110 (İtfaiye)',
      touristPolice: '157 (YİMER) / +90 212 527 4503',
      touristHelpline: '157 (Foreigners & Tourist Support in 6 Languages)',
      medicalHotline: '112 / +90 212 368 2900',
      generalEmergency: '112',
      embassyPhone: '+90 312 468 5599',
      embassyEmergencyLine: '+90 530 955 5555',
      embassyAddress: 'Turan Emeksiz Sokak No:6, Gaziosmanpaşa, Ankara / Konaklar Mah, Levent, Istanbul',
      embassyHours: 'Mon - Fri: 09:00 - 16:00 (24/7 Citizen Care)',
      embassy: {
        name: `Embassy of ${originName} in Ankara & Consulate in Istanbul`,
        nameAr: `سفارة ${originName} في أنقرة والقنصلية العامة في إسطنبول`,
        address: 'Ankara: Gaziosmanpaşa / Istanbul: Levent',
        phone: '+90 312 468 5599',
        emergencyHotline: '+90 530 955 5555',
        workingHours: '09:00 - 16:00 (طوارئ الرعايا 24/7)',
        website: 'https://www.turkiye.gov.tr',
      },
      emergencyPhrases: [
        {
          phrase: 'I need an ambulance immediately!',
          native: 'Lütfen acil ambulans çağırın!',
          phonetic: 'Lewt-fen ah-jeel ahm-boo-lahns chah-er-un!',
          textEn: 'Please call an ambulance immediately!',
          textAr: 'أحتاج سيارة إسعاف فوراً من فضلكم!',
          meaningEn: 'Please call an ambulance immediately!',
          meaningAr: 'أحتاج سيارة إسعاف فوراً من فضلكم!',
        },
        {
          phrase: 'Help me please! Call the police!',
          native: 'İmdat! Lütfen polis çağırın!',
          phonetic: 'Eem-daht! Lewt-fen poh-lees chah-er-un!',
          textEn: 'Help! Please call the police!',
          textAr: 'النجدة! اتصلوا بالشرطة من فضلكم!',
          meaningEn: 'Help! Please call the police!',
          meaningAr: 'النجدة! اتصلوا بالشرطة من فضلكم!',
        },
        {
          phrase: 'Where is the nearest hospital?',
          native: 'En yakın hastane nerede?',
          phonetic: 'En yah-kuhn hahs-tah-neh neh-reh-deh?',
          textEn: 'Where is the nearest hospital?',
          textAr: 'أين يقع أقرب مستشفى؟',
          meaningEn: 'Where is the nearest hospital?',
          meaningAr: 'أين يقع أقرب مستشفى؟',
        },
      ],
      emergencyClinicsNote: 'Dial 112 for acute emergency or 157 for multilingual foreign traveler assistance.',
      emergencyClinicsNoteAr: 'اتصل برقم 112 للإسعاف والطوارئ أو 157 لمركز مساعدة المسافرين الأجانب باللغة العربية والإنجليزية.',
    };
  }

  // 2. Egypt (مصر)
  if (normDest.includes('egypt') || normDest.includes('مصر') || normDest.includes('cairo') || normDest.includes('القاهرة')) {
    return {
      police: '122 (شرطة النجدة)',
      ambulance: '123 (الإسعاف المصري)',
      fire: '180 (المطافئ والدفاع المدني)',
      touristPolice: '126 (شرطة السياحة والآثار)',
      touristHelpline: '19654 (الخط الساخن لوزارة السياحة)',
      medicalHotline: '137 (طوارئ الرعاية المركزة)',
      generalEmergency: '122 / 123',
      embassyPhone: '+20 2 3762 5000',
      embassyEmergencyLine: '+20 114 555 5555',
      embassyAddress: 'حي الدقي / الجيزة، القاهرة',
      embassyHours: 'الأحد - الخميس: 09:00 - 15:30 (طوارئ 24 ساعة)',
      embassy: {
        name: `سفارة ${originName} في القاهرة`,
        nameAr: `سفارة ${originName} بالقاهرة`,
        address: 'حي الدقي، الجيزة، القاهرة',
        phone: '+20 2 3762 5000',
        emergencyHotline: '+20 114 555 5555',
        workingHours: '09:00 - 15:30 (طوارئ 24/7)',
        website: 'https://www.mofa.gov.sa',
      },
      emergencyPhrases: [
        {
          phrase: 'أحتاج إلى سيارة إسعاف فوراً',
          native: 'أحتاج إلى سيارة إسعاف فوراً',
          phonetic: 'Ah-taaj ela sayyarat is-aaf fawran',
          textEn: 'I need an ambulance immediately!',
          textAr: 'أحتاج إلى سيارة إسعاف فوراً',
          meaningEn: 'I need an ambulance immediately!',
          meaningAr: 'أحتاج إلى سيارة إسعاف فوراً',
        },
        {
          phrase: 'لو سمحت اتصل بشرطة السياحة أو النجدة',
          native: 'لو سمحت اتصل بشرطة السياحة أو النجدة',
          phonetic: 'Law samaht ettesel bi shortet el seyyaha',
          textEn: 'Please contact tourist police or emergency line!',
          textAr: 'لو سمحت اتصل بشرطة السياحة أو النجدة',
          meaningEn: 'Please contact tourist police or emergency line!',
          meaningAr: 'لو سمحت اتصل بشرطة السياحة أو النجدة',
        },
      ],
      emergencyClinicsNote: 'اتصل برقم 123 للإسعاف أو 126 لشرطة السياحة المخصصة لحماية وإرشاد الزوار.',
      emergencyClinicsNoteAr: 'اتصل برقم 123 للإسعاف أو 126 لشرطة السياحة المخصصة لحماية وإرشاد الزوار.',
    };
  }

  // 3. Morocco (المغرب)
  if (normDest.includes('morocco') || normDest.includes('المغرب') || normDest.includes('marrakech') || normDest.includes('مراكش') || normDest.includes('casablanca') || normDest.includes('الدار البيضاء')) {
    return {
      police: '19 (الشرطة الحضرية)',
      ambulance: '15 (الإسعاف والوقاية المدنية)',
      fire: '15 (الوقاية المدنية)',
      touristPolice: '177 (الدرك الملكي) / +212 524 38 46 01',
      touristHelpline: '0522 20 20 20',
      medicalHotline: '141 (المساعدة الطبية المستعجلة SAMU)',
      generalEmergency: '19 / 15',
      embassyPhone: '+212 537 63 30 00',
      embassyEmergencyLine: '+212 661 12 34 56',
      embassyAddress: 'شارع الإمام مالك، حي السويسي، الرباط',
      embassyHours: 'Mon - Fri: 09:00 - 15:30 (طوارئ 24/7)',
      embassy: {
        name: `سفارة ${originName} بالرباط`,
        nameAr: `سفارة ${originName} بالرباط`,
        address: 'حي السويسي، الرباط',
        phone: '+212 537 63 30 00',
        emergencyHotline: '+212 661 12 34 56',
        workingHours: '09:00 - 15:30',
        website: 'https://diplomatie.ma',
      },
      emergencyPhrases: [
        {
          phrase: 'أحتاج إلى إسعاف عاجل',
          native: 'خصني الإسعاف دابا عفاك',
          phonetic: 'Khasni l-is-aaf daba aafak',
          textEn: 'I need an ambulance immediately!',
          textAr: 'أحتاج إلى سيارة إسعاف فوراً',
          meaningEn: 'I need an ambulance immediately!',
          meaningAr: 'أحتاج إلى سيارة إسعاف فوراً',
        },
      ],
      emergencyClinicsNote: 'اتصل بـ 19 للشرطة في المدن أو 177 للدرك الملكي خارجها و15 لسيارات الإسعاف.',
      emergencyClinicsNoteAr: 'اتصل بـ 19 للشرطة في المدن أو 177 للدرك الملكي خارجها و15 لسيارات الإسعاف.',
    };
  }

  // 4. Saudi Arabia (المملكة العربية السعودية)
  if (normDest.includes('saudi') || normDest.includes('السعودية') || normDest.includes('riyadh') || normDest.includes('الرياض')) {
    return {
      police: '911 (العمليات الأمنية الموحدة) / 999',
      ambulance: '997 (الهلال الأحمر السعودي)',
      fire: '998 (الدفاع المدني)',
      touristPolice: '930 (مركز العناية بالزوار والسياح)',
      touristHelpline: '930 / +966 920000890',
      medicalHotline: '937 (استشارات وزارة الصحة 24/7)',
      generalEmergency: '911',
      embassyPhone: '199099 (خدمة رعاية المواطنين الموحدة)',
      embassyEmergencyLine: '199099 / 911',
      embassyAddress: 'الحي الدبلوماسي، الرياض',
      embassyHours: '24/7 National Emergency Services',
      embassy: {
        name: 'Ministry of Foreign Affairs Citizen Care',
        nameAr: 'مركز رعاية المواطنين والزوار الموحد',
        address: 'الرياض، المملكة العربية السعودية',
        phone: '199099',
        emergencyHotline: '911',
        workingHours: '24/7',
        website: 'https://www.my.gov.sa',
      },
      emergencyPhrases: [
        {
          phrase: 'أحتاج سيارة إسعاف في هذا الموقع',
          native: 'أحتاج سيارة إسعاف في هذا الموقع',
          phonetic: 'Ahtaaj sayyarat is-aaf fi hatha al-mawqe',
          textEn: 'I need an ambulance at this location',
          textAr: 'أحتاج سيارة إسعاف في هذا الموقع',
          meaningEn: 'I need an ambulance at this location',
          meaningAr: 'أحتاج سيارة إسعاف في هذا الموقع',
        },
      ],
      emergencyClinicsNote: 'الرقم الموحد 911 يربطك مباشرة بجميع خدمات الأمن والسلامة والإسعاف في ثوانٍ معدودة.',
      emergencyClinicsNoteAr: 'الرقم الموحد 911 يربطك مباشرة بجميع خدمات الأمن والسلامة والإسعاف في ثوانٍ معدودة.',
    };
  }

  // 5. Mauritius (موريشيوس)
  if (normDest.includes('mauritius') || normDest.includes('موريشيوس')) {
    return {
      police: '999 / 112',
      ambulance: '114 / 999',
      fire: '115 / 999',
      touristPolice: '+230 213 1584',
      touristHelpline: '+230 203 1000',
      medicalHotline: '114',
      generalEmergency: '999 / 112',
      embassyPhone: '+230 208 0000',
      embassyEmergencyLine: '+230 5250 0000',
      embassyAddress: 'Port Louis Diplomatic Quarter / Regional Mission',
      embassyHours: 'Mon - Fri: 09:00 - 16:00 (24/7 Citizen Emergency Hotline)',
      embassy: {
        name: 'Embassy / Regional Diplomatic Representation',
        nameAr: 'السفارة والتمثيل الدبلوماسي في موريشيوس',
        address: 'Port Louis / Regional Consulate',
        phone: '+230 208 0000',
        emergencyHotline: '+230 5250 0000',
        workingHours: '09:00 - 16:00',
        website: 'https://foreignaffairs.govmu.org',
      },
      emergencyPhrases: [
        {
          phrase: 'I need an ambulance immediately!',
          native: 'Mo bizin enn lanbilans vit vit!',
          phonetic: 'Mo bizin enn lanbilans vit vit!',
          textEn: 'I need an ambulance immediately!',
          textAr: 'أحتاج سيارة إسعاف فوراً!',
          meaningEn: 'I need an ambulance immediately!',
          meaningAr: 'أحتاج سيارة إسعاف فوراً!',
        },
      ],
      emergencyClinicsNote: 'Wellkin Hospital (Moka) and Dr. A. G. Jeetoo Hospital (Port Louis) offer 24/7 emergency care.',
      emergencyClinicsNoteAr: 'يقدم مستشفى ويلكين الدولي (موكا) ومستشفى جيتو (بورت لويس) خدمات طوارئ على مدار 24 ساعة.',
    };
  }

  // 6. Germany (ألمانيا)
  if (normDest.includes('germany') || normDest.includes('ألمانيا') || normDest.includes('المانيا') || normDest.includes('berlin') || normDest.includes('munich')) {
    return {
      police: '110 (Polizei)',
      ambulance: '112 (Rettungsdienst)',
      fire: '112 (Feuerwehr)',
      touristPolice: '110',
      touristHelpline: '116 117 (On-Call Medical Doctor)',
      medicalHotline: '116 117',
      generalEmergency: '112',
      embassyPhone: '+49 30 8892 50',
      embassyEmergencyLine: '+49 170 1234567',
      embassyAddress: 'Tiergarten / Mitte, Berlin',
      embassyHours: 'Mon - Fri: 09:00 - 15:30 (24/7 Citizen Emergency)',
      embassy: {
        name: 'Embassy in Berlin',
        nameAr: 'السفارة في برلين',
        address: 'Berlin Diplomatic District',
        phone: '+49 30 8892 50',
        emergencyHotline: '+49 170 1234567',
        workingHours: '09:00 - 15:30',
        website: 'https://berlin.diplo.de',
      },
      emergencyPhrases: [
        {
          phrase: 'I need an ambulance!',
          native: 'Ich brauche dringend einen Krankenwagen!',
          phonetic: 'Ikh brow-khe drin-gend eye-nen kran-ken-vah-gen!',
          textEn: 'I need an ambulance urgently!',
          textAr: 'أحتاج إلى سيارة إسعاف فوراً!',
          meaningEn: 'I need an ambulance urgently!',
          meaningAr: 'أحتاج إلى سيارة إسعاف فوراً!',
        },
      ],
      emergencyClinicsNote: 'Dial 112 for acute emergency or 116 117 for on-call English-speaking medical doctors.',
      emergencyClinicsNoteAr: 'اتصل برقم 112 للطوارئ الحرجة أو 116 117 لخدمة الطبيب المناوب على مدار الساعة.',
    };
  }

  // 7. United States & Canada (أمريكا وكندا)
  if (normDest.includes('united-states') || normDest.includes('usa') || normDest.includes('أمريكا') || normDest.includes('امريكا') || normDest.includes('canada') || normDest.includes('كندا')) {
    return {
      police: '911 (Police Emergency)',
      ambulance: '911 (Paramedics & EMS)',
      fire: '911 (Fire Department)',
      touristPolice: '311 (Non-Emergency Municipal Help)',
      touristHelpline: '1-800-222-1222 (Poison & Urgent Control)',
      medicalHotline: '911 / 311',
      generalEmergency: '911',
      embassyPhone: '+1 202 342 3800',
      embassyEmergencyLine: '+1 202 746 0666',
      embassyAddress: '601 New Hampshire Ave NW, Washington, DC',
      embassyHours: 'Mon - Fri: 09:00 - 17:00 (24/7 Emergency Line)',
      embassy: {
        name: `Embassy in Washington, DC`,
        nameAr: `السفارة في واشنطن العاصمة`,
        address: '601 New Hampshire Ave NW, Washington, DC',
        phone: '+1 202 342 3800',
        emergencyHotline: '+1 202 746 0666',
        workingHours: '09:00 - 17:00',
        website: 'https://embassies.gov',
      },
      emergencyPhrases: [
        {
          phrase: 'I need immediate medical attention!',
          native: 'I need immediate medical attention!',
          phonetic: 'I need immediate medical attention!',
          textEn: 'I need immediate medical attention!',
          textAr: 'أحتاج إلى رعاية طبية عاجلة!',
          meaningEn: 'I need immediate medical attention!',
          meaningAr: 'أحتاج إلى رعاية طبية عاجلة!',
        },
      ],
      emergencyClinicsNote: 'Dial 911 for all life-threatening emergencies or 311 for non-emergency municipal city assistance.',
      emergencyClinicsNoteAr: 'اتصل برقم 911 لجميع حالات الطوارئ الحرجة أو 311 للمساعدة المدنية غير الطارئة.',
    };
  }

  // 8. Universal Worldwide Fallback
  return {
    police: '112 / 999',
    ambulance: '112 / 120',
    fire: '112 / 119',
    touristPolice: '112',
    touristHelpline: '112 (Universal Emergency Operator)',
    medicalHotline: '112',
    generalEmergency: '112',
    embassyPhone: '+966 11 406 7777',
    embassyEmergencyLine: '+966 920000890',
    embassyAddress: 'Diplomatic Enclave, Capital City',
    embassyHours: 'Mon - Fri: 09:00 - 16:00 (24/7 Hotline)',
    embassy: {
      name: 'Diplomatic Mission',
      nameAr: 'البعثة الدبلوماسية والسفارة',
      address: 'Diplomatic Enclave',
      phone: '+966 11 406 7777',
      emergencyHotline: '+966 920000890',
      workingHours: '09:00 - 16:00',
    },
    emergencyPhrases: [
      {
        phrase: 'I need medical assistance immediately!',
        native: 'Emergency! Medical assistance needed.',
        phonetic: 'Emergency assistance',
        textEn: 'I need medical assistance immediately!',
        textAr: 'أحتاج إلى رعاية طبية طارئة فوراً!',
        meaningEn: 'I need medical assistance immediately!',
        meaningAr: 'أحتاج إلى رعاية طبية طارئة فوراً!',
      },
    ],
    emergencyClinicsNote: 'Contact local emergency services via 112 or visit the nearest central public hospital.',
    emergencyClinicsNoteAr: 'اتصل برقم الطوارئ 112 أو توجه لأقرب مستشفى عام في المدينة.',
  };
}
