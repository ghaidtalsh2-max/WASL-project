export interface CityKnowledge {
  coffee: {
    en: string;
    ar: string;
  };
  food: {
    en: string;
    ar: string;
  };
  attractions: {
    en: string;
    ar: string;
  };
  hotels: {
    en: string;
    ar: string;
  };
  souvenirs: {
    en: string;
    ar: string;
  };
  sim: {
    en: string;
    ar: string;
  };
  weather: {
    en: string;
    ar: string;
  };
  transport: {
    en: string;
    ar: string;
  };
}

export const CHAT_CITY_KNOWLEDGE: Record<string, CityKnowledge> = {
  // GERMANY / BERLIN
  'germany': {
    coffee: {
      en: `☕ **Top Specialty Coffee Roasters in Berlin (Germany):**\n\n1. **The Barn (Mitte & Kurfürstendamm):** Berlin's world-famous specialty roastery pioneer, renowned for pure light roasts and championship V60 pour-overs.\n2. **Five Elephant (Kreuzberg & Mitte):** Renowned micro-roastery serving exquisite espresso and their iconic Philadelphia-style cheesecake.\n3. **Bonanza Coffee Roasters (Prenzlauer Berg & Kreuzberg):** Third-wave pioneers in a stunning industrial-brick roastery.\n4. **19grams Coffee (Alexanderplatz):** Multi-origin roastery & specialty brunch near Alexanderplatz.\n5. **Refinery High End Coffee (Mitte):** Precision pour-overs and single origins.`,
      ar: `☕ **أفضل مقاهي ومحامص القهوة المختصة في برلين (ألمانيا):**\n\n1. **ذا بارن (The Barn - حي ميتي وشارع كورفورستيندام):** أشهر محمصة قهوة مختصة في ألمانيا وأوروبا؛ رائدة التحميص الخفيف ومحاصيل البن الفاخرة والتقطير اليدوي V60.\n2. **فايف إليفانت (Five Elephant - حي كروزبرج وميتي):** محمصة وإسبريسو بار شهير عالمياً بقهوته الحرفية والتشيز كيك الكلاسيكي الأسطوري.\n3. **بونانزا كوفي روستر (Bonanza Coffee - برينزلاور بيرغ):** من أوائل رواد الموجة الثالثة للقهوة في برلين منذ 2006.\n4. **19 جرامز كوفي (19grams - ساحة ألكسندر بلاتز):** محمصة عصرية تقدم محاصيل فردية المصدر ووجبات إفطار برنش فاخرة.\n5. **ريفينيري هاي إند كوفي (Refinery - حي ميتي):** لعشاق الإسبريسو النقي والتقطير الحرفي.`,
    },
    food: {
      en: `🍽️ **Top BBQ Grills, Steakhouses & Halal Dining in Berlin:**\n\n1. **Hasir Restaurant (Kreuzberg & Mitte):** The legendary home of traditional charcoal-grilled Turkish kebabs and steaks.\n2. **Grill Royal (Mitte - Spree River):** High-end steakhouse with river views serving dry-aged German beef.\n3. **Tugra Restaurant (Halal):** Upscale Ottoman halal cuisine and lamb chops.\n4. **Mustafa's Gemüse Kebap (Mehringdamm):** World-famous street food chicken doner with roasted vegetables.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والستيك والأكلات الحلال في برلين:**\n\n1. **مطعم حصير التاريخي (Hasir - كروزبرج وميتي):** أعرق مطاعم المشاوي والكباب التركي المشوي على الفحم واللحوم الطازجة.\n2. **مطعم جريل رويال (Grill Royal - على ضفاف نهر شبريه):** أرقى مطعم ستيك ومشويات للحوم البقرية الفاخرة.\n3. **مطعم طغراء (Tugra - حلال):** مأكولات عثمانية فاخرة وريش لحم الضأن المشوية.\n4. **مصطفى جيموز كباب (Mustafa's Gemuse Kebap):** كباب ودجاج مشوي مع الخضار الطازجة الأشهر في ألمانيا.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks & Attractions in/near Berlin:**\n\n1. **Tropical Islands Resort (Krausnick - 45 mins from Berlin):** The world's largest indoor water park inside a colossal airship hangar with indoor rainforest, beaches, and extreme water slides.\n2. **Filmpark Babelsberg:** Cinema theme park with stunt shows and medieval sets.\n3. **Legoland Discovery Centre Berlin (Potsdamer Platz):** Indoor interactive LEGO family kingdom.\n4. **Berlin Zoo & Aquarium:** World's most species-rich zoo.`,
      ar: `🎡 **أفضل مدن الملاهي والألعاب المائية في برلين ومحيطها:**\n\n1. **منتجع الجزر الاستوائية (Tropical Islands Resort - أكبر حديقة مائية مغلقة في العالم):** تقع داخل أضخم قبة عملاقة وتضم غابة استوائية وشواطئ رملية وزحاليق مائية عملاقة دافئة طوال العام.\n2. **فيلم بارك بابلسبيرغ (Filmpark Babelsberg):** مدينة ملاهي سينمائية مع عروض الأكشن الحية.\n3. **ليجولاند ديسكفري سنتر (Legoland Berlin - ساحة بوتسدامر بلاتز):** ألعاب تفاعلية عائلية.\n4. **حديقة حيوان برلين التاريخية (Berlin Zoo):** أقدم وأغنى حديقة حيوان في أوروبا.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Berlin:** Hotel Adlon Kempinski (Brandenburg Gate), The Ritz-Carlton Berlin (Potsdamer Platz), Regent Berlin.`,
      ar: `🏨 **أفضل الفنادق في برلين:** فندق أدلون كمبينسكي (بجوار بوابة براندنبورغ)، ذا ريتز-كارلتون برلين (ساحة بوتسدامر بلاتز)، وريجنت برلين.`,
    },
    souvenirs: {
      en: `🎁 **Best Souvenirs in Berlin:** Ampelmännchen (traffic light man merchandise), Berlin Wall historic fragments, KPM Berlin porcelain, KaDeWe luxury shopping.`,
      ar: `🎁 **أفضل الهدايا والتسوق في برلين:** منتجات رجل المرور التراثي (Ampelmännchen)، قطع تاريخية تذكارية من جدار برلين، ومول كادي فيه (KaDeWe) الأكبر في أوروبا.`,
    },
    sim: {
      en: `📱 **SIM Cards in Germany:** Telekom (T-Mobile) has best 5G network; Vodafone and O2. Requires passport registration.`,
      ar: `📱 **شرائح الإنترنت في ألمانيا:** شركة Telekom (الأقوى في 5G) وتليها Vodafone و O2، ويمكن تفعيلها من المطار أو فروعهم بجواز السفر.`,
    },
    weather: {
      en: `🌤️ **Berlin Weather:** Spring (12-20°C), Summer (22-28°C), Autumn (8-16°C), Winter (-1 to 5°C with snow). Pack warm coats in winter.`,
      ar: `🌤️ **طقس برلين والملابس:** الربيع (12°-20°م)، الصيف (22°-28°م)، الخريف (8°-16°م)، الشتاء (-1° إلى 5°م مع ثلوج)؛ يتطلب معاطف شتوية دافئة.`,
    },
    transport: {
      en: `🚕 **Transport in Berlin:** Uber and FreeNow for taxis; BVG U-Bahn (Subway) & S-Bahn trains using the BVG Tickets app.`,
      ar: `🚕 **المواصلات في برلين:** تطبيق Uber وتطبيق FreeNow لسيارات الأجرة؛ ومترو U-Bahn و S-Bahn بتذاكر BVG اليومية.`,
    },
  },

  // UNITED KINGDOM / LONDON
  'united-kingdom': {
    coffee: {
      en: `☕ **Top Specialty Coffee in London:** Monmouth Coffee (Borough Market & Covent Garden), WatchHouse (Tower Bridge & Somerset House), Workshop Coffee, Ozone Coffee Roasters (Shoreditch).`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في لندن:** مونموث كوفي (Monmouth - بورو ماركت وكوفنت جاردن)، ووتش هاوس (WatchHouse)، ووركشوب كوفي، وأوزون كوفي روستر.`,
    },
    food: {
      en: `🍽️ **Top BBQ Grills & Halal in London:** Dishoom (Covent Garden & Shoreditch - Halal meats), Hawksmoor Seven Dials (Steaks), Benares (Mayfair - Michelin Halal Indian), Al Arez (Edgware Road).`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في لندن:** مطعم ديشوم (Dishoom - مأكولات ومشاوي حلال راقية)، وهوكسمور (Hawksmoor للستيك)، وبنارس مايفير (ميشلان حلال)، ومطاعم إدجوير رود.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks near London:** Thorpe Park (UK's fastest coasters), Chessington World of Adventures, Legoland Windsor, Warner Bros. Studio Tour (Harry Potter).`,
      ar: `🎡 **أفضل مدن الملاهي في لندن:** ثورب بارك (Thorpe Park للأفعوانيات السريعة)، شيسينغتون، ليجولاند وندسور، وجولة استوديوهات هاري بوتر.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in London:** The Savoy, The Dorchester (Mayfair), Claridge's, The Ritz London.`,
      ar: `🏨 **أفضل الفنادق في لندن:** ذا سافوي، ذا دورشستر (مايفير)، كلاريدجز، وذا ريتز لندن.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in London:** Fortnum & Mason royal tea and biscuits, Harrods signature hampers, Liberty London silk scarves, Regent Street boutiques.`,
      ar: `🎁 **أفضل الهدايا والتسوق في لندن:** شاي وبسكويت فورتنام آند ميسون الملكي، هدايا متجر هارودز، وشاحات ليبرتي الحريرية، ومتاجر شارع ريجنت ستريت.`,
    },
    sim: {
      en: `📱 **SIM Cards in UK:** EE (fastest 5G), Vodafone, Three, O2. Available at Heathrow arrivals.`,
      ar: `📱 **شرائح الإنترنت في بريطانيا:** شركة EE (الأسرع والأقوى) وتليها فودافون و Three، ومتوفرة بصالات مطار هيثرو.`,
    },
    weather: {
      en: `🌤️ **London Weather:** Temperate maritime climate with occasional rain. Always carry a compact umbrella.`,
      ar: `🌤️ **طقس لندن:** معتدل مع أمطار محتملة على مدار العام؛ يُنصح دائماً بحمل مظلة خفيفة ومعطف مناسب.`,
    },
    transport: {
      en: `🚕 **Transport in London:** London Black Cabs and Uber; London Underground (Tube) using contactless bank card tap.`,
      ar: `🚕 **المواصلات في لندن:** التاكسي الأسود الشهير (Black Cab) وتطبيق Uber؛ ومترو لندن (Underground) بالدفع المباشر بالبطاقة اللاتلامسية أو Apple Pay.`,
    },
  },

  // FRANCE / PARIS
  'france': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Paris:** Telescope (Palais-Royal), Café de Flore, Coutume Café (7th Arr.), Fragments (Le Marais), La Fontaine de Belleville.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في باريس:** تليسكوب (Telescope بجوار باليه رويال)، كافيه دو فلور التاريخي، كوتوم كافيه (Coutume)، وفراغمنتس في حي الماريه.`,
    },
    food: {
      en: `🍽️ **Top Dining & Halal in Paris:** Le Relais de l'Entrecôte (Steak frites), L'Ambroisie (Michelin 3-Star), Les Grands Enfants (Halal French gastronomy), Noura (Champs-Élysées).`,
      ar: `🍽️ **أفضل المطاعم والحلال في باريس:** لورليه دو لانتركوت (الستيك المقلي بصلصته السرية)، لي غراند أونفان (مأكولات فرنسية حلال فاخرة)، ومطعم نورا في الشانزليزيه.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Paris:** Disneyland Paris & Walt Disney Studios, Parc Astérix, Jardin d'Acclimatation.`,
      ar: `🎡 **أفضل مدن الملاهي في باريس:** ديزني لاند باريس واستوديوهات والت ديزني، بارك أستريكس، وحديقة التأقلم الترفيهية.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Paris:** The Ritz Paris (Place Vendôme), Four Seasons Hotel George V, Le Meurice.`,
      ar: `🏨 **أفضل الفنادق في باريس:** ذا ريتز باريس (ساحة فاندوم)، فور سيزونز جورج الخامس، ولو موريس.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Paris:** Ladurée / Pierre Hermé macarons, French perfumes from Grasse, Galeries Lafayette luxury shopping.`,
      ar: `🎁 **أفضل الهدايا والتسوق في باريس:** ماكرون لادوريه وبيير هيرميه، العطور الفرنسية الفاخرة، ومجمع غاليري لافاييت الشهير.`,
    },
    sim: {
      en: `📱 **SIM Cards in France:** Orange (best 5G network), SFR, Bouygues Telecom. Free Mobile.`,
      ar: `📱 **شرائح الإنترنت في فرنسا:** شركة Orange (الشبكة الأولى في فرنسا) وتليها SFR و Bouygues Telecom.`,
    },
    weather: {
      en: `🌤️ **Paris Weather:** Mild spring/autumn (15-20°C), warm summer (25-30°C), cool winter (3-8°C).`,
      ar: `🌤️ **طقس باريس:** معتدل ربيعاً وخريفاً (15°-20°م)، دافئ صيفاً (25°-30°م)، وبارد شتاءً (3°-8°م).`,
    },
    transport: {
      en: `🚕 **Transport in Paris:** Uber and G7 Taxi; Paris Métro & RER trains using the Navigo Easy card.`,
      ar: `🚕 **المواصلات في باريس:** تطبيق G7 Taxi وتطبيق Uber؛ ومترو باريس وشبكة قطارات RER ببطاقة Navigo.`,
    },
  },

  // ITALY / ROME
  'italy': {
    coffee: {
      en: `☕ **Top Coffee in Rome:** Sant'Eustachio Il Caffè (Historic wood-roast espresso), Tazza d'Oro (near Pantheon), Faro - Luminari del Caffè (Specialty V60), Roscioli Caffè.`,
      ar: `☕ **أفضل مقاهي القهوة في روما:** سانت أوستاشيو (Sant'Eustachio بالقرب من البانثيون منذ 1938)، تازا دورو (Tazza d'Oro)، وفارو (Faro) للقهوة المختصة والـ V60.`,
    },
    food: {
      en: `🍽️ **Top Dining & Halal in Rome:** Ristorante Aroma (Colosseum view), Halal Vatican Restaurant, Ciro & Ciro, Da Enzo al 29 (Trastevere pasta).`,
      ar: `🍽️ **أفضل المطاعم في روما:** مطعم أروما بإطلالة الكولوسيوم، مطاعم الباستا والبيتزا التراثية في حي تراستيفيري، والمطاعم الحلال المعتمدة بوسط المدينة.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Rome:** Cinecittà World (Cinema theme park), Rainbow MagicLand, Hydromania Water Park.`,
      ar: `🎡 **أفضل مدن الملاهي في روما:** شينيتشيتا وورلد (Cinecitta World للألعاب السينمائية)، ورينبو ماجيك لاند، وحديقة هيدرومانيا المائية.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Rome:** Hotel de Russie (Piazza del Popolo), Hassler Roma (Spanish Steps), Rome Cavalieri Waldorf Astoria.`,
      ar: `🏨 **أفضل الفنادق في روما:** فندق دي روسي (ساحة بوبولو)، هاسلر روما (السلالم الإسبانية)، وفندق والدورف أستوريا روما كافاليري.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Rome:** Italian genuine leather goods (Via dei Condotti), Murano glass, artisanal olive oil, Piazza di Spagna boutiques.`,
      ar: `🎁 **أفضل الهدايا والتسوق في روما:** المنتجات الجلدية الإيطالية الأصلية، زجاج مورانو، زيت الزيتون البكر، ومتاجر ساحة إسبانيا الشهيرة.`,
    },
    sim: {
      en: `📱 **SIM Cards in Italy:** TIM (Telecom Italia), Vodafone, WindTre, Iliad.`,
      ar: `📱 **شرائح الإنترنت في إيطاليا:** شركة TIM (الشبكة الوطنية الأقوى) وتليها Vodafone و WindTre.`,
    },
    weather: {
      en: `🌤️ **Rome Weather:** Mediterranean sunny climate; hot dry summers (30-34°C), mild pleasant winters (8-14°C).`,
      ar: `🌤️ **طقس روما:** متوسطي مشمس ودافئ صيفاً (30°-34°م)، ومعتدل لطيف شتاءً (8°-14°م).`,
    },
    transport: {
      en: `🚕 **Transport in Rome:** FreeNow & Uber; Rome Metro (Line A & B) using Contactless bank cards.`,
      ar: `🚕 **المواصلات في روما:** تطبيق FreeNow وتطبيق Uber؛ ومترو روما (الخط A و B) بالدفع المباشر بالبطاقة البنكية.`,
    },
  },

  // SPAIN / MADRID
  'spain': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Madrid:** Toma Café (Malasaña), Acid Bakehouse, Hola Coffee, Misión Café.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في مدريد:** توما كافيه (Toma Cafe في حي مالاسانيا)، أسيد بيك هاوس، هولا كوفي، وميسيون كافيه.`,
    },
    food: {
      en: `🍽️ **Top Dining & Halal in Madrid:** Sobrino de Botín (World's oldest restaurant founded 1725), Asador de Aranda (Roast lamb), Alzahra Halal Restaurant (near M-30 Mosque).`,
      ar: `🍽️ **أفضل المطاعم في مدريد:** مطعم بوتين (أقدم مطعم في العالم منذ 1725)، أسادور دي أراندا للمشاوي واللحم المشوي، ومطعم الزهراء الحلال بجوار مسجد مدريد.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Madrid:** Parque Warner Madrid (Superman & Batman coasters), Parque de Atracciones de Madrid, Aquopolis Villanueva.`,
      ar: `🎡 **أفضل مدن الملاهي في مدريد:** باركي وارنر مدريد (Parque Warner وعوالم باتمان وسوبرمان)، ومدينة ملاهي كاسا دي كامبو، وأكوابوليس المائية.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Madrid:** Four Seasons Hotel Madrid, Mandarin Oriental Ritz, The Westin Palace.`,
      ar: `🏨 **أفضل الفنادق في مدريد:** فور سيزونز مدريد، ماندرين أورينتال ريتز، وذا وستن بالاس.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Madrid:** Real Madrid official gear (Santiago Bernabéu), Spanish fans (Abanicos), Gran Vía & Salamanca shopping.`,
      ar: `🎁 **أفضل الهدايا والتسوق في مدريد:** منتجات ريال مدريد الأصلية من متجر السانتياغو برنابيو، المراوح الإسبانية التراثية، ومتاجر شارع غران فيا وحي سالامانكا.`,
    },
    sim: {
      en: `📱 **SIM Cards in Spain:** Movistar (best coverage), Vodafone, Orange, Yoigo.`,
      ar: `📱 **شرائح الإنترنت في إسبانيا:** شركة Movistar (الشبكة الأولى) وتليها فودافون وأورانج.`,
    },
    weather: {
      en: `🌤️ **Madrid Weather:** Sunny continental climate; hot summers (32-36°C), crisp cool winters (5-11°C).`,
      ar: `🌤️ **طقس مدريد:** مشمس وقاري؛ حار صيفاً (32°-36°م) ومعتدل وبارد نسبياً شتاءً (5°-11°م).`,
    },
    transport: {
      en: `🚕 **Transport in Madrid:** Cabify and Uber; Madrid Metro network using Multi Card.`,
      ar: `🚕 **المواصلات في مدريد:** تطبيق Cabify وتطبيق Uber؛ وشبكة مترو مدريد ببطاقة Multi Card.`,
    },
  },
};
