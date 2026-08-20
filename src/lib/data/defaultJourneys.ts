export interface JourneyStage {
  id: string;
  stageNumber: string;
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
  description?: string;
  descriptionAr?: string;
  photoUrl?: string;
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
  purpose: string = 'study',
  cityName: string = 'Tokyo'
): JourneyStage[] {
  return [
    {
      id: 'stage-1',
      stageNumber: '01',
      title: 'Before You Go',
      titleAr: 'قبل السفر',
      subtitle: `Essential preparations for traveling to ${cityName}, ${destinationName}`,
      subtitleAr: `أهم التجهيزات والخطوات الأساسية قبل السفر إلى ${cityName}`,
      thingsToCheck: [
        { id: 'c1', text: 'Check passport validity (minimum 6 months from travel date)', textAr: 'التأكد من سريان الجواز لمدة لا تقل عن 6 أشهر', mandatory: true },
        { id: 'c2', text: `Verify entry visa / digital arrival declarations for ${destinationName}`, textAr: `التحقق من متطلبات التأشيرة الرسمية وإجراءات الدخول الرقمية لـ ${destinationName}`, mandatory: true },
        { id: 'c3', text: 'Acquire comprehensive international travel/medical insurance', textAr: 'شراء وثيقة تأمين طبي دولي شامل تغطي فترة الإقامة' },
        { id: 'c4', text: `Confirm accommodation bookings in ${cityName} and store the address in local script`, textAr: `تأكيد حجز السكن في ${cityName} وحفظ العنوان باللغة المحلية` },
      ],
      officialResources: [
        {
          name: `Official Consular & Travel Authority (${destinationName})`,
          nameAr: `البوابة القنصلية الرسمية (${destinationName})`,
          url: `https://www.google.com/search?q=official+travel+visa+guidance+${encodeURIComponent(destinationName)}`,
          description: 'Official government travel regulations and consular updates',
          descriptionAr: 'المتطلبات الرسمية للتأشيرات والإرشادات القنصلية المعتمدة',
        },
        {
          name: 'Ministry of Foreign Affairs (Citizen Care abroad)',
          nameAr: 'وزارة الخارجية - رعاية المواطنين في الخارج',
          url: 'https://www.mofa.gov.sa',
          description: 'Register trip with embassy and 24/7 assistance hotline',
          descriptionAr: 'تسجيل الرحلة في السفارة والتواصل في حالات الطوارئ',
        },
      ],
      quickTip: {
        title: 'Digital Preparation',
        titleAr: 'التحضير الرقمي',
        text: `Download offline maps of ${cityName} and save emergency embassy contacts before boarding your flight.`,
        textAr: `حمّل الخرائط غير المتصلة لمدينة ${cityName} واحفظ أرقام طوارئ السفارة قبل الإقلاع.`,
      },
    },
    {
      id: 'stage-2',
      stageNumber: '02',
      title: 'Documents & Logistics',
      titleAr: 'الوثائق والترتيبات',
      subtitle: 'Paperwork, banking notifications & communications',
      subtitleAr: 'الوثائق والبطاقات والاتصال',
      thingsToCheck: [
        { id: 'c5', text: 'Carry physical printed copies of visa, insurance, and accommodation confirmation', textAr: 'طباعة نسخ ورقية من التأشيرة ووثيقة التأمين وحجز السكن' },
        { id: 'c6', text: 'Notify your home bank of international card usage to prevent security freezes', textAr: 'إبلاغ البنك بالسفر الدولي لتفادي إيقاف البطاقات المصرفية' },
        { id: 'c7', text: 'Purchase an e-SIM or international roaming data plan for instant arrival connectivity', textAr: 'تفعيل شريحة إلكترونية e-SIM أو باقة تجوال لضمان الاتصال فور الهبوط' },
      ],
      officialResources: [
        {
          name: `Customs & Border Protection Authority (${destinationName})`,
          nameAr: `هيئة الجمارك والمنافذ الرسمية (${destinationName})`,
          url: `https://www.google.com/search?q=customs+border+declarations+${encodeURIComponent(destinationName)}`,
          description: 'Restricted items, medication import rules, and duty declarations',
          descriptionAr: 'لوائح المواد المقيدة وإدخال الأدوية الشخصية والإفصاح الجمركي',
        },
      ],
      quickTip: {
        title: 'Medication Rules',
        titleAr: 'تنبيه الأدوية',
        text: 'Always keep prescription medications in original packaging along with doctor-certified prescriptions translated into English.',
        textAr: 'احتفظ بالأدوية المصروفة في عبواتها الأصلية مع تقرير طبي رسمي مترجم بالإنجليزية.',
      },
    },
    {
      id: 'stage-3',
      stageNumber: '03',
      title: 'Departure & Flight',
      titleAr: 'المغادرة والوصول',
      subtitle: `Airport transit and arrival clearance in ${cityName}`,
      subtitleAr: `إجراءات المطار والمواصلات الأولى في ${cityName}`,
      thingsToCheck: [
        { id: 'c8', text: 'Arrive at the departure airport 3.5 hours prior to international flight', textAr: 'التواجد في المطار قبل 3.5 ساعات من موعد الإقلاع الدولي' },
        { id: 'c9', text: 'Complete digital immigration/customs arrival forms in advance', textAr: 'تعبئة نماذج الجوازات والجمارك الإلكترونية مسبقاً' },
        { id: 'c10', text: `Have public transit / airport transfer routes to ${cityName} mapped out`, textAr: `معرفة مسار المواصلات العامة أو التاكسي المعتمد من المطار إلى مقر الإقامة` },
      ],
      officialResources: [
        {
          name: `International Airport Navigation Portal`,
          nameAr: `دليل المطار الدولي ووسائل النقل`,
          url: `https://www.google.com/search?q=airport+official+guide+transport+${encodeURIComponent(cityName)}`,
          description: 'Terminal logistics, fast transit links, and licensed taxi counters',
          descriptionAr: 'إرشادات المحطات وخطوط القطارات ومكاتب التاكسي المرخصة',
        },
      ],
      quickTip: {
        title: 'Safe Transit',
        titleAr: 'المواصلات الآمنة',
        text: 'Only use official taxi dispatch counters or licensed transit apps; avoid unlicensed street solicitors.',
        textAr: 'استخدم دائماً مكاتب التاكسي الرسمية داخل صالة الوصول أو تطبيقات النقل المعتمدة وتجنب السائقين غير المرخصين.',
      },
    },
    {
      id: 'stage-4',
      stageNumber: '04',
      title: 'First Days & Orientation',
      titleAr: 'الأيام الأولى والتأقلم',
      subtitle: `Essential setup in your ${cityName} neighborhood`,
      subtitleAr: `الخطوات الأساسية للاندماج الأولي في ${cityName}`,
      thingsToCheck: [
        { id: 'c11', text: 'Obtain a local smart transit card (metro / bus IC card)', textAr: 'شراء بطاقة المواصلات الذكية للمترو والحافلات' },
        { id: 'c12', text: 'Save local emergency numbers (Police, Medical, Fire) and nearest clinic', textAr: 'حفظ أرقام الطوارئ المحلية وموقع أقرب مركز طبي' },
        { id: 'c13', text: 'Locate nearest grocery markets, pharmacies, and halal/suitable dining spots', textAr: 'استكشاف محيط السكن (المتاجر، الصيدليات، والمطاعم المناسبة)' },
      ],
      officialResources: [
        {
          name: `City Municipal Services Portal (${cityName})`,
          nameAr: `بوابة خدمات بلدية ${cityName}`,
          url: `https://www.google.com/search?q=city+government+foreign+residents+${encodeURIComponent(cityName)}`,
          description: 'Local district services, safety alerts, and resident registration',
          descriptionAr: 'الخدمات البلدية وإرشادات السلامة للمقيمين والزوار',
        },
      ],
      quickTip: {
        title: 'Neighborhood Walk',
        titleAr: 'استكشاف الحي',
        text: 'Take a relaxed daylight walk around your accommodation to spot convenience stores, metro exits, and pharmacies.',
        textAr: 'قم بجولة استكشافية نهارية في محيط سكنك للتعرف على مداخل المترو والصيدليات ومتاجر الأغذية.',
      },
    },
    {
      id: 'stage-5',
      stageNumber: '05',
      title: 'Settling In',
      titleAr: 'الاستقرار والروتين',
      subtitle: purpose === 'study' ? 'Academic orientation and student life' : 'Establishing seamless daily routines',
      subtitleAr: purpose === 'study' ? 'التسجيل الأكاديمي والحياة الطلابية' : 'تنظيم المعيشة اليومية بانسيابية',
      thingsToCheck: [
        { id: 'c14', text: purpose === 'study' ? 'Complete university registration and student ID issuance' : 'Set up long-term local connectivity and utility accounts', textAr: purpose === 'study' ? 'إنهاء إجراءات التسجيل الجامعي واستلام البطاقة الطلابية' : 'تفعيل خطوط الاتصال والخدمات طويلة المدى' },
        { id: 'c15', text: 'Understand local neighborhood recycling schedules and quiet hours', textAr: 'معرفة مواعيد فرز القمامة وقوانين ساعات الهدوء في المبنى السكني' },
        { id: 'c16', text: 'Familiarize with cashless payment apps widely accepted in the city', textAr: 'التعرف على تطبيقات الدفع الإلكتروني المعتمدة في المدينة' },
      ],
      officialResources: [
        {
          name: `Consumer Protection & Resident Rights`,
          nameAr: `حماية المستهلك وإرشادات المقيمين`,
          url: `https://www.google.com/search?q=resident+services+and+rights+${encodeURIComponent(destinationName)}`,
          description: 'Tenant rights, contract standards, and living rules',
          descriptionAr: 'حقوق المستأجر واللوائح السكنية المعتمدة',
        },
      ],
      quickTip: {
        title: 'Local Etiquette',
        titleAr: 'احترام الجيران',
        text: 'Adhering to quiet hours and neighborhood rules builds positive relations with local residents.',
        textAr: 'احترام مواعيد الهدوء وأنظمة السكن يضمن لك إقامة مريحة وعلاقات طيبة مع الجيران.',
      },
    },
    {
      id: 'stage-6',
      stageNumber: '06',
      title: 'Daily Life & Cultural Harmony',
      titleAr: 'الحياة اليومية والاندماج',
      subtitle: 'Living respectfully and discovering the rich local heritage',
      subtitleAr: 'العيش بتناغم واكتشاف عمق الثقافة المحلية',
      thingsToCheck: [
        { id: 'c17', text: 'Connect with local community centers, student associations, or cultural networks', textAr: 'بناء شبكة تواصل مع المراكز المجتمعية والجمعيات الطلابية' },
        { id: 'c18', text: `Explore iconic historical sites and cultural landmarks across ${cityName}`, textAr: `زيارة المعالم التراثية والتاريخية البارزة في ${cityName}` },
        { id: 'c19', text: 'Practice everyday conversational phrases with local shopkeepers and peers', textAr: 'ممارسة العبارات اليومية اللبقة في تعاملاتك المباشرة' },
      ],
      officialResources: [
        {
          name: `National Cultural & Tourism Board (${destinationName})`,
          nameAr: `الهيئة الوطنية للثقافة والسياحة (${destinationName})`,
          url: `https://www.google.com/search?q=official+tourism+culture+board+${encodeURIComponent(destinationName)}`,
          description: 'Official museums, cultural festivals, and heritage trails',
          descriptionAr: 'المتاحف الرسمية والمهرجانات الثقافية والمعالم التاريخية',
        },
      ],
      quickTip: {
        title: 'Cultural Empathy',
        titleAr: 'الانفتاح والاحترام',
        text: 'Showing genuine curiosity, smiling, and attempting local greetings makes a warm, lasting impression anywhere.',
        textAr: 'الابتسامة واستخدام كلمات الترحيب البسيطة باللغة المحلية تفتح لك قلوب الناس في كل مكان.',
      },
    },
  ];
}

