export interface OfficialPortalResource {
  name: string;
  nameAr: string;
  url: string;
  description: string;
  descriptionAr: string;
  category: 'visa' | 'origin_government' | 'customs' | 'tourism' | 'transport' | 'health';
}

/**
 * Returns exact official government portals for the Origin/Departure country
 */
export function getOriginTravelPortals(originCodeOrName: string): OfficialPortalResource[] {
  const code = (originCodeOrName || 'SA').toUpperCase().trim();
  const nameLower = (originCodeOrName || '').toLowerCase();

  // 1. Saudi Arabia
  if (code === 'SA' || nameLower.includes('saudi') || nameLower.includes('سعودي')) {
    return [
      {
        name: 'Ministry of Foreign Affairs (Citizen Care Abroad)',
        nameAr: 'تسجيل المواطنين في الخارج (وزارة الخارجية)',
        url: 'https://registration.mofa.gov.sa',
        description: 'Official portal to register citizens abroad and connect directly with Saudi embassies',
        descriptionAr: 'البوابة الرسمية لتسجيل المواطنين بالخارج وربطهم المباشر بالسفارات وقنوات الطوارئ',
        category: 'origin_government',
      },
      {
        name: 'Absher Platform (Passport & Travel Documents)',
        nameAr: 'منصة أبشر (إجراءات الجوازات ووثائق السفر)',
        url: 'https://www.absher.sa',
        description: 'Verify passport validity, national IDs, and exit/entry permits',
        descriptionAr: 'التحقق من سريان الجواز وتصاريح السفر الرسمية لجميع أفراد الأسرة',
        category: 'origin_government',
      },
      {
        name: 'ZATCA (Zakat, Tax and Customs Authority)',
        nameAr: 'هيئة الزكاة والضريبة والجمارك (زاتكا)',
        url: 'https://zatca.gov.sa',
        description: 'Customs regulations for departures, passenger declaration & currency rules',
        descriptionAr: 'لوائح الإفصاح الجمركي للمغادرين والأمتعة المسموحة وتداول النقد',
        category: 'customs',
      },
    ];
  }

  // 2. United Arab Emirates
  if (code === 'AE' || nameLower.includes('uae') || nameLower.includes('emirates') || nameLower.includes('إمارات')) {
    return [
      {
        name: 'Twajudi Service (Ministry of Foreign Affairs UAE)',
        nameAr: 'خدمة تواجدي (وزارة الخارجية والتعاون الدولي)',
        url: 'https://www.mofa.gov.ae/en/Services/Twajudi',
        description: 'Emergency registration and consular communication service for UAE citizens abroad',
        descriptionAr: 'الخدمة الرسمية لتسجيل مواطني دولة الإمارات أثناء السفر ورعايتهم في الطوارئ',
        category: 'origin_government',
      },
      {
        name: 'Federal Authority for Identity & Citizenship (ICP)',
        nameAr: 'الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ',
        url: 'https://icp.gov.ae',
        description: 'Passport validity, smart travel services, and citizen credentials',
        descriptionAr: 'الخدمات الذكية للجوازات، تصاريح السفر، والوثائق الوطنية للمواطنين',
        category: 'origin_government',
      },
    ];
  }

  // 3. Kuwait
  if (code === 'KW' || nameLower.includes('kuwait') || nameLower.includes('كويت')) {
    return [
      {
        name: 'Ministry of Foreign Affairs Kuwait',
        nameAr: 'وزارة الخارجية الكويتية (رعاية المواطنين بالخارج)',
        url: 'https://www.mofa.gov.kw',
        description: 'Official citizen registration abroad, emergency hotlines and diplomatic missions',
        descriptionAr: 'البوابة الرسمية لتسجيل المسافرين الكويتيين والتواصل الدبلوماسي العاجل',
        category: 'origin_government',
      },
      {
        name: 'Ministry of Interior Kuwait (Passports & Travel)',
        nameAr: 'وزارة الداخلية الكويتية (شؤون الجوازات وتراخيص السفر)',
        url: 'https://www.moi.gov.kw',
        description: 'Passport renewals, travel bans verification, and citizen documentation',
        descriptionAr: 'التأكد من جاهزية وثائق السفر وصلاحية الجواز وتراخيص المغادرة',
        category: 'origin_government',
      },
    ];
  }

  // 4. Qatar
  if (code === 'QA' || nameLower.includes('qatar') || nameLower.includes('قطر')) {
    return [
      {
        name: 'Ministry of Foreign Affairs Qatar',
        nameAr: 'وزارة الخارجية القطرية (المواطنون في الخارج)',
        url: 'https://www.mofa.gov.qa',
        description: 'Consular assistance, citizen travel registration, and 24/7 hotline',
        descriptionAr: 'خدمات رعاية المواطنين القطريين بالخارج وتنسيق البعثات الدبلوماسية',
        category: 'origin_government',
      },
      {
        name: 'Ministry of Interior Qatar (Metrash2 Portal)',
        nameAr: 'وزارة الداخلية القطرية (بوابة مطراش2 والجوازات)',
        url: 'https://portal.moi.gov.qa',
        description: 'Digital travel permits, QID renewals, and electronic passport services',
        descriptionAr: 'الخدمات الإلكترونية للجوازات ووثائق السفر الرسمية للمواطنين',
        category: 'origin_government',
      },
    ];
  }

  // 5. Oman
  if (code === 'OM' || nameLower.includes('oman') || nameLower.includes('عمان')) {
    return [
      {
        name: 'Foreign Ministry of Oman',
        nameAr: 'وزارة الخارجية العمانية (دليل المسافر العماني)',
        url: 'https://fm.gov.om',
        description: 'Travel advisories, embassy registrations, and emergency assistance',
        descriptionAr: 'التسجيل الرسمي للمسافرين العمانيين وإرشادات السفر والسفارات المعتمدة',
        category: 'origin_government',
      },
      {
        name: 'Royal Oman Police (Passports & Civil Status)',
        nameAr: 'شرطة عمان السلطانية (الجوازات والإقامة)',
        url: 'https://www.rop.gov.om',
        description: 'Passport validity checks and border crossing regulations',
        descriptionAr: 'خدمات الجوازات الرسمية وإجراءات العبور والمنافذ',
        category: 'origin_government',
      },
    ];
  }

  // 6. Bahrain
  if (code === 'BH' || nameLower.includes('bahrain') || nameLower.includes('بحرين')) {
    return [
      {
        name: 'Ministry of Foreign Affairs Bahrain (Wejhanak Service)',
        nameAr: 'وزارة الخارجية البحرينية (خدمة وجهتك)',
        url: 'https://www.mofa.gov.bh',
        description: 'Official citizen travel registration and international emergency response',
        descriptionAr: 'المنصة الرسمية لتسجيل المواطنين بالخارج والمتابعة الدبلوماسية الفورية',
        category: 'origin_government',
      },
    ];
  }

  // 7. Egypt
  if (code === 'EG' || nameLower.includes('egypt') || nameLower.includes('مصر')) {
    return [
      {
        name: 'Ministry of Foreign Affairs Egypt',
        nameAr: 'وزارة الخارجية المصرية (رعاية المغتربين والمسافرين)',
        url: 'https://www.mofa.gov.eg',
        description: 'Consular missions, legal attestations, and citizen overseas protection',
        descriptionAr: 'البوابة الرسمية للبعثات الدبلوماسية ورعاية المواطنين المصريين في الخارج',
        category: 'origin_government',
      },
      {
        name: 'Ministry of Interior (Passports & Immigration Authority)',
        nameAr: 'الإدارة العامة للجوازات والهجرة والجنسية',
        url: 'https://enationality.moi.gov.eg',
        description: 'Passport renewals, departure exit permits and official clearances',
        descriptionAr: 'إصدار وتجديد الجوازات الرسمية وتصاريح السفر القانونية للمواطنين',
        category: 'origin_government',
      },
    ];
  }

  // 8. United Kingdom
  if (code === 'GB' || code === 'UK' || nameLower.includes('kingdom') || nameLower.includes('britain') || nameLower.includes('بريطانيا')) {
    return [
      {
        name: 'Foreign, Commonwealth & Development Office (FCDO)',
        nameAr: 'وزارة الخارجية البريطانية (FCDO Travel Advice)',
        url: 'https://www.gov.uk/foreign-travel-advice',
        description: 'Official British citizen travel advisories, consular support, and crisis registration',
        descriptionAr: 'الإرشادات الرسمية للمواطنين البريطانيين وخدمات الطوارئ القنصلية بالخارج',
        category: 'origin_government',
      },
      {
        name: 'HM Passport Office UK',
        nameAr: 'مكتب الجوازات البريطاني الرسمي',
        url: 'https://www.gov.uk/browse/abroad/passports',
        description: 'Official British passport renewals and international validity rules',
        descriptionAr: 'صلاحية الجوازات البريطانية وإجراءات التجديد والسفر الدولي',
        category: 'origin_government',
      },
    ];
  }

  // 9. United States
  if (code === 'US' || code === 'USA' || nameLower.includes('states') || nameLower.includes('america') || nameLower.includes('أمريكا')) {
    return [
      {
        name: 'Smart Traveler Enrollment Program (STEP)',
        nameAr: 'برنامج تسجيل المسافر الذكي (STEP - وزارة الخارجية الأمريكية)',
        url: 'https://step.state.gov',
        description: 'Official U.S. State Department emergency citizen enrollment and embassy alerts',
        descriptionAr: 'التسجيل الرسمي لمواطني الولايات المتحدة لدى السفارات واستلام تنبيهات الأمان',
        category: 'origin_government',
      },
      {
        name: 'U.S. Department of State Travel',
        nameAr: 'بوابة السفر بوزارة الخارجية الأمريكية',
        url: 'https://travel.state.gov',
        description: 'Passport validity, international travel warnings, and consular assistance',
        descriptionAr: 'المتطلبات الرسمية للجوازات والتحذيرات الدبلوماسية ورعاية المواطنين',
        category: 'origin_government',
      },
    ];
  }

  // 10. France
  if (code === 'FR' || nameLower.includes('france') || nameLower.includes('فرنسا')) {
    return [
      {
        name: 'Fil d’Ariane (Ministère de l’Europe et des Affaires étrangères)',
        nameAr: 'خدمة خيط أريان (وزارة الشؤون الخارجية الفرنسية)',
        url: 'https://pastel.diplomatie.gouv.fr/fildariane/',
        description: 'Official French citizen overseas registration and crisis management',
        descriptionAr: 'البوابة الرسمية لتسجيل المواطنين الفرنسيين بالخارج وحمايتهم في الطوارئ',
        category: 'origin_government',
      },
    ];
  }

  // 11. Germany
  if (code === 'DE' || nameLower.includes('germany') || nameLower.includes('ألمانيا')) {
    return [
      {
        name: 'ELEFAND (Auswärtiges Amt Krisenvorsorgeliste)',
        nameAr: 'نظام إدارة الأزمات وقائمة المسافرين (الخارجية الألمانية)',
        url: 'https://krisenvorsorgeliste.diplo.de',
        description: 'Official German citizen overseas emergency registration system',
        descriptionAr: 'التسجيل الرسمي لمواطني ألمانيا لدى السفارات والقنصليات أثناء السفر',
        category: 'origin_government',
      },
    ];
  }

  // Global Default / Fallback
  return [
    {
      name: `Ministry of Foreign Affairs (${originCodeOrName})`,
      nameAr: `وزارة الخارجية ورعاية المواطنين بالخارج (${originCodeOrName})`,
      url: 'https://registration.mofa.gov.sa',
      description: 'Official citizen overseas registration, embassy contacts and travel protection',
      descriptionAr: 'البوابة الرسمية لتسجيل المسافرين بالخارج وتنسيق المساعدة القنصلية العاجلة',
      category: 'origin_government',
    },
  ];
}

