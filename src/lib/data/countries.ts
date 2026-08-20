export interface DestinationResource {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  url: string;
  category: 'visa' | 'government' | 'transport' | 'emergency' | 'culture' | 'housing' | 'student';
}

export interface CountryInfo {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  code: string;
  capital: string;
  capitalAr: string;
  lat: number;
  lng: number;
  currency: string;
  language: string;
  languageCode: string;
  famousCities: { name: string; nameAr: string; lat: number; lng: number }[];
  officialResources: DestinationResource[];
}

export const COUNTRIES: CountryInfo[] = [
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    code: 'SA',
    capital: 'Riyadh',
    capitalAr: 'الرياض',
    lat: 24.7136,
    lng: 46.6753,
    currency: 'SAR (ريال)',
    language: 'Arabic (العربية)',
    languageCode: 'ar',
    famousCities: [
      { name: 'Riyadh', nameAr: 'الرياض', lat: 24.7136, lng: 46.6753 },
      { name: 'Jeddah', nameAr: 'جدة', lat: 21.4858, lng: 39.1925 },
      { name: 'Makkah', nameAr: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
      { name: 'Madinah', nameAr: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
      { name: 'Dammam', nameAr: 'الدمام', lat: 26.4207, lng: 50.0888 },
      { name: 'AlUla', nameAr: 'العلا', lat: 26.6167, lng: 37.9167 },
    ],
    officialResources: [
      {
        name: 'Absher Portal',
        nameAr: 'منصة أبشر',
        description: 'Official portal for government and resident services in Saudi Arabia',
        descriptionAr: 'المنصة الرسمية للخدمات الحكومية وخدمات المواطنين والمقيمين',
        url: 'https://www.absher.sa',
        category: 'government',
      },
      {
        name: 'Nafath National Single Sign-On',
        nameAr: 'النفاذ الوطني الموحد (نفاذ)',
        description: 'Unified national identity verification gateway',
        descriptionAr: 'البوابة الوطنية الموحدة للتحقق من الهوية الرقمية',
        url: 'https://www.iam.gov.sa',
        category: 'government',
      },
      {
        name: 'General Directorate of Passports (Jawazat)',
        nameAr: 'المديرية العامة للجوازات',
        description: 'Official passport, residency, and border entry regulations',
        descriptionAr: 'الخدمات والإجراءات الرسمية للجوازات والإقامة والدخول',
        url: 'https://www.gdp.gov.sa',
        category: 'visa',
      },
      {
        name: 'Ministry of Foreign Affairs (MOFA)',
        nameAr: 'وزارة الخارجية السعودية',
        description: 'Visa platforms, embassy information, and travel advisories',
        descriptionAr: 'منصة التأشيرات ومعلومات السفارات والإرشادات الدبلوماسية',
        url: 'https://www.mofa.gov.sa',
        category: 'visa',
      },
      {
        name: 'Saudi Unified Visa Platform (KSA Visa)',
        nameAr: 'المنصة الوطنية الموحدة للتأشيرات',
        description: 'Official unified eVisa portal for tourism, business, and study',
        descriptionAr: 'المنصة الرسمية الموحدة للتقديم على التأشيرات الإلكترونية',
        url: 'https://visa.visitsaudi.com',
        category: 'visa',
      },
    ],
  },
  {
    id: 'japan',
    name: 'Japan',
    nameAr: 'اليابان',
    flag: '🇯🇵',
    code: 'JP',
    capital: 'Tokyo',
    capitalAr: 'طوكيو',
    lat: 35.6762,
    lng: 139.6503,
    currency: 'JPY (¥)',
    language: 'Japanese (日本語)',
    languageCode: 'ja',
    famousCities: [
      { name: 'Tokyo', nameAr: 'طوكيو', lat: 35.6762, lng: 139.6503 },
      { name: 'Kyoto', nameAr: 'كيوتو', lat: 35.0116, lng: 135.7681 },
      { name: 'Osaka', nameAr: 'أوساكا', lat: 34.6937, lng: 135.5023 },
      { name: 'Fukuoka', nameAr: 'فوكوكا', lat: 33.5904, lng: 130.4017 },
      { name: 'Sapporo', nameAr: 'سابورو', lat: 43.0618, lng: 141.3545 },
    ],
    officialResources: [
      {
        name: 'Visit Japan Web',
        nameAr: 'بوابة زيارة اليابان الرسمية',
        description: 'Official digital immigration, customs, and tax-free entry registration',
        descriptionAr: 'البوابة الرقمية الرسمية لإجراءات الهجرة والجمارك والدخول',
        url: 'https://vjw-lp.digital.go.jp/en/',
        category: 'visa',
      },
      {
        name: 'Immigration Services Agency of Japan',
        nameAr: 'وكالة خدمات الهجرة اليابانية',
        description: 'Official residence status, visa changes, and registration procedures',
        descriptionAr: 'الإجراءات الرسمية لتصاريح الإقامة وتأشيرات العمل والدراسة',
        url: 'https://www.moj.go.jp/isa/',
        category: 'government',
      },
      {
        name: 'Japan National Tourism Organization (JNTO)',
        nameAr: 'الهيئة القومية للسياحة اليابانية',
        description: 'Verified emergency numbers, medical clinics, and tourist navigation',
        descriptionAr: 'أرقام الطوارئ والمراكز الطبية المعتمدة للزوار',
        url: 'https://www.japan.travel/en/',
        category: 'culture',
      },
      {
        name: 'Japan Rail Pass & Suica Information',
        nameAr: 'معلومات شبكة القطارات والبطاقات الذكية',
        description: 'Official public transit cards (Suica/Pasmo) and Shinkansen bookings',
        descriptionAr: 'معلومات بطاقات المواصلات العامة وقطارات الشينكانسن السريعة',
        url: 'https://www.jreast.co.jp/e/',
        category: 'transport',
      },
      {
        name: 'Study in Japan (JASSO)',
        nameAr: 'بوابة الدراسة في اليابان',
        description: 'Official scholarships, student housing, and university guidelines',
        descriptionAr: 'الدليل الرسمي للجامعات والمنح الدراسية والسكن الجامعي',
        url: 'https://www.studyinjapan.go.jp',
        category: 'student',
      },
    ],
  },
  {
    id: 'turkey',
    name: 'Turkey',
    nameAr: 'تركيا',
    flag: '🇹🇷',
    code: 'TR',
    capital: 'Ankara',
    capitalAr: 'أنقرة',
    lat: 39.9334,
    lng: 32.8597,
    currency: 'TRY (₺)',
    language: 'Turkish (Türkçe)',
    languageCode: 'tr',
    famousCities: [
      { name: 'Istanbul', nameAr: 'إسطنبول', lat: 41.0082, lng: 28.9784 },
      { name: 'Ankara', nameAr: 'أنقرة', lat: 39.9334, lng: 32.8597 },
      { name: 'Antalya', nameAr: 'أنطاليا', lat: 36.8969, lng: 30.7133 },
      { name: 'Izmir', nameAr: 'إزمير', lat: 38.4237, lng: 27.1428 },
      { name: 'Trabzon', nameAr: 'طرابزون', lat: 41.0027, lng: 39.7168 },
    ],
    officialResources: [
      {
        name: 'e-Devlet Gateway',
        nameAr: 'بوابة الحكومة الإلكترونية التركية',
        description: 'Official digital government services portal for residents and foreigners',
        descriptionAr: 'البوابة الحكومية الرسمية لجميع المعاملات والإقامات',
        url: 'https://www.turkiye.gov.tr',
        category: 'government',
      },
      {
        name: 'Turkish Electronic Visa (e-Visa)',
        nameAr: 'نظام التأشيرة الإلكترونية التركية',
        description: 'Official Ministry of Foreign Affairs electronic visa application portal',
        descriptionAr: 'البوابة الرسمية لوزارة الخارجية لإصدار التأشيرة الإلكترونية',
        url: 'https://www.evisa.gov.tr',
        category: 'visa',
      },
      {
        name: 'Presidency of Migration Management (GÖÇ)',
        nameAr: 'رئاسة إدارة الهجرة التركية (Göç)',
        description: 'Official residence permit (İkamet) applications and appointments',
        descriptionAr: 'الموقع الرسمي لتقديم ومتابعة مواعيد الإقامة التركية',
        url: 'https://en.goc.gov.tr',
        category: 'visa',
      },
      {
        name: 'Go Türkiye Official Tourism Portal',
        nameAr: 'البوابة الرسمية للسياحة التركية',
        description: 'Verified guides on culture, transportation, and emergency assistance',
        descriptionAr: 'الدليل الرسمي للثقافة والمواصلات والطوارئ',
        url: 'https://goturkiye.com',
        category: 'culture',
      },
    ],
  },
  {
    id: 'france',
    name: 'France',
    nameAr: 'فرنسا',
    flag: '🇫🇷',
    code: 'FR',
    capital: 'Paris',
    capitalAr: 'باريس',
    lat: 48.8566,
    lng: 2.3522,
    currency: 'EUR (€)',
    language: 'French (Français)',
    languageCode: 'fr',
    famousCities: [
      { name: 'Paris', nameAr: 'باريس', lat: 48.8566, lng: 2.3522 },
      { name: 'Lyon', nameAr: 'ليون', lat: 45.7640, lng: 4.8357 },
      { name: 'Marseille', nameAr: 'مارسيليا', lat: 43.2965, lng: 5.3698 },
      { name: 'Nice', nameAr: 'نيس', lat: 43.7102, lng: 7.2620 },
    ],
    officialResources: [
      {
        name: 'France-Visas Official Portal',
        nameAr: 'بوابة التأشيرات الفرنسية الرسمية',
        description: 'The sole official portal for French visa requirements and tracking',
        descriptionAr: 'البوابة الرسمية الوحيدة لمعالجة وتتبع التأشيرات الفرنسية',
        url: 'https://france-visas.gouv.fr',
        category: 'visa',
      },
      {
        name: 'Service-Public.fr',
        nameAr: 'بوابة الخدمات العامة الفرنسية',
        description: 'Official guide to administrative rights, residency cards, and health insurance',
        descriptionAr: 'الدليل الإداري الرسمي لحقوق الإقامة والتأمين الصحي (Sécu)',
        url: 'https://www.service-public.fr',
        category: 'government',
      },
      {
        name: 'Campus France',
        nameAr: 'كامبوس فرانس للطلاب والباحثين',
        description: 'Official agency for international students in French higher education',
        descriptionAr: 'الوكالة الرسمية لدراسة الطلاب الدوليين في الجامعات الفرنسية',
        url: 'https://www.campusfrance.org',
        category: 'student',
      },
      {
        name: 'RATP Paris Public Transport',
        nameAr: 'شبكة مواصلات باريس (RATP)',
        description: 'Official metro, bus, RER routes, and Navigo pass information',
        descriptionAr: 'الموقع الرسمي للمترو والحافلات وبطاقات نافيجو',
        url: 'https://www.ratp.fr',
        category: 'transport',
      },
    ],
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    flag: '🇬🇧',
    code: 'GB',
    capital: 'London',
    capitalAr: 'لندن',
    lat: 51.5074,
    lng: -0.1278,
    currency: 'GBP (£)',
    language: 'English',
    languageCode: 'en',
    famousCities: [
      { name: 'London', nameAr: 'لندن', lat: 51.5074, lng: -0.1278 },
      { name: 'Manchester', nameAr: 'مانشستر', lat: 53.4808, lng: -2.2426 },
      { name: 'Edinburgh', nameAr: 'إدنبرة', lat: 55.9533, lng: -3.1883 },
      { name: 'Birmingham', nameAr: 'برمنغهام', lat: 52.4862, lng: -1.8904 },
    ],
    officialResources: [
      {
        name: 'GOV.UK Visas and Immigration',
        nameAr: 'بوابة الهجرة والتأشيرات البريطانية (GOV.UK)',
        description: 'Official government portal for student, work, and tourist visas',
        descriptionAr: 'الموقع الحكومي الرسمي لتأشيرات الدراسة والعمل والسياحة (EVW/eVisa)',
        url: 'https://www.gov.uk/browse/visas-immigration',
        category: 'visa',
      },
      {
        name: 'National Health Service (NHS)',
        nameAr: 'هيئة الخدمات الصحية الوطنية (NHS)',
        description: 'Official healthcare guide, emergency (999/111) and GP registration',
        descriptionAr: 'الدليل الصحي الرسمي وأرقام الطوارئ والتسجيل لدى طبيب الأسرة',
        url: 'https://www.nhs.uk',
        category: 'emergency',
      },
      {
        name: 'Transport for London (TfL)',
        nameAr: 'هيئة النقل في لندن (TfL)',
        description: 'Official tube, bus, and contactless fare information',
        descriptionAr: 'الموقع الرسمي لقطارات الأنفاق وبطاقات أويستر والدفع اللاتلامسي',
        url: 'https://tfl.gov.uk',
        category: 'transport',
      },
    ],
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    nameAr: 'كوريا الجنوبية',
    flag: '🇰🇷',
    code: 'KR',
    capital: 'Seoul',
    capitalAr: 'سيئول',
    lat: 37.5665,
    lng: 126.9780,
    currency: 'KRW (₩)',
    language: 'Korean (한국어)',
    languageCode: 'ko',
    famousCities: [
      { name: 'Seoul', nameAr: 'سيئول', lat: 37.5665, lng: 126.9780 },
      { name: 'Busan', nameAr: 'بوسان', lat: 35.1796, lng: 129.0756 },
      { name: 'Incheon', nameAr: 'إنتشون', lat: 37.4563, lng: 126.7052 },
      { name: 'Jeju', nameAr: 'جيجو', lat: 33.4996, lng: 126.5312 },
    ],
    officialResources: [
      {
        name: 'K-ETA (Korea Electronic Travel Authorization)',
        nameAr: 'التصريح الإلكتروني للسفر إلى كوريا (K-ETA)',
        description: 'Official electronic travel authorization application portal',
        descriptionAr: 'البوابة الرسمية لطلب تصريح السفر الإلكتروني لكوريا',
        url: 'https://www.k-eta.go.kr',
        category: 'visa',
      },
      {
        name: 'Hi Korea (Immigration Portal)',
        nameAr: 'بوابة هاي كوريا للإقامة والهجرة',
        description: 'Official e-government for foreigners, Alien Registration Card (ARC)',
        descriptionAr: 'البوابة الإلكترونية الرسمية للأجانب وبطاقة الإقامة',
        url: 'https://www.hikorea.go.kr',
        category: 'government',
      },
      {
        name: 'Visit Korea Tourism',
        nameAr: 'منظمة السياحة الكورية الرسمية',
        description: 'Verified guides, emergency contact (1330), and cultural insights',
        descriptionAr: 'الدليل الرسمي وخط مساعدة الزوار السياحي (1330)',
        url: 'https://english.visitkorea.or.kr',
        category: 'culture',
      },
    ],
  },
  {
    id: 'united-states',
    name: 'United States',
    nameAr: 'الولايات المتحدة الأمريكية',
    flag: '🇺🇸',
    code: 'US',
    capital: 'Washington, D.C.',
    capitalAr: 'واشنطن العاصمة',
    lat: 38.9072,
    lng: -77.0369,
    currency: 'USD ($)',
    language: 'English',
    languageCode: 'en',
    famousCities: [
      { name: 'New York City', nameAr: 'نيويورك', lat: 40.7128, lng: -74.0060 },
      { name: 'Los Angeles', nameAr: 'لوس أنجلوس', lat: 34.0522, lng: -118.2437 },
      { name: 'Chicago', nameAr: 'شيكاغو', lat: 41.8781, lng: -87.6298 },
      { name: 'San Francisco', nameAr: 'سان فرانسيسكو', lat: 37.7749, lng: -122.4194 },
      { name: 'Boston', nameAr: 'بوسطن', lat: 42.3601, lng: -71.0589 },
    ],
    officialResources: [
      {
        name: 'U.S. Department of State - Travel & Visas',
        nameAr: 'وزارة الخارجية الأمريكية - التأشيرات والسفر',
        description: 'Official portal for Nonimmigrant Visa DS-160 applications & embassy info',
        descriptionAr: 'البوابة الرسمية للتأشيرات غير الهجرة واستمارة DS-160',
        url: 'https://travel.state.gov',
        category: 'visa',
      },
      {
        name: 'U.S. Customs and Border Protection (ESTA & I-94)',
        nameAr: 'هيئة الجمارك وحماية الحدود الأمريكية (ESTA / I-94)',
        description: 'Electronic System for Travel Authorization and official I-94 arrival record',
        descriptionAr: 'نظام تصريح السفر الإلكتروني وسجل الدخول والخروج الرسمي',
        url: 'https://i94.cbp.dhs.gov',
        category: 'visa',
      },
      {
        name: 'USCIS Official Portal',
        nameAr: 'دائرة خدمات الهجرة والجنسية الأمريكية (USCIS)',
        description: 'Official student status (F-1/OPT) and employment authorization guidance',
        descriptionAr: 'الدليل الرسمي لحالة الطلاب الدوليين وتصاريح العمل',
        url: 'https://www.uscis.gov',
        category: 'government',
      },
    ],
  },
  {
    id: 'germany',
    name: 'Germany',
    nameAr: 'ألمانيا',
    flag: '🇩🇪',
    code: 'DE',
    capital: 'Berlin',
    capitalAr: 'برلين',
    lat: 52.5200,
    lng: 13.4050,
    currency: 'EUR (€)',
    language: 'German (Deutsch)',
    languageCode: 'de',
    famousCities: [
      { name: 'Berlin', nameAr: 'برلين', lat: 52.5200, lng: 13.4050 },
      { name: 'Munich', nameAr: 'ميونخ', lat: 48.1351, lng: 11.5820 },
      { name: 'Frankfurt', nameAr: 'فرانكفورت', lat: 50.1109, lng: 8.6821 },
      { name: 'Hamburg', nameAr: 'هامبورغ', lat: 53.5511, lng: 9.9937 },
    ],
    officialResources: [
      {
        name: 'Federal Foreign Office (Auswärtiges Amt)',
        nameAr: 'وزارة الخارجية الاتحادية الألمانية',
        description: 'Official entry requirements, Schengen visa regulations, and embassy links',
        descriptionAr: 'الإرشادات الرسمية للتأشيرات ولوائح دخول دول الشنغن',
        url: 'https://www.auswaertiges-amt.de/en',
        category: 'visa',
      },
      {
        name: 'Make it in Germany',
        nameAr: 'بوابة اصنعها في ألمانيا الرسمية',
        description: 'Federal government portal for qualified professionals, trainees, and students',
        descriptionAr: 'البوابة الحكومية الرسمية للعمل والتدريب المهني والدراسة',
        url: 'https://www.make-it-in-germany.com',
        category: 'government',
      },
      {
        name: 'DAAD (German Academic Exchange Service)',
        nameAr: 'الهيئة الألمانية للتبادل الأكاديمي (DAAD)',
        description: 'Official database for higher education degrees and university admissions',
        descriptionAr: 'الدليل الشامل للجامعات والمنح الدراسية للطلاب الدوليين',
        url: 'https://www.daad.de/en/',
        category: 'student',
      },
    ],
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    code: 'AE',
    capital: 'Abu Dhabi',
    capitalAr: 'أبوظبي',
    lat: 24.4539,
    lng: 54.3773,
    currency: 'AED (درهم)',
    language: 'Arabic (العربية)',
    languageCode: 'ar',
    famousCities: [
      { name: 'Dubai', nameAr: 'دبي', lat: 25.2048, lng: 55.2708 },
      { name: 'Abu Dhabi', nameAr: 'أبوظبي', lat: 24.4539, lng: 54.3773 },
      { name: 'Sharjah', nameAr: 'الشارقة', lat: 25.3463, lng: 55.4209 },
    ],
    officialResources: [
      {
        name: 'UAE Government Official Portal (u.ae)',
        nameAr: 'البوابة الرسمية لحكومة الإمارات (u.ae)',
        description: 'Unified gateway for visas, emirates ID, labor laws, and public services',
        descriptionAr: 'البوابة الموحدة لتأشيرات الإقامة والهوية وخدمات العمل',
        url: 'https://u.ae',
        category: 'government',
      },
      {
        name: 'Federal Authority for Identity and Citizenship (ICP)',
        nameAr: 'الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ',
        description: 'Official residency visas, golden visa applications, and entry permits',
        descriptionAr: 'التقديم على تأشيرات الإقامة الذهبية وأذونات الدخول',
        url: 'https://icp.gov.ae',
        category: 'visa',
      },
    ],
  },
  {
    id: 'egypt',
    name: 'Egypt',
    nameAr: 'مصر',
    flag: '🇪🇬',
    code: 'EG',
    capital: 'Cairo',
    capitalAr: 'القاهرة',
    lat: 30.0444,
    lng: 31.2357,
    currency: 'EGP (جنيه)',
    language: 'Arabic (العربية)',
    languageCode: 'ar',
    famousCities: [
      { name: 'Cairo', nameAr: 'القاهرة', lat: 30.0444, lng: 31.2357 },
      { name: 'Alexandria', nameAr: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
      { name: 'Giza', nameAr: 'الجيزة', lat: 30.0131, lng: 31.2089 },
      { name: 'Luxor', nameAr: 'الأقصر', lat: 25.6872, lng: 32.6396 },
    ],
    officialResources: [
      {
        name: 'Egypt e-Visa Portal',
        nameAr: 'البوابة الرسمية للتأشيرة الإلكترونية المصرية',
        description: 'Official Government of Egypt electronic visa application platform',
        descriptionAr: 'البوابة الرسمية لإصدار التأشيرة السياحية الإلكترونية لمصر',
        url: 'https://visa2egypt.gov.eg',
        category: 'visa',
      },
      {
        name: 'Ministry of Tourism and Antiquities',
        nameAr: 'وزارة السياحة والآثار المصرية',
        description: 'Official tickets, archaeological site regulations, and tourist hotline (19654)',
        descriptionAr: 'الموقع الرسمي للزيارات الأثرية وتذاكر المتاحف والخط الساخن',
        url: 'https://mota.gov.eg',
        category: 'culture',
      },
    ],
  },
  {
    id: 'morocco',
    name: 'Morocco',
    nameAr: 'المغرب',
    flag: '🇲🇦',
    code: 'MA',
    capital: 'Rabat',
    capitalAr: 'الرباط',
    lat: 34.020882,
    lng: -6.841650,
    currency: 'MAD (درهم)',
    language: 'Arabic & Tamazight (العربية والأمازيغية)',
    languageCode: 'ar',
    famousCities: [
      { name: 'Marrakech', nameAr: 'مراكش', lat: 31.6295, lng: -7.9811 },
      { name: 'Casablanca', nameAr: 'الدار البيضاء', lat: 33.5731, lng: -7.5898 },
      { name: 'Rabat', nameAr: 'الرباط', lat: 34.0209, lng: -6.8417 },
      { name: 'Fez', nameAr: 'فاس', lat: 34.0181, lng: -5.0078 },
      { name: 'Tangier', nameAr: 'طنجة', lat: 35.7595, lng: -5.8340 },
    ],
    officialResources: [
      {
        name: 'Access Maroc (Accès Maroc eVisa)',
        nameAr: 'منصة التأشيرة الإلكترونية المغربية (Accès Maroc)',
        description: 'Official Ministry of Foreign Affairs electronic visa platform',
        descriptionAr: 'البوابة الرسمية المعتمدة لطلب تأشيرة الدخول الإلكترونية للمغرب',
        url: 'https://www.acces-maroc.ma',
        category: 'visa',
      },
      {
        name: 'Moroccan National Tourism Office (Visit Morocco)',
        nameAr: 'المكتب الوطني المغربي للسياحة',
        description: 'Official destination guide, transportation, and safety advisories',
        descriptionAr: 'الدليل الرسمي للسياحة والمواصلات وخدمات الزوار',
        url: 'https://www.visitmorocco.com',
        category: 'culture',
      },
    ],
  },
  {
    id: 'italy',
    name: 'Italy',
    nameAr: 'إيطاليا',
    flag: '🇮🇹',
    code: 'IT',
    capital: 'Rome',
    capitalAr: 'روما',
    lat: 41.9028,
    lng: 12.4964,
    currency: 'EUR (€)',
    language: 'Italian (Italiano)',
    languageCode: 'it',
    famousCities: [
      { name: 'Rome', nameAr: 'روما', lat: 41.9028, lng: 12.4964 },
      { name: 'Milan', nameAr: 'ميلانو', lat: 45.4642, lng: 9.1900 },
      { name: 'Florence', nameAr: 'فلورنسا', lat: 43.7696, lng: 11.2558 },
      { name: 'Venice', nameAr: 'البندقية', lat: 45.4408, lng: 12.3155 },
    ],
    officialResources: [
      {
        name: 'Il Visto per l\'Italia (Visa for Italy)',
        nameAr: 'بوابة التأشيرة الإيطالية الرسمية',
        description: 'Ministry of Foreign Affairs official visa guide and application procedures',
        descriptionAr: 'الموقع الرسمي لوزارة الشؤون الخارجية لتأشيرات إيطاليا',
        url: 'https://vistoperitalia.esteri.it',
        category: 'visa',
      },
      {
        name: 'Polizia di Stato - Permesso di Soggiorno',
        nameAr: 'الشرطة الإيطالية - تصاريح الإقامة',
        description: 'Official residence permit application tracking and Questura appointments',
        descriptionAr: 'متابعة تصاريح الإقامة ومواعيد مديرية الأمن الإيطالية',
        url: 'https://www.poliziadistato.it',
        category: 'government',
      },
    ],
  },
  {
    id: 'spain',
    name: 'Spain',
    nameAr: 'إسبانيا',
    flag: '🇪🇸',
    code: 'ES',
    capital: 'Madrid',
    capitalAr: 'مدريد',
    lat: 40.4168,
    lng: -3.7038,
    currency: 'EUR (€)',
    language: 'Spanish (Español)',
    languageCode: 'es',
    famousCities: [
      { name: 'Madrid', nameAr: 'مدريد', lat: 40.4168, lng: -3.7038 },
      { name: 'Barcelona', nameAr: 'برشلونة', lat: 41.3879, lng: 2.1699 },
      { name: 'Valencia', nameAr: 'بلنسية', lat: 39.4699, lng: -0.3763 },
      { name: 'Seville', nameAr: 'إشبيلية', lat: 37.3891, lng: -5.9845 },
    ],
    officialResources: [
      {
        name: 'Ministerio de Asuntos Exteriores (Spain MOFA)',
        nameAr: 'وزارة الشؤون الخارجية الإسبانية',
        description: 'Official information on Schengen visas, residency, and consulate services',
        descriptionAr: 'معلومات التأشيرات وخدمات القنصليات والإقامة الرسمية',
        url: 'https://www.exteriores.gob.es',
        category: 'visa',
      },
      {
        name: 'Sede Electrónica - Extranjería (NIE/TIE)',
        nameAr: 'بوابة شؤون الأجانب الإسبانية (NIE/TIE)',
        description: 'Official appointments for Foreigner Identity Number (NIE) and TIE card',
        descriptionAr: 'حجز مواعيد رقم هوية الأجنبي وبطاقة الإقامة في إسبانيا',
        url: 'https://sede.administracionespublicas.gob.es',
        category: 'government',
      },
    ],
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    flag: '🇲🇾',
    code: 'MY',
    capital: 'Kuala Lumpur',
    capitalAr: 'كوالالمبور',
    lat: 3.1390,
    lng: 101.6869,
    currency: 'MYR (RM)',
    language: 'Malay (Bahasa Melayu)',
    languageCode: 'ms',
    famousCities: [
      { name: 'Kuala Lumpur', nameAr: 'كوالالمبور', lat: 3.1390, lng: 101.6869 },
      { name: 'Penang', nameAr: 'بينانج', lat: 5.4141, lng: 100.3288 },
      { name: 'Johor Bahru', nameAr: 'جوهر بهرو', lat: 1.4927, lng: 103.7414 },
    ],
    officialResources: [
      {
        name: 'Malaysia Digital Arrival Card (MDAC)',
        nameAr: 'بطاقة الوصول الرقمية الماليزية (MDAC)',
        description: 'Mandatory online registration for foreign travelers prior to arrival',
        descriptionAr: 'التسجيل الإلزامي الإلكتروني المسبق لجميع القادمين إلى ماليزيا',
        url: 'https://imigresen-online.imi.gov.my/mdac/main',
        category: 'visa',
      },
      {
        name: 'Immigration Department of Malaysia',
        nameAr: 'إدارة الهجرة الماليزية',
        description: 'Official student passes, work permits, and MM2H program details',
        descriptionAr: 'الموقع الرسمي لتصاريح الطلاب والعمل وبرامج الإقامة',
        url: 'https://www.imi.gov.my',
        category: 'government',
      },
    ],
  },
];

// Extensive Aliases mapping for instant smart Arabic & English detection
const COUNTRY_ALIASES: Record<string, string[]> = {
  'united-kingdom': ['بريطانيا', 'بريطانيه', 'انجلترا', 'إنجلترا', 'المملكة المتحدة', 'لندن', 'مانشستر', 'uk', 'britain', 'england', 'london', 'manchester', 'edinburgh', 'birmingham'],
  'united-states': ['امريكا', 'أمريكا', 'أميركا', 'اميركا', 'الولايات المتحدة', 'امريكيا', 'نيويورك', 'واشنطن', 'كاليفورنيا', 'لوس انجلوس', 'usa', 'us', 'america', 'united states', 'new york', 'california'],
  'japan': ['اليابان', 'ياباني', 'طوكيو', 'كيوتو', 'اوساكا', 'أوساكا', 'japan', 'tokyo', 'kyoto', 'osaka', 'sapporo', 'fukuoka'],
  'turkey': ['تركيا', 'تركي', 'اسطنبول', 'إسطنبول', 'أنقرة', 'انقرة', 'انطاليا', 'أنطاليا', 'طرابزون', 'turkey', 'türkiye', 'istanbul', 'ankara', 'antalya', 'trabzon'],
  'france': ['فرنسا', 'فرنسي', 'باريس', 'ليون', 'مارسيليا', 'نيس', 'france', 'paris', 'lyon', 'marseille', 'nice'],
  'germany': ['المانيا', 'ألمانيا', 'الماني', 'برلين', 'ميونخ', 'فرانكفورت', 'هامبورغ', 'germany', 'deutschland', 'berlin', 'munich', 'frankfurt'],
  'saudi-arabia': ['السعودية', 'السعوديه', 'سعودي', 'سعوديه', 'المملكة العربية السعودية', 'الرياض', 'جدة', 'مكة', 'المدينة', 'العلا', 'ksa', 'saudi', 'saudi arabia', 'riyadh', 'jeddah', 'makkah'],
  'south-korea': ['كوريا', 'كوريا الجنوبية', 'كوري', 'سيول', 'سيئول', 'بوسان', 'korea', 'south korea', 'seoul', 'busan', 'incheon'],
  'uae': ['الامارات', 'الإمارات', 'اماراتي', 'إماراتي', 'دبي', 'ابوظبي', 'أبوظبي', 'الشارقة', 'uae', 'emirates', 'dubai', 'abu dhabi', 'sharjah'],
  'egypt': ['مصر', 'مصري', 'مصريه', 'القاهرة', 'الإسكندرية', 'الاسكندرية', 'شرم الشيخ', 'egypt', 'cairo', 'alexandria', 'giza'],
  'morocco': ['المغرب', 'مغربي', 'مراكش', 'الرباط', 'الدار البيضاء', 'كازابلانكا', 'طنجة', 'فاس', 'morocco', 'marrakech', 'rabat', 'casablanca', 'tangier'],
  'italy': ['ايطاليا', 'إيطاليا', 'ايطالي', 'روما', 'ميلانو', 'فلورنسا', 'البندقية', 'فينيسيا', 'italy', 'rome', 'milan', 'florence', 'venice'],
  'spain': ['اسبانيا', 'إسبانيا', 'اسباني', 'مدريد', 'برشلونة', 'بلنسية', 'اشبيلية', 'إشبيلية', 'spain', 'madrid', 'barcelona', 'valencia', 'seville'],
  'malaysia': ['ماليزيا', 'ماليزي', 'كوالالمبور', 'بينانج', 'سيلانجور', 'malaysia', 'kuala lumpur', 'penang'],
};

function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove tashkeel
    .trim();
}

export function findCountry(query?: string): CountryInfo | undefined {
  if (!query) return undefined;
  const rawQ = query.toLowerCase().trim();
  const normQ = normalizeArabic(query);

  // 1. Direct ID match
  const directId = COUNTRIES.find((c) => c.id === rawQ);
  if (directId) return directId;

  // 2. Check aliases map
  for (const [countryId, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      const normAlias = normalizeArabic(alias);
      if (rawQ.includes(alias.toLowerCase()) || normQ.includes(normAlias) || normAlias.includes(normQ)) {
        const found = COUNTRIES.find((c) => c.id === countryId);
        if (found) return found;
      }
    }
  }

  // 3. Check country names and famous cities
  return COUNTRIES.find((c) => {
    const normNameAr = normalizeArabic(c.nameAr);
    const normCapital = normalizeArabic(c.capitalAr);
    const nameEn = c.name.toLowerCase();
    const capEn = c.capital.toLowerCase();

    return (
      nameEn.includes(rawQ) ||
      rawQ.includes(nameEn) ||
      normNameAr.includes(normQ) ||
      normQ.includes(normNameAr) ||
      capEn.includes(rawQ) ||
      rawQ.includes(capEn) ||
      normCapital.includes(normQ) ||
      normQ.includes(normCapital) ||
      c.famousCities.some((city) => {
        const normCity = normalizeArabic(city.nameAr);
        const cityEn = city.name.toLowerCase();
        return cityEn.includes(rawQ) || rawQ.includes(cityEn) || normCity.includes(normQ) || normQ.includes(normCity);
      })
    );
  });
}