export function getDefaultCulture(destinationName: string, cityName: string = 'Tokyo'): CultureGuidance {
  const isJapan = destinationName.toLowerCase().includes('japan') || destinationName.includes('اليابان');

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
  const isJapan = destinationName.toLowerCase().includes('japan') || destinationName.includes('اليابان');

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
  const isJapan = destinationName.toLowerCase().includes('japan') || destinationName.includes('اليابان');

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
          nameAr: 'هاتسومودي (زيارة رأس السنة)',
          timing: 'Jan 1 – 3',
          timingAr: '1 - 3 يناير',
          impact: 'Millions visit local shrines and temples to pray for good health and fortune. Many businesses and banks close during the first 3 days of January.',
          impactAr: 'يزور الملايين الأضرحة والمعابد للتمني بالصحة والخير. تغلق معظم البنوك والشركات أبوابها في الأيام الثلاثة الأولى من يناير.',
        },
        {
          name: 'Obon (Ancestor Remembrance Festival)',
          nameAr: 'مهرجان أوبون (تذكر الأسلاف)',
          timing: 'Mid-August',
          timingAr: 'منتصف أغسطس',
          impact: 'A major Buddhist holiday where families gather in their hometowns. Bullet trains and domestic flights experience heavy peak travel.',
          impactAr: 'مناسبة بوذية كبرى تسافر فيها العائلات إلى مساقط رؤوسهم، وتشهد القطارات والطيران الداخلي ذروة ازدحام قصوى.',
        },
      ],
      placesOfWorship: [
        {
          type: 'Shinto Shrines (Jinja)',
          typeAr: 'أضرحة الشنتو (جينجا)',
          guidance: 'Identified by wooden or vermilion Torii gates. Visitors wash hands at the Temizuya pavilion before entering.',
          guidanceAr: 'تُعرف ببوابات التوري الخشبية أو الحمراء. يغسل الزوار أيديهم في حوض التيميزويا قبل الدخول كرمز للنقاء.',
          etiquette: [
            'Bow lightly once before passing under the Torii gate.',
            'Walk along the outer sides of the approach path (the center is traditionally reserved for deities).',
            'Photography is generally allowed outdoors, but prohibited inside the inner sanctuary.',
          ],
          etiquetteAr: [
            'انحنِ برأسك بخفة قبل المرور تحت بوابة التوري.',
            'امشِ على أطراف الممر بدلاً من المنتصف.',
            'يُسمح بالتصوير في الساحات الخارجية ويُمنع داخل المحاريب المغلقة.',
          ],
        },
        {
          type: 'Buddhist Temples (O-tera)',
          typeAr: 'المعابد البوذية (أو-تيرا)',
          guidance: 'Marked by large entrance gates (Sanmon) and incense burners (Jokoro). Famous examples include Senso-ji and Todai-ji.',
          guidanceAr: 'تتميز ببوابات سانمون الضخمة ومباخر الجوكورو. ومن أشهرها معبد سينسوجي في طوكيو وتوداي-جي في نارا.',
          etiquette: [
            'Remove shoes when stepping onto temple hall tatami floors.',
            'Keep voices quiet and observe signs regarding interior photography.',
            'Dress respectfully with covered shoulders and knees.',
          ],
          etiquetteAr: [
            'اخلع حذاءك عند الصعود إلى قاعات التاتامي الخشبية.',
            'حافظ على الهدوء وانتبه لإشارات منع التصوير الداخلي.',
            'ارتدِ ملابس محتشمة تغطي الكتفين والركبتين.',
          ],
        },
      ],
      dietaryAndPublicBehavior: {
        dietaryOverview: 'Japanese cuisine relies extensively on pork (Butaniku), pork-derived gelatin, and cooking alcohol (Mirin & Sake). Inquiring specifically at restaurants or seeking Halal-certified establishments ensures dietary peace of mind.',
        dietaryOverviewAr: 'يعتمد المطبخ الياباني على لحم الخنزير ومشتقاته وكحول الطبخ (الميرين والساكي) لتحضير المرق والصلصات. لذا يُنصح بالسؤال المباشر أو ارتياد المطاعم المعتمدة حلالاً.',
        dressExpectations: 'Standard modest dress is welcomed everywhere. When visiting temples, shrines, or formal offices, neat and respectful clothing is standard practice.',
        dressExpectationsAr: 'الملابس الأنيقة والساترة مقبولة في كل مكان. عند زيارة المعالم الدينية أو المكاتب الرسمية، يُفضل ارتداء ملابس محتشمة ومرتبة.',
        publicEtiquette: 'Public behavior is quiet, orderly, and considerate. Respect personal space and follow designated signage in historic areas.',
        publicEtiquetteAr: 'السلوك العام يتسم بالهدوء والانضباط ومراعاة الآخرين. احترم المساحة الشخصية واللافتات الإرشادية في المناطق التراثية.',
      },
      muslimTravelerGuide: {
        halalOverview: 'Japan has made significant progress in welcoming Muslim travelers. Cities like Tokyo, Osaka, Kyoto, and Nagoya feature hundreds of Halal-certified and Muslim-friendly restaurants ranging from authentic Halal Wagyu yakiniku and ramen to Turkish, Indian, and Malaysian cuisine.',
        halalOverviewAr: 'حققت اليابان تقدماً كبيراً في استضافة المسافرين المسلمين. تضم مدن مثل طوكيو وأوساكا وكيوتو وناغويا مئات المطاعم الحلال والمعتمدة التي تقدم لحم الواغيو والرامن والمأكولات المتنوعة.',
        halalVerificationTips: [
          'Look for official certificates from recognized bodies like Japan Halal Association (JHA) or MPJA.',
          'When dining at general seafood/vegetarian shops, ask: "Mirin ya Sake wa haitte imasu ka?" (Does this contain mirin or sake?).',
          'Convenience store onigiri (rice balls) with plain salt (Shio-musubi) or salmon (Sake) without meat broth are common quick options.',
          'Always check ingredient labels or use translation apps to detect pork extracts (豚肉エキス) or emulsifiers (乳化剤).',
        ],
        halalVerificationTipsAr: [
          'ابحث عن شهادات الاعتماد من جهات مثل جمعية الحلال اليابانية (JHA) أو جمعية مسلمي اليابان (MPJA).',
          'في المطاعم البحرية أو النباتية العامة، اسأل: "Mirin ya Sake wa haitte imasu ka?" (هل يحتوي على ميرين أو ساكي؟).',
          'كرات الأرز (أونيغيري) السادة بالملح أو السلمون المشوي البسيط من متاجر 7-Eleven وFamilyMart خيار سريع ومناسب.',
          'استخدم تطبيق الترجمة لفحص المكونات للتأكد من خلوها من مستخلصات الخنزير (豚肉エキス).',
        ],
        mosquesAndPrayer: 'Major cities offer dedicated mosques, prayer rooms in international airports (Haneda, Narita, Kansai), and multi-faith prayer spaces in major commercial hubs (like Shibuya PARCO, Shinjuku Takashimaya, and Tokyo Station).',
        mosquesAndPrayerAr: 'تتوفر مساجد جامعة ومصليات مخصصة في المطارات الدولية (هانيدا، ناريتا، كانساي) ومصليات متعددة الأديان في مراكز التسوق الكبرى (مثل شيبويا باركو، تاكاشيمايا، ومحطة طوكيو).',
        publicPrayerEtiquette: 'Prayer in public may be restricted or culturally sensitive in some busy commercial corridors. Check local regulations and use designated prayer spaces, hotel rooms, or quiet parks where available.',
        publicPrayerEtiquetteAr: 'قد تكون الصلاة في الممرات العامة المزدحمة غير معتادة أو محل تساؤل. يُنصح باستخدام المصليات المخصصة أو غرف الفنادق أو الحدائق الهادئة تفادياً لعرقلة حركة المشاة.',
        ramadanConsiderations: 'During Ramadan, community Iftars are hosted daily at Tokyo Camii, Otsuka Mosque, and Nagoya Mosque, welcoming students, expatriates, and travelers.',
        ramadanConsiderationsAr: 'خلال شهر رمضان المبارك، تُقام موائد إفطار جماعية يومية في مسجد طوكيو كامي ومسجد أوتسوكا، وتستقبل الطلاب والمقيمين والزوار بأجواء إيمانية دافئة.',
        localInquiryPhrases: [
          {
            phrase: 'ハラール対応はありますか？',
            pronunciation: 'Haraaru taiou wa arimasu ka?',
            meaningEn: 'Do you offer halal options?',
            meaningAr: 'هل يتوفر لديكم خيارات حلال؟',
          },
          {
            phrase: '豚肉やアルコールは入っていませんか？',
            pronunciation: 'Butaniku ya arukooru wa haitte imasen ka?',
            meaningEn: 'Does this contain any pork or alcohol?',
            meaningAr: 'هل هذا الطبق خالي من لحم الخنزير والكحول؟',
          },
          {
            phrase: 'お祈りできる場所はありますか？',
            pronunciation: 'Oinori dekiru basho wa arimasu ka?',
            meaningEn: 'Is there a quiet room where I can pray?',
            meaningAr: 'هل يتوفر مكان هادئ يمكنني أداء الصلاة فيه؟',
          },
        ],
      },
      disclaimer: 'Religious practices, food ingredients, and prayer facilities vary across districts. WASL provides verified contextual insights to assist respectful journeys.',
      disclaimerAr: 'تختلف التسهيلات الدينية وتوفر المطاعم بين المدن والمناطق. يقدم وصل دليلاً استرشادياً لمساعدتك على أداء شعائرك باطمئنان واحترام.',
    };
  }

  // Generic religion data
  return {
    overview: `Freedom of religion is respected in ${destinationName}. Society is open and welcoming to international travelers of all spiritual backgrounds.`,
    overviewAr: `تُحترم حرية المعتقد والأديان في ${destinationName}، ويتميز المجتمع بالانفتاح والترحيب بالزوار من مختلف الخلفيات الدينية.`,
    religiousLandscape: [
      {
        tradition: 'Major Local Religious Traditions',
        traditionAr: 'التقاليد الدينية الرئيسية',
        percentageEstimate: 'National majority',
        description: `Diverse faith traditions and cultural spiritual practices coexist harmoniously across ${destinationName}.`,
        descriptionAr: `تتعايش التقاليد الدينية والثقافية المتنوعة بتناغم عبر مدن ${destinationName}.`,
      },
    ],
    practicesAndHolidays: [
      {
        name: 'Major National Holiday',
        nameAr: 'العطلات الوطنية والدينية',
        timing: 'Throughout the year',
        timingAr: 'على مدار العام',
        impact: 'Public offices and banks may observe adjusted operational hours during official national holidays.',
        impactAr: 'قد تعدل المؤسسات والبنوك ساعات عملها أثناء العطلات الرسمية.',
      },
    ],
    placesOfWorship: [
      {
        type: 'Historic Places of Worship',
        typeAr: 'دور العبادة التاريخية',
        guidance: 'Sacred sites welcome respectful visitors. Follow quiet decorum and photography rules.',
        guidanceAr: 'ترحب المعالم الدينية بالزوار مع ضرورة الالتزام بالهدوء وقواعد اللباس المحتشم.',
        etiquette: [
          'Dress modestly with shoulders and knees covered.',
          'Keep your voice low and respect worshippers in prayer.',
        ],
        etiquetteAr: [
          'ارتدِ ملابس محتشمة تغطي الكتفين والركبتين.',
          'حافظ على الهدوء واحترام المصلين.',
        ],
      },
    ],
    dietaryAndPublicBehavior: {
      dietaryOverview: 'Check food packaging labels and ingredients or seek certified dining establishments for dietary peace of mind.',
      dietaryOverviewAr: 'تحقق من مكونات الأغذية أو استعن بالمطاعم المعتمدة لضمان مطابقة الوجبات لاحتياجاتك الغذائية.',
      dressExpectations: 'Modest and neat clothing is appreciated across public and cultural venues.',
      dressExpectationsAr: 'الملابس الأنيقة والمحتشمة تحظى بالتقدير في كافة الأماكن العامة والثقافية.',
      publicEtiquette: 'Respectful, considerate public behavior ensures smooth cross-cultural harmony.',
      publicEtiquetteAr: 'السلوك اللبق ومراعاة الآخرين يضمنان إقامة مريحة وتواصلاً إيجابياً.',
    },
    muslimTravelerGuide: {
      halalOverview: `Halal dining options, vegetarian alternatives, and international restaurants are available in ${cityName}.`,
      halalOverviewAr: `تتوفر خيارات المطاعم الحلال والبدائل النباتية والمأكولات العالمية في ${cityName}.`,
      halalVerificationTips: [
        'Seek restaurants with visible Halal certification or Muslim ownership.',
        'Inquire about cooking oils and sauces to ensure no alcohol or animal byproducts.',
      ],
      halalVerificationTipsAr: [
        'ابحث عن المطاعم التي تحمل شهادات حلال معتمدة أو يديرها مسلمون.',
        'استفسر عن زيوت الطهي والصلصات لضمان خلوها من أي مشتقات غير مناسبة.',
      ],
      mosquesAndPrayer: `Central mosques and Islamic centers operate in major metropolitan areas including ${cityName}.`,
      mosquesAndPrayerAr: `تتوفر مساجد ومراكز إسلامية رئيسية في المدن الكبرى مثل ${cityName}.`,
      publicPrayerEtiquette: 'Use designated prayer rooms, mosques, or your private accommodation for daily prayers.',
      publicPrayerEtiquetteAr: 'يُنصح بأداء الصلوات في المصليات المخصصة أو المساجد أو مقر السكن الخاص.',
      ramadanConsiderations: 'Local mosques host community gatherings and Iftar meals during Ramadan.',
      ramadanConsiderationsAr: 'تنظم المساجد والمراكز الإسلامية إفطارات جماعية وأنشطة مجتمعية خلال شهر رمضان.',
      localInquiryPhrases: [
        {
          phrase: 'Is this meal halal / vegetarian?',
          pronunciation: 'Halal inquiry',
          meaningEn: 'Asking about halal suitability',
          meaningAr: 'هل هذا الطبق حلال أو نباتي؟',
        },
      ],
    },
    disclaimer: 'Religious context and facilities vary by city and neighborhood.',
    disclaimerAr: 'تختلف التسهيلات الدينية بحسب المدينة والحي.',
  };
}
