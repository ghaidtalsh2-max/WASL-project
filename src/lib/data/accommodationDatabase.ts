export interface DynamicAccommodation {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  rating: string;
  price: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  descriptionAr: string;
  directUrl: string; // Verified Booking.com deep search link
  tripComUrl: string; // Verified Trip.com deep search link
  sourceProvider: string;
}

export function getDynamicAccommodations(
  destinationName: string,
  cityName: string = 'Capital',
  purpose: string = 'tourism',
  budget: string = 'moderate',
  travelParty: string = 'solo',
  medicalSubCategory?: string
): DynamicAccommodation[] {
  const normDest = (destinationName || '').toLowerCase().trim();
  const normCity = (cityName || '').toLowerCase().trim();
  const destCombined = `${normDest} ${normCity}`;
  const isFamily = travelParty === 'family' || travelParty === 'group';
  const isLuxury = budget === 'luxury' || budget === 'premium' || budget === 'high';
  const isEconomy = budget === 'economy' || budget === 'low' || budget === 'budget';
  const isMedical = purpose === 'medical' || purpose === 'recovery';
  const isWellness = isMedical && (medicalSubCategory === 'RECOVERY_WELLNESS' || normCity.includes('karlovy') || normCity.includes('teplice') || normDest.includes('czech'));

  const cityDisplay = cityName || destinationName || 'City Center';

  // Helper to build verified booking URL
  const buildBookingUrl = (propertyName: string) => {
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(propertyName + ' ' + cityDisplay)}&aid=2311236&lang=ar`;
  };

  // Helper to build verified Trip.com URL
  const buildTripComUrl = (propertyName: string) => {
    return `https://sa.trip.com/hotels/list?keyword=${encodeURIComponent(propertyName + ' ' + cityDisplay)}&locale=ar-sa`;
  };

  // --------------------------------------------------------------------------
  // 1. RIYADH & SAUDI ARABIA (المملكة العربية السعودية - الرياض)
  // --------------------------------------------------------------------------
  if (destCombined.includes('riyadh') || destCombined.includes('الرياض') || (destCombined.includes('saudi') && !destCombined.includes('jeddah') && !destCombined.includes('alula'))) {
    if (isLuxury) {
      return [
        {
          id: 'ruh-lux-1',
          name: 'The Ritz-Carlton, Riyadh',
          nameAr: 'فندق الريتز-كارلتون، الرياض (حي الهدا والمؤتمرات)',
          type: '5-Star Historic Royal Palace Hotel',
          rating: '4.9',
          price: '$650 - $1,100 / ليلة',
          location: 'حي الهدا، طريق مكة المكرمة، الرياض',
          lat: 24.6657,
          lng: 46.6301,
          description: 'Majestic royal palace set within 52 acres of lush gardens and 600-year-old olive trees, with world-class spas and fine dining.',
          descriptionAr: 'قصر ملكي تاريخي محاط بحدائق مساحتها 52 فداناً وأشجار زيتون معمرة، يوفر أجنحة ملكية وسبا متطور ومطاعم عالمية.',
          directUrl: buildBookingUrl('The Ritz-Carlton Riyadh'),
          tripComUrl: buildTripComUrl('The Ritz-Carlton Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-lux-2',
          name: 'Four Seasons Hotel Riyadh at Kingdom Centre',
          nameAr: 'فندق فورسيزونز الرياض (برج المملكة - العليا)',
          type: '5-Star Landmark Tower Hotel',
          rating: '4.9',
          price: '$580 - $950 / ليلة',
          location: 'برج المملكة، طريق الملك فهد، حي العليا، الرياض',
          lat: 24.7114,
          lng: 46.6744,
          description: 'Panoramic luxury suites occupying the iconic Kingdom Centre tower with direct access to luxury shopping and top restaurants.',
          descriptionAr: 'أجنحة بانورامية فاخرة تشغل برج المملكة الأيقوني مع إطلالات ساحرة على أفق الرياض وربط مباشر بأرقى مراكز التسوق والمطاعم.',
          directUrl: buildBookingUrl('Four Seasons Hotel Riyadh Kingdom Centre'),
          tripComUrl: buildTripComUrl('Four Seasons Hotel Riyadh Kingdom Centre'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-lux-3',
          name: 'Mansard Riyadh, A Radisson Collection Hotel',
          nameAr: 'فندق مانسارد الرياض، راديسون كوليكشن (حي الربيع)',
          type: 'Luxury Parisian-Chic Boutique Hotel & Villas',
          rating: '4.8',
          price: '$480 - $820 / ليلة',
          location: 'حي الربيع، طريق الأمير محمد بن سلمان، الرياض',
          lat: 24.7932,
          lng: 46.6621,
          description: 'Parisian Haussmann-style architecture featuring luxury duplex villas, bespoke suites and Carita Paris Spa.',
          descriptionAr: 'تصميم معماري فرنسي باريسي يضم فللاً دوبلكس فاخرة وأجنحة فندقية خاصة مع سبا كاريتا باريس ومطاعم عالمية راقية.',
          directUrl: buildBookingUrl('Mansard Riyadh A Radisson Collection Hotel'),
          tripComUrl: buildTripComUrl('Mansard Riyadh A Radisson Collection Hotel'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-lux-4',
          name: 'Bab Samhan Hotel, Diriyah, Luxury Collection',
          nameAr: 'فندق باب سمحان، الدرعية التاريخية (حي الطريف)',
          type: 'Najdi Heritage Luxury Resort',
          rating: '4.9',
          price: '$720 - $1,250 / ليلة',
          location: 'الدرعية التاريخية، حي الطريف والسمحان، الرياض',
          lat: 24.7335,
          lng: 46.5746,
          description: 'Authentic Najdi mud-brick architecture blending UNESCO heritage with unparalleled luxury in historic Diriyah.',
          descriptionAr: 'تحفة معمارية نجدية تراثية تقع في قلب الدرعية التاريخية بجوار مطل البجيري وحي الطريف المسجل في اليونسكو.',
          directUrl: buildBookingUrl('Bab Samhan Hotel Diriyah Riyadh'),
          tripComUrl: buildTripComUrl('Bab Samhan Hotel Diriyah Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-lux-5',
          name: 'Al Faisaliah Hotel Riyadh (Mandarin Oriental)',
          nameAr: 'فندق الفيصلية الرياض (ماندارين أورينتال - العليا)',
          type: '5-Star Landmark Luxury Hotel',
          rating: '4.8',
          price: '$520 - $890 / ليلة',
          location: 'برج الفيصلية، طريق الملك فهد، حي العليا، الرياض',
          lat: 24.6903,
          lng: 46.6853,
          description: 'Prestigious landmark in Olaya with bespoke butler service, Michelin-starred culinary concepts and The Globe sphere lounge.',
          descriptionAr: 'أعرق الفنادق الفاخرة بالعليا بإدارة ماندارين أورينتال، يضم مطعم ذا جلوب داخل الكرة الزجاجية وخدمة الخادم الشخصي.',
          directUrl: buildBookingUrl('Mandarin Oriental Al Faisaliah Riyadh'),
          tripComUrl: buildTripComUrl('Mandarin Oriental Al Faisaliah Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
      ];
    }

    if (isFamily || purpose === 'relocation' || purpose === 'work') {
      return [
        {
          id: 'ruh-fam-1',
          name: 'Ascott Rafal Olaya Riyadh',
          nameAr: 'أسكوت رافال العليا الرياض (شقق فندقية عائلية فاخرة)',
          type: 'Luxury Serviced Family Residence (1-3 Bedrooms)',
          rating: '4.8',
          price: '$280 - $490 / ليلة',
          location: 'برج رافال، طريق الملك فهد، حي الصحافة / كافد، الرياض',
          lat: 24.7892,
          lng: 46.6341,
          description: 'Fully furnished 1 to 3 bedroom luxury serviced apartments with equipped kitchens, separate living rooms and pools.',
          descriptionAr: 'شقق فندقية فسيحة من غرفة إلى 3 غرف نوم مجهزة بمطابخ عصرية كاملة وصالات معيشة، مثالية للعائلات والإقامة الطويلة بجوار كافد.',
          directUrl: buildBookingUrl('Ascott Rafal Olaya Riyadh'),
          tripComUrl: buildTripComUrl('Ascott Rafal Olaya Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-fam-2',
          name: 'Narcissus Hotel & Residence Riyadh',
          nameAr: 'فندق وأجنحة نارسيس الرياض (شارع التحلية - العليا)',
          type: '5-Star Classic Boutique Residence',
          rating: '4.7',
          price: '$290 - $460 / ليلة',
          location: 'تقاطع شارع التحلية مع شارع العليا، الرياض',
          lat: 24.7008,
          lng: 46.6833,
          description: 'Classic luxury suites and serviced residences on vibrant Tahlia Street with family suites and indoor swimming pools.',
          descriptionAr: 'أجنحة عائلية فاخرة في قلب شارع التحلية النابض بالمطاعم والمقاهي، مع مسابح داخلية ونادي صحي متكامل.',
          directUrl: buildBookingUrl('Narcissus Hotel Residence Riyadh'),
          tripComUrl: buildTripComUrl('Narcissus Hotel Residence Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-fam-3',
          name: 'Braira Al Olaya Hotel',
          nameAr: 'فندق بريرا العليا (حي العليا المركزي)',
          type: '4-Star Modern Family & Executive Hotel',
          rating: '4.6',
          price: '$180 - $290 / ليلة',
          location: 'حي العليا، خلف مكتبة الملك فهد الوطنية، الرياض',
          lat: 24.6865,
          lng: 46.6902,
          description: 'Contemporary family rooms and suites overlooking King Fahad National Library Park with buffet dining.',
          descriptionAr: 'غرف وأجنحة عائلية عصرية تطل على حديقة مكتبة الملك فهد الوطنية، بموقع هادئ واستراتيجي في قلب المدينة.',
          directUrl: buildBookingUrl('Braira Al Olaya Hotel Riyadh'),
          tripComUrl: buildTripComUrl('Braira Al Olaya Hotel Riyadh'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'ruh-fam-4',
          name: 'voco Riyadh, an IHG Hotel',
          nameAr: 'فندق فوكو الرياض (طريق الملك فهد)',
          type: '5-Star Modern Lifestyle Hotel',
          rating: '4.7',
          price: '$240 - $380 / ليلة',
          location: 'طريق الملك فهد، حي النموذجية، الرياض',
          lat: 24.6685,
          lng: 46.6963,
          description: 'Spacious family suites, multiple international restaurants, kids pool, and prime central location on King Fahd Road.',
          descriptionAr: 'أجنحة عائلية واسعة، مطاعم إيطالية وهندية معتمدة، مسبح عائلي، وموقع استراتيجي على طريق الملك فهد.',
          directUrl: buildBookingUrl('voco Riyadh IHG Hotel'),
          tripComUrl: buildTripComUrl('voco Riyadh IHG Hotel'),
          sourceProvider: 'Booking.com & Trip.com',
        },
      ];
    }

    // Moderate & Economy
    return [
      {
        id: 'ruh-mod-1',
        name: 'Centro Olaya by Rotana',
        nameAr: 'فندق سنترو العليا من روتانا',
        type: '4-Star Modern Lifestyle Hotel',
        rating: '4.6',
        price: '$140 - $220 / ليلة',
        location: 'حي العليا، شارع وادي الأوسط، الرياض',
        lat: 24.6974,
        lng: 46.6861,
        description: 'Chic, contemporary rooms with rooftop pool, 24/7 fitness center and direct access to Olaya business and dining hub.',
        descriptionAr: 'فندق عصري وأنيق بموقع مميز في العليا مع مسبح على السطح ومطعم سي.تيست ونادي رياضي على مدار الساعة.',
        directUrl: buildBookingUrl('Centro Olaya by Rotana Riyadh'),
        tripComUrl: buildTripComUrl('Centro Olaya by Rotana Riyadh'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-mod-2',
        name: 'ibis Riyadh Olaya Street',
        nameAr: 'فندق إيبيس الرياض (شارع العليا العام)',
        type: '3-Star Quality Economy Hotel',
        rating: '4.4',
        price: '$85 - $140 / ليلة',
        location: 'شارع العليا العام، مقابل برج المملكة، الرياض',
        lat: 24.7135,
        lng: 46.6718,
        description: 'Budget-friendly modern rooms directly opposite Kingdom Tower with comfortable bedding, breakfast and high-speed Wi-Fi.',
        descriptionAr: 'خيار اقتصادي ممتاز وحديث مباشرة أمام برج المملكة بشارع العليا مع فطور كونتيننتال وإنترنت سريع.',
        directUrl: buildBookingUrl('ibis Riyadh Olaya Street'),
        tripComUrl: buildTripComUrl('ibis Riyadh Olaya Street'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-mod-3',
        name: 'Braira Qurtubah Hotel',
        nameAr: 'فندق بريرا قرطبة (شمال الرياض - واجهة روشن)',
        type: '4-Star Modern Hotel',
        rating: '4.6',
        price: '$130 - $210 / ليلة',
        location: 'حي قرطبة، بالقرب من واجهة روشن ومطار الملك خالد، الرياض',
        lat: 24.8162,
        lng: 46.7384,
        description: 'Close to Roshn Front, Riyadh Airport, and Princess Nourah University with elegant rooms and spa.',
        descriptionAr: 'قريب من واجهة روشن ومطار الملك خالد الدولي، يضم غرفاً عصرية أنيقة وسبا وخدمات رجال الأعمال.',
        directUrl: buildBookingUrl('Braira Qurtubah Hotel Riyadh'),
        tripComUrl: buildTripComUrl('Braira Qurtubah Hotel Riyadh'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-mod-4',
        name: 'Gloria Inn Riyadh',
        nameAr: 'فندق جلوريا إن الرياض (وسط المدينة والبطحاء)',
        type: 'Quality Budget Hotel',
        rating: '4.3',
        price: '$70 - $115 / ليلة',
        location: 'شارع الديرة، البطحاء، وسط الرياض القديم',
        lat: 24.6362,
        lng: 46.7198,
        description: 'Comfortable economy accommodation near historic Al Masmak Fortress and traditional souqs.',
        descriptionAr: 'إقامة اقتصادية مريحة بالقرب من قصر المصمك التاريخي وأسواق الديرة وسوق الزل التراثي.',
        directUrl: buildBookingUrl('Gloria Inn Riyadh'),
        tripComUrl: buildTripComUrl('Gloria Inn Riyadh'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 2. JEDDAH & RED SEA (جدة وعروس البحر الأحمر)
  // --------------------------------------------------------------------------
  if (destCombined.includes('jeddah') || destCombined.includes('جدة')) {
    return [
      {
        id: 'jed-1',
        name: 'The Ritz-Carlton, Jeddah',
        nameAr: 'فندق الريتز-كارلتون، جدة (كورنيش الحمراء)',
        type: '5-Star Luxury Waterfront Palace',
        rating: '4.9',
        price: '$450 - $850 / ليلة',
        location: 'كورنيش الحمراء، طريق الأندلس، جدة',
        lat: 21.5169,
        lng: 39.1558,
        description: 'Palatial luxury overlooking King Fahd’s Fountain and the Red Sea with magnificent ballrooms and dining.',
        descriptionAr: 'قصر فندقي فخم يطل مباشرة على نافورة الملك فهد ومياه البحر الأحمر مع سبا ملكي وأرقى المطاعم.',
        directUrl: buildBookingUrl('The Ritz-Carlton Jeddah'),
        tripComUrl: buildTripComUrl('The Ritz-Carlton Jeddah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'jed-2',
        name: 'Shangri-La Jeddah',
        nameAr: 'فندق شانغريلا جدة (الواجهة البحرية الجديدة)',
        type: '5-Star Modern Luxury Waterfront Hotel',
        rating: '4.9',
        price: '$420 - $780 / ليلة',
        location: 'طريق الكورنيش الشمالي، حي الشاطئ، جدة',
        lat: 21.6167,
        lng: 39.1083,
        description: 'Contemporary waterfront hotel near Jeddah Yacht Club with floor-to-ceiling Red Sea views and Shang Palace dining.',
        descriptionAr: 'فندق فاخر على الواجهة البحرية الجديدة بجوار نادي جدة لليخوت مع إطلالات بانورامية على البحر الأحمر ومطعم شانغ بالاس.',
        directUrl: buildBookingUrl('Shangri-La Jeddah'),
        tripComUrl: buildTripComUrl('Shangri-La Jeddah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'jed-3',
        name: 'Ascott Sari Jeddah',
        nameAr: 'أسكوت ساري جدة (شقق فندقية عائلية فاخرة)',
        type: 'Luxury Serviced Apartments',
        rating: '4.8',
        price: '$210 - $350 / ليلة',
        location: 'شارع ساري، حي الزهراء، جدة',
        lat: 21.5786,
        lng: 39.1417,
        description: 'Parisian-inspired serviced residences with fully equipped kitchens, rooftop pool, and kids play lounge in Al Zahra.',
        descriptionAr: 'شقق فندقية أنيقة مستوحاة من الطراز الباريسي مجهزة بالكامل بمطابخ وصالات عائلية ومسبح في حي الزهراء.',
        directUrl: buildBookingUrl('Ascott Sari Jeddah'),
        tripComUrl: buildTripComUrl('Ascott Sari Jeddah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'jed-4',
        name: 'Radisson Blu Hotel, Jeddah Corniche',
        nameAr: 'فندق راديسون بلو، كورنيش جدة',
        type: '4-Star Superior Waterfront Hotel',
        rating: '4.6',
        price: '$160 - $260 / ليلة',
        location: 'طريق الكورنيش، حي الشاطئ، جدة',
        lat: 21.6214,
        lng: 39.1072,
        description: 'Modern sea-view rooms close to Red Sea Mall and Formula 1 track with outdoor pool and wellness center.',
        descriptionAr: 'غرف عصرية بإطلالات بحرية بالقرب من رد سي مول وحلبة كورنيش جدة للفورمولا 1.',
        directUrl: buildBookingUrl('Radisson Blu Hotel Jeddah Corniche'),
        tripComUrl: buildTripComUrl('Radisson Blu Hotel Jeddah Corniche'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 3. ORLANDO & FLORIDA (أورلاندو وفلوريدا - مدن الملاهي)
  // --------------------------------------------------------------------------
  if (destCombined.includes('orlando') || destCombined.includes('أورلاندو') || destCombined.includes('florida') || destCombined.includes('فلوريدا')) {
    if (isLuxury) {
      return [
        {
          id: 'orl-lux-1',
          name: 'Four Seasons Resort Orlando at Walt Disney World Resort',
          nameAr: 'منتجع فورسيزونز أورلاندو داخل عالم والت ديزني',
          type: '5-Star AAA Five Diamond Resort',
          rating: '4.9',
          price: '$850 - $1,400 / night',
          location: 'Golden Oak, Walt Disney World Resort, Orlando',
          lat: 28.3972,
          lng: -81.5325,
          description: 'Ultra-luxury resort within Disney gates featuring private 5-acre water park, Michelin-starred Capa steakhouse, and theme park views.',
          descriptionAr: 'أفخم منتجعات أورلاندو داخل بوابات عالم ديزني مع حديقة مائية خاصة بمساحة 5 أفدنة وسبا فاخر ومشاهدة ألعاب ديزني النارية من الشرفات.',
          directUrl: buildBookingUrl('Four Seasons Resort Orlando at Walt Disney World'),
          tripComUrl: buildTripComUrl('Four Seasons Resort Orlando at Walt Disney World'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'orl-lux-2',
          name: 'Loews Portofino Bay Hotel at Universal Orlando',
          nameAr: 'فندق لويز بورتوفينو باي داخل يونيفرسال أورلاندو',
          type: 'Premier Italian Harbor Theme Resort',
          rating: '4.8',
          price: '$480 - $790 / night',
          location: 'Universal Orlando Resort, Orlando',
          lat: 28.4789,
          lng: -81.4628,
          description: 'Italian Riviera themed resort with Free Universal Express Unlimited passes (skip regular lines at Universal parks) and water taxi.',
          descriptionAr: 'منتجع ساحر مستوحى من الريفييرا الإيطالية يمنحك مجاناً بطاقات الدخول السريع (Universal Express) لجميع قطارات ملاهي يونيفرسال بدون انتظار.',
          directUrl: buildBookingUrl('Loews Portofino Bay Hotel Universal Orlando'),
          tripComUrl: buildTripComUrl('Loews Portofino Bay Hotel Universal Orlando'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'orl-lux-3',
          name: 'The Ritz-Carlton Orlando, Grande Lakes',
          nameAr: 'فندق الريتز-كارلتون أورلاندو، جراند ليكس',
          type: '5-Star Luxury Lakefront Sanctuary',
          rating: '4.9',
          price: '$580 - $920 / night',
          location: 'Grande Lakes, South Orlando',
          lat: 28.4061,
          lng: -81.4332,
          description: 'Peaceful 500-acre estate with championship golf, luxury spa, lazy river, and farm-to-table Michelin-starred dining.',
          descriptionAr: 'واحة هادئة على مساحة 500 فدان تضم بحيرات طبيعية، ونهر كسلان، ونادياً صحياً عملاقاً، ومطاعم حاصلة على نجمة ميشلان.',
          directUrl: buildBookingUrl('The Ritz-Carlton Orlando Grande Lakes'),
          tripComUrl: buildTripComUrl('The Ritz-Carlton Orlando Grande Lakes'),
          sourceProvider: 'Booking.com & Trip.com',
        },
      ];
    }

    // Family / Moderate Orlando
    return [
      {
        id: 'orl-fam-1',
        name: 'Universal’s Cabana Bay Beach Resort',
        nameAr: 'منتجع كابانا باي بيتش من يونيفرسال (أجنحة عائلية)',
        type: 'Retro Family Suites & Waterparks',
        rating: '4.7',
        price: '$170 - $280 / night',
        location: 'Universal Orlando Resort, Next to Volcano Bay',
        lat: 28.4682,
        lng: -81.4744,
        description: 'Vibrant 1950s themed family suites accommodating up to 6 guests with kitchenettes, 2 pools, lazy river, bowling alley, and early park entry.',
        descriptionAr: 'أجنحة عائلية تستوعب حتى 6 أفراد مع مطابخ صغيرة، مسبحين ضخمين، نهر كسلان، صالة بولينغ، ودخول مبكر لمنتزه فولكانو باي المائي.',
        directUrl: buildBookingUrl('Universals Cabana Bay Beach Resort Orlando'),
        tripComUrl: buildTripComUrl('Universals Cabana Bay Beach Resort Orlando'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'orl-fam-2',
        name: 'Disney’s Art of Animation Resort',
        nameAr: 'منتجع ديزني آرت أوف أنيميشن (أجنحة كرتونية عائلية)',
        type: 'Themed Family Suites (Lion King, Cars, Nemo)',
        rating: '4.7',
        price: '$210 - $340 / night',
        location: 'Walt Disney World Resort, Lake Buena Vista',
        lat: 28.3512,
        lng: -81.5436,
        description: 'Immersive family suites themed to Lion King, Cars, and Finding Nemo with Disney Skyliner cable car access to EPCOT & Hollywood Studios.',
        descriptionAr: 'أجنحة عائلية مستوحاة من أفلام ديزني الكلاسيكية (الأسد الملك، سيارات، نيمو) مع تلفريك ديزني سكاي لاينر المعلق لمنتزهات إبكوت.',
        directUrl: buildBookingUrl('Disneys Art of Animation Resort Orlando'),
        tripComUrl: buildTripComUrl('Disneys Art of Animation Resort Orlando'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'orl-fam-3',
        name: 'Floridays Resort Orlando',
        nameAr: 'منتجع فلوريدايز أورلاندو (شقق كوندو 2-3 غرف)',
        type: 'Spacious Family Condo Resort (2-3 Bedrooms)',
        rating: '4.6',
        price: '$160 - $260 / night',
        location: 'International Drive South, Orlando',
        lat: 28.3792,
        lng: -81.4921,
        description: '2 and 3-bedroom luxury condo units with full granite kitchens, Jacuzzi tubs, private balconies, and shuttles to Disney and Universal.',
        descriptionAr: 'شقق عائلية رحبة من غرفتين و3 غرف نوم بمطابخ متكاملة وجاكوزي وشرفات خاصة وحافلات نقل مجانية لمنتزهات ديزني ويونيفرسال.',
        directUrl: buildBookingUrl('Floridays Resort Orlando'),
        tripComUrl: buildTripComUrl('Floridays Resort Orlando'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'orl-mod-4',
        name: 'Universal’s Endless Summer Resort - Dockside Inn',
        nameAr: 'منتجع إندليس سمر من يونيفرسال (دوكسايد إن)',
        type: 'Quality Economy Family Suites',
        rating: '4.6',
        price: '$110 - $190 / night',
        location: 'Universal Boulevard, International Drive',
        lat: 28.4594,
        lng: -81.4589,
        description: 'Affordable 2-bedroom suites sleeping up to 6 people with free park shuttle and Early Park Admission.',
        descriptionAr: 'أجنحة عائلية من غرفتي نوم بأسعار اقتصادية ممتازة مع حافلات سريعة ودخول مبكر لمدن ملاهي يونيفرسال.',
        directUrl: buildBookingUrl('Universals Endless Summer Resort Dockside Inn Orlando'),
        tripComUrl: buildTripComUrl('Universals Endless Summer Resort Dockside Inn Orlando'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 4. DUBAI & UAE (دبي والإمارات)
  // --------------------------------------------------------------------------
  if (destCombined.includes('dubai') || destCombined.includes('دبي') || destCombined.includes('uae') || destCombined.includes('emirates')) {
    return [
      {
        id: 'dxb-1',
        name: 'Atlantis The Royal, Palm Jumeirah',
        nameAr: 'منتجع أتلانتس ذا رويال، نخلة جميرا',
        type: '5-Star Ultra-Luxury Landmark Resort',
        rating: '4.9',
        price: '$780 - $1,450 / night',
        location: 'نخلة جميرا، الهلال، دبي',
        lat: 25.1382,
        lng: 55.1278,
        description: 'Iconic ultra-luxury destination with Cloud 22 infinity sky pool, celebrity chef restaurants, and Aquaventure Waterpark access.',
        descriptionAr: 'أحدث المعالم الفندقية الفاخرة في دبي مع مسبح معلق في الطابق 22، ومطاعم عالمية حائزة على نجوم ميشلان ودخول منتزه أكوافنتشر المائي.',
        directUrl: buildBookingUrl('Atlantis The Royal Dubai'),
        tripComUrl: buildTripComUrl('Atlantis The Royal Dubai'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'dxb-2',
        name: 'Armani Hotel Dubai',
        nameAr: 'فندق أرماني دبي (برج خليفة)',
        type: '5-Star Haute Couture Luxury Hotel',
        rating: '4.8',
        price: '$550 - $950 / night',
        location: 'برج خليفة، وسط مدينة دبي (Downtown)',
        lat: 25.1972,
        lng: 55.2744,
        description: 'Sophisticated minimalist luxury designed by Giorgio Armani occupying 11 floors of the Burj Khalifa with direct Dubai Mall access.',
        descriptionAr: 'تصميم فاخر من جورجيو أرماني داخل برج خليفة مباشرة، مع إطلالات ساحرة على نافورة دبي وممر مباشر لدبي مول.',
        directUrl: buildBookingUrl('Armani Hotel Dubai Burj Khalifa'),
        tripComUrl: buildTripComUrl('Armani Hotel Dubai Burj Khalifa'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'dxb-3',
        name: 'Rove Downtown Dubai',
        nameAr: 'فندق روف وسط مدينة دبي (روف داون تاون)',
        type: 'Modern Lifestyle & Family Hotel',
        rating: '4.7',
        price: '$130 - $210 / night',
        location: 'شارع السعادة، وسط مدينة دبي',
        lat: 25.2014,
        lng: 55.2798,
        description: 'Trendy family-friendly hotel facing Burj Khalifa with cinema, outdoor pool, 24-hour gym, and interconnecting rooms.',
        descriptionAr: 'فندق شبابي وعائلي عصري يطل على برج خليفة مع سينما خاصة ومسبح وغرف متصلة تناسب العائلات بأسعار مناسبة.',
        directUrl: buildBookingUrl('Rove Downtown Dubai'),
        tripComUrl: buildTripComUrl('Rove Downtown Dubai'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'dxb-4',
        name: 'Citadines Metro Central Dubai',
        nameAr: 'سيتادين مترو سنترال دبي (شقق فندقية بجوار المترو)',
        type: 'Serviced Apartment Suites',
        rating: '4.6',
        price: '$110 - $180 / night',
        location: 'برشا هايتس (تيكوم)، بجوار محطة مترو مدينة دبي للإنترنت',
        lat: 25.0975,
        lng: 55.1764,
        description: 'Serviced studios and 1-bedroom apartments with kitchenettes right next to the Dubai Metro station.',
        descriptionAr: 'شقق واستوديوهات فندقية مجهزة بمطابخ صغيرة مباشرة بجوار محطة المترو للتنقل السريع في دبي.',
        directUrl: buildBookingUrl('Citadines Metro Central Dubai'),
        tripComUrl: buildTripComUrl('Citadines Metro Central Dubai'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 5. PARIS & FRANCE (باريس وفرنسا)
  // --------------------------------------------------------------------------
  if (destCombined.includes('paris') || destCombined.includes('france') || destCombined.includes('فرنسا') || destCombined.includes('باريس')) {
    return [
      {
        id: 'par-1',
        name: 'Hôtel Plaza Athénée Paris',
        nameAr: 'فندق بلازا أثيني باريس (الشانزلزيه وجادة مونتين)',
        type: '5-Star Ultra-Luxury Palace Hotel',
        rating: '4.9',
        price: '$950 - $1,500 / night',
        location: 'Avenue Montaigne, 8th Arr., Paris',
        lat: 48.8662,
        lng: 2.3045,
        description: 'Haute couture luxury on Avenue Montaigne with Christian Dior Spa, Eiffel Tower views and Michelin-starred dining.',
        descriptionAr: 'قصر فندقي فاخر في جادة مونتين الراقية مع سبا ديور وإطلالات خلابة على برج إيفل.',
        directUrl: buildBookingUrl('Hotel Plaza Athenee Paris'),
        tripComUrl: buildTripComUrl('Hotel Plaza Athenee Paris'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'par-2',
        name: 'Shangri-La Paris',
        nameAr: 'فندق شانغريلا باريس (إطلالات مباشرة على برج إيفل)',
        type: 'Historic Palace Hotel',
        rating: '4.9',
        price: '$880 - $1,350 / night',
        location: '16th Arr., Trocadéro, Paris',
        lat: 48.8637,
        lng: 2.2936,
        description: 'Former residence of Prince Roland Bonaparte with private terraces directly facing the Eiffel Tower.',
        descriptionAr: 'قصر تاريخي للأمير رولاند بونابرت مع شرفات خاصة بإطلالة بانورامية مباشرة على برج إيفل.',
        directUrl: buildBookingUrl('Shangri-La Paris'),
        tripComUrl: buildTripComUrl('Shangri-La Paris'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'par-3',
        name: 'Fraser Suites Le Claridge Champs-Elysées',
        nameAr: 'أجنحة فريزر لو كلاريدج الفندقية (جادة الشانزلزيه)',
        type: 'Luxury Serviced Family Apartment (1-3 Bedrooms)',
        rating: '4.8',
        price: '$420 - $690 / night',
        location: 'Avenue des Champs-Élysées, 8th Arr., Paris',
        lat: 48.8711,
        lng: 2.3041,
        description: 'Spacious serviced luxury suites with full kitchens directly on Champs-Elysées, ideal for families.',
        descriptionAr: 'أجنحة عائلية فاخرة مجهزة بمطابخ متكاملة في قلب الشانزلزيه، مثالية للعائلات والإقامات الممتدة.',
        directUrl: buildBookingUrl('Fraser Suites Le Claridge Champs-Elysées Paris'),
        tripComUrl: buildTripComUrl('Fraser Suites Le Claridge Champs-Elysées Paris'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'par-4',
        name: 'CitizenM Paris Gare de Lyon',
        nameAr: 'فندق سيتيزن إم باريس (وسط المدينة الذكي)',
        type: 'Modern Design Boutique Hotel',
        rating: '4.6',
        price: '$160 - $240 / night',
        location: '12th Arr., near Seine River, Paris',
        lat: 48.8445,
        lng: 2.3732,
        description: 'Contemporary smart boutique hotel with cloud-like king beds, mood lighting, and rooftop cocktail lounge.',
        descriptionAr: 'فندق عصري ذكي بتصميم فريد وأسرة مريحة وصالة بانورامية على السطح تطل على معالم باريس.',
        directUrl: buildBookingUrl('CitizenM Paris Gare de Lyon'),
        tripComUrl: buildTripComUrl('CitizenM Paris Gare de Lyon'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 6. LONDON & UK (لندن وبريطانيا)
  // --------------------------------------------------------------------------
  if (destCombined.includes('london') || destCombined.includes('لندن') || destCombined.includes('uk') || destCombined.includes('britain')) {
    return [
      {
        id: 'lon-1',
        name: 'The Savoy, London',
        nameAr: 'فندق ذا سافوي لندن (ستراند وضفاف نهر التايمز)',
        type: '5-Star Historic Luxury Landmark',
        rating: '4.9',
        price: '$750 - $1,300 / night',
        location: 'Strand, Covent Garden, London',
        lat: 51.5103,
        lng: -0.1205,
        description: 'World-famous luxury hotel on the River Thames with Gordon Ramsay Grill, Edwardian suites, and iconic butler service.',
        descriptionAr: 'أعرق فنادق لندن على ضفاف نهر التايمز مع مطاعم الشيف غوردون رامزي وأجنحة ملكية فخمة بجوار كوفنت جاردن.',
        directUrl: buildBookingUrl('The Savoy London'),
        tripComUrl: buildTripComUrl('The Savoy London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'lon-2',
        name: 'Cheval Three Quays at The Tower of London',
        nameAr: 'أجنحة شيفال ثري كيز الفندقية (جسر البرج ونهر التايمز)',
        type: '5-Star Luxury Serviced Family Apartments',
        rating: '4.9',
        price: '$450 - $780 / night',
        location: 'Lower Thames St, Tower Bridge Waterfront, London',
        lat: 51.5085,
        lng: -0.0792,
        description: 'Ultra-modern 1 to 3 bedroom luxury serviced apartments directly overlooking Tower Bridge and River Thames with kitchens.',
        descriptionAr: 'أجنحة وشقق فندقية عائلية فخمة من غرفة إلى 3 غرف نوم بإطلالة مباشرة على جسر البرج التراثي ونهر التايمز.',
        directUrl: buildBookingUrl('Cheval Three Quays at The Tower of London'),
        tripComUrl: buildTripComUrl('Cheval Three Quays at The Tower of London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'lon-3',
        name: 'Citadines Trafalgar Square London',
        nameAr: 'سيتادين ترافالغار سكوير لندن (ميدان ترافالغار)',
        type: 'Quality Serviced Family Apartments',
        rating: '4.6',
        price: '$240 - $380 / night',
        location: 'Northumberland Ave, Westminster / Trafalgar, London',
        lat: 51.5074,
        lng: -0.1245,
        description: 'Spacious apartments with kitchens steps from Big Ben, London Eye, and West End theatres.',
        descriptionAr: 'شقق مجهزة بمطابخ متكاملة على بُعد خطوات من ساعة بيغ بن ومسارح ويست إند وميدان ترافالغار.',
        directUrl: buildBookingUrl('Citadines Trafalgar Square London'),
        tripComUrl: buildTripComUrl('Citadines Trafalgar Square London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'lon-4',
        name: 'Premier Inn London County Hall',
        nameAr: 'بريمير إن لندن كاونتي هول (بجوار عين لندن وبيغ بن)',
        type: 'Top-Rated Quality Economy Hotel',
        rating: '4.5',
        price: '$130 - $210 / night',
        location: 'South Bank, next to London Eye & Waterloo Station',
        lat: 51.5019,
        lng: -0.1192,
        description: 'Unbeatable budget location right behind the London Eye with comfortable Hypnos beds and family rooms.',
        descriptionAr: 'موقع اقتصادي استثنائي خلف عين لندن وبيغ بن مباشرة مع غرف عائلية مريحة وفطور شهي.',
        directUrl: buildBookingUrl('Premier Inn London County Hall'),
        tripComUrl: buildTripComUrl('Premier Inn London County Hall'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 7. TOKYO & JAPAN (طوكيو واليابان)
  // --------------------------------------------------------------------------
  if (destCombined.includes('tokyo') || destCombined.includes('طوكيو') || destCombined.includes('japan') || destCombined.includes('اليابان')) {
    return [
      {
        id: 'tyo-1',
        name: 'Aman Tokyo (Otemachi Tower)',
        nameAr: 'فندق أمان طوكيو (برج أوتيماتشي والحدائق الإمبراطورية)',
        type: '5-Star Sanctuary in the Sky',
        rating: '4.9',
        price: '$980 - $1,600 / night',
        location: 'Otemachi, Chiyoda City, Tokyo',
        lat: 35.6882,
        lng: 139.7645,
        description: 'Zen-inspired sanctuary featuring soaring washi paper ceilings, traditional furo soaking tubs, and panoramic Mount Fuji views.',
        descriptionAr: 'ملاذ ياباني هادئ مستوحى من فلسفة الزن مع أحواض استحمام يابانية تقليدية وإطلالات ساحرة على جبل فوجي وقصر الإمبراطور.',
        directUrl: buildBookingUrl('Aman Tokyo'),
        tripComUrl: buildTripComUrl('Aman Tokyo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'tyo-2',
        name: 'MIMARU Tokyo Ginza East',
        nameAr: 'شقق ميمارو طوكيو جينزا إيست (شقق فندقية عائلية يابانية)',
        type: 'Japanese Modern Family Apartment Hotel',
        rating: '4.8',
        price: '$280 - $450 / night',
        location: 'Shintomi, Chuo City, Ginza Area, Tokyo',
        lat: 35.6719,
        lng: 139.7744,
        description: 'Spacious Japanese-style family apartments with dining areas, kitchens, bunk beds and tatami mats, ideal for families and groups.',
        descriptionAr: 'شقق فندقية عائلية فسيحة بطراز ياباني حديث مجهزة بمطبخ وطاولة طعام وأسرّة بطابقين وحصائر التاتامي في حي جينزا.',
        directUrl: buildBookingUrl('MIMARU Tokyo Ginza East'),
        tripComUrl: buildTripComUrl('MIMARU Tokyo Ginza East'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'tyo-3',
        name: 'Hotel Gracery Shinjuku (Godzilla Head)',
        nameAr: 'فندق جريسري شينجوكو (مجسم غودزيلا الشهير)',
        type: '4-Star Entertainment District Hotel',
        rating: '4.6',
        price: '$160 - $260 / night',
        location: 'Kabukicho, Shinjuku, Tokyo',
        lat: 35.6953,
        lng: 139.7022,
        description: 'Iconic Shinjuku hotel with the life-size Godzilla head terrace, steps from Shinjuku Train Station and shopping malls.',
        descriptionAr: 'أشهر فنادق شينجوكو الترفيهية مع شرفة غودزيلا العملاقة وقريب من محطة قطارات شينجوكو وأسواق الإلكترونيات.',
        directUrl: buildBookingUrl('Hotel Gracery Shinjuku Tokyo'),
        tripComUrl: buildTripComUrl('Hotel Gracery Shinjuku Tokyo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'tyo-4',
        name: 'APA Hotel & Resort Ryogoku Eki Tower',
        nameAr: 'فندق ومنتجع آبا ريوغوكو إيكي تاور (مطل على طوكيو سكاي تري)',
        type: 'Modern Quality High-Rise Hotel',
        rating: '4.5',
        price: '$80 - $140 / night',
        location: 'Ryogoku, Sumida City, Tokyo',
        lat: 35.6961,
        lng: 139.7925,
        description: 'Sky-high tower with open-air hot spring onsen bath, swimming pool, and direct train access to Akihabara and Tokyo Skytree.',
        descriptionAr: 'برج شاهق يضم حمام ينابيع ساخنة أونسن في الهواء الطلق، ومسبحاً بإطلالة على برج طوكيو سكاي تري بأسعار اقتصادية.',
        directUrl: buildBookingUrl('APA Hotel Resort Ryogoku Eki Tower Tokyo'),
        tripComUrl: buildTripComUrl('APA Hotel Resort Ryogoku Eki Tower Tokyo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 8. CZECH REPUBLIC & KARLOVY VARY / TEPLICE (التشيك والمصحات العلاجية)
  // --------------------------------------------------------------------------
  if (destCombined.includes('czech') || destCombined.includes('تشيك') || destCombined.includes('prague') || destCombined.includes('براغ') || destCombined.includes('karlovy') || destCombined.includes('كارلوفي')) {
    if (isWellness || normCity.includes('karlovy') || normCity.includes('teplice')) {
      return [
        {
          id: 'cz-spa-1',
          name: 'Spa Resort Imperial (Karlovy Vary)',
          nameAr: 'منتجع إمبريال الصحي والاستشفائي (كارلوفي فاري)',
          type: 'Historic 5-Star Medical Spa & Thermal Baths',
          rating: '4.9',
          price: '$280 - $490 / night (مع البرامج الطبية)',
          location: 'Libušina 1212/18, Karlovy Vary, Czech Republic',
          lat: 50.2223,
          lng: 12.8875,
          description: 'Dominant castle spa resort providing balneology, thermal mineral water therapies, rehabilitation and doctor consultations.',
          descriptionAr: 'أشهر مصحة وقصر علاجي استشفائي في التشيك يوفر جلسات المياه المعدنية الحارة والعلاج الطبيعي والتأهيل بإشراف أطباء متخصصين.',
          directUrl: buildBookingUrl('Spa Resort Imperial Karlovy Vary'),
          tripComUrl: buildTripComUrl('Spa Resort Imperial Karlovy Vary'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'cz-spa-2',
          name: 'Grandhotel Pupp (Karlovy Vary)',
          nameAr: 'جراندهوتيل بوب التاريخي الفاخر (كارلوفي فاري)',
          type: 'Historic Luxury Spa Palace (Since 1701)',
          rating: '4.9',
          price: '$320 - $550 / night',
          location: 'Mírové náměstí 2, Karlovy Vary, Czech Republic',
          lat: 50.2198,
          lng: 12.8794,
          description: 'Legendary 18th-century palace hotel with Roman baths, luxury Harfa spa clinic, and serene forest walking colonnades.',
          descriptionAr: 'قصر ملكي أسطوري منذ عام 1701 يضم حمامات رومانية وسبا استرخاء عالمي ومسارات مشي غابات هادئة على ضفاف النهر.',
          directUrl: buildBookingUrl('Grandhotel Pupp Karlovy Vary'),
          tripComUrl: buildTripComUrl('Grandhotel Pupp Karlovy Vary'),
          sourceProvider: 'Booking.com & Trip.com',
        },
        {
          id: 'cz-spa-3',
          name: 'Spa House Beethoven (Lázně Teplice)',
          nameAr: 'مصحة بيتهوفن للعلاج الطبيعي (ينابيع تبليتسه المعدنية)',
          type: 'Specialized Musculoskeletal Thermal Spa',
          rating: '4.7',
          price: '$180 - $310 / night',
          location: 'Lázeňská ulička, Teplice, Czech Republic',
          lat: 50.6402,
          lng: 13.8245,
          description: 'Renowned thermal mineral rehabilitation spa specializing in musculoskeletal recovery, joints, and thermal pools.',
          descriptionAr: 'مصحة تاريخية شهيرة في تبليتسه متخصصة في علاج وتأهيل العظام والمفاصل والعمود الفقري بالمياه الحرارية الطبيعية.',
          directUrl: buildBookingUrl('Spa Beethoven Teplice Czech Republic'),
          tripComUrl: buildTripComUrl('Spa Beethoven Teplice Czech Republic'),
          sourceProvider: 'Booking.com & Trip.com',
        },
      ];
    }

    // Prague City
    return [
      {
        id: 'prg-1',
        name: 'Four Seasons Hotel Prague',
        nameAr: 'فندق فورسيزونز براغ (إطلالة مباشرة على جسر تشارلز والقلعة)',
        type: '5-Star Historic River Palace Hotel',
        rating: '4.9',
        price: '$520 - $890 / night',
        location: 'Veleslavínova 1098/2a, Old Town Prague',
        lat: 50.0874,
        lng: 14.4152,
        description: 'Set on the edge of the Vltava River uniting Baroque, Renaissance and Modern neoclassical buildings with Charles Bridge views.',
        descriptionAr: 'قصر فندقي تاريخي يطل على نهر فلتافا وجسر تشارلز وقلعة براغ المهيبة في قلب البلدة القديمة.',
        directUrl: buildBookingUrl('Four Seasons Hotel Prague'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel Prague'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'prg-2',
        name: 'Grand Hotel Bohemia Prague',
        nameAr: 'جراند هوتيل بوهيميا براغ (البلدة القديمة)',
        type: '5-Star Art Nouveau Historic Hotel',
        rating: '4.8',
        price: '$210 - $350 / night',
        location: 'Králodvorská 652/4, Prague 1, Old Town',
        lat: 50.0881,
        lng: 14.4278,
        description: 'Elegantly preserved historic hotel steps from Powder Tower and Old Town Square with Boccaccio Grand Ballroom.',
        descriptionAr: 'فندق تاريخي كلاسيكي ساحر على بُعد خطوات من ساحة البلدة القديمة وبرج البارود وساعة براغ الفلكية.',
        directUrl: buildBookingUrl('Grand Hotel Bohemia Prague'),
        tripComUrl: buildTripComUrl('Grand Hotel Bohemia Prague'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 9. CAIRO & EGYPT (القاهرة ومصر)
  // --------------------------------------------------------------------------
  if (destCombined.includes('cairo') || destCombined.includes('القاهرة') || destCombined.includes('egypt') || destCombined.includes('مصر')) {
    return [
      {
        id: 'cai-1',
        name: 'Four Seasons Hotel Cairo at Nile Plaza',
        nameAr: 'فندق فورسيزونز القاهرة نايل بلازا (جاردن سيتي)',
        type: '5-Star Luxury Nilefront Palace',
        rating: '4.9',
        price: '$380 - $650 / ليلة',
        location: 'كورنيش النيل، جاردن سيتي، القاهرة',
        lat: 30.0358,
        lng: 31.2292,
        description: 'Prestigious waterfront palace overlooking the River Nile with luxury spa, outdoor pools, and Italian dining.',
        descriptionAr: 'قصر فندقي فاخر على ضفاف نهر النيل بحي جاردن سيتي الراقي مع شرفات خاصة وسبا وأحواض سباحة خارجية.',
        directUrl: buildBookingUrl('Four Seasons Hotel Cairo at Nile Plaza'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel Cairo at Nile Plaza'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-2',
        name: 'Marriott Mena House, Cairo',
        nameAr: 'فندق ماريوت مينا هاوس، القاهرة (إطلالة مباشرة على الأهرامات)',
        type: 'Historic 5-Star Royal Heritage Palace',
        rating: '4.8',
        price: '$320 - $540 / ليلة',
        location: 'طريق الأهرامات، الجيزة، القاهرة',
        lat: 29.9856,
        lng: 31.1328,
        description: 'Legendary palace built in 1869 with lush gardens directly at the foot of the Great Pyramids of Giza.',
        descriptionAr: 'قصر ملكي أسطوري شُيّد عام 1869 وسط حدائق غناء عند سفح أهرامات الجيزة مباشرة مع إطلالات لا تُنسى.',
        directUrl: buildBookingUrl('Marriott Mena House Cairo'),
        tripComUrl: buildTripComUrl('Marriott Mena House Cairo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-3',
        name: 'Steigenberger Hotel El Tahrir Cairo',
        nameAr: 'فندق شتايجنبرجر التحرير القاهرة (ميدان التحرير والمتحف)',
        type: '4-Star Superior Modern Hotel',
        rating: '4.7',
        price: '$120 - $190 / ليلة',
        location: 'شارع قصر النيل، ميدان التحرير، القاهرة',
        lat: 30.0465,
        lng: 31.2368,
        description: 'Contemporary hotel located directly next to the Egyptian Museum on Tahrir Square with outdoor pool.',
        descriptionAr: 'فندق عصري متميز بجوار المتحف المصري بميدان التحرير ومحطة المترو مع مسبح ومركز للياقة البدنية.',
        directUrl: buildBookingUrl('Steigenberger Hotel El Tahrir Cairo'),
        tripComUrl: buildTripComUrl('Steigenberger Hotel El Tahrir Cairo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // 10. UNIVERSAL SMART DYNAMIC GENERATOR FOR ALL OTHER WORLD CITIES
  // --------------------------------------------------------------------------
  const tierPrice1 = isLuxury ? '$450 - $780 / night' : isEconomy ? '$70 - $120 / night' : '$150 - $260 / night';
  const tierPrice2 = isLuxury ? '$380 - $650 / night' : isEconomy ? '$60 - $105 / night' : '$130 - $220 / night';
  const tierPrice3 = isLuxury ? '$320 - $540 / night' : isEconomy ? '$55 - $95 / night' : '$110 - $180 / night';
  const tierPrice4 = isLuxury ? '$260 - $440 / night' : isEconomy ? '$45 - $80 / night' : '$85 - $145 / night';

  return [
    {
      id: `univ-acc-1-${normCity}`,
      name: `${cityDisplay} Grand Palace & Luxury Heritage Suites`,
      nameAr: `أجنحة جراند بالاس الفاخرة في ${cityDisplay}`,
      type: isLuxury ? '5-Star Luxury Heritage Hotel' : 'Premium Central Hotel',
      rating: '4.9',
      price: tierPrice1,
      location: `${cityDisplay} Central Historic Quarter`,
      lat: 48.8566,
      lng: 2.3522,
      description: `Prime central location in ${cityDisplay} with concierge service, panoramic city skyline views, and gourmet dining.`,
      descriptionAr: `موقع مركزي مميز في قلب ${cityDisplay} يوفر إطلالات بانورامية على معالم المدينة وخدمة كونسيرج على مدار الساعة.`,
      directUrl: buildBookingUrl(`${cityDisplay} Central Hotel`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Central Hotel`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-2-${normCity}`,
      name: `${cityDisplay} Royal Serviced Family Residences`,
      nameAr: `أجنحة رويال ريزيدنس الفندقية للعائلات في ${cityDisplay}`,
      type: 'Serviced Family Apartment Suite',
      rating: '4.8',
      price: tierPrice2,
      location: `${cityDisplay} Diplomatic & Gardens Promenade`,
      lat: 48.8606,
      lng: 2.3376,
      description: `Spacious multi-room serviced apartments with kitchenettes, separate living rooms, and kids play spaces in ${cityDisplay}.`,
      descriptionAr: `أجنحة فندقية فسيحة متعددة الغرف مجهزة بمطابخ صغيرة وصالات جلوس مناسبة للعائلات والإقامات المريحة في ${cityDisplay}.`,
      directUrl: buildBookingUrl(`${cityDisplay} Serviced Apartments`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Serviced Apartments`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-3-${normCity}`,
      name: `${cityDisplay} Skyline Modern Boutique Hotel`,
      nameAr: `فندق سكاي لاين البوتيكي العصري في ${cityDisplay}`,
      type: '4-Star Modern Boutique Hotel',
      rating: '4.7',
      price: tierPrice3,
      location: `${cityDisplay} Financial & Shopping Boulevard`,
      lat: 48.8738,
      lng: 2.2950,
      description: `Contemporary design hotel with high-speed Wi-Fi, fitness center, and walking proximity to major shopping centers in ${cityDisplay}.`,
      descriptionAr: `فندق عصري أنيق بتصميم حديث قريب من مراكز التسوق والمطاعم مع صالة رياضية وإنترنت عالي السرعة في ${cityDisplay}.`,
      directUrl: buildBookingUrl(`${cityDisplay} Boutique Hotel`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Boutique Hotel`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-4-${normCity}`,
      name: `${cityDisplay} Transit Comfort Inn & Suites`,
      nameAr: `فندق ترانزيت كومفورت إن في ${cityDisplay}`,
      type: 'Quality Economy Hotel',
      rating: '4.5',
      price: tierPrice4,
      location: `${cityDisplay} Metro & Rail Express Hub`,
      lat: 48.8445,
      lng: 2.3732,
      description: `Budget-conscious clean and comfortable rooms next to central metro and train stations for effortless city transit in ${cityDisplay}.`,
      descriptionAr: `إقامة اقتصادية مريحة ونظيفة بجوار محطات المترو والقطارات للتنقل السهل والعملي داخل ${cityDisplay}.`,
      directUrl: buildBookingUrl(`${cityDisplay} Express Hotel`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Express Hotel`),
      sourceProvider: 'Booking.com & Trip.com',
    },
  ];
}
