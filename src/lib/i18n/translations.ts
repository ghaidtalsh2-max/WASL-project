export type Language = 'ar' | 'en';

export interface Translations {
  appName: string;
  tagline: string;
  subTagline: string;
  startJourney: string;
  scrollExplore: string;
  guidedSetup: string;
  naturalLanguageMode: string;
  preferToTellUs: string;
  preferGuided: string;
  whereAreYouGoing: string;
  letsBuildJourney: string;
  from: string;
  to: string;
  selectOrigin: string;
  selectDestination: string;
  chooseDestination: string;
  searchCountryOrCity: string;
  purposeTitle: string;
  durationTitle: string;
  additionalDetailsTitle: string;
  tellUsAnythingElse: string;
  continueBtn: string;
  backBtn: string;
  confirmJourneyBtn: string;
  analyzingJourney: string;
  tellWaslDirectly: string;
  naturalLanguagePlaceholder: string;
  naturalLanguageExamples: string;
  extractedDetails: string;
  originLabel: string;
  destinationLabel: string;
  cityLabel: string;
  purposeLabel: string;
  durationLabel: string;
  personaLabel: string;
  missingInfoTitle: string;
  answeringQuestion: string;
  submitAnswer: string;
  // Purposes
  study: string;
  work: string;
  travel: string;
  relocation: string;
  visit: string;
  business: string;
  other: string;
  // Durations
  days: string;
  weeks: string;
  months: string;
  yearPlus: string;
  // Navigation
  navJourney: string;
  navDiscover: string;
  navCulture: string;
  navLanguage: string;
  navTranslate: string;
  navReligion: string;
  navSafety: string;
  navAssistant: string;
  navAppearance: string;
  navLangSwitch: string;
  navSettings: string;
  // Dashboard
  yourJourney: string;
  thingsToCheck: string;
  officialResources: string;
  quickTips: string;
  cultureSnapshot: string;
  learnCulturalDos: string;
  viewCulture: string;
  localLanguageTitle: string;
  essentialPhrases: string;
  viewPhrases: string;
  digitalSafetyTitle: string;
  staySafeFromScams: string;
  checkSafety: string;
  markCompleted: string;
  openResource: string;
  // Sections
  discoverTitle: string;
  discoverSubtitle: string;
  searchPlaces: string;
  allPlaces: string;
  attractions: string;
  restaurants: string;
  cafes: string;
  universities: string;
  hospitals: string;
  placesOfWorship: string;
  transportation: string;
  emergencyServices: string;
  getDirections: string;
  officialSite: string;
  cultureSenseTitle: string;
  cultureSenseSubtitle: string;
  socialEtiquette: string;
  communication: string;
  diningCustoms: string;
  clothingAppearance: string;
  dosSection: string;
  avoidsSection: string;
  listenAudio: string;
  playingAudio: string;
  translatorTitle: string;
  translatorSubtitle: string;
  sourceTextPlaceholder: string;
  translateAction: string;
  literalTranslation: string;
  naturalTranslation: string;
  contextAndNuance: string;
  religionContextTitle: string;
  religionContextSubtitle: string;
  placesOfWorshipTitle: string;
  dietaryConsiderationsTitle: string;
  holidaysAndSocialLifeTitle: string;
  safetyAnalyzerTitle: string;
  safetyAnalyzerSubtitle: string;
  pasteMessagePlaceholder: string;
  analyzeSafetyAction: string;
  riskLevel: string;
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
  whyAnalysis: string;
  whatToDoAction: string;
  settingsTitle: string;
  aiProviderConfig: string;
  providerLabel: string;
  apiKeyLabel: string;
  testConnectionBtn: string;
  testingConnection: string;
  connectionSuccess: string;
  connectionFailed: string;
  saveSettings: string;
  fontSize: string;
  fontSizeSmall: string;
  fontSizeNormal: string;
  fontSizeLarge: string;
  themeMode: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  aiUnavailableMsg: string;
  placesUnavailableMsg: string;
  retryBtn: string;
  // Assistant
  assistantTitle: string;
  assistantSubtitle: string;
  askAnything: string;
  suggestedQuestions: string;
  sendBtn: string;
  thinking: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'WASL وصل',
    tagline: 'عالم واحد. ثقافات متعددة. اتصال واحد.',
    subTagline: 'افهم وجهتك بعمق قبل أن تصل إليها وتأقلم مع ثقافتها ولغتها وأمانها.',
    startJourney: 'ابدأ رحلتك',
    scrollExplore: 'مرر للاستكشاف',
    guidedSetup: 'الإعداد الموجّه',
    naturalLanguageMode: 'تحدث مع وصل مباشرة',
    preferToTellUs: 'تفضّل أن تخبرنا بأسلوبك؟',
    preferGuided: 'العودة للإعداد الموجه',
    whereAreYouGoing: 'إلى أين تتجه رحلتك؟',
    letsBuildJourney: 'دعنا نبني لك رحلة مخصصة متكاملة',
    from: 'من',
    to: 'إلى',
    selectOrigin: 'اختر بلد الانطلاق',
    selectDestination: 'اختر الوجهة',
    chooseDestination: 'اختر الوجهة أو المدينة',
    searchCountryOrCity: 'ابحث عن دولة أو مدينة...',
    purposeTitle: 'ما هو الهدف الرئيسي من الرحلة؟',
    durationTitle: 'كم المدة المقررة للإقامة؟',
    additionalDetailsTitle: 'تفاصيل إضافية تهمك (اختياري)',
    tellUsAnythingElse: 'أخبرنا بأي شيء يهمك (مثلاً: مسافر مع عائلتي، نباتي، لا أتحدث اللغة...)',
    continueBtn: 'متابعة',
    backBtn: 'السابق',
    confirmJourneyBtn: 'تأكيد وبدء الرحلة',
    analyzingJourney: 'جاري تحليل الرحلة بواسطة الذكاء الاصطناعي...',
    tellWaslDirectly: 'أخبر وصل بلغتك الطبيعية',
    naturalLanguagePlaceholder: 'مثال: أنا طالب علوم حاسب سعودي مبتعث إلى طوكيو لمدة سنة، أبحث عن سكن وتأقلم ثقافي...',
    naturalLanguageExamples: 'أمثلة سريعة:',
    extractedDetails: 'البيانات المستخرجة بواسطة الذكاء الاصطناعي',
    originLabel: 'بلد الانطلاق',
    destinationLabel: 'الوجهة',
    cityLabel: 'المدينة',
    purposeLabel: 'الهدف',
    durationLabel: 'المدة',
    personaLabel: 'طبيعة المسافر',
    missingInfoTitle: 'يحتاج وصل لتوضيح بسيط:',
    answeringQuestion: 'جاري معالجة الإجابة...',
    submitAnswer: 'إرسال الإجابة',
    study: 'دراسة / ابتعاث',
    work: 'عمل / نقل وظيفي',
    travel: 'سياحة / سفر',
    relocation: 'استقرار / هجرة',
    visit: 'زيارة عائلية',
    business: 'أعمال وتجارة',
    other: 'أخرى',
    days: 'أيام',
    weeks: 'أسابيع',
    months: 'أشهر',
    yearPlus: 'سنة فأكثر',
    navJourney: 'الرحلة',
    navDiscover: 'اكتشف',
    navCulture: 'الثقافة',
    navLanguage: 'اللغة المحلية',
    navTranslate: 'الترجمة السياقية',
    navReligion: 'الدين والسياق',
    navSafety: 'الأمان الرقمي',
    navAssistant: 'المساعد الذكي',
    navAppearance: 'المظهر',
    navLangSwitch: 'اللغة',
    navSettings: 'الإعدادات',
    yourJourney: 'رحلتك المخصصة',
    thingsToCheck: 'مهام يجب التحقق منها',
    officialResources: 'الروابط والمصادر الرسمية المعتمدة',
    quickTips: 'نصيحة ذكية',
    cultureSnapshot: 'لمحة ثقافية سريعة',
    learnCulturalDos: 'تعلم أهم القواعد والسلوكيات الاجتماعية المتبعة.',
    viewCulture: 'عرض الثقافة',
    localLanguageTitle: 'اللغة المحلية الحية',
    essentialPhrases: 'عبارات أساسية لمواقف الحياة اليومية في الوجهة.',
    viewPhrases: 'عرض العبارات',
    digitalSafetyTitle: 'الأمان الرقمي ومكافحة الاحتيال',
    staySafeFromScams: 'احمِ نفسك من رسائل التصيد والاحتيال أثناء السفر.',
    checkSafety: 'فحص رسالة',
    markCompleted: 'تم الإنجاز',
    openResource: 'فتح المصدر الرسمي',
    discoverTitle: 'اكتشف الأماكن والخدمات الموثوقة',
    discoverSubtitle: 'خدمات ومعالم حقيقية مبنية على موقعك ووجهتك الحالية',
    searchPlaces: 'ابحث عن مكان أو خدمة...',
    allPlaces: 'الكل',
    attractions: 'معالم سياحية',
    restaurants: 'مطاعم',
    cafes: 'مقاهي',
    universities: 'جامعات ومعاهد',
    hospitals: 'مستشفيات وطوارئ',
    placesOfWorship: 'دور عبادة ومساجد',
    transportation: 'محطات ومواصلات',
    emergencyServices: 'خدمات الطوارئ',
    getDirections: 'الاتجاهات',
    officialSite: 'الموقع الرسمي',
    cultureSenseTitle: 'حس الثقافة (Culture Sense)',
    cultureSenseSubtitle: 'افهم المجتمع وتواصل بلباقة واحترام دون تنميط',
    socialEtiquette: 'الآداب الاجتماعية',
    communication: 'أسلوب التواصل',
    diningCustoms: 'آداب الطعام والمائدة',
    clothingAppearance: 'الملابس والمظهر',
    dosSection: 'أفعال مستحسنة ومقدّرة (DO)',
    avoidsSection: 'سلوكيات يُستحسن تجنبها (AVOID)',
    listenAudio: 'استمع للنطق',
    playingAudio: 'جاري تشغيل الصوت...',
    translatorTitle: 'المترجم السياقي الثقافي',
    translatorSubtitle: 'ترجمة فورية مع توضيح الفارق بين المعنى الحرفي والمعنى الطبيعي المستخدم محلياً',
    sourceTextPlaceholder: 'اكتب أو الصق النص هنا للترجمة...',
    translateAction: 'ترجمة سياقية',
    literalTranslation: 'الترجمة الحرفية',
    naturalTranslation: 'الأسلوب الطبيعي المستخدم محلياً',
    contextAndNuance: 'السياق والملاحظات الثقافية',
    religionContextTitle: 'الدين والسياق الاجتماعي',
    religionContextSubtitle: 'إرشادات موضوعية ومحترمة تراعي خصوصية الأماكن والمناسبات',
    placesOfWorshipTitle: 'دور العبادة والمواقع التراثية',
    dietaryConsiderationsTitle: 'التصنيفات الغذائية والخيارات الحلال',
    holidaysAndSocialLifeTitle: 'المناسبات والعطلات وتأثيرها على الحياة',
    safetyAnalyzerTitle: 'محلل الأمان الرقمي ومكافحة الاحتيال',
    safetyAnalyzerSubtitle: 'الصق أي رسالة SMS، واتساب، بريد إلكتروني، أو رابط مشبوه لتحليله بالذكاء الاصطناعي',
    pasteMessagePlaceholder: 'الصق نص الرسالة المشبوهة أو الرابط هنا...',
    analyzeSafetyAction: 'تحليل الرسالة ومستوى الخطورة',
    riskLevel: 'مستوى الخطورة',
    lowRisk: 'منخفض 🟢',
    mediumRisk: 'متوسط 🟡',
    highRisk: 'مرتفع / احتيال محتمل 🔴',
    whyAnalysis: 'لماذا؟ (تحليل المؤشرات المشبوهة)',
    whatToDoAction: 'ماذا يجب أن تفعل الآن؟ (خطوات الحماية)',
    settingsTitle: 'إعدادات النظام ومزود الذكاء الاصطناعي',
    aiProviderConfig: 'تكوين مزود الذكاء الاصطناعي (LLM Provider)',
    providerLabel: 'مزود الذكاء الاصطناعي',
    apiKeyLabel: 'مفتاح API الخاص بك (اختياري / يُخزن بأمان في جلستك)',
    testConnectionBtn: 'اختبار اتصال الذكاء الاصطناعي',
    testingConnection: 'جاري فحص الاتصال...',
    connectionSuccess: 'تم الاتصال بمزود الذكاء الاصطناعي بنجاح ✓',
    connectionFailed: 'تعذر الاتصال. يرجى التحقق من المفتاح أو الإعدادات ✕',
    saveSettings: 'حفظ التفضيلات',
    fontSize: 'حجم الخط',
    fontSizeSmall: 'صغير',
    fontSizeNormal: 'متوسط',
    fontSizeLarge: 'كبير',
    themeMode: 'نمط المظهر',
    lightMode: 'فاتح',
    darkMode: 'داكن',
    systemMode: 'تلقائي (حسب النظام)',
    aiUnavailableMsg: 'خدمة الذكاء الاصطناعي غير متوفرة حالياً. يرجى مراجعة إعدادات الـ API والمحاولة مجدداً.',
    placesUnavailableMsg: 'تعذر تحميل بيانات الأماكن في الوقت الحالي.',
    retryBtn: 'إعادة المحاولة',
    assistantTitle: 'مساعد وصل الذكي',
    assistantSubtitle: 'مساعدك المعرفي المطلع على تفاصيل رحلتك الحالية',
    askAnything: 'اسأل عن أي تفاصيل تخص وجهتك أو ثقافتها...',
    suggestedQuestions: 'أسئلة مقترحة لسياق رحلتك:',
    sendBtn: 'إرسال',
    thinking: 'وصل يفكر...',
  },
  en: {
    appName: 'WASL وصل',
    tagline: 'One world. Many cultures. One connection.',
    subTagline: 'Understand where you’re going before you arrive — live, communicate, and stay safe with cultural depth.',
    startJourney: 'Start Your Journey',
    scrollExplore: 'Scroll to explore',
    guidedSetup: 'Guided Setup',
    naturalLanguageMode: 'Tell WASL Directly',
    preferToTellUs: 'Prefer to just tell us?',
    preferGuided: 'Back to Guided Setup',
    whereAreYouGoing: 'Where are you going?',
    letsBuildJourney: 'Let’s build your personalized journey',
    from: 'From',
    to: 'To',
    selectOrigin: 'Select origin country',
    selectDestination: 'Select destination',
    chooseDestination: 'Choose destination or city',
    searchCountryOrCity: 'Search country or city...',
    purposeTitle: 'What is your journey purpose?',
    durationTitle: 'How long are you staying?',
    additionalDetailsTitle: 'Additional details (optional)',
    tellUsAnythingElse: 'Tell us anything else that matters (e.g. traveling with family, vegetarian, first time alone...)',
    continueBtn: 'Continue',
    backBtn: 'Back',
    confirmJourneyBtn: 'Confirm & Launch Journey',
    analyzingJourney: 'AI is analyzing your journey details...',
    tellWaslDirectly: 'Tell WASL in natural language',
    naturalLanguagePlaceholder: 'e.g. I’m a Saudi computer science student moving to Tokyo for 1 year, looking for student housing and cultural tips...',
    naturalLanguageExamples: 'Quick prompts:',
    extractedDetails: 'AI Extracted Journey Details',
    originLabel: 'Origin',
    destinationLabel: 'Destination',
    cityLabel: 'City',
    purposeLabel: 'Purpose',
    durationLabel: 'Duration',
    personaLabel: 'Traveler Persona',
    missingInfoTitle: 'WASL needs a quick clarification:',
    answeringQuestion: 'Processing your answer...',
    submitAnswer: 'Submit Answer',
    study: 'Study / Scholarship',
    work: 'Work / Relocation',
    travel: 'Travel / Tourism',
    relocation: 'Relocation / Living',
    visit: 'Family Visit',
    business: 'Business',
    other: 'Other',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    yearPlus: '1+ Year',
    navJourney: 'Journey',
    navDiscover: 'Discover',
    navCulture: 'Culture',
    navLanguage: 'Local Language',
    navTranslate: 'Translate',
    navReligion: 'Religion & Context',
    navSafety: 'Digital Safety',
    navAssistant: 'AI Assistant',
    navAppearance: 'Appearance',
    navLangSwitch: 'Language',
    navSettings: 'Settings',
    yourJourney: 'Your Journey',
    thingsToCheck: 'Things to check',
    officialResources: 'Official Resources',
    quickTips: 'Quick Tips',
    cultureSnapshot: 'Culture Snapshot',
    learnCulturalDos: 'Learn key cultural do’s & don’ts for smooth daily interactions.',
    viewCulture: 'View',
    localLanguageTitle: 'Local Language',
    essentialPhrases: 'Essential phrases for real-world situations with pronunciation.',
    viewPhrases: 'View',
    digitalSafetyTitle: 'Digital Safety',
    staySafeFromScams: 'Stay safe from foreign phishing, scam SMS, and fake payments.',
    checkSafety: 'Check',
    markCompleted: 'Mark completed',
    openResource: 'Open official resource',
    discoverTitle: 'Discover Verified Places & Services',
    discoverSubtitle: 'Real locations, emergency hubs, and neighborhood services in your destination',
    searchPlaces: 'Search for a place or service...',
    allPlaces: 'All',
    attractions: 'Attractions',
    restaurants: 'Restaurants',
    cafes: 'Cafés',
    universities: 'Universities',
    hospitals: 'Hospitals & Emergency',
    placesOfWorship: 'Places of Worship',
    transportation: 'Transit Hubs',
    emergencyServices: 'Emergency',
    getDirections: 'Directions',
    officialSite: 'Official Site',
    cultureSenseTitle: 'Culture Sense',
    cultureSenseSubtitle: 'Deep, respectful, stereotype-free guidance on societal etiquette',
    socialEtiquette: 'Social Etiquette',
    communication: 'Communication Style',
    diningCustoms: 'Dining & Table Etiquette',
    clothingAppearance: 'Clothing & Public Dress',
    dosSection: 'Recommended Practices (DO)',
    avoidsSection: 'Practices to Avoid (AVOID)',
    listenAudio: 'Listen Pronunciation',
    playingAudio: 'Playing audio...',
    translatorTitle: 'Cultural Context Translator',
    translatorSubtitle: 'Understand the difference between literal translation and natural local speech',
    sourceTextPlaceholder: 'Enter or paste text to translate...',
    translateAction: 'Translate with Context',
    literalTranslation: 'Literal Translation',
    naturalTranslation: 'Natural / Local Idiomatic Phrasing',
    contextAndNuance: 'Cultural Context & Nuance',
    religionContextTitle: 'Religion & Social Context',
    religionContextSubtitle: 'Respectful, objective guidance distinguishing religion, culture, and daily life',
    placesOfWorshipTitle: 'Places of Worship & Sacred Sites',
    dietaryConsiderationsTitle: 'Dietary Guidance & Food Labels',
    holidaysAndSocialLifeTitle: 'Holidays & Impact on Daily Life',
    safetyAnalyzerTitle: 'Digital Safety & Anti-Scam Analyzer',
    safetyAnalyzerSubtitle: 'Paste any suspicious foreign SMS, email, WhatsApp message, or payment link to analyze with AI',
    pasteMessagePlaceholder: 'Paste suspicious message, SMS, or URL here...',
    analyzeSafetyAction: 'Analyze Message & Risk Level',
    riskLevel: 'Risk Level',
    lowRisk: 'Low Risk 🟢',
    mediumRisk: 'Medium Risk 🟡',
    highRisk: 'High Risk / Potential Scam 🔴',
    whyAnalysis: 'Why? (Detected Indicators & Red Flags)',
    whatToDoAction: 'What Should I Do? (Action Checklist)',
    settingsTitle: 'Settings & AI Provider Configuration',
    aiProviderConfig: 'AI Provider Configuration (LLM Abstraction)',
    providerLabel: 'AI Provider',
    apiKeyLabel: 'Custom API Key (Optional / Stored safely in session)',
    testConnectionBtn: 'Test AI Connection',
    testingConnection: 'Testing connection...',
    connectionSuccess: 'Connected to AI provider successfully ✓',
    connectionFailed: 'Connection failed. Please check API key or quota ✕',
    saveSettings: 'Save Preferences',
    fontSize: 'Font Size',
    fontSizeSmall: 'Small',
    fontSizeNormal: 'Medium',
    fontSizeLarge: 'Large',
    themeMode: 'Appearance Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    systemMode: 'System Preference',
    aiUnavailableMsg: 'AI connection unavailable. Please check your API configuration and try again.',
    placesUnavailableMsg: 'Places couldn’t be loaded right now.',
    retryBtn: 'Retry',
    assistantTitle: 'WASL AI Assistant',
    assistantSubtitle: 'Context-aware intelligence knowing your origin, destination, and purpose',
    askAnything: 'Ask anything about your destination, etiquette, safety...',
    suggestedQuestions: 'Suggested questions for your trip:',
    sendBtn: 'Send',
    thinking: 'WASL is thinking...',
  },
};
