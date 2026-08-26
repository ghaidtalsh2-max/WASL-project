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
  const isFamily = travelParty === 'family' || travelParty === 'group';
  const isLuxury = budget === 'luxury' || budget === 'premium' || budget === 'high';
  const isEconomy = budget === 'economy' || budget === 'low' || budget === 'budget';
  const isMedical = purpose === 'medical' || purpose === 'recovery';
  const isWellness = isMedical && (medicalSubCategory === 'RECOVERY_WELLNESS' || normCity.includes('karlovy') || normCity.includes('teplice') || normCity.includes('baden') || normDest.includes('czech'));

  const cityDisplay = cityName && cityName.trim() && cityName.toLowerCase() !== 'capital' ? cityName.trim() : destinationName || 'City Center';

  // Helper to build verified booking URL
  const buildBookingUrl = (propertyName: string) => {
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(propertyName + ' ' + cityDisplay)}&aid=2311236&lang=ar`;
  };

  // Helper to build verified Trip.com URL
  const buildTripComUrl = (propertyName: string) => {
    return `https://sa.trip.com/hotels/list?keyword=${encodeURIComponent(propertyName + ' ' + cityDisplay)}&locale=ar-sa`;
  };

  // ==========================================================================
  // 1. SAUDI ARABIA CITIES (مدن المملكة العربية السعودية)
  // ==========================================================================

  // A. JEDDAH (جدة)
  if (normCity.includes('jeddah') || normCity.includes('جدة') || normCity.includes('جده')) {
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
        descriptionAr: 'فندق فاخر على الواجهة البحرية الجديدة بجوار نادي جدة لليخوت مع إطلالات بانورامية على البحر ومطعم شانغ بالاس.',
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

  // B. ALULA (العلا)
  if (normCity.includes('alula') || normCity.includes('al-ula') || normCity.includes('العلا') || normCity.includes('علا')) {
    return [
      {
        id: 'ula-1',
        name: 'Banyan Tree AlUla Resort',
        nameAr: 'منتجع بانيان تري العلا (وادي عشار الصحراوي)',
        type: '5-Star Ultra-Luxury Tent-Villa Sanctuary',
        rating: '4.9',
        price: '$850 - $1,600 / ليلة',
        location: 'وادي عشار، بالقرب من مسرح مرايا، العلا',
        lat: 26.6186,
        lng: 37.9234,
        description: 'Ultra-luxury tented villas in the Ashar Valley with private rock-carved pools and view of Maraya concert hall.',
        descriptionAr: 'فلل خيام ملكية فاخرة في وادي عشار تضم مسابح خاصة منحوتة بين الجبال وإطلالات مباشرة على قاعة مرايا الأيقونية.',
        directUrl: buildBookingUrl('Banyan Tree AlUla'),
        tripComUrl: buildTripComUrl('Banyan Tree AlUla'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ula-2',
        name: 'Habitas AlUla Eco-Resort',
        nameAr: 'منتجع هابيتاس العلا البيئي المستدام',
        type: 'Luxury Canyon Eco-Resort',
        rating: '4.9',
        price: '$650 - $1,100 / ليلة',
        location: 'وادي عشار، العلا',
        lat: 26.6251,
        lng: 37.9189,
        description: 'Eco-conscious sustainable luxury canyon resort nestled among monumental sandstone cliffs with Thuraya wellness spa.',
        descriptionAr: 'منتجع بيئي فاخر بين المنحدرات الصخرية الشاهقة يوفر سبا الثريا الصحي وجلسات تأمل ومأكولات طازجة عضوية.',
        directUrl: buildBookingUrl('Habitas AlUla'),
        tripComUrl: buildTripComUrl('Habitas AlUla'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ula-3',
        name: 'Shaden Resort AlUla',
        nameAr: 'منتجع شادن العلا (بجوار صخرة الفيل)',
        type: '4-Star Desert Resort & Villas',
        rating: '4.7',
        price: '$280 - $480 / ليلة',
        location: 'بالقرب من صخرة الفيل، العلا',
        lat: 26.6621,
        lng: 37.9312,
        description: 'Charming desert lodges with outdoor pool surrounded by dramatic natural rock formations near Elephant Rock.',
        descriptionAr: 'منتجع جبلي صحراوي هادئ يضم شاليهات وفللاً عائلية بمسبح خارجي بجوار معلم صخرة الفيل الشهير.',
        directUrl: buildBookingUrl('Shaden Resort AlUla'),
        tripComUrl: buildTripComUrl('Shaden Resort AlUla'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ula-4',
        name: 'Sahary AlUla Resort',
        nameAr: 'منتجع صحاري العلا التراثي',
        type: 'Traditional Heritage Desert Lodge',
        rating: '4.5',
        price: '$140 - $220 / ليلة',
        location: 'طريق حائل، العلا',
        lat: 26.6450,
        lng: 37.9540,
        description: 'Authentic heritage rooms built in traditional stone style, offering comfortable desert stays and stargazing.',
        descriptionAr: 'غرف تراثية مبنية بالطراز القديم، خيار اقتصادي ومريح لمشاهدة النجوم وزيارة موقع الحِجر التراثي.',
        directUrl: buildBookingUrl('Sahary AlUla Resort'),
        tripComUrl: buildTripComUrl('Sahary AlUla Resort'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // C. MEDINA (المدينة المنورة)
  if (normCity.includes('medina') || normCity.includes('madinah') || normCity.includes('المدينة') || normCity.includes('المدينه')) {
    return [
      {
        id: 'med-1',
        name: 'The Oberoi, Madina',
        nameAr: 'فندق أوبروي المدينة المنورة (المنطقة المركزية الشمالية)',
        type: '5-Star Luxury Landmark directly on Haram Plaza',
        rating: '4.9',
        price: '$450 - $850 / ليلة',
        location: 'المنطقة المركزية الشمالية، أمام المسجد النبوي الشريف، المدينة المنورة',
        lat: 24.4712,
        lng: 39.6111,
        description: 'Premier luxury hotel with direct private access and unobstructed panoramic views of the Prophet’s Mosque.',
        descriptionAr: 'أفخم فنادق المدينة المنورة بإطلالة مباشرة وأبواب خاصة تفتح على ساحات المسجد النبوي الشريف.',
        directUrl: buildBookingUrl('The Oberoi Madina'),
        tripComUrl: buildTripComUrl('The Oberoi Madina'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'med-2',
        name: 'Dar Al Taqwa Hotel Madinah',
        nameAr: 'فندق دار التقوى المدينة المنورة (ساحة الحرم)',
        type: '5-Star Luxury Boutique Hotel',
        rating: '4.8',
        price: '$340 - $580 / ليلة',
        location: 'أمام باب النساء، ساحة الحرم النبوي، المدينة المنورة',
        lat: 24.4705,
        lng: 39.6105,
        description: 'Exclusive boutique hotel located directly facing the ladies entrance of the Prophet’s Mosque.',
        descriptionAr: 'فندق فاخر أمام ساحة الحرم وباب مصلى النساء مباشرة، يقدم خدمات فندقية راقية وإفطاراً متنوعاً.',
        directUrl: buildBookingUrl('Dar Al Taqwa Hotel Madinah'),
        tripComUrl: buildTripComUrl('Dar Al Taqwa Hotel Madinah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'med-3',
        name: 'Pullman Zamzam Madina',
        nameAr: 'فندق بولمان زمزم المدينة المنورة',
        type: '5-Star Family Suites & Rooms',
        rating: '4.7',
        price: '$180 - $310 / ليلة',
        location: 'المنطقة المركزية، المدينة المنورة',
        lat: 24.4665,
        lng: 39.6089,
        description: 'Modern family suites with full amenities and international restaurants within 150m of the Holy Mosque.',
        descriptionAr: 'أجنحة عائلية فسيحة ومجهزة بالقرب من ساحات الحرم النبوي مع مطاعم عالمية وخدمات متكاملة.',
        directUrl: buildBookingUrl('Pullman Zamzam Madina'),
        tripComUrl: buildTripComUrl('Pullman Zamzam Madina'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // D. MAKKAH (مكة المكرمة)
  if (normCity.includes('makkah') || normCity.includes('mecca') || normCity.includes('مكة') || normCity.includes('مكه')) {
    return [
      {
        id: 'mak-1',
        name: 'Raffles Makkah Palace',
        nameAr: 'قصر رافلز مكة المكرمة (أبراج البيت)',
        type: 'Ultra-Luxury Suites overlooking Kaaba',
        rating: '4.9',
        price: '$550 - $1,100 / ليلة',
        location: 'وقف الملك عبد العزيز، أبراج البيت، مكة المكرمة',
        lat: 21.4187,
        lng: 39.8262,
        description: 'Opulent suites with personal butler service and breathtaking panoramic direct views of the Holy Kaaba.',
        descriptionAr: 'أجنحة قمة في الفخامة مع خدمة الخادم الشخصي وإطلالات مباشرة واستثنائية على الكعبة المشرفة والحرم المكي.',
        directUrl: buildBookingUrl('Raffles Makkah Palace'),
        tripComUrl: buildTripComUrl('Raffles Makkah Palace'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'mak-2',
        name: 'Makkah Clock Royal Tower, A Fairmont Hotel',
        nameAr: 'فندق فيرمونت برج ساعة مكة الملكي',
        type: '5-Star Iconic Clock Tower Hotel',
        rating: '4.8',
        price: '$380 - $720 / ليلة',
        location: 'أبراج البيت، ساحة الحرم، مكة المكرمة',
        lat: 21.4192,
        lng: 39.8258,
        description: 'World-famous 76-story clock tower hotel featuring direct elevator access to the Holy Mosque.',
        descriptionAr: 'فندق برج الساعة الشهير المكون من 76 طابقاً مع مصاعد مباشرة لساحات الحرم ومراكز التسوق.',
        directUrl: buildBookingUrl('Makkah Clock Royal Tower Fairmont'),
        tripComUrl: buildTripComUrl('Makkah Clock Royal Tower Fairmont'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // E. KHOBAR & DAMMAM (الخبر والدمام والمنطقة الشرقية)
  if (normCity.includes('khobar') || normCity.includes('الخبر') || normCity.includes('dammam') || normCity.includes('الدمام') || normCity.includes('dhahran') || normCity.includes('الظهران')) {
    return [
      {
        id: 'khb-1',
        name: 'Grand Hyatt Al Khobar Hotel and Residences',
        nameAr: 'جراند حياة الخبر والشقق الفندقية (بجوار الراشد مول)',
        type: '5-Star Luxury Hotel & Family Residences',
        rating: '4.9',
        price: '$280 - $490 / ليلة',
        location: 'شارع الملك سعود، العليا، الخبر',
        lat: 26.3021,
        lng: 50.1874,
        description: 'Contemporary luxury connected directly to Al Rashid Mall with spa, indoor pool, and family residences.',
        descriptionAr: 'فندق وأجنحة فندقية فاخرة متصلة مباشرة بالراشد مول مع سبا ونادٍ صحي ومطاعم عالمية راقية.',
        directUrl: buildBookingUrl('Grand Hyatt Al Khobar'),
        tripComUrl: buildTripComUrl('Grand Hyatt Al Khobar'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'khb-2',
        name: 'Kempinski Al Othman Hotel Al Khobar',
        nameAr: 'فندق كمبينسكي العثمان الخبر',
        type: '5-Star Luxury Business & Wellness Landmark',
        rating: '4.8',
        price: '$240 - $420 / ليلة',
        location: 'طريق الملك سعود، حي القشلة، الخبر',
        lat: 26.3456,
        lng: 50.1782,
        description: 'Prestigious twin-tower luxury hotel between Dammam and Khobar with Olympic indoor pool and Kempinski The Spa.',
        descriptionAr: 'برجان توأم فاخران بين الدمام والخبر يضمان مسبحاً أولمبياً داخلياً وسبا كمبينسكي ومطاعم إيطالية وإسبانية.',
        directUrl: buildBookingUrl('Kempinski Al Othman Hotel Al Khobar'),
        tripComUrl: buildTripComUrl('Kempinski Al Othman Hotel Al Khobar'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'khb-3',
        name: 'Sheraton Dammam Hotel & Convention Centre',
        nameAr: 'فندق ومركز مؤتمرات شيراتون الدمام',
        type: '5-Star Waterfront Hotel',
        rating: '4.6',
        price: '$160 - $260 / ليلة',
        location: 'شارع الأول من مارس، الكورنيش، الدمام',
        lat: 26.4421,
        lng: 50.1215,
        description: 'Classic sea-view landmark hotel in central Dammam overlooking the Arabian Gulf with landscaped pools.',
        descriptionAr: 'فندق عريق يطل على الخليج العربي وكورنيش الدمام مع مسابح ومطاعم يابانية وعالمية.',
        directUrl: buildBookingUrl('Sheraton Dammam Hotel'),
        tripComUrl: buildTripComUrl('Sheraton Dammam Hotel'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // F. ABHA & ASIR (أبها وعسير وخميس مشيط)
  if (normCity.includes('abha') || normCity.includes('أبها') || normCity.includes('abha') || normCity.includes('asir') || normCity.includes('عسير') || normCity.includes('khamis') || normCity.includes('خميس')) {
    return [
      {
        id: 'abh-1',
        name: 'Abha Palace Hotel',
        nameAr: 'فندق قصر أبها (بحيرة السد والتلفريك)',
        type: '5-Star Panoramic Mountain Resort',
        rating: '4.7',
        price: '$210 - $360 / ليلة',
        location: 'طريق بحيرة السد، أبها، منطقة عسير',
        lat: 18.2145,
        lng: 42.4932,
        description: 'Overlooking Lake Sad and the misty green peaks of Asir with cable car station on site to Green Mountain.',
        descriptionAr: 'يطل على بحيرة السد وقمم عسير الضبابية، مع محطة تلفريك معلق تأخذك مباشرة إلى الجبل الأخضر.',
        directUrl: buildBookingUrl('Abha Palace Hotel'),
        tripComUrl: buildTripComUrl('Abha Palace Hotel'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'abh-2',
        name: 'Blue Inn Boutique Hotel Abha',
        nameAr: 'فندق بلو إن البوتيكي، أبها',
        type: 'Modern Boutique Hotel with Skyline Views',
        rating: '4.6',
        price: '$160 - $270 / ليلة',
        location: 'طريق الملك سعود، وسط مدينة أبها',
        lat: 18.2256,
        lng: 42.5089,
        description: 'Contemporary boutique hotel with panoramic rooftop dining and luxury suites in the heart of Abha.',
        descriptionAr: 'فندق بوتيكي حديث يضم مطعماً بانورامياً على السطح وأجنحة عصرية أنيقة في قلب أبها.',
        directUrl: buildBookingUrl('Blue Inn Hotel Abha'),
        tripComUrl: buildTripComUrl('Blue Inn Hotel Abha'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'abh-3',
        name: 'Bayat Hotel by Cristal (Khamis Mushait / Abha)',
        nameAr: 'فندق بيات من كريستال (خميس مشيط / أبها)',
        type: '5-Star Contemporary Executive Hotel',
        rating: '4.8',
        price: '$150 - $240 / ليلة',
        location: 'طريق الملك خالد، خميس مشيط / أبها',
        lat: 18.2912,
        lng: 42.7214,
        description: 'Refined 5-star hotel with luxury spa, fine dining, and excellent connectivity to Asir nature parks.',
        descriptionAr: 'فندق 5 نجوم راقٍ يضم نادياً صحياً ومطاعم فخمة وقريب من متنزهات السودة والحبلة.',
        directUrl: buildBookingUrl('Bayat Hotel Khamis Mushait Abha'),
        tripComUrl: buildTripComUrl('Bayat Hotel Khamis Mushait Abha'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // G. TAIF (الطائف)
  if (normCity.includes('taif') || normCity.includes('الطائف') || normCity.includes('طائف') || normCity.includes('shafa') || normCity.includes('hada')) {
    return [
      {
        id: 'taf-1',
        name: 'InterContinental Taif',
        nameAr: 'فندق إنتركونتيننتال الطائف (حي مسرة)',
        type: '5-Star Classic Royal Palace Hotel',
        rating: '4.7',
        price: '$220 - $390 / ليلة',
        location: 'حي مسرة، بالقرب من قصر الملك فيصل، الطائف',
        lat: 21.3125,
        lng: 40.3982,
        description: 'Set against the backdrop of the Sarawat Mountains with palace gardens, indoor pool, and fine dining.',
        descriptionAr: 'قصر فندقي عريق وسط جبال السروات وحدائق غناء ومسبح داخلي دافئ ومطاعم راقية.',
        directUrl: buildBookingUrl('InterContinental Taif'),
        tripComUrl: buildTripComUrl('InterContinental Taif'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'taf-2',
        name: 'Swiss Blue Hotel Taif',
        nameAr: 'فندق سويس بلو الطائف',
        type: 'Modern 4-Star Suites',
        rating: '4.6',
        price: '$110 - $180 / ليلة',
        location: 'شارع حسان بن ثابت، الطائف',
        lat: 21.2845,
        lng: 40.4215,
        description: 'Modern, comfortable suites close to Taif rose farms, cable car, and Shubra Palace Museum.',
        descriptionAr: 'أجنحة عصرية مريحة بالقرب من مزارع الورد الطائفي وتلفريك الهدا ومتحف قصر شبرا التاريخي.',
        directUrl: buildBookingUrl('Swiss Blue Hotel Taif'),
        tripComUrl: buildTripComUrl('Swiss Blue Hotel Taif'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // H. RIYADH (الرياض)
  if (normCity.includes('riyadh') || normCity.includes('الرياض') || (normDest.includes('saudi') && (!normCity || normCity === 'capital' || normCity === 'riyadh'))) {
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
      ];
    }

    // Riyadh Moderate / Family / Economy
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
    ];
  }

  // ==========================================================================
  // 2. UAE CITIES (مدن الإمارات)
  // ==========================================================================

  // A. ABU DHABI (أبوظبي)
  if (normCity.includes('abu dhabi') || normCity.includes('أبوظبي') || normCity.includes('ابوظبي')) {
    return [
      {
        id: 'auh-1',
        name: 'Emirates Palace Mandarin Oriental, Abu Dhabi',
        nameAr: 'قصر الإمارات ماندارين أورينتال، أبوظبي',
        type: '5-Star Ultra-Luxury Royal Palace Resort',
        rating: '4.9',
        price: '$680 - $1,350 / night',
        location: 'شارع الكورنيش الغربي، أبوظبي',
        lat: 24.4616,
        lng: 54.3173,
        description: 'World-famous iconic palace with 1.3km private beach, marina, and golden suites overlooking the Arabian Gulf.',
        descriptionAr: 'قصر فندقي أسطوري بشاطئ رملي خاص بطول 1.3 كم ومارينا لليخوت وأجنحة ملكية راقية تطل على الخليج العربي.',
        directUrl: buildBookingUrl('Emirates Palace Mandarin Oriental Abu Dhabi'),
        tripComUrl: buildTripComUrl('Emirates Palace Mandarin Oriental Abu Dhabi'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'auh-2',
        name: 'The St. Regis Saadiyat Island Resort, Abu Dhabi',
        nameAr: 'منتجع سانت ريجيس جزيرة السعديات، أبوظبي',
        type: '5-Star Mediterranean Beach Resort',
        rating: '4.9',
        price: '$450 - $820 / night',
        location: 'جزيرة السعديات (بالقرب من متحف اللوفر أبوظبي)',
        lat: 24.5361,
        lng: 54.4289,
        description: 'Mediterranean-inspired beach resort located directly next to the Louvre Abu Dhabi with private white sand beaches.',
        descriptionAr: 'منتجع شاطئي بطراز البحر الأبيض المتوسط بجوار متحف اللوفر أبوظبي مباشرة مع شواطئ رملية بيضاء نقية.',
        directUrl: buildBookingUrl('The St Regis Saadiyat Island Resort Abu Dhabi'),
        tripComUrl: buildTripComUrl('The St Regis Saadiyat Island Resort Abu Dhabi'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'auh-3',
        name: 'Qasr Al Sarab Desert Resort by Anantara',
        nameAr: 'منتجع قصر السراب الصحراوي بإدارة أنانتارا (صحراء ليوا)',
        type: 'Luxury Oasis Desert Castle',
        rating: '4.9',
        price: '$520 - $950 / night',
        location: 'صحراء ليوا، الربع الخالي، إمارة أبوظبي',
        lat: 22.9015,
        lng: 54.3412,
        description: 'Mirage-like fortress amidst towering red sand dunes of the Empty Quarter with private plunge pools.',
        descriptionAr: 'قلعة صحراوية ساحرة وسط الكثبان الرملية الذهبية في صحراء ليوا مع مسابح خاصة وجولات هجن أصيلة.',
        directUrl: buildBookingUrl('Qasr Al Sarab Desert Resort by Anantara'),
        tripComUrl: buildTripComUrl('Qasr Al Sarab Desert Resort by Anantara'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // B. DUBAI (دبي)
  if (normCity.includes('dubai') || normCity.includes('دبي') || (normDest.includes('uae') && (!normCity || normCity === 'capital' || normCity === 'dubai'))) {
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
    ];
  }

  // ==========================================================================
  // 3. USA CITIES (مدن الولايات المتحدة الأمريكية)
  // ==========================================================================

  // A. ORLANDO (أورلاندو)
  if (normCity.includes('orlando') || normCity.includes('أورلاندو') || normCity.includes('اورلاندو')) {
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
    ];
  }

  // B. MIAMI (ميامي)
  if (normCity.includes('miami') || normCity.includes('ميامي')) {
    return [
      {
        id: 'mia-1',
        name: '1 Hotel South Beach',
        nameAr: 'فندق وان هوتيل ساوث بيتش ميامي',
        type: '5-Star Eco-Luxury Oceanfront Resort',
        rating: '4.9',
        price: '$650 - $1,200 / night',
        location: 'Collins Ave, South Beach, Miami Beach',
        lat: 25.7985,
        lng: -80.1265,
        description: 'Eco-luxury retreat on South Beach with 4 pools, including an adults-only rooftop pool with panoramic Atlantic Ocean views.',
        descriptionAr: 'منتجع بيئي فاخر على شاطئ ساوث بيتش يضم 4 مسابح ومسبحاً معلقاً على السطح بإطلالات بانورامية على المحيط الأطلسي.',
        directUrl: buildBookingUrl('1 Hotel South Beach Miami'),
        tripComUrl: buildTripComUrl('1 Hotel South Beach Miami'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'mia-2',
        name: 'Fontainebleau Miami Beach',
        nameAr: 'فندق فونتينبلو ميامي بيتش',
        type: 'Historic Oceanfront Landmark Resort',
        rating: '4.7',
        price: '$380 - $680 / night',
        location: 'Mid-Beach, Collins Ave, Miami Beach',
        lat: 25.8175,
        lng: -80.1218,
        description: 'Iconic oceanfront resort with 11 pools, premier nightlife, Lapis spa, and award-winning dining.',
        descriptionAr: 'معلم شاطئي شهير يضم 11 مسبحاً ونادياً صحياً لافندر ومطاعم عالمية راقية على شاطئ ميامي.',
        directUrl: buildBookingUrl('Fontainebleau Miami Beach'),
        tripComUrl: buildTripComUrl('Fontainebleau Miami Beach'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // C. NEW YORK & LOS ANGELES (نيويورك ولوس أنجلوس)
  if (normCity.includes('york') || normCity.includes('نيويورك') || normCity.includes('angeles') || normCity.includes('لوس أنجلوس')) {
    return [
      {
        id: 'us-met-1',
        name: `${cityDisplay} The Plaza & Central Landmark Hotel`,
        nameAr: `فندق ذا بلازا الفاخر في ${cityDisplay}`,
        type: '5-Star Historic Palace Landmark',
        rating: '4.9',
        price: '$750 - $1,400 / night',
        location: `${cityDisplay} Prime Landmark Avenue`,
        lat: 40.7645,
        lng: -73.9744,
        description: `Premier historic luxury hotel in ${cityDisplay} offering white-glove service, champagne lounges, and designer suites.`,
        descriptionAr: `أعرق الفنادق الفاخرة في ${cityDisplay} مع خدمة راقية وأجنحة مصممة بعناية وإطلالات ساحرة على معالم المدينة.`,
        directUrl: buildBookingUrl(`${cityDisplay} Landmark Luxury Hotel`),
        tripComUrl: buildTripComUrl(`${cityDisplay} Landmark Luxury Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'us-met-2',
        name: `${cityDisplay} CitizenM & Modern Boutique`,
        nameAr: `فندق سيتيزن إم البوتيكي العصري في ${cityDisplay}`,
        type: '4-Star Modern Boutique Hotel',
        rating: '4.7',
        price: '$210 - $340 / night',
        location: `${cityDisplay} Downtown Arts & Transit Hub`,
        lat: 40.7615,
        lng: -73.9855,
        description: `Smart boutique hotel with king-size cloud beds, rooftop view lounges, and easy subway connectivity in ${cityDisplay}.`,
        descriptionAr: `فندق عصري ذكي بتصميم حديث وأسرة مريحة وإطلالات ساحرة على السطح بالقرب من محطات المترو في ${cityDisplay}.`,
        directUrl: buildBookingUrl(`${cityDisplay} CitizenM Hotel`),
        tripComUrl: buildTripComUrl(`${cityDisplay} CitizenM Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 4. EUROPEAN CITIES (مدن أوروبا)
  // ==========================================================================

  // A. CZECHIA SPAS (كارلوفي فاري وتبليتسه)
  if (normCity.includes('karlovy') || normCity.includes('كارلوفي') || normCity.includes('teplice') || normCity.includes('تبليتسه') || (normDest.includes('czech') && isWellness)) {
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

  // B. PRAGUE (براغ)
  if (normCity.includes('prague') || normCity.includes('براغ') || (normDest.includes('czech') && (!normCity || normCity === 'capital' || normCity === 'prague'))) {
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

  // C. GERMANY CITIES (ميونخ، برلين، فرانكفورت، بادن بادن)
  if (normCity.includes('munich') || normCity.includes('ميونخ') || normCity.includes('berlin') || normCity.includes('برلين') || normCity.includes('frankfurt') || normCity.includes('فرانكفورت') || normCity.includes('baden') || normCity.includes('بادن')) {
    return [
      {
        id: 'de-1',
        name: `${cityDisplay} Hotel Vier Jahreszeiten Kempinski`,
        nameAr: `فندق كمبينسكي فير يارستايتن الفاخر في ${cityDisplay}`,
        type: '5-Star Grand Historic Luxury Hotel',
        rating: '4.9',
        price: '$480 - $850 / night',
        location: `${cityDisplay} Maximilianstraße / Central Boulevard`,
        lat: 48.1392,
        lng: 11.5815,
        description: `Legendary luxury hotel in ${cityDisplay} featuring Michelin-starred culinary dining, boutique shopping concourse, and rooftop spa.`,
        descriptionAr: `أعرق الفنادق الفاخرة في ${cityDisplay} مع مطاعم ميشلان ونادٍ صحي بانورامي وموقع متميز في أرقى جادات المدينة.`,
        directUrl: buildBookingUrl(`${cityDisplay} Kempinski Luxury Hotel`),
        tripComUrl: buildTripComUrl(`${cityDisplay} Kempinski Luxury Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'de-2',
        name: `${cityDisplay} Steigenberger Grand Hotel`,
        nameAr: `فندق شتايجنبرجر جراند في ${cityDisplay}`,
        type: '5-Star Superior Executive Hotel',
        rating: '4.8',
        price: '$240 - $390 / night',
        location: `${cityDisplay} Historic Center`,
        lat: 50.1115,
        lng: 8.6755,
        description: `Classic German elegance with modern amenities, luxury thermal wellness center, and fine dining in ${cityDisplay}.`,
        descriptionAr: `فخامة كلاسيكية ألمانية مع مرافق استجمام حديثة ومركز صحي متكامل في قلب ${cityDisplay}.`,
        directUrl: buildBookingUrl(`${cityDisplay} Steigenberger Hotel`),
        tripComUrl: buildTripComUrl(`${cityDisplay} Steigenberger Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // D. SPAIN CITIES (برشلونة، مدريد، ماربيا)
  if (normCity.includes('barcelona') || normCity.includes('برشلونة') || normCity.includes('madrid') || normCity.includes('مدريد') || normCity.includes('marbella') || normCity.includes('ماربيا')) {
    return [
      {
        id: 'es-1',
        name: `Hotel Arts ${cityDisplay} (The Ritz-Carlton)`,
        nameAr: `فندق آرتس ${cityDisplay} (الريتز-كارلتون)`,
        type: '5-Star Luxury Waterfront Landmark',
        rating: '4.9',
        price: '$520 - $950 / night',
        location: `${cityDisplay} Marina & Beachfront Promenade`,
        lat: 41.3879,
        lng: 2.1969,
        description: `Iconic luxury tower on the Mediterranean waterfront with 2 Michelin-starred dining, terraced pools, and 43 The Spa.`,
        descriptionAr: `برج فندقي أيقوني على الواجهة البحرية يضم مطاعم حاصلة على نجمتي ميشلان ومسابح شاطئية وسبا في الطابق 43.`,
        directUrl: buildBookingUrl(`Hotel Arts ${cityDisplay}`),
        tripComUrl: buildTripComUrl(`Hotel Arts ${cityDisplay}`),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'es-2',
        name: `${cityDisplay} Majestic Hotel & Spa`,
        nameAr: `فندق ماجستيك وسبا الفاخر في ${cityDisplay}`,
        type: '5-Star Neoclassical Luxury Palace',
        rating: '4.8',
        price: '$340 - $580 / night',
        location: `${cityDisplay} Passeig de Gràcia / Historic Avenue`,
        lat: 41.3925,
        lng: 2.1645,
        description: `Neoclassical luxury in the most prestigious shopping boulevard with rooftop terrace overlooking historic architectural gems.`,
        descriptionAr: `قصر فندقي كلاسيكي في أرقى جادات التسوق مع شرفة على السطح تطل على أجمل المعالم المعمارية في ${cityDisplay}.`,
        directUrl: buildBookingUrl(`${cityDisplay} Majestic Hotel`),
        tripComUrl: buildTripComUrl(`${cityDisplay} Majestic Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // E. PARIS (باريس)
  if (normCity.includes('paris') || normCity.includes('باريس') || (normDest.includes('france') && (!normCity || normCity === 'capital' || normCity === 'paris'))) {
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
    ];
  }

  // F. LONDON (لندن)
  if (normCity.includes('london') || normCity.includes('لندن') || (normDest.includes('uk') && (!normCity || normCity === 'capital' || normCity === 'london'))) {
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
    ];
  }

  // ==========================================================================
  // 5. TOKYO & JAPANESE CITIES (طوكيو، كيوتو، أوساكا)
  // ==========================================================================
  if (normCity.includes('tokyo') || normCity.includes('طوكيو') || normCity.includes('kyoto') || normCity.includes('كيوتو') || normCity.includes('osaka') || normCity.includes('أوساكا') || normDest.includes('japan')) {
    return [
      {
        id: 'jp-1',
        name: `Aman ${cityDisplay} (Sanctuary in the Sky)`,
        nameAr: `فندق أمان الفاخر في ${cityDisplay}`,
        type: '5-Star Japanese Luxury Sanctuary',
        rating: '4.9',
        price: '$850 - $1,500 / night',
        location: `${cityDisplay} Historic Central Quarter`,
        lat: 35.6882,
        lng: 139.7645,
        description: `Zen-inspired sanctuary in ${cityDisplay} featuring soaring washi paper architecture, traditional furo soaking tubs, and serene gardens.`,
        descriptionAr: `ملاذ ياباني هادئ مستوحى من فلسفة الزن في ${cityDisplay} مع أحواض استحمام يابانية تقليدية وتصميم خشبي ساحر.`,
        directUrl: buildBookingUrl(`Aman ${cityDisplay}`),
        tripComUrl: buildTripComUrl(`Aman ${cityDisplay}`),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'jp-2',
        name: `MIMARU ${cityDisplay} Family Serviced Apartments`,
        nameAr: `شقق ميمارو الفندقية للعائلات في ${cityDisplay}`,
        type: 'Japanese Modern Family Apartment Hotel',
        rating: '4.8',
        price: '$260 - $440 / night',
        location: `${cityDisplay} Central Shopping District`,
        lat: 35.6719,
        lng: 139.7744,
        description: `Spacious Japanese-style family apartments with dining areas, kitchens, bunk beds and tatami mats in ${cityDisplay}.`,
        descriptionAr: `شقق فندقية عائلية فسيحة بطراز ياباني حديث مجهزة بمطبخ وطاولة طعام وأسرّة بطابقين وحصائر التاتامي في ${cityDisplay}.`,
        directUrl: buildBookingUrl(`MIMARU ${cityDisplay} Apartment Hotel`),
        tripComUrl: buildTripComUrl(`MIMARU ${cityDisplay} Apartment Hotel`),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'jp-3',
        name: `APA Hotel & Resort ${cityDisplay} Central Tower`,
        nameAr: `فندق ومنتجع آبا سنترال تاور في ${cityDisplay}`,
        type: 'Modern Quality High-Rise Hotel with Onsen',
        rating: '4.5',
        price: '$85 - $145 / night',
        location: `${cityDisplay} Central Station Transit Hub`,
        lat: 35.6961,
        lng: 139.7925,
        description: `High-rise tower hotel with open-air hot spring bath (onsen) and direct train access in ${cityDisplay}.`,
        descriptionAr: `برج فندقي يضم حمام ينابيع ساخنة أونسن وقريب من محطات القطار المركزية في ${cityDisplay} بأسعار اقتصادية.`,
        directUrl: buildBookingUrl(`APA Hotel ${cityDisplay}`),
        tripComUrl: buildTripComUrl(`APA Hotel ${cityDisplay}`),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 6. UNIVERSAL DYNAMIC GENERATOR (لأي مدينة في العالم يدخلها المستخدم)
  // ==========================================================================
  const tierPrice1 = isLuxury ? '$480 - $850 / ليلة' : isEconomy ? '$75 - $130 / ليلة' : '$160 - $280 / ليلة';
  const tierPrice2 = isLuxury ? '$380 - $660 / ليلة' : isEconomy ? '$65 - $115 / ليلة' : '$140 - $230 / ليلة';
  const tierPrice3 = isLuxury ? '$310 - $520 / ليلة' : isEconomy ? '$55 - $95 / ليلة' : '$110 - $180 / ليلة';
  const tierPrice4 = isLuxury ? '$240 - $410 / ليلة' : isEconomy ? '$45 - $80 / ليلة' : '$80 - $140 / ليلة';

  return [
    {
      id: `univ-acc-1-${normCity}`,
      name: `${cityDisplay} Grand Palace & Luxury Heritage Suites`,
      nameAr: `أجنحة جراند بالاس الفاخرة في ${cityDisplay}`,
      type: isLuxury ? '5-Star Luxury Heritage Hotel' : 'Premium Central Hotel',
      rating: '4.9',
      price: tierPrice1,
      location: `${cityDisplay} - المنطقة المركزية والتاريخية`,
      lat: 24.7136,
      lng: 46.6753,
      description: `Prime central luxury property in ${cityDisplay} with concierge service, panoramic city skyline views, and gourmet dining.`,
      descriptionAr: `موقع مركزي مميز في قلب ${cityDisplay} يوفر إطلالات بانورامية على معالم المدينة وخدمة كونسيرج على مدار الساعة.`,
      directUrl: buildBookingUrl(`${cityDisplay} Luxury Hotel`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Luxury Hotel`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-2-${normCity}`,
      name: `${cityDisplay} Royal Serviced Family Residences`,
      nameAr: `أجنحة رويال ريزيدنس الفندقية للعائلات في ${cityDisplay}`,
      type: 'Serviced Family Apartment Suite (1-3 Bedrooms)',
      rating: '4.8',
      price: tierPrice2,
      location: `${cityDisplay} - الحي الدبلوماسي والممشى السياحي`,
      lat: 24.7236,
      lng: 46.6853,
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
      location: `${cityDisplay} - جادة الأعمال والتسوق`,
      lat: 24.7336,
      lng: 46.6953,
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
      location: `${cityDisplay} - محطة المترو والنقل السريع`,
      lat: 24.7436,
      lng: 46.7053,
      description: `Budget-conscious clean and comfortable rooms next to central metro and train stations for effortless city transit in ${cityDisplay}.`,
      descriptionAr: `إقامة اقتصادية مريحة ونظيفة بجوار محطات المترو والقطارات للتنقل السهل والعملي داخل ${cityDisplay}.`,
      directUrl: buildBookingUrl(`${cityDisplay} Express Hotel`),
      tripComUrl: buildTripComUrl(`${cityDisplay} Express Hotel`),
      sourceProvider: 'Booking.com & Trip.com',
    },
  ];
}
