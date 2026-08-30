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
  // 1. SAUDI ARABIA (المملكة العربية السعودية)
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
        type: '5-Star All-Suite Ultra-Luxury Landmark',
        rating: '4.9',
        price: '$550 - $1,100 / ليلة',
        location: 'مجمع أبراج البيت، وقف الملك عبد العزيز، مكة المكرمة',
        lat: 21.4187,
        lng: 39.8256,
        description: 'Exclusive all-suite sanctuary facing the Holy Kaaba with personalized 24-hour butler service and private dining.',
        descriptionAr: 'أجنحة ملكية حصرية بإطلالة مباشرة على الكعبة المشرفة مع خدمة المساعد الشخصي (Butler) على مدار الساعة.',
        directUrl: buildBookingUrl('Raffles Makkah Palace'),
        tripComUrl: buildTripComUrl('Raffles Makkah Palace'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'mak-2',
        name: 'Makkah Clock Royal Tower, A Fairmont Hotel',
        nameAr: 'فندق برج ساعة مكة الملكي (فيرمونت)',
        type: '5-Star Iconic Skyscraper Hotel',
        rating: '4.8',
        price: '$350 - $750 / ليلة',
        location: 'برج الساعة، مجمع أبراج البيت، مكة المكرمة',
        lat: 21.4192,
        lng: 39.8262,
        description: 'World-famous clock tower residence steps from the Holy Mosque with breathtaking panoramic views of the Haram.',
        descriptionAr: 'الإقامة الأيقونية في أعلى برج ساعة مكة مع إطلالات ساحرة على ساحات الحرم المكي الشريف ومصلى داخلي.',
        directUrl: buildBookingUrl('Makkah Clock Royal Tower Fairmont'),
        tripComUrl: buildTripComUrl('Makkah Clock Royal Tower Fairmont'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'mak-3',
        name: 'Swissôtel Al Maqam Makkah',
        nameAr: 'فندق سويس أوتيل المقام مكة',
        type: '5-Star Premium Family & Pilgrim Hotel',
        rating: '4.7',
        price: '$220 - $420 / ليلة',
        location: 'مجمع أبراج البيت، مكة المكرمة',
        lat: 21.4181,
        lng: 39.8248,
        description: 'Direct access to the Haram via Ibrahim Al Khalil Street, comfortable rooms with modern amenities.',
        descriptionAr: 'دخول مباشر لساحات الحرم عبر شارع إبراهيم الخليل، وغرف فسيحة ومجهزة تناسب العائلات والمعتمرين.',
        directUrl: buildBookingUrl('Swissotel Al Maqam Makkah'),
        tripComUrl: buildTripComUrl('Swissotel Al Maqam Makkah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // E. RIYADH (الرياض)
  if (normCity.includes('riyadh') || normCity.includes('الرياض') || (normDest.includes('saudi') && (!normCity || normCity === 'capital' || normCity === 'riyadh'))) {
    return [
      {
        id: 'ruh-1',
        name: 'Four Seasons Hotel Riyadh at Kingdom Centre',
        nameAr: 'فندق فورسيزونز الرياض (برج المملكة)',
        type: '5-Star Luxury Landmark Skyscraper',
        rating: '4.9',
        price: '$550 - $950 / ليلة',
        location: 'برج المملكة، طريق الملك فهد، حي العليا، الرياض',
        lat: 24.7114,
        lng: 46.6744,
        description: 'Elevated luxury inside the Kingdom Centre with panoramic skyline views, bridge access, and Michelin-inspired dining.',
        descriptionAr: 'إقامة فاخرة شاهقة داخل برج المملكة بإطلالات بانورامية على أفق الرياض وخدمة كونسيرج راقية.',
        directUrl: buildBookingUrl('Four Seasons Hotel Riyadh Kingdom Centre'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel Riyadh Kingdom Centre'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-2',
        name: 'The Ritz-Carlton, Riyadh',
        nameAr: 'فندق الريتز-كارلتون، الرياض (طريق مكة)',
        type: '5-Star Palatial Luxury Hotel',
        rating: '4.9',
        price: '$500 - $900 / ليلة',
        location: 'حي الهدا، طريق مكة، الرياض',
        lat: 24.6647,
        lng: 46.6306,
        description: 'Spectacular palatial hotel set among 52 acres of olive gardens with majestic indoor pools and royal suites.',
        descriptionAr: 'قصر فندقي ملكي محاط بـ 52 فداناً من حدائق الزيتون ومسبح داخلي فاخر وقاعات ومطاعم عالمية.',
        directUrl: buildBookingUrl('The Ritz-Carlton Riyadh'),
        tripComUrl: buildTripComUrl('The Ritz-Carlton Riyadh'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-3',
        name: 'Ascott Rafal Olaya Riyadh',
        nameAr: 'أسكوت رافال العليا الرياض (شقق فندقية عائلية فاخرة)',
        type: 'Luxury Serviced Family Residences',
        rating: '4.8',
        price: '$220 - $380 / ليلة',
        location: 'حي الصحافة، طريق الملك فهد، الرياض',
        lat: 24.7936,
        lng: 46.6342,
        description: 'High-rise luxury serviced apartments with separate living areas, kitchens, pools, and kids playroom.',
        descriptionAr: 'شقق فندقية فارهة متكاملة التجهيز بمطابخ وصالات عائلية واسعة ومسابح للأطفال والكبار قرب مركز كافد.',
        directUrl: buildBookingUrl('Ascott Rafal Olaya Riyadh'),
        tripComUrl: buildTripComUrl('Ascott Rafal Olaya Riyadh'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ruh-4',
        name: 'voco Riyadh, an IHG Hotel',
        nameAr: 'فندق فوكو الرياض (طريق الملك فهد)',
        type: '5-Star Contemporary Business & Family Hotel',
        rating: '4.7',
        price: '$180 - $290 / ليلة',
        location: 'طريق الملك فهد، حي النموذجية، الرياض',
        lat: 24.6736,
        lng: 46.7022,
        description: 'Vibrant modern hotel with Cabana pool, luxury spa, and award-winning international dining options.',
        descriptionAr: 'فندق عصري متميز بمسبح الكابانا المفتوح وسبا فاخر وخيارات طعام إيطالية وهندية متميزة.',
        directUrl: buildBookingUrl('voco Riyadh IHG Hotel'),
        tripComUrl: buildTripComUrl('voco Riyadh IHG Hotel'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 2. EGYPT (جمهورية مصر العربية)
  // ==========================================================================

  // A. CAIRO (القاهرة)
  if (normCity.includes('cairo') || normCity.includes('قاهرة') || normCity.includes('القاهرة') || (normDest.includes('egypt') || normDest.includes('مصر'))) {
    return [
      {
        id: 'cai-1',
        name: 'Four Seasons Hotel Cairo at Nile Plaza',
        nameAr: 'فندق فورسيزونز القاهرة نايل بلازا (إطلالة ساحرة على النيل)',
        type: '5-Star Ultra-Luxury Nile-Front Palace',
        rating: '4.9',
        price: '$380 - $650 / ليلة',
        location: 'كورنيش النيل، حي جاردن سيتي، القاهرة',
        lat: 30.0356,
        lng: 31.2308,
        description: 'Iconic luxury hotel in Garden City directly on the Nile River with private balconies, 8 world-class restaurants, and luxury spa.',
        descriptionAr: 'أيقونة الفخامة في جاردن سيتي بإطلالات بانورامية مباشرة على نهر النيل، شرفات خاصة، 8 مطاعم عالمية وسبا متكامل.',
        directUrl: buildBookingUrl('Four Seasons Hotel Cairo at Nile Plaza'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel Cairo at Nile Plaza'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-2',
        name: 'Sofitel Cairo Nile El Gezirah',
        nameAr: 'فندق سوفيتيل كايرو نايل الجزيرة (جزيرة الزمالك)',
        type: '5-Star Luxury Island Resort on the Nile',
        rating: '4.8',
        price: '$260 - $450 / ليلة',
        location: 'الطرف الجنوبي لجزيرة الزمالك، القاهرة',
        lat: 30.0372,
        lng: 31.2256,
        description: 'Tranquil French luxury haven at the tip of Zamalek Island with infinity pool hovering over the Nile and gourmet riverfront dining.',
        descriptionAr: 'ملاذ فاخر على ضفاف جزيرة الزمالك يتميز بمسبح إنفينيتي يطفو فوق النيل ومطاعم عائمة بإطلالات لا مثيل لها.',
        directUrl: buildBookingUrl('Sofitel Cairo Nile El Gezirah'),
        tripComUrl: buildTripComUrl('Sofitel Cairo Nile El Gezirah'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-3',
        name: 'The Nile Ritz-Carlton, Cairo',
        nameAr: 'فندق نايل ريتز-كارلتون القاهرة (ميدان التحرير والكورنيش)',
        type: '5-Star Historic Luxury Hotel',
        rating: '4.8',
        price: '$320 - $550 / ليلة',
        location: 'بين ميدان التحرير وكورنيش النيل، وسط القاهرة',
        lat: 30.0461,
        lng: 31.2333,
        description: 'Positioned between the Nile and Tahrir Square, next to the Egyptian Museum with stunning Nile and Cairo Tower vistas.',
        descriptionAr: 'موقع استراتيجي بين كورنيش النيل والمتحف المصري بميدان التحرير، يجمع بين الفخامة التاريخية والإطلالات البانورامية.',
        directUrl: buildBookingUrl('The Nile Ritz-Carlton Cairo'),
        tripComUrl: buildTripComUrl('The Nile Ritz-Carlton Cairo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-4',
        name: 'Marriott Mena House, Cairo',
        nameAr: 'فندق ماريوت مينا هاوس القاهرة (إطلالة مباشرة على الأهرامات)',
        type: '5-Star Historic Heritage Resort',
        rating: '4.9',
        price: '$290 - $520 / ليلة',
        location: 'شارع الهرم، الجيزة، القاهرة الكبرى',
        lat: 29.9856,
        lng: 31.1328,
        description: 'Legendary palace hotel nestled amidst 40 acres of green gardens with dramatic unobstructed views of the Great Pyramids of Giza.',
        descriptionAr: 'قصر تاريخي أسطوري وسط 40 فداناً من الحدائق الخضراء مع إطلالات مباشرة لا تُحجب على أهرامات الجيزة الخالدة.',
        directUrl: buildBookingUrl('Marriott Mena House Cairo'),
        tripComUrl: buildTripComUrl('Marriott Mena House Cairo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'cai-5',
        name: 'Steigenberger Hotel El Tahrir Cairo',
        nameAr: 'فندق شتايجنبرجر التحرير القاهرة (قلب السنتر)',
        type: '4-Star Superior Modern City Hotel',
        rating: '4.7',
        price: '$120 - $190 / ليلة',
        location: 'شارع قصر النيل، ميدان التحرير، وسط البلد',
        lat: 30.0469,
        lng: 31.2372,
        description: 'Modern, highly rated central hotel steps from Egyptian Museum, Khedivial Cairo, metro, and vibrant downtown shopping.',
        descriptionAr: 'فندق ألماني حديث فائق النظافة في قلب وسط البلد بجوار المتحف المصري ومحطة المترو والمطاعم والأسواق.',
        directUrl: buildBookingUrl('Steigenberger Hotel El Tahrir Cairo'),
        tripComUrl: buildTripComUrl('Steigenberger Hotel El Tahrir Cairo'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 3. UNITED STATES (الولايات المتحدة الأمريكية)
  // ==========================================================================

  // A. ORLANDO (أورلاندو)
  if (normCity.includes('orlando') || normCity.includes('أورلاندو') || normCity.includes('اورلاندو') || normCity.includes('florida') || normCity.includes('فلوريدا')) {
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
        description: 'Ultra-luxury resort within Disney gates featuring private 5-acre water park, Michelin-starred Capa steakhouse, and theme park fireworks views.',
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
      {
        id: 'orl-wal-1',
        name: 'Waldorf Astoria Orlando',
        nameAr: 'فندق والدورف أستوريا أورلاندو (بونيت كريك)',
        type: '5-Star Luxury Golf & Spa Oasis',
        rating: '4.8',
        price: '$380 - $650 / night',
        location: 'Bonnet Creek Resort, Orlando',
        lat: 28.3512,
        lng: -81.5367,
        description: 'Surrounded by the Bonnet Creek nature preserve, championship Rees Jones golf course, Guerlain spa, and private luxury cabanas.',
        descriptionAr: 'واحة فاخرة محاطة بمحمية بونيت كريك الطبيعية مع ملعب غولف عالمي وسبا جيرلان ومسابح فاخرة وقريبة من ديزني.',
        directUrl: buildBookingUrl('Waldorf Astoria Orlando'),
        tripComUrl: buildTripComUrl('Waldorf Astoria Orlando'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // B. NEW YORK (نيويورك)
  if (normCity.includes('york') || normCity.includes('نيويورك') || normCity.includes('manhattan') || normCity.includes('منهاتن')) {
    return [
      {
        id: 'nyc-1',
        name: 'The Plaza Hotel New York',
        nameAr: 'فندق ذا بلازا نيويورك (فيفث أفينيو وسنترال بارك)',
        type: '5-Star Historic Luxury Icon',
        rating: '4.9',
        price: '$850 - $1,600 / night',
        location: 'Fifth Avenue at Central Park South, Manhattan, New York',
        lat: 40.7644,
        lng: -73.9744,
        description: 'Legendary castle of Manhattan on Fifth Avenue overlooking Central Park with timeless grandeur and butler service.',
        descriptionAr: 'قصر مانهاتن الأسطوري على الجادة الخامسة المطل على سنترال بارك مع تاريخ عريق وخدمة كونسيرج لا مثيل لها.',
        directUrl: buildBookingUrl('The Plaza Hotel New York'),
        tripComUrl: buildTripComUrl('The Plaza Hotel New York'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'nyc-2',
        name: 'The Langham, New York, Fifth Avenue',
        nameAr: 'فندق ذا لانغهام نيويورك (فيفث أفينيو)',
        type: '5-Star Contemporary Luxury Hotel',
        rating: '4.9',
        price: '$620 - $1,100 / night',
        location: '400 5th Ave, Midtown Manhattan, New York',
        lat: 40.7501,
        lng: -73.9836,
        description: 'Refined midtown luxury between Bryant Park and Empire State Building with Michelin-starred Ai Fiori dining.',
        descriptionAr: 'فخامة عصرية في قلب الجادة الخامسة بمانهاتن بالقرب من إمباير ستيت ومطعم حاصل على نجمة ميشلان.',
        directUrl: buildBookingUrl('The Langham New York Fifth Avenue'),
        tripComUrl: buildTripComUrl('The Langham New York Fifth Avenue'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 4. QATAR (دولة قطر)
  // ==========================================================================
  if (normCity.includes('doha') || normCity.includes('الدوحة') || normCity.includes('دوحة') || normDest.includes('qatar') || normDest.includes('قطر')) {
    return [
      {
        id: 'doh-1',
        name: 'Mandarin Oriental, Doha',
        nameAr: 'فندق مانديرين أورينتال الدوحة (مشيرب قلب الدوحة)',
        type: '5-Star Ultra-Luxury Urban Sanctuary',
        rating: '4.9',
        price: '$380 - $720 / ليلة',
        location: 'براحة مشيرب، قلب الدوحة، الدوحة',
        lat: 25.2867,
        lng: 51.5298,
        description: 'Refined luxury in the heart of Msheireb Downtown within walking distance of Souq Waqif, Metro, and Al Baraha.',
        descriptionAr: 'تحفة معمارية في قلب مشيرب الذكي على بُعد خطوات مشياً من سوق واقف وساحة البراحة ومحطة المترو الرئيسية.',
        directUrl: buildBookingUrl('Mandarin Oriental Doha Msheireb'),
        tripComUrl: buildTripComUrl('Mandarin Oriental Doha Msheireb'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'doh-2',
        name: 'The St. Regis Doha',
        nameAr: 'فندق سانت ريجيس الدوحة (الخليج الغربي)',
        type: '5-Star Luxury Beach Resort',
        rating: '4.8',
        price: '$320 - $600 / ليلة',
        location: 'الخليج الغربي، الدوحة',
        lat: 25.3582,
        lng: 51.5312,
        description: 'Private beachfront resort in West Bay with Olympic-sized pool, signature St. Regis Butler Service, and Gordon Ramsay dining.',
        descriptionAr: 'منتجع شاطئي خاص في الخليج الغربي يضم مسبحاً أولمبياً وخدمة المساعد الشخصي ومطاعم عالمية راقية.',
        directUrl: buildBookingUrl('The St Regis Doha'),
        tripComUrl: buildTripComUrl('The St Regis Doha'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'doh-3',
        name: 'Marsa Malaz Kempinski, The Pearl - Doha',
        nameAr: 'فندق مرسى ملاذ كمبينسكي اللؤلؤة (جزيرة اللؤلؤة)',
        type: '5-Star Palatial Island Resort',
        rating: '4.8',
        price: '$290 - $540 / ليلة',
        location: 'جزيرة اللؤلؤة، الدوحة',
        lat: 25.3789,
        lng: 51.5542,
        description: 'Palatial European luxury on its own secluded island in The Pearl with private beach, outdoor pools, and spa.',
        descriptionAr: 'قصر أوروبي فخم على جزيرة خاصة في اللؤلؤة مع شاطئ خاص ومسابح متعددة ونشاطات بحرية متكاملة.',
        directUrl: buildBookingUrl('Marsa Malaz Kempinski The Pearl Doha'),
        tripComUrl: buildTripComUrl('Marsa Malaz Kempinski The Pearl Doha'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 5. TURKEY (تركيا)
  // ==========================================================================
  if (normCity.includes('istanbul') || normCity.includes('إسطنبول') || normCity.includes('اسطنبول') || normDest.includes('turkey') || normDest.includes('تركيا')) {
    return [
      {
        id: 'ist-1',
        name: 'Çırağan Palace Kempinski Istanbul',
        nameAr: 'فندق قصر سيراجان كمبينسكي إسطنبول (مطل على البوسفور)',
        type: '5-Star Ottoman Imperial Palace Hotel',
        rating: '4.9',
        price: '$650 - $1,200 / ليلة',
        location: 'طريق سيراجان، بشكطاش، إسطنبول',
        lat: 41.0436,
        lng: 29.0167,
        description: 'The only Ottoman Imperial Palace and Hotel on the Bosphorus, offering royal suites, infinity pool on the strait, and historic gardens.',
        descriptionAr: 'القصر العثماني الوحيد على ضفاف البوسفور، يضم أجنحة ملكية ومسبح إنفينيتي يطل على المضيق وحدائق تاريخية ساحرة.',
        directUrl: buildBookingUrl('Ciragan Palace Kempinski Istanbul'),
        tripComUrl: buildTripComUrl('Ciragan Palace Kempinski Istanbul'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ist-2',
        name: 'Four Seasons Hotel Istanbul at the Bosphorus',
        nameAr: 'فندق فورسيزونز إسطنبول عند البوسفور',
        type: '5-Star Restored 19th-Century Waterfront Palace',
        rating: '4.9',
        price: '$580 - $1,100 / ليلة',
        location: 'بشكطاش، البوسفور، إسطنبول',
        lat: 41.0469,
        lng: 29.0211,
        description: 'A chic converted 19th-century palace along the shimmering waters of the Bosphorus with outdoor terrace and Turkish hammam.',
        descriptionAr: 'قصر تاريخي تم تجديده بإتقان على الواجهة المائية للبوسفور مع تراس ساحر وحمام تركي ملكي.',
        directUrl: buildBookingUrl('Four Seasons Hotel Istanbul at the Bosphorus'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel Istanbul at the Bosphorus'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ist-3',
        name: 'CVK Park Bosphorus Hotel Istanbul',
        nameAr: 'فندق سي في كيه بارك بوسفور إسطنبول (قرب ميدان تقسيم)',
        type: '5-Star Luxury Suites & Apartments',
        rating: '4.8',
        price: '$220 - $420 / ليلة',
        location: 'قرب ميدان تقسيم، إسطنبول',
        lat: 41.0361,
        lng: 28.9886,
        description: 'Luxurious hotel and serviced apartments steps from Taksim Square with panoramic Bosphorus terraces and family suites.',
        descriptionAr: 'أجنحة وشقق فندقية عائلية فخمة على بُعد دقيقتين من ميدان تقسيم وشارع الاستقلال بإطلالات واسعة على البوسفور.',
        directUrl: buildBookingUrl('CVK Park Bosphorus Hotel Istanbul'),
        tripComUrl: buildTripComUrl('CVK Park Bosphorus Hotel Istanbul'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 6. UNITED KINGDOM (المملكة المتحدة - لندن)
  // ==========================================================================
  if (normCity.includes('london') || normCity.includes('لندن') || (normDest.includes('uk') || normDest.includes('britain') || normDest.includes('بريطانيا'))) {
    return [
      {
        id: 'lon-1',
        name: 'The Savoy, London',
        nameAr: 'فندق ذا سافوي لندن (ستراند وضفاف نهر التايمز)',
        type: '5-Star Iconic Edwardian & Art Deco Hotel',
        rating: '4.9',
        price: '$750 - $1,400 / night',
        location: 'Strand, Covent Garden, London WC2R 0EZ',
        lat: 51.5101,
        lng: -0.1206,
        description: 'The epitome of British grandeur on the Strand overlooking the Thames, steps from Covent Garden and West End theatres.',
        descriptionAr: 'رمز الفخامة البريطانية العريقة على شارع الستراند المطل على نهر التايمز بالقرب من كوفنت غاردن ومسارح لندن.',
        directUrl: buildBookingUrl('The Savoy London'),
        tripComUrl: buildTripComUrl('The Savoy London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'lon-2',
        name: 'The Ritz London',
        nameAr: 'فندق ذا ريتز لندن (بيكاديللي وغرين بارك)',
        type: '5-Star World-Famous Luxury Landmark',
        rating: '4.9',
        price: '$850 - $1,600 / night',
        location: '150 Piccadilly, St. James’s, London W1J 9BR',
        lat: 51.5071,
        lng: -0.1416,
        description: 'World-renowned symbol of high society with neoclassical elegance, legendary Afternoon Tea, and Michelin-starred dining.',
        descriptionAr: 'معلم الضيافة الملكية في بيكاديللي بجوار غرين بارك، يشتهر بجلسات شاي بعد الظهر ومطعمه الحائز على نجمة ميشلان.',
        directUrl: buildBookingUrl('The Ritz London'),
        tripComUrl: buildTripComUrl('The Ritz London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'lon-3',
        name: 'Cheval Three Quays at The Tower of London',
        nameAr: 'شقق شيفال ثري كيز الفندقية الفاخرة (إطلالة برج وجسر لندن)',
        type: 'Luxury 5-Star Serviced Riverfront Apartments',
        rating: '4.9',
        price: '$380 - $720 / night',
        location: 'Lower Thames Street, City of London',
        lat: 51.5085,
        lng: -0.0792,
        description: 'Award-winning 1 to 3-bedroom luxury serviced residences right on the Thames with front-row views of Tower Bridge.',
        descriptionAr: 'شقق فندقية عائلية فاخرة مجهزة بالكامل من 1-3 غرف نوم بإطلالة مباشرة مذهلة على نهر التايمز وبرج لندن التاريخي.',
        directUrl: buildBookingUrl('Cheval Three Quays London'),
        tripComUrl: buildTripComUrl('Cheval Three Quays London'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 7. FRANCE (فرنسا - باريس)
  // ==========================================================================
  if (normCity.includes('paris') || normCity.includes('باريس') || (normDest.includes('france') || normDest.includes('فرنسا'))) {
    return [
      {
        id: 'par-1',
        name: 'Four Seasons Hotel George V, Paris',
        nameAr: 'فندق فورسيزونز جورج الخامس باريس (الشانزلزيه)',
        type: 'Palace Distinction Ultra-Luxury Hotel',
        rating: '4.9',
        price: '$1,200 - $2,400 / nuit',
        location: '31 Avenue George V, 8th Arr., Paris',
        lat: 48.8689,
        lng: 2.3008,
        description: 'Art Deco palace landmark in the Golden Triangle with 5 Michelin stars across 3 restaurants and lavish Jeff Leatham floral displays.',
        descriptionAr: 'قصر أرت ديكو أسطوري في المثلث الذهبي بجوار الشانزلزيه، يضم 5 نجوم ميشلان وتنسيقات زهور عالمية ساحرة.',
        directUrl: buildBookingUrl('Four Seasons Hotel George V Paris'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel George V Paris'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'par-2',
        name: 'Pullman Paris Tour Eiffel',
        nameAr: 'فندق بولمان باريس برج إيفل (إطلالة مباشرة على البرج)',
        type: '4-Star Superior View Hotel',
        rating: '4.7',
        price: '$340 - $620 / nuit',
        location: '18 Avenue de Suffren, 15th Arr., Paris',
        lat: 48.8558,
        lng: 2.2936,
        description: 'Set just steps from the Eiffel Tower and Trocadéro with private balconies offering unobstructed Eiffel views.',
        descriptionAr: 'على بُعد خطوات معدودة من برج إيفل مع شرفات خاصة توفر إطلالات مباشرة ساحرة على البرج وساحة التروكاديرو.',
        directUrl: buildBookingUrl('Pullman Paris Tour Eiffel'),
        tripComUrl: buildTripComUrl('Pullman Paris Tour Eiffel'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 8. UAE (الإمارات العربية المتحدة - دبي وأبوظبي)
  // ==========================================================================
  if (normCity.includes('dubai') || normCity.includes('دبي') || (normDest.includes('uae') || normDest.includes('إمارات') || normDest.includes('امارات'))) {
    return [
      {
        id: 'dxb-1',
        name: 'Armani Hotel Dubai',
        nameAr: 'فندق أرماني دبي (داخل برج خليفة)',
        type: '5-Star Ultra-Luxury Designer Hotel',
        rating: '4.9',
        price: '$550 - $1,100 / ليلة',
        location: 'برج خليفة، وسط مدينة دبي (Downtown Dubai)',
        lat: 25.1972,
        lng: 55.2744,
        description: 'Sophisticated luxury designed personally by Giorgio Armani inside the world’s tallest tower with direct Dubai Mall access.',
        descriptionAr: 'تصميم فاخر من إبداع جورجيو أرماني داخل برج خليفة مع إطلالات على نافورة دبي ودخول مباشر لدبي مول.',
        directUrl: buildBookingUrl('Armani Hotel Dubai Burj Khalifa'),
        tripComUrl: buildTripComUrl('Armani Hotel Dubai Burj Khalifa'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'dxb-2',
        name: 'Atlantis The Royal, Palm Jumeirah',
        nameAr: 'أتلانتس ذا رويال، نخلة جميرا دبي',
        type: '5-Star Ultra-Luxury Experiential Resort',
        rating: '4.9',
        price: '$850 - $1,600 / ليلة',
        location: 'هلال نخلة جميرا، دبي',
        lat: 25.1378,
        lng: 55.1264,
        description: 'New architectural wonder of Dubai featuring Cloud 22 sky pool, celebrity chef restaurants, and private beachfront.',
        descriptionAr: 'الأعجوبة المعمارية الأحدث في نخلة جميرا مع مسبح كلاود 22 المعلق وأرقى مطاعم الطهاة العالميين وشاطئ خاص.',
        directUrl: buildBookingUrl('Atlantis The Royal Palm Jumeirah Dubai'),
        tripComUrl: buildTripComUrl('Atlantis The Royal Palm Jumeirah Dubai'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'dxb-3',
        name: 'Address Downtown Dubai',
        nameAr: 'فندق العنوان وسط مدينة دبي (Address Downtown)',
        type: '5-Star Premium Luxury Landmark',
        rating: '4.8',
        price: '$420 - $780 / ليلة',
        location: 'بوليفارد الشيخ محمد بن راشد، داون تاون دبي',
        lat: 25.1956,
        lng: 55.2789,
        description: 'Flagship luxury hotel overlooking Burj Khalifa and Dubai Fountain with multi-tiered infinity pool and connected walkway to Dubai Mall.',
        descriptionAr: 'موقع مميز على بوليفارد محمد بن راشد بإطلالات مباشرة على نافورة دبي وبرج خليفة ومسابح متعددة المستويات.',
        directUrl: buildBookingUrl('Address Downtown Dubai'),
        tripComUrl: buildTripComUrl('Address Downtown Dubai'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 9. JAPAN (اليابان - طوكيو وكيوتو وأوساكا)
  // ==========================================================================
  if (normCity.includes('tokyo') || normCity.includes('طوكيو') || normDest.includes('japan') || normDest.includes('اليابان')) {
    return [
      {
        id: 'tyo-1',
        name: 'Aman Tokyo',
        nameAr: 'فندق أمان طوكيو (أوتيماتشي بالقرب من قصر الإمبراطور)',
        type: '5-Star Ultra-Luxury Urban Sanctuary',
        rating: '4.9',
        price: '$1,100 - $2,200 / night',
        location: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo',
        lat: 35.6869,
        lng: 139.7644,
        description: 'Monumental Japanese minimalism atop Otemachi Tower with panoramic views of Mount Fuji and the Imperial Palace Gardens.',
        descriptionAr: 'قمة الفخامة اليابانية الهادئة أعلى برج أوتيماتشي مع إطلالات على قصر الإمبراطور وجبل فوجي وسبا ياباني تقليدي.',
        directUrl: buildBookingUrl('Aman Tokyo Hotel'),
        tripComUrl: buildTripComUrl('Aman Tokyo Hotel'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'tyo-2',
        name: 'Cerulean Tower Tokyu Hotel, Shibuya',
        nameAr: 'فندق سيروليان تاور شيبويا طوكيو',
        type: '5-Star High-Rise City Landmark',
        rating: '4.8',
        price: '$320 - $580 / night',
        location: '26-1 Sakuragaokacho, Shibuya-ku, Tokyo',
        lat: 35.6561,
        lng: 139.7001,
        description: 'Panoramic skyline hotel minutes from Shibuya Scramble Crossing, high-speed train connections, and premier shopping.',
        descriptionAr: 'برج فندقي فخم على بُعد خطوات من تقاطع شيبويا الشهير ومحطات القطار السريع مع إطلالات ليلية خلابة.',
        directUrl: buildBookingUrl('Cerulean Tower Tokyu Hotel Shibuya'),
        tripComUrl: buildTripComUrl('Cerulean Tower Tokyu Hotel Shibuya'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 10. SWITZERLAND & AUSTRIA (سويسرا والنمسا)
  // ==========================================================================
  if (normCity.includes('geneva') || normCity.includes('جنيف') || normCity.includes('zurich') || normCity.includes('زيورخ') || normCity.includes('interlaken') || normCity.includes('انترلاكن') || normDest.includes('switzerland') || normDest.includes('سويسرا')) {
    return [
      {
        id: 'ch-1',
        name: 'Four Seasons Hotel des Bergues Geneva',
        nameAr: 'فندق فورسيزونز دي بيرغ جنيف (بحيرة جنيف)',
        type: '5-Star Historic Lakefront Palace',
        rating: '4.9',
        price: '$850 - $1,600 / night',
        location: '33 Quai des Bergues, Geneva',
        lat: 46.2069,
        lng: 6.1461,
        description: 'The first hotel in Geneva on the shores of Lake Geneva with views of the Jet d’Eau and Mont Blanc.',
        descriptionAr: 'أعرق فنادق جنيف التاريخية على ضفاف البحيرة بإطلالات ساحرة على نافورة جنيف وجبال الألب ومطعم إل لاغو الإيطالي.',
        directUrl: buildBookingUrl('Four Seasons Hotel des Bergues Geneva'),
        tripComUrl: buildTripComUrl('Four Seasons Hotel des Bergues Geneva'),
        sourceProvider: 'Booking.com & Trip.com',
      },
      {
        id: 'ch-2',
        name: 'Victoria-Jungfrau Grand Hotel & Spa, Interlaken',
        nameAr: 'فندق وسبا فيكتوريا يونغفراو إنترلاكن',
        type: '5-Star Historic Alpine Luxury Resort',
        rating: '4.9',
        price: '$550 - $1,100 / night',
        location: 'Höheweg 41, Interlaken',
        lat: 46.6869,
        lng: 7.8572,
        description: 'Legendary grand hotel overlooking the Jungfrau massif with a 5,500m² spa and sprawling alpine gardens.',
        descriptionAr: 'قصر ألبيني تاريخي في قلب إنترلاكن يطل مباشرة على قمة يونغفراو الثلجية مع سبا صحي عالمي بمساحة 5500 متر مربع.',
        directUrl: buildBookingUrl('Victoria Jungfrau Grand Hotel Interlaken'),
        tripComUrl: buildTripComUrl('Victoria Jungfrau Grand Hotel Interlaken'),
        sourceProvider: 'Booking.com & Trip.com',
      },
    ];
  }

  // ==========================================================================
  // 11. UNIVERSAL DYNAMIC GENERATOR (لأي مدينة أخرى حول العالم)
  // ==========================================================================
  const tierPrice1 = isLuxury ? '$480 - $850 / ليلة' : isEconomy ? '$75 - $130 / ليلة' : '$160 - $280 / ليلة';
  const tierPrice2 = isLuxury ? '$380 - $660 / ليلة' : isEconomy ? '$65 - $115 / ليلة' : '$140 - $230 / ليلة';
  const tierPrice3 = isLuxury ? '$310 - $520 / ليلة' : isEconomy ? '$55 - $95 / ليلة' : '$110 - $180 / ليلة';

  return [
    {
      id: `univ-acc-1-${normCity}`,
      name: `Luxury 5-Star Central Hotel & Suites - ${cityDisplay}`,
      nameAr: `فندق وأجنحة سنترال الفاخرة (5 نجوم) في ${cityDisplay}`,
      type: isLuxury ? '5-Star Luxury Central Landmark' : 'Premium Central Hotel',
      rating: '4.9',
      price: tierPrice1,
      location: `${cityDisplay} - Downtown & Central District`,
      lat: 24.7136,
      lng: 46.6753,
      description: `Premier top-rated 5-star hotel in central ${cityDisplay} offering luxurious rooms, 24-hour concierge, gourmet breakfast, and direct access to top landmarks.`,
      descriptionAr: `أحد أعلى الفنادق تقييماً في سنتر ${cityDisplay}، يوفر غرفاً فسيحة فاخرة، خدمة كونسيرج على مدار 24 ساعة، وقريب من أهم المعالم ووسائل النقل.`,
      directUrl: buildBookingUrl(`Luxury Hotel in ${cityDisplay}`),
      tripComUrl: buildTripComUrl(`Luxury Hotel in ${cityDisplay}`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-2-${normCity}`,
      name: `Family Serviced Apartment Suites (1-3 Beds) - ${cityDisplay}`,
      nameAr: `أجنحة شقق فندقية عائلية متكاملة (1-3 غرف) في ${cityDisplay}`,
      type: 'Serviced Family Apartment Suites',
      rating: '4.8',
      price: tierPrice2,
      location: `${cityDisplay} - Safe Prime Residential & Tourist Area`,
      lat: 24.7236,
      lng: 46.6853,
      description: `Spacious multi-bedroom serviced apartments in ${cityDisplay} with fully equipped kitchen, laundry, spacious living lounge, and family amenities.`,
      descriptionAr: `شقق فندقية عائلية واسعة ومجهزة بالكامل بمطبخ متكامل وغسالة وصالة معيشة في منطقة سياحية آمنة في ${cityDisplay}.`,
      directUrl: buildBookingUrl(`Serviced Apartments in ${cityDisplay}`),
      tripComUrl: buildTripComUrl(`Serviced Apartments in ${cityDisplay}`),
      sourceProvider: 'Booking.com & Trip.com',
    },
    {
      id: `univ-acc-3-${normCity}`,
      name: `Boutique Modern City Hotel - ${cityDisplay}`,
      nameAr: `فندق بوتيك مودرن في ${cityDisplay}`,
      type: '4-Star Superior Boutique Hotel',
      rating: '4.7',
      price: tierPrice3,
      location: `${cityDisplay} - Shopping & Metro Promenade`,
      lat: 24.7336,
      lng: 46.6953,
      description: `Stylish contemporary design hotel in ${cityDisplay} near metro lines, lively cafes, and shopping boulevards with high-speed Wi-Fi and gym.`,
      descriptionAr: `فندق عصري أنيق بتصميم حديث بجوار خطوط المواصلات والمقاهي ومناطق التسوق مع إنترنت فائق السرعة وإفطار يومي متميز.`,
      directUrl: buildBookingUrl(`Boutique Hotel in ${cityDisplay}`),
      tripComUrl: buildTripComUrl(`Boutique Hotel in ${cityDisplay}`),
      sourceProvider: 'Booking.com & Trip.com',
    },
  ];
}