/**
 * Returns exact official direct landing portals for the Destination country
 */
export function getDestinationOfficialPortals(destinationCodeOrName: string, cityName?: string): OfficialPortalResource[] {
  const norm = (destinationCodeOrName || '').toLowerCase().trim();

  // Czech Republic (التشيك)
  if (norm.includes('czech') || norm.includes('تشيك') || norm.includes('prague') || norm.includes('براغ') || norm.includes('karlovy') || norm.includes('كارلوفي')) {
    return [
      {
        name: 'Ministry of Foreign Affairs of the Czech Republic (Schengen Visas)',
        nameAr: 'وزارة الخارجية التشيكية (بوابة تأشيرات شنغن الرسمية)',
        url: 'https://www.mzv.cz/jnp/en/information_for_aliens/index.html',
        description: 'Official entry requirements, Schengen visa applications, and consular procedures',
        descriptionAr: 'البوابة الرسمية لمتطلبات تأشيرة شنغن وتصاريح الإقامة والدخول لجمهورية التشيك',
        category: 'visa',
      },
      {
        name: 'CzechTourism Official Travel & Spa Portal',
        nameAr: 'الهيئة القومية للسياحة والاستشفاء في التشيك (CzechTourism)',
        url: 'https://www.visitczechia.com',
        description: 'Official destination guide, thermal spa resorts in Karlovy Vary & cultural maps',
        descriptionAr: 'الدليل الرسمي للمنتجعات العلاجية الطبيعية في كارلوفي فاري ومصحات الاستشفاء',
        category: 'tourism',
      },
      {
        name: 'Customs Administration of the Czech Republic (Celní správa)',
        nameAr: 'الإدارة الجمركية التشيكية الرسمية (الإفصاح والأدوية)',
        url: 'https://www.celnisprava.cz/en/',
        description: 'Official customs regulations, duty-free limits and medication importation rules',
        descriptionAr: 'اللوائح الرسمية للجمارك، الإفصاح عن الأدوية الشخصية والحدود المسموحة',
        category: 'customs',
      },
      {
        name: 'Prague Integrated Transport (PID / DPP)',
        nameAr: 'شبكة مواصلات براغ الرسمية والمترو والقطارات',
        url: 'https://www.dpp.cz/en',
        description: 'Official airport express bus, metro passes, tram maps, and train schedules',
        descriptionAr: 'مواعيد حافلات المطار وقطارات الضواحي وتذاكر المترو الرسمية',
        category: 'transport',
      },
    ];
  }

  // United Kingdom (بريطانيا)
  if (norm.includes('united kingdom') || norm.includes('uk') || norm.includes('britain') || norm.includes('england') || norm.includes('بريطانيا') || norm.includes('لندن') || norm.includes('london')) {
    return [
      {
        name: 'UK Visas and Immigration (GOV.UK)',
        nameAr: 'بوابة التأشيرات والهجرة البريطانية الرسمية (GOV.UK)',
        url: 'https://www.gov.uk/browse/visas-immigration',
        description: 'Official UK Standard Visitor Visa, Electronic Travel Authorisation (ETA), and entry checks',
        descriptionAr: 'المنصة الرسمية المعتمدة للتقديم على التأشيرة البريطانية وتصريح السفر الإلكتروني ETA',
        category: 'visa',
      },
      {
        name: 'VisitBritain Official Tourism Board',
        nameAr: 'مجلس السياحة البريطاني الرسمي (VisitBritain)',
        url: 'https://www.visitbritain.com',
        description: 'Official visitor heritage passes, regional rail cards, and city cultural itineraries',
        descriptionAr: 'الدليل السياحي المعتمد وتذاكر المعالم التراثية والقطارات الإقليمية',
        category: 'tourism',
      },
      {
        name: 'HM Revenue & Customs (HMRC Duty Free & Allowances)',
        nameAr: 'هيئة الإيرادات والجمارك البريطانية الرسمية (HMRC)',
        url: 'https://www.gov.uk/duty-free-goods',
        description: 'Official rules on goods brought into the UK, medication declarations and allowances',
        descriptionAr: 'لوائح الجمارك البريطانية والإفصاح عن الأمتعة والأدوية المسموحة',
        category: 'customs',
      },
      {
        name: 'Transport for London (TfL)',
        nameAr: 'هيئة النقل والمواصلات في لندن (TfL)',
        url: 'https://tfl.gov.uk',
        description: 'Live tube maps, Elizabeth line schedules, contactless payment fares, and buses',
        descriptionAr: 'خرائط شبكة المترو والقطارات السريعة وتفعيل بطاقات الدفع اللاتلامسي',
        category: 'transport',
      },
    ];
  }

  // United States (الولايات المتحدة)
  if (norm.includes('united states') || norm.includes('usa') || norm.includes('us') || norm.includes('america') || norm.includes('أمريكا') || norm.includes('orlando') || norm.includes('أورلاندو')) {
    return [
      {
        name: 'U.S. Customs and Border Protection (ESTA / Visa Portal)',
        nameAr: 'نظام تصاريح السفر الإلكتروني والتأشيرات الأمريكية (ESTA / CBP)',
        url: 'https://esta.cbp.dhs.gov',
        description: 'Official online application for Electronic System for Travel Authorization (ESTA) and Visa checks',
        descriptionAr: 'البوابة الفيدرالية الرسمية لإصدار تصاريح السفر ESTA وإجراءات الدخول للولايات المتحدة',
        category: 'visa',
      },
      {
        name: 'Visit The USA (Official Travel & Theme Parks Board)',
        nameAr: 'الهيئة القومية للسياحة في الولايات المتحدة (Visit The USA)',
        url: 'https://www.visittheusa.com',
        description: 'Official destination guide for Florida theme parks, national parks and cities',
        descriptionAr: 'الدليل الرسمي للوجهات ومدن الملاهي الكبرى والحدائق الوطنية',
        category: 'tourism',
      },
      {
        name: 'U.S. Customs & Border Protection (Passenger Declarations)',
        nameAr: 'الجمارك وحماية الحدود الأمريكية (لوائح الإفصاح والأدوية)',
        url: 'https://www.cbp.gov/travel/clearing-cbt',
        description: 'Official customs declaration requirements, currency limits and food/medication rules',
        descriptionAr: 'لوائح الجمارك الفيدرالية وإرشادات الأدوية المصروفة والإفصاح المالي',
        category: 'customs',
      },
    ];
  }

  // Japan (اليابان)
  if (norm.includes('japan') || norm.includes('اليابان') || norm.includes('tokyo') || norm.includes('طوكيو')) {
    return [
      {
        name: 'Visit Japan Web (Official Digital Immigration & Customs)',
        nameAr: 'بوابة زيارة اليابان الرقمية الرسمية (Visit Japan Web)',
        url: 'https://vjw-lp.digital.go.jp/en/',
        description: 'Official immigration fast-track, customs declaration QR codes, and tax-free shopping',
        descriptionAr: 'المنصة الرقمية الرسمية لإنهاء إجراءات الجوازات والجمارك واسترداد الضرائب بالباركود',
        category: 'visa',
      },
      {
        name: 'Japan National Tourism Organization (JNTO)',
        nameAr: 'الهيئة القومية للسياحة اليابانية (JNTO)',
        url: 'https://www.japan.travel/en/',
        description: 'Official transit guides, seasonal festivals, emergency hospital locators, and Halal maps',
        descriptionAr: 'الدليل الرسمي للثقافة والمراكز الطبية المعتمدة ومطاعم الحلال وشبكات القطارات',
        category: 'tourism',
      },
      {
        name: 'East Japan Railway Company (JR-EAST)',
        nameAr: 'شركة سكك حديد شرق اليابان الرسمية (JR Pass & Suica)',
        url: 'https://www.jreast.co.jp/e/',
        description: 'Official Shinkansen bullet train reservations, Suica smart cards, and airport express',
        descriptionAr: 'حجوزات قطار الطلقة شينكانسن وبطاقات سويكا الذكية وقطار ناريتا إكسبريس',
        category: 'transport',
      },
    ];
  }

  // Switzerland (سويسرا)
  if (norm.includes('switzerland') || norm.includes('سويسرا') || norm.includes('swiss') || norm.includes('interlaken') || norm.includes('إنترلاكن')) {
    return [
      {
        name: 'State Secretariat for Migration (SEM Switzerland - Visas)',
        nameAr: 'أمانة الدولة السويسرية للهجرة (تأشيرات الدخول الرسمية)',
        url: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
        description: 'Official Swiss and Schengen entry criteria, visa requirements, and medical entry forms',
        descriptionAr: 'البوابة الاتحادية الرسمية لمتطلبات تأشيرة شنغن وتصاريح العلاج والاستشفاء في سويسرا',
        category: 'visa',
      },
      {
        name: 'Switzerland Tourism Official Portal (MySwitzerland)',
        nameAr: 'هيئة السياحة السويسرية الرسمية (MySwitzerland)',
        url: 'https://www.myswitzerland.com',
        description: 'Official alpine guides, Grand Resort Bad Ragaz wellness retreats, and scenic lake tours',
        descriptionAr: 'الدليل الرسمي لقمم جبال الألب والمنتجعات الصحية وبحيرات إنترلاكن ولوزيرن',
        category: 'tourism',
      },
      {
        name: 'Swiss Federal Railways (SBB CFF FFS)',
        nameAr: 'السكك الحديدية الفيدرالية السويسرية (SBB)',
        url: 'https://www.sbb.ch/en',
        description: 'Official Swiss Travel Pass, panoramic mountain trains (GoldenPass), and timetable app',
        descriptionAr: 'حجوزات بطاقة السفر السويسرية والقطارات البانورامية والرحلات الجبلية',
        category: 'transport',
      },
    ];
  }

  // Malaysia (ماليزيا)
  if (norm.includes('malaysia') || norm.includes('ماليزيا') || norm.includes('kuala lumpur') || norm.includes('كوالالمبور')) {
    return [
      {
        name: 'Malaysia Digital Arrival Card (MDAC / Immigration)',
        nameAr: 'بطاقة الوصول الرقمية الماليزية الرسمية (MDAC)',
        url: 'https://imigresen-online.imi.gov.my',
        description: 'Official online arrival declaration and eVisa processing portal',
        descriptionAr: 'البوابة الرسمية لإصدار بطاقة الوصول الرقمية MDAC والتأشيرة الإلكترونية',
        category: 'visa',
      },
      {
        name: 'Tourism Malaysia Official Portal',
        nameAr: 'هيئة السياحة الماليزية الرسمية',
        url: 'https://www.malaysia.travel',
        description: 'Official guide to culture, shopping, nature sanctuaries and certified Halal dining',
        descriptionAr: 'الدليل الرسمي للوجهات السياحية والتسوق والمطاعم الحلال المعتمدة',
        category: 'tourism',
      },
    ];
  }

  // Singapore (سنغافورة)
  if (norm.includes('singapore') || norm.includes('سنغافورة') || norm.includes('sentosa')) {
    return [
      {
        name: 'Immigration & Checkpoints Authority (SG Arrival Card)',
        nameAr: 'بطاقة الوصول الإلكترونية السنغافورية الرسمية (SG Arrival Card)',
        url: 'https://eservices.ica.gov.sg/sgarrivalcard/',
        description: 'Official digital arrival and electronic health declaration portal',
        descriptionAr: 'البوابة الحكومية الرسمية لتقديم إقرار الدخول الرقمي قبل السفر لسنغافورة',
        category: 'visa',
      },
      {
        name: 'Singapore Tourism Board (Visit Singapore)',
        nameAr: 'مجلس السياحة السنغافوري الرسمي (Visit Singapore)',
        url: 'https://www.visitsingapore.com',
        description: 'Official guide for Sentosa Island, Gardens by the Bay, and transport maps',
        descriptionAr: 'الدليل الرسمي لجزيرة سنتوسا الترفيهية ومحميات حدائق الخليج والمواصلات',
        category: 'tourism',
      },
    ];
  }

  // Turkey (تركيا)
  if (norm.includes('turkey') || norm.includes('تركيا') || norm.includes('istanbul') || norm.includes('إسطنبول')) {
    return [
      {
        name: 'Electronic Visa Application System (Republic of Türkiye)',
        nameAr: 'بوابة التأشيرة الإلكترونية الرسمية للجمهورية التركية',
        url: 'https://www.evisa.gov.tr',
        description: 'Official Ministry of Foreign Affairs eVisa processing portal',
        descriptionAr: 'المنصة الرسمية المعتمدة لوزارة الخارجية التركية لاستخراج التأشيرات الإلكترونية',
        category: 'visa',
      },
      {
        name: 'Go Türkiye Official Tourism Portal',
        nameAr: 'البوابة الرسمية للسياحة والثقافة في تركيا (Go Türkiye)',
        url: 'https://goturkiye.com',
        description: 'Official historical monuments, Bosphorus experiences, and medical health tourism directory',
        descriptionAr: 'الدليل الرسمي للآثار والمتاحف التاريخية وجولات البوسفور والمراكز الصحية',
        category: 'tourism',
      },
    ];
  }

  // France (فرنسا)
  if (norm.includes('france') || norm.includes('فرنسا') || norm.includes('paris') || norm.includes('باريس') || norm.includes('nice') || norm.includes('نيس')) {
    return [
      {
        name: 'France-Visas (Official French Visa Portal)',
        nameAr: 'بوابة التأشيرات الفرنسية الرسمية (France-Visas)',
        url: 'https://france-visas.gouv.fr',
        description: 'Official Schengen visa applications, documentation requirements, and tracking',
        descriptionAr: 'البوابة الحكومية الرسمية لتقديم ومتابعة طلبات تأشيرة شنغن لفرنسا',
        category: 'visa',
      },
      {
        name: 'Explore France Official Tourism Agency',
        nameAr: 'الوكالة الرسمية لتنمية السياحة في فرنسا (Explore France)',
        url: 'https://www.france.fr/en',
        description: 'Official cultural itineraries, French Riviera seaside guides, and museum passes',
        descriptionAr: 'الدليل الرسمي للمتاحف وتذاكر المعالم وشواطئ الريفييرا الفرنسية',
        category: 'tourism',
      },
    ];
  }

  // Italy (إيطاليا)
  if (norm.includes('italy') || norm.includes('إيطاليا') || norm.includes('rome') || norm.includes('روما') || norm.includes('florence') || norm.includes('فلورنسا')) {
    return [
      {
        name: 'Il Visto per l’Italia (Ministry of Foreign Affairs Italy)',
        nameAr: 'البوابة الرسمية لتأشيرات إيطاليا (وزارة الشؤون الخارجية الإيطالية)',
        url: 'https://vistoperitalia.esteri.it/home/en',
        description: 'Official visa eligibility wizard, Schengen documentation, and embassy forms',
        descriptionAr: 'البوابة الرسمية للتحقق من متطلبات التأشيرة وتقديم طلبات الدخول لإيطاليا',
        category: 'visa',
      },
      {
        name: 'Italia.it (Official Italian National Tourism Board)',
        nameAr: 'الهيئة القومية للسياحة الإيطالية (Italia.it)',
        url: 'https://www.italia.it/en',
        description: 'Official UNESCO sites, Lake Como scenic routes, and Tuscan wellness guides',
        descriptionAr: 'الدليل الرسمي لمواقع التراث العالمي وبحيرة كومو ومصحات الاستجمام في توسكانا',
        category: 'tourism',
      },
    ];
  }

  // Generic / Default Destination Official Portal
  return [
    {
      name: `Official Immigration & Visa Authority (${destinationCodeOrName})`,
      nameAr: `الهيئة الرسمية للهجرة والتأشيرات (${destinationCodeOrName})`,
      url: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa_en',
      description: 'Official immigration rules, entry visas, and border requirements',
      descriptionAr: 'المتطلبات الرسمية للتأشيرات وتصاريح الدخول والإقامة المعتمدة',
      category: 'visa',
    },
    {
      name: `National Tourism & Heritage Board (${destinationCodeOrName})`,
      nameAr: `الهيئة الرسمية للسياحة والآثار (${destinationCodeOrName})`,
      url: 'https://www.visitczechia.com',
      description: 'Official cultural guides, museum passes, and regional routes',
      descriptionAr: 'الدليل الرسمي للمتاحف والمعالم التراثية والأنشطة السياحية المعتمدة',
      category: 'tourism',
    },
  ];
}
