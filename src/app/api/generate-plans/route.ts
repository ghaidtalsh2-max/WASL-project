import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { findCountry, getCountryFlagEmoji, COUNTRIES } from '@/lib/data/countries';

// Dynamic fallback package builder based strictly on user preferences (No static hardcoded Japan/Turkey)
function buildDynamicFallbackPlans(params: {
  preferredVibe?: string;
  targetCities?: string;
  interests?: string[];
  durationStr?: string;
  budget?: string;
  travelParty?: string;
}) {
  const { preferredVibe, targetCities, interests = [], durationStr = '2 Weeks', budget = 'moderate', travelParty = 'solo' } = params;
  const vibe = (preferredVibe || '').toLowerCase();
  const rawTarget = (targetCities || '').toLowerCase();

  // If user entered specific preferred cities/regions
  if (rawTarget) {
    if (rawTarget.includes('malaysia') || rawTarget.includes('ماليزيا') || rawTarget.includes('kuala lumpur') || rawTarget.includes('كوالالمبور')) {
      return [
        {
          id: 'plan-1-my',
          destinationCountry: 'Malaysia',
          destinationCountryAr: 'ماليزيا',
          destinationCity: 'Kuala Lumpur & Penang',
          destinationCityAr: 'كوالالمبور وبينانج',
          isoCode: 'MY',
          flag: '🇲🇾',
          title: 'Metropolitan Marvels & Culinary Heritage',
          titleAr: 'عجائب العاصمة الحديثة وتراث المأكولات العالمية',
          tagline: 'Petronas Towers, lush urban rainforests, and world-renowned UNESCO street gastronomy',
          taglineAr: 'أبراج بتروناس الأيقونية، الغابات الاستوائية الحضرية، وأشهر مأكولات الشارع التراثية',
          duration: durationStr,
          seasonalVibe: 'Tropical vibrancy, modern air-conditioned malls & gentle evening breezes',
          seasonalVibeAr: 'أجواء استوائية ممتعة، مجمعات تسوق حديثة، وأمسيات ساحرة',
          touristAttractions: ['Petronas Twin Towers', 'Batu Caves', 'Penang Street Art', 'KLCC Park'],
          museums: ['Islamic Arts Museum Malaysia', 'National Museum KL', 'Pinang Peranakan Mansion'],
          eventsAndActivities: ['KL Tower Sky Deck Walk', 'Penang Food Trail', 'Batu Caves Cultural Tour'],
          whyRecommended: 'Ideal balance between rich cultural diversity, top-tier shopping, and 100% Halal dining comfort.',
          whyRecommendedAr: 'الخيار الأمثل للجمع بين حيوية المدينة العصرية، التسوق الفاخر، والتنوع الغذائي الحلال بالكامل.',
        },
        {
          id: 'plan-2-sg',
          destinationCountry: 'Singapore',
          destinationCountryAr: 'سنغافورة',
          destinationCity: 'Singapore & Sentosa',
          destinationCityAr: 'سنغافورة وجزيرة سنتوسا',
          isoCode: 'SG',
          flag: '🇸🇬',
          title: 'Futuristic Garden Metropolis & Sentosa Island',
          titleAr: 'مدينة الحدائق المستقبلية وجزيرة سنتوسا الترفيهية',
          tagline: 'Gardens by the Bay supertrees, world-class theme parks, and futuristic skyline',
          taglineAr: 'أشجار حدائق الخليج العملاقة، أحدث مدن الملاهي العالمية، وأفق معماري مستقبلي',
          duration: durationStr,
          seasonalVibe: 'Clean, green, ultra-modern luxury and family entertainment',
          seasonalVibeAr: 'نظافة فائقة، مساحات خضراء شاسعة، وتجارب ترفيهية متطورة لجميع الأعمار',
          touristAttractions: ['Gardens by the Bay', 'Marina Bay Sands SkyPark', 'Universal Studios Singapore'],
          museums: ['ArtScience Museum', 'National Gallery Singapore', 'Asian Civilisations Museum'],
          eventsAndActivities: ['SuperTree Light Show', 'Sentosa Cable Car Experience', 'Night Safari'],
          whyRecommended: 'Unsurpassed safety, high-tech infrastructure, and thrilling entertainment for all travelers.',
          whyRecommendedAr: 'أعلى معايير الأمان العالمية، شبكة نقل فائقة التطور، وأنشطة ترفيهية رائدة.',
        },
      ];
    }
  }

  // 1. Entertainment & Theme Parks (ألعاب وحياة مدن)
  if (vibe.includes('entertainment') || vibe.includes('theme') || vibe.includes('fun') || vibe.includes('العاب') || vibe.includes('مدن') || interests.includes('entertainment')) {
    return [
      {
        id: 'plan-1-orlando',
        destinationCountry: 'United States',
        destinationCountryAr: 'الولايات المتحدة الأمريكية',
        destinationCity: 'Orlando, Florida',
        destinationCityAr: 'أورلاندو، فلوريدا',
        isoCode: 'US',
        flag: '🇺🇸',
        title: 'Theme Park Capital & Epic Entertainment',
        titleAr: 'عاصمة الملاهي والترفيه العالمي الأولى',
        tagline: 'World-famous Walt Disney World, Universal Epic Universe, and endless resort fun',
        taglineAr: 'منتجعات ديزني وورلد العالمية، يونيفرسال ستوديوز، وتجارب الترفيه العائلية الأسطورية',
        duration: durationStr,
        seasonalVibe: 'Sunny Florida warmth, thrilling rides & vibrant entertainment boulevards',
        seasonalVibeAr: 'شمس فلوريدا المشرقة، مدن ألعاب عملاقة، وأمسيات ترفيهية حيوية',
        touristAttractions: ['Walt Disney World Resort', 'Universal Studios Florida', 'Kennedy Space Center', 'ICON Park'],
        museums: ['Orlando Museum of Art', 'Orlando Science Center', 'Titanic Artifact Exhibition'],
        eventsAndActivities: ['Universal CityWalk Night Tour', 'Airboat Everglades Safari', 'Disney Springs Shopping'],
        whyRecommended: 'The undisputed global destination for mega theme parks and family-focused excitement.',
        whyRecommendedAr: 'الوجهة العالمية الأولى لمدن الملاهي الضخمة والفعاليات الترفيهية التي لا مثيل لها.',
      },
      {
        id: 'plan-2-tokyo',
        destinationCountry: 'Japan',
        destinationCountryAr: 'اليابان',
        destinationCity: 'Tokyo',
        destinationCityAr: 'طوكيو',
        isoCode: 'JP',
        flag: '🇯🇵',
        title: 'High-Tech Urban Wonderland & Anime Districts',
        titleAr: 'عالم التقنية المستقبلي ومراكز الترفيه الحديثة',
        tagline: 'Tokyo DisneySea, teamLab digital art, and vibrant neon metropolis',
        taglineAr: 'ديزني سي طوكيو الفريدة، معارض teamLab للفنون الرقمية، وأحياء الأنمي والإلكترونيات',
        duration: durationStr,
        seasonalVibe: 'Crisp city energy, ultra-fast Shinkansen transit & dazzling digital lights',
        seasonalVibeAr: 'طاقة مدنية لا تهدأ، قطارات فائقة السرعة، وإضاءات رقمية مبهرة',
        touristAttractions: ['Tokyo DisneySea', 'Shibuya Sky', 'teamLab Planets', 'Akihabara Tech City'],
        museums: ['Mori Art Museum', 'Miraikan Emerging Science', 'Ghibli Museum'],
        eventsAndActivities: ['Shibuya Crossing Experience', 'VR Theme Park Shinjuku', 'Odaiba Seaside Leisure'],
        whyRecommended: 'Unmatched blend of next-gen digital entertainment, safety, and unique theme parks.',
        whyRecommendedAr: 'مزيج استثنائي يجمع بين الترفيه الرقمي المتطور وأعلى مستويات الأمان والتنظيم.',
      },
    ];
  }

  // 2. Nature & Serenity (هدوء ورسف وطبيعة)
  if (vibe.includes('nature') || vibe.includes('هدوء') || vibe.includes('طبيعة') || interests.includes('nature')) {
    return [
      {
        id: 'plan-1-swiss',
        destinationCountry: 'Switzerland',
        destinationCountryAr: 'سويسرا',
        destinationCity: 'Interlaken & Lucerne',
        destinationCityAr: 'إنترلاكن ولوزيرن',
        isoCode: 'CH',
        flag: '🇨🇭',
        title: 'Alpine Splendor & Crystal Lakes',
        titleAr: 'سحر جبال الألب والبحيرات الكريستالية',
        tagline: 'Jungfraujoch Top of Europe, pristine glacial lakes, and panoramic scenic trains',
        taglineAr: 'قمة يونغفراوجوخ أعلى أوروبا، بحيرات برينز وثون الفيروزية، والقطارات البانورامية',
        duration: durationStr,
        seasonalVibe: 'Fresh mountain breeze, crisp alpine meadows & pure relaxation',
        seasonalVibeAr: 'هواء نقي منعش، مروج خضراء وجبال شاهقة، وقمة الهدوء والاسترخاء',
        touristAttractions: ['Jungfraujoch Top of Europe', 'Lake Brienz & Lake Thun', 'Harder Kulm Lookout', 'Chapel Bridge'],
        museums: ['Swiss Museum of Transport', 'Ballenberg Open-Air Museum', 'Glacier Garden'],
        eventsAndActivities: ['Lake Brienz Steamboat Cruise', 'GoldenPass Scenic Train', 'Lauterbrunnen Valley Walk'],
        whyRecommended: 'Unrivaled natural beauty, world-class train network, and utmost peacefulness.',
        whyRecommendedAr: 'جمال طبيعي لا يقارن، شبكة قطارات متكاملة وفائقة الدقة، وهدوء تام بعيداً عن صخب المدن.',
      },
      {
        id: 'plan-2-italy-como',
        destinationCountry: 'Italy',
        destinationCountryAr: 'إيطاليا',
        destinationCity: 'Lake Como & Dolomites',
        destinationCityAr: 'بحيرة كومو وجبال الدولوميت',
        isoCode: 'IT',
        flag: '🇮🇹',
        title: 'Tranquil Lakeside Villas & Alpine Valleys',
        titleAr: 'فلل بحيرة كومو الهادئة ووديان جبال الألب الإيطالية',
        tagline: 'Scenic Bellagio waters, historic botanical gardens, and majestic Dolomite peaks',
        taglineAr: 'ضفاف بيلاجيو الساحرة، الحدائق النباتية الملكية، والقمم الصخرية الخلابة',
        duration: durationStr,
        seasonalVibe: 'Romantic lakeside breezes, slow dining & serene mountain vistas',
        seasonalVibeAr: 'نسائم البحر والبحيرات الهادئة، مقاهٍ ساحلية راقية، وإطلالات جبلية مريحة للأعصاب',
        touristAttractions: ['Villa del Balbianello', 'Bellagio Waterfront', 'Lake Braies (Dolomites)', 'Val di Funes'],
        museums: ['Villa Carlotta Museum & Garden', 'Messner Mountain Museum', 'Como Silk Museum'],
        eventsAndActivities: ['Private Boat Tour on Lake Como', 'Scenic Cableway Excursion', 'Artisan Gelato Masterclass'],
        whyRecommended: 'Exceptional slow-paced elegance, scenic landscapes, and rejuvenating natural escapes.',
        whyRecommendedAr: 'أناقة وهدوء استثنائي على ضفاف البحيرات الإيطالية الشهيرة مع تجربة استجمام راقية.',
      },
    ];
  }

  // 3. Beaches & Wellness / Recovery (شواطئ ونقاهة واستجمام)
  if (vibe.includes('beach') || vibe.includes('wellness') || vibe.includes('شواطئ') || vibe.includes('نقاهة') || interests.includes('wellness')) {
    return [
      {
        id: 'plan-1-maldives',
        destinationCountry: 'Maldives',
        destinationCountryAr: 'جزر المالديف',
        destinationCity: 'Malé & Private Atolls',
        destinationCityAr: 'ماليه والمنتجعات المائية',
        isoCode: 'MV',
        flag: '🇲🇻',
        title: 'Overwater Luxury & Marine Sanctuary',
        titleAr: 'الفلل المائية الفاخرة وملاذ الشعب المرجانية',
        tagline: 'Turquoise lagoons, private infinity pools, and world-class spa retreats',
        taglineAr: 'بحيرات تركوازية نقية، مسابح خاصة معلقة فوق البحر، وجلسات سبا واستجمام عالمية',
        duration: durationStr,
        seasonalVibe: 'Sun-drenched tropical bliss, gentle waves & private serenity',
        seasonalVibeAr: 'أجواء استوائية مشمسة، مياه كريستالية دافئة، وخصوصية تامة للاستجمام',
        touristAttractions: ['Baa Atoll Biosphere', 'Ari Atoll Coral Gardens', 'Submarine Tours', 'Sandbank Islands'],
        museums: ['National Museum Male', 'Old Friday Mosque'],
        eventsAndActivities: ['Sunset Dolphin Cruise', 'Underwater Dining Experience', 'Coral Reef Snorkeling'],
        whyRecommended: 'The ultimate global benchmark for privacy, crystal-clear waters, and full physical rejuvenation.',
        whyRecommendedAr: 'الوجهة الأفضل عالمياً للاستجمام والراحة التامة والخصوصية الفندقية الفاخرة.',
      },
      {
        id: 'plan-2-french-riviera',
        destinationCountry: 'France',
        destinationCountryAr: 'فرنسا',
        destinationCity: 'Nice & French Riviera',
        destinationCityAr: 'نيس والريفييرا الفرنسية',
        isoCode: 'FR',
        flag: '🇫🇷',
        title: 'Mediterranean Riviera Glamour & Coastal Serenity',
        titleAr: 'سحر الريفييرا الفرنسية وشواطئ البحر الأبيض المتوسط',
        tagline: 'Promenade des Anglais, Monaco harbor vistas, and azure coastal breezes',
        taglineAr: 'ممشى الإنجليز الشهير في نيس، إطلالات موناكو الساحلية، ونسائم البحر الفيروزية',
        duration: durationStr,
        seasonalVibe: 'Warm Mediterranean sun, seaside promenade walks & fresh seafood dining',
        seasonalVibeAr: 'أجواء البحر المتوسط المعتدلة، المشي على الواجهة البحرية، وتناول المأكولات الطازجة',
        touristAttractions: ['Promenade des Anglais', 'Castle Hill Panorama', 'Eze Medieval Village', 'Monaco Port'],
        museums: ['Musée Matisse', 'Marc Chagall Museum', 'Oceanographic Museum of Monaco'],
        eventsAndActivities: ['Coastal Train to Cannes & Monaco', 'Old Town Flower Market Walk', 'Riviera Sunset Boat'],
        whyRecommended: 'Sophisticated seaside leisure combining world-class culture, promenades, and coastal wellness.',
        whyRecommendedAr: 'وجهة بحرية تجمع بين فخامة الريفييرا، المشاهد الطبيعية المفتوحة، والمتاحف العريقة.',
      },
    ];
  }

  // 4. Default / History & Culture (تاريخ وثقافة)
  return [
    {
      id: 'plan-1-rome',
      destinationCountry: 'Italy',
      destinationCountryAr: 'إيطاليا',
      destinationCity: 'Rome & Florence',
      destinationCityAr: 'روما وفلورنسا',
      isoCode: 'IT',
      flag: '🇮🇹',
      title: 'Eternal Empires & Renaissance Masterpieces',
      titleAr: 'عظمة الإمبراطوريات التاريخية وروائع عصر النهضة',
      tagline: 'Colosseum, Vatican Museums, and Florence Renaissance galleries',
      taglineAr: 'الكولوسيوم العظيم، متاحف الفاتيكان التاريخية، وكنوز فلورنسا المعمارية',
      duration: durationStr,
      seasonalVibe: 'Timeless monuments, stone-paved piazzas & open-air historic splendor',
      seasonalVibeAr: 'معالم أثرية خالدة، ساحات مرصوفة نابضة بالتاريخ، وعمارة لا تضاهى',
      touristAttractions: ['Colosseum & Roman Forum', 'Trevi Fountain & Pantheon', 'Duomo of Florence', 'Ponte Vecchio'],
      museums: ['Vatican Museums', 'Uffizi Gallery', 'Galleria dell Accademia'],
      eventsAndActivities: ['Sunset at Piazza Navona', 'Frecciarossa High-Speed Rail Journey', 'Artisan Espresso Tour'],
      whyRecommended: 'The epicenter of classical Western civilization and unparalleled historical architecture.',
      whyRecommendedAr: 'الوجهة الحضارية الأولى لعشاق الآثار والمتاحف العالمية والقصور التاريخية.',
    },
    {
      id: 'plan-2-kyoto',
      destinationCountry: 'Japan',
      destinationCountryAr: 'اليابان',
      destinationCity: 'Kyoto & Nara',
      destinationCityAr: 'كيوتو ونارا',
      isoCode: 'JP',
      flag: '🇯🇵',
      title: 'Ancient Sanctuaries, Bamboo Groves & Geisha Culture',
      titleAr: 'المعابد العريقة، غابات الخيزران، والتقاليد اليابانية الأصيلة',
      tagline: 'Fushimi Inari torii gates, Arashiyama bamboo forest, and thousand-year heritage',
      taglineAr: 'بوابات فوشيمي إيناري الحمراء، غابة خيزران أراشيياما، وتاريخ ياباني يمتد لأكثر من ألف عام',
      duration: durationStr,
      seasonalVibe: 'Zen serenity, peaceful wooden pavilions & centuries of cultural wisdom',
      seasonalVibeAr: 'هدوء نفسي عميق، حدائق زن الحجرية، وطقوس الشاي التراثية',
      touristAttractions: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Nara Deer Park'],
      museums: ['Kyoto National Museum', 'Kyoto Railway Museum', 'Hosomi Museum of Traditional Arts'],
      eventsAndActivities: ['Traditional Tea Ceremony in Gion', 'Sagano Romantic Scenic Train', 'Philosopher’s Path Walk'],
      whyRecommended: 'Unmatched immersion in living ancient traditions, pristine gardens, and spiritual peace.',
      whyRecommendedAr: 'تجربة ثقافية فريدة تغمرك في التقاليد اليابانية الأصيلة والحدائق المعتنى بها بعناية فائقة.',
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      interests = [],
      duration = 'weeks',
      dates = '',
      travelStyle = 'cultural',
      preferences = '',
      purpose = 'tourism',
      origin = 'Any',
      freeText = '',
      preferredVibe = '',
      targetCities = '',
      apiKey,
      provider,
    } = body;

    const prompt = `You are WASL AI travel planning engine.
The user requested 2 tailored, diverse, contrasting suggested trip packages for "ليس لدي خطة" based on these parameters:
- Preferred Travel Vibe: "${preferredVibe || 'Balanced'}" (e.g. Theme Parks & Cities, Nature & Serenity, History & Culture, Beaches & Wellness)
- Target Destinations/Preferences: "${targetCities || 'Any top international destination'}"
- Interests: ${Array.isArray(interests) && interests.length > 0 ? interests.join(', ') : 'Sightseeing, local gastronomy, landmark exploration'}
- Duration: ${duration || '2 Weeks'}
- Dates / Season: ${dates || 'Upcoming season'}
- Travel Style: ${travelStyle || 'Balanced'}
- Free-Text Notes: "${freeText || ''}"

TASK:
Generate exactly 2 contrasting, exciting, realistic trip packages strictly tailored to the user's preferred vibe and requested cities in JSON format.
For example:
- If vibe is "Theme Parks & City Life" -> Option 1: Orlando / USA, Option 2: Tokyo / Japan (or Singapore).
- If vibe is "Nature & Serenity" -> Option 1: Interlaken / Switzerland, Option 2: Lake Como & Dolomites / Italy.
- If vibe is "Beaches & Wellness" -> Option 1: Maldives, Option 2: French Riviera / France (or Bali).
- If specific target city mentioned (e.g. Malaysia / Kuala Lumpur) -> Incorporate that exact destination and an appropriate contrast.

STRICT JSON OUTPUT FORMAT:
{
  "suggestedPlans": [
    {
      "id": "plan-1",
      "destinationCountry": "Country in English (e.g. United States, Switzerland, Malaysia)",
      "destinationCountryAr": "Country in Arabic (e.g. الولايات المتحدة الأمريكية، سويسرا، ماليزيا)",
      "destinationCity": "City name in English (e.g. Orlando, Florida, Interlaken, Kuala Lumpur)",
      "destinationCityAr": "City name in Arabic (e.g. أورلاندو، إنترلاكن، كوالالمبور)",
      "isoCode": "2-letter ISO code (e.g. US, CH, MY, JP, IT, FR, MV, SG)",
      "flag": "Matching Flag Emoji (e.g. 🇺🇸, 🇨🇭, 🇲🇾, 🇯🇵, 🇮🇹, 🇫🇷, 🇲🇻, 🇸🇬)",
      "title": "Inspiring Title in English",
      "titleAr": "عنوان ملهم باللغة العربية",
      "tagline": "Short Catchy Tagline in English",
      "taglineAr": "عبارة تعريفية قصيرة باللغة العربية",
      "duration": "${duration === 'days' ? '5-7 Days' : duration === 'weeks' ? '2 Weeks' : '1 Month'}",
      "seasonalVibe": "Seasonal atmospheric description in English",
      "seasonalVibeAr": "وصف أجواء الموسم باللغة العربية",
      "touristAttractions": ["Attraction 1", "Attraction 2", "Attraction 3", "Attraction 4"],
      "museums": ["Museum 1", "Museum 2"],
      "eventsAndActivities": ["Activity 1", "Activity 2", "Activity 3"],
      "whyRecommended": "Reasoning in English",
      "whyRecommendedAr": "سبب التوصية باللغة العربية"
    },
    {
      "id": "plan-2",
      "destinationCountry": "Contrasting Country in English",
      "destinationCountryAr": "اسم الدولة باللغة العربية",
      "destinationCity": "Contrasting City in English",
      "destinationCityAr": "اسم المدينة باللغة العربية",
      "isoCode": "2-letter ISO code",
      "flag": "Matching Flag Emoji",
      "title": "Title in English",
      "titleAr": "عنوان باللغة العربية",
      "tagline": "Tagline in English",
      "taglineAr": "عبارة تعريفية باللغة العربية",
      "duration": "${duration === 'days' ? '5-7 Days' : duration === 'weeks' ? '2 Weeks' : '1 Month'}",
      "seasonalVibe": "Seasonal atmospheric description in English",
      "seasonalVibeAr": "وصف أجواء الموسم باللغة العربية",
      "touristAttractions": ["Attraction 1", "Attraction 2", "Attraction 3", "Attraction 4"],
      "museums": ["Museum 1", "Museum 2"],
      "eventsAndActivities": ["Activity 1", "Activity 2", "Activity 3"],
      "whyRecommended": "Reasoning in English",
      "whyRecommendedAr": "سبب التوصية باللغة العربية"
    }
  ]
}`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.planGeneration,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.4,
    });

    if (aiRes.error) {
      const dynamicFallbacks = buildDynamicFallbackPlans({
        preferredVibe,
        targetCities,
        interests,
        durationStr: duration === 'days' ? '5-7 Days' : duration === 'weeks' ? '2 Weeks' : '1 Month',
      });
      return NextResponse.json({ success: true, suggestedPlans: dynamicFallbacks, warning: aiRes.error });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      if (parsed.suggestedPlans && Array.isArray(parsed.suggestedPlans) && parsed.suggestedPlans.length >= 2) {
        // Ensure accurate flags & ISO codes
        const normalizedPlans = parsed.suggestedPlans.map((plan: any, idx: number) => {
          const resolvedFlag = plan.flag && plan.flag !== '🌐' ? plan.flag : getCountryFlagEmoji(plan.destinationCountry || plan.isoCode);
          return {
            ...plan,
            id: plan.id || `plan-${idx + 1}`,
            flag: resolvedFlag,
            isoCode: plan.isoCode || (findCountry(plan.destinationCountry)?.code || 'UN'),
          };
        });
        return NextResponse.json({ success: true, suggestedPlans: normalizedPlans });
      }
      throw new Error('Invalid suggestedPlans format');
    } catch {
      const dynamicFallbacks = buildDynamicFallbackPlans({
        preferredVibe,
        targetCities,
        interests,
        durationStr: duration === 'days' ? '5-7 Days' : duration === 'weeks' ? '2 Weeks' : '1 Month',
      });
      return NextResponse.json({ success: true, suggestedPlans: dynamicFallbacks });
    }
  } catch (error: any) {
    const dynamicFallbacks = buildDynamicFallbackPlans({});
    return NextResponse.json({ success: true, suggestedPlans: dynamicFallbacks });
  }
}
