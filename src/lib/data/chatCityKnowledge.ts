export interface CityKnowledge {
  coffee: { en: string; ar: string };
  food: { en: string; ar: string };
  attractions: { en: string; ar: string };
  hotels: { en: string; ar: string };
  souvenirs: { en: string; ar: string };
  sim: { en: string; ar: string };
  weather: { en: string; ar: string };
  transport: { en: string; ar: string };
}

export const CHAT_CITY_KNOWLEDGE: Record<string, CityKnowledge> = {
  // 1. GERMANY / BERLIN
  'germany': {
    coffee: {
      en: `☕ **Top Specialty Coffee Roasters in Berlin (Germany):**\n\n1. **The Barn (Mitte & Kurfürstendamm):** World-famous pioneer of light roasts & V60 pour-overs.\n2. **Five Elephant (Kreuzberg & Mitte):** Renowned espresso bar & legendary Philadelphia cheesecake.\n3. **Bonanza Coffee Roasters (Prenzlauer Berg):** Third-wave pioneers in a stunning industrial roastery.\n4. **19grams Coffee (Alexanderplatz):** Multi-origin roastery with specialty brunch.\n5. **Refinery High End Coffee (Mitte):** Precision artisanal extractions.`,
      ar: `☕ **أفضل مقاهي ومحامص القهوة المختصة في برلين (ألمانيا):**\n\n1. **ذا بارن (The Barn - حي ميتي وشارع كورفورستيندام):** أشهر محمصة قهوة مختصة في ألمانيا وأوروبا؛ رائدة التحميص الخفيف ومحاصيل البن الفاخرة والتقطير اليدوي V60.\n2. **فايف إليفانت (Five Elephant - كروزبرج وميتي):** محمصة وإسبريسو بار شهير عالمياً بقهوته الحرفية والتشيز كيك الكلاسيكي الأسطوري.\n3. **بونانزا كوفي روستر (Bonanza Coffee - برينزلاور بيرغ):** من رواد الموجة الثالثة للقهوة في برلين منذ 2006.\n4. **19 جرامز كوفي (19grams - ساحة ألكسندر بلاتز):** محمصة عصرية تقدم محاصيل فردية المصدر وإفطار برنش فاخر.\n5. **ريفينيري هاي إند كوفي (Refinery - حي ميتي):** لعشاق الإسبريسو الحرفي والتقطير النقي.`,
    },
    food: {
      en: `🍽️ **Top BBQ Grills & Halal in Berlin:** Hasir Restaurant (Legendary Turkish charcoal grills), Grill Royal (Spree River dry-aged steakhouse), Tugra (Halal Ottoman dining), Mustafa's Gemüse Kebap.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في برلين:** مطعم حصير التاريخي (Hasir للمشاوي والكباب التركي على الفحم)، جريل رويال (ستيك فاخر على نهر شبريه)، مطعم طغراء (أطباق عثمانية حلال)، ومصطفى جيموز كباب.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in/near Berlin:** Tropical Islands Resort (World's largest indoor water park), Filmpark Babelsberg, Legoland Discovery Centre Berlin.`,
      ar: `🎡 **أفضل مدن الملاهي والألعاب في برلين ومحيطها:** منتجع الجزر الاستوائية (Tropical Islands Resort - أضخم حديقة مائية مغلقة في العالم)، فيلم بارك بابلسبيرغ، وليجولاند برلين.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Berlin:** Hotel Adlon Kempinski (Brandenburg Gate), The Ritz-Carlton Berlin, Regent Berlin.`,
      ar: `🏨 **أفضل الفنادق في برلين:** فندق أدلون كمبينسكي (بوابة براندنبورغ)، ذا ريتز-كارلتون برلين، وريجنت برلين.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Berlin:** Ampelmännchen merchandise, Berlin Wall historical fragments, KPM porcelain, KaDeWe luxury department store.`,
      ar: `🎁 **أفضل الهدايا والتسوق في برلين:** منتجات رجل المرور التراثي (Ampelmännchen)، قطع تذكارية من جدار برلين، ومول كادي فيه (KaDeWe).`,
    },
    sim: {
      en: `📱 **SIM Cards in Germany:** Telekom (T-Mobile 5G), Vodafone, and O2. Available at airport arrivals.`,
      ar: `📱 **شرائح الإنترنت في ألمانيا:** شركة Telekom (الأقوى في 5G) وتليها فودافون و O2 بجواز السفر.`,
    },
    weather: {
      en: `🌤️ **Berlin Weather:** Spring (12-20°C), Summer (22-28°C), Autumn (8-16°C), Winter (-1 to 5°C with snow). Heavy winter coat needed.`,
      ar: `🌤️ **طقس برلين:** الربيع (12°-20°م)، الصيف (22°-28°م)، الخريف (8°-16°م)، الشتاء (-1° إلى 5°م مع ثلوج)؛ يتطلب معاطف شتوية دافئة.`,
    },
    transport: {
      en: `🚕 **Transport in Berlin:** Uber and FreeNow; BVG U-Bahn & S-Bahn trains using BVG app.`,
      ar: `🚕 **المواصلات في برلين:** تطبيق Uber وتطبيق FreeNow؛ ومترو U-Bahn و S-Bahn بتذاكر BVG اليومية.`,
    },
  },

  // 2. CHINA / BEIJING
  'china': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Beijing:** Metal Hands Coffee (Sanlitun & Dashilar - lever espresso machines), Berry Beans (Qianmen Hutong rooftop views), % Arabica (Taikoo Li & WF Central), Barista Coffee Roasters (Wudaoying).`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في بكين (الصين):** ميتال هاندز (Metal Hands للإسبريسو اليدوي ومشروب الفستق والـ V60)، بيري بينز (Berry Beans بأزقة الهوتونغ التراثية)، بالمائة أرابيكا (% Arabica في سانليتون)، وباريستا كوفي روستر.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Beijing:** Ju Bao Yuan (聚宝源 - Niujie Mosque historic copper-pot halal lamb hotpot & grills), Kaorou Ji (烤肉季 - 1848 Halal Mongolian griddle lamb at Houhai Lake), Hong Bin Lou (鸿宾楼 - Premier Halal banquet dining), Dadong Roast Duck (Wangfujing).`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في بكين (الصين):** مطعم جوباو يوان (Ju Bao Yuan - شارع جامع نيوجيه التاريخي لهوت بوت ومشاوي لحم الضأن النحاسي الحلال)، مطعم كاورو جي (Kaorou Ji - شواء اللحم على الصاج ببحيرة هوهاي منذ 1848)، هونغ بين لو (Hong Bin Lou للمشاوي الملكية الحلال)، ومطعم دادونغ لبط بكين المشوي.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Beijing:** Universal Studios Beijing (Transformers Metrobase, Kung Fu Panda Land, Harry Potter), Happy Valley Beijing (Thrilling coasters), Water Cube Aquapark.`,
      ar: `🎡 **أفضل مدن الملاهي في بكين (الصين):** يونيفرسال ستوديوز بكين (Universal Studios - عالم المتحولون وكونغ فو باندا وهاري بوتر)، هابي فالي بكين (Happy Valley للأفعوانيات)، والحديقة المائية بالمكعب الأولمبي.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Beijing:** The Peninsula Beijing (Wangfujing), Waldorf Astoria Beijing (Hutong villas), Rosewood Beijing (Sanlitun).`,
      ar: `🏨 **أفضل الفنادق في بكين:** فندق ذا بينينسيولا (شارع وانغفوجينغ)، والدورف أستوريا بكين (فلل الهوتونغ التراثية)، وروزوود بكين.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Beijing:** Ruifuxiang tailored silk qipao & garments, Beijing jasmine tea, cloisonné enamel vases, Silk Market (Xiushui).`,
      ar: `🎁 **أفضل الهدايا والتسوق في بكين:** حرير رويفو شيانغ الفاخر وأزياء الهانفو، شاي الياسمين الصيني، التحف الخزفية، وسوق الحرير (Silk Market).`,
    },
    sim: {
      en: `📱 **SIM Cards in China:** China Mobile and China Unicom (available at Beijing Capital PEK / Daxing PKX with passport).`,
      ar: `📱 **شرائح الإنترنت في الصين:** شركتا China Mobile و China Unicom (متوفرة بصالات مطار العاصمة PKX/PEK بجواز السفر).`,
    },
    weather: {
      en: `🌤️ **Beijing Weather:** Spring/Autumn pleasant, Summer warm (30-34°C), Winter cold and dry (-5 to 5°C).`,
      ar: `🌤️ **طقس بكين:** معتدل ربيعاً وخريفاً، حار صيفاً (30°-34°م)، وبارد جاف شتاءً (-5° إلى 5°م).`,
    },
    transport: {
      en: `🚕 **Transport in Beijing:** Didi Chuxing app (English supported) & Beijing Subway with contactless Alipay QR.`,
      ar: `🚕 **المواصلات في بكين:** تطبيق Didi Chuxing (يدعم الإنجليزية والبطاقات الدولية)، وشبكة مترو بكين عبر Alipay.`,
    },
  },

  // 3. UNITED STATES / WASHINGTON DC
  'united-states': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Washington, D.C.:** Compass Coffee (Downtown & Georgetown), Blue Bottle Coffee (Georgetown & Union Market), Tryst (Adams Morgan), La Colombe (Chinatown).`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في واشنطن:** كومباس كوفي (Compass Coffee - السنتر وجورج تاون)، بلو بوتل كوفي (Blue Bottle)، تريست كوفي (Tryst)، ولا كولومب في تشاينا تاون.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Washington, D.C.:** Fogo de Chão Brazilian Steakhouse (Pennsylvania Ave), Albi (Michelin Levantine wood-fired grill), Moby Dick House of Kabob (Georgetown halal grills), The Halal Guys (Dupont Circle).`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في واشنطن:** فوجو دي تشاو (Fogo de Chao للمشاوي البرازيلية الفاخرة)، مطعم ألبي (Albi ميشلان للمشاوي على الحطب)، موبي ديك (Moby Dick للكباب على الفحم)، ومطعم ذا حلال غايز.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks near Washington, D.C.:** Six Flags America (Bowie, MD - 20 mins), Kings Dominion (VA), Busch Gardens Williamsburg, Smithsonian National Zoo.`,
      ar: `🎡 **أفضل مدن الملاهي في واشنطن ومحيطها:** ملاهي سيكس فلاجز أمريكا (Six Flags America على بعد 20 دقيقة)، كينغز دومينيون (Kings Dominion)، بوش جاردنز، وحديقة الحيوان الوطنية.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Washington, D.C.:** The Willard InterContinental, The Ritz-Carlton Georgetown, Waldorf Astoria Washington DC.`,
      ar: `🏨 **أفضل الفنادق في واشنطن:** ذا ويلارد إنتركونتيننتال (بجوار البيت الأبيض)، ذا ريتز-كارلتون جورج تاون، ووالدورف أستوريا.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Washington, D.C.:** Smithsonian official space & history memorabilia, Tysons Corner & Galleria luxury shopping, Georgetown M Street boutiques.`,
      ar: `🎁 **أفضل الهدايا والتسوق في واشنطن:** مقتنيات متاحف سميثسونيان الفضائية والتاريخية، مجمع تايسونز كورنر، ومتاجر حي جورج تاون.`,
    },
    sim: {
      en: `📱 **SIM Cards in USA:** T-Mobile (prepaid tourist eSIM), AT&T, and Verizon.`,
      ar: `📱 **شرائح الإنترنت في أمريكا:** شركة T-Mobile (شريحة eSIM سياحية مسبقة الدفع) وشركة AT&T.`,
    },
    weather: {
      en: `🌤️ **Washington Weather:** Spring/Autumn crisp and scenic, Summer warm/humid (30-34°C), Winter cold (0-5°C).`,
      ar: `🌤️ **طقس واشنطن:** معتدل وجميل ربيعاً وخريفاً، دافئ صيفاً (30°-34°م)، وبارد شتاءً (0°-5°م).`,
    },
    transport: {
      en: `🚕 **Transport in Washington, D.C.:** Uber and Lyft; Washington Metro using Apple Wallet SmarTrip card.`,
      ar: `🚕 **المواصلات في واشنطن:** تطبيق Uber وتطبيق Lyft؛ ومترو Washington Metro بالدفع عبر Apple Pay وبطاقة SmarTrip.`,
    },
  },

  // 4. GEORGIA / TBILISI
  'georgia': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Tbilisi (Georgia):** Coffee LAB (Kazbegi & Vake - premier local roaster & V60), ERTI KAVA (Rustaveli & Old Tbilisi), Shavi Coffee Roasters (Vake), Fabrika.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في تبيليسي (جورجيا):** كوفي لاب (Coffee LAB - المحمصة الأولى للبن والتقطير V60)، إيرتي كافا (ERTI KAVA بالبلدة القديمة وروستافيلي)، شافي كوفي روستر (Shavi Coffee)، وكافيهات مجمع فابريكا.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Tbilisi:** Tsiskvili Restaurant Complex (Georgian Mtsvadi skewers with waterfalls & folk shows), Funicular Restaurant (Mtatsminda city views), Beirut Halal Lebanese Restaurant (Marjanishvili).`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في تبيليسي (جورجيا):** مجمع تسيسكفيلي (Tsiskvili للمشاوي الجورجية والشلالات الحية)، مطعم فونيكولار البانورامي (Funicular)، ومطعم بيروت اللبناني الحلال 100% في شارع مرجانيشفيلي.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Tbilisi:** Mtatsminda Amusement Park (Giant Ferris wheel & roller coasters via Funicular), Gino Paradise Tbilisi (Massive water park & wave pools), East Point (Focus Mokus & IMAX), Astra Park (Go-karting).`,
      ar: `🎡 **أفضل مدن الملاهي والألعاب المائية في تبيليسي (جورجيا):** مدينة ملاهي متاتسميندا (Mtatsminda Park بالقطار المعلق وعجلة فيريس)، ملاهي جينو بارادايس المائية (Gino Paradise)، مجمع إيست بوينت، وأسترا بارك لسباقات الكارتينج.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Tbilisi:** The Biltmore Hotel Tbilisi (Rustaveli), Radisson Blu Iveria, Stamba Hotel, Rooms Hotel Tbilisi.`,
      ar: `🏨 **أفضل الفنادق في تبيليسي:** فندق بيلتمور تبيليسي (شارع روستافيلي)، راديسون بلو إيفيريا، فندق ستامبا، وفندق رومز.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Tbilisi:** Minankari cloisonné silver enamel jewelry, mountain honey, churchkhela walnut candy, Dry Bridge Flea Market antiques, Galleria Tbilisi.`,
      ar: `🎁 **أفضل الهدايا والتسوق في تبيليسي:** مجوهرات المينانكاري الفضية الملونة (Minankari)، العسل الجبلي، حلويات التشورتشخيلا، سوق الجسر الجاف للتحف، ومول غاليريا تبيليسي.`,
    },
    sim: {
      en: `📱 **SIM Cards in Georgia:** Magti (ماجتي - #1 4G/5G nationwide coverage) & Silknet. Available at Tbilisi Airport arrivals 24/7.`,
      ar: `📱 **شرائح الإنترنت في جورجيا:** شركة ماجتي (Magti - الأقوى والأوسع تغطية) وسيلك نت (Silknet)، متوفرة بصالة المطار على مدار 24 ساعة.`,
    },
    weather: {
      en: `🌤️ **Tbilisi Weather:** Spring/Autumn pleasant (15-23°C), Summer sunny (28-35°C), Winter cool (0-7°C).`,
      ar: `🌤️ **طقس تبيليسي:** معتدل ربيعاً وخريفاً (15°-23°م)، دافئ صيفاً (28°-35°م)، وبارد شتاءً (0°-7°م).`,
    },
    transport: {
      en: `🚕 **Transport in Tbilisi:** Bolt (top rated & cheapest taxi app) and Tbilisi Metro network with Metromoney card.`,
      ar: `🚕 **المواصلات في تبيليسي:** تطبيق Bolt (الخيار الأول والأرخص للتاكسي)، ومترو تبيليسي ببطاقة Metromoney.`,
    },
  },

  // 5. SINGAPORE
  'singapore': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Singapore:** Chye Seng Huat Hardware (Jalan Besar 360-degree brew bar), Bacha Coffee (ION Orchard & Jewel Changi), Nylon Coffee Roasters (Everton Park), Common Man Coffee Roasters, % Arabica (Arab Street).`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في سنغافورة:** تشاي سينغ هوات (Chye Seng Huat بجالان بيسار)، باشا كوفي (Bacha Coffee بآيون أورشارد ومطار شانغي)، نايلون كوفي روستر (Nylon Coffee بإيفرتون بارك)، كومون مان كوفي، وبالمائة أرابيكا في شارع العرب.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Singapore:** Lau Pa Sat Satay Street (Open-air charcoal satay skewers), Zam Zam Restaurant (Iconic halal murtabak & biryani since 1908), The Halia (Botanic Gardens MUIS Halal steaks), Poulet.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في سنغافورة:** شارع الساتاي في سوق لاو با سات (Lau Pa Sat لأسياخ المشاوي على الفحم)، مطعم زام زام التاريخي (شارع العرب)، مطعم ذا هاليا في الحدائق النباتية (حلال معتمد MUIS).`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Singapore:** Universal Studios Singapore (USS Sentosa), Skyline Luge Sentosa, Adventure Cove Waterpark, Jewel Changi Canopy Park.`,
      ar: `🎡 **أفضل مدن الملاهي في سنغافورة:** يونيفرسال ستوديوز سنغافورة (USS Sentosa)، زحليقة سنتوسا المعلقة (Skyline Luge)، حديقة أدفنتشر كوف المائية، ومنتزه جويل شانغي المعلق.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Singapore:** Marina Bay Sands, Raffles Hotel Singapore, The Ritz-Carlton Millenia, Pan Pacific Serviced Suites.`,
      ar: `🏨 **أفضل الفنادق في سنغافورة:** مارينا باي ساندز، فندق رافلز التاريخي، ذا ريتز-كارلتون ميلينيا، وبان باسيفيك سويتس.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Singapore:** RISIS 24k gold-plated natural orchids, TWG Tea & Bacha Coffee gift sets, Kaya coconut jam (Ya Kun), Orchard Road shopping.`,
      ar: `🎁 **أفضل الهدايا والتسوق في سنغافورة:** زهور الأوركيد المطلية بذهب 24 قيراط (RISIS)، علب هدايا شاي TWG وقهوة باشا كوفي، مربى الكايا التراثي، ومتاجر شارع أورشارد.`,
    },
    sim: {
      en: `📱 **SIM Cards in Singapore:** Singtel, StarHub, and M1. Available at Changi Airport terminals.`,
      ar: `📱 **شرائح الإنترنت في سنغافورة:** شركة Singtel (الأقوى والأسرع) وتليها StarHub و M1 بصالات مطار شانغي.`,
    },
    weather: {
      en: `🌤️ **Singapore Weather:** Tropical warm year-round (26-32°C) with occasional short tropical showers. Pack light cottons.`,
      ar: `🌤️ **طقس سنغافورة:** استوائي دافئ على مدار العام (26°-32°م) مع أمطار استوائية منعشة؛ تناسبه الملابس القطنية الخفيفة والمظلة.`,
    },
    transport: {
      en: `🚕 **Transport in Singapore:** Grab and CDG Zig; Singapore MRT subway network using Contactless bank cards / Apple Pay.`,
      ar: `🚕 **المواصلات في سنغافورة:** تطبيق Grab وتطبيق CDG Zig؛ ومترو سنغافورة (MRT) بالدفع المباشر بالبطاقة البنكية أو Apple Pay.`,
    },
  },

  // 6. SOUTH KOREA / SEOUL
  'south-korea': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Seoul:** Fritz Coffee Company (Dohwa-dong & Wonseo Hanok roasteries), Anthracite Coffee, Center Coffee (Seoul Forest), Blue Bottle Samcheong.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في سيول (كوريا):** محمصة فريتز كوفي (Fritz Coffee في بيت هانوك تراثي بمابو وسامشونغ)، أنثراسايت كوفي، سنتر كوفي (غابة سيول)، وبلو بوتل سامشونغ المطل على القصر الملكي.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Seoul:** Maple Tree House (Itaewon premium Hanwoo beef BBQ), Eid Halal Korean Food (KMF-certified Bulgogi), Myeongdong Kyoja (Michelin handmade noodles), Tosokchon Samgyetang.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في سيول:** مابل تري هاوس (Maple Tree House لمشاوي اللحم الكوري الفاخر)، مطعم عيد للأكلات الكورية الحلال (إتايوان)، ميونغ دونغ كيوجا (زلابية ومعكرونة ميشلان)، وتوسوكشون لحساء الجينسنغ.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Seoul:** Lotte World Adventure (World's largest indoor park + Magic Island), Everland Resort (T-Express coaster & Panda World), Seoul Land.`,
      ar: `🎡 **أفضل مدن الملاهي في سيول (كوريا الجنوبية):** لوت وورلد (Lotte World أضخم ملاهي مغلقة والجزيرة الخارجية في غانغنام)، منتجع إيفرلاند (Everland وقطار T-Express الخشبي وسفاري الباندا)، وسيول لاند.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Seoul:** Signiel Seoul (Lotte World Tower 76-101F), Four Seasons Hotel Seoul (Gwanghwamun), The Shilla Seoul.`,
      ar: `🏨 **أفضل الفنادق في سيول:** فندق سيغنييل سيول (Signiel في برج لوت وورلد الطوابق 76-101)، فور سيزونز سيول، وفندق ذا شيلا.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Seoul:** Korean K-Beauty skincare cosmetics (Myeongdong & Olive Young), Korean Red Ginseng (CheongKwanJang), Hanbok attire, Insadong crafts.`,
      ar: `🎁 **أفضل الهدايا والتسوق في سيول:** منتجات العناية بالبشرة الكورية (K-Beauty من متاجر Olive Young في ميونغ دونغ)، الجينسنغ الكوري الأحمر الأصلي، والتحف التراثية في إنسادونغ.`,
    },
    sim: {
      en: `📱 **SIM Cards in South Korea:** SK Telecom, KT (Korea Telecom), and LG U+. Available at Incheon Airport T1/T2 arrivals.`,
      ar: `📱 **شرائح الإنترنت في كوريا الجنوبية:** شركة SK Telecom (الأقوى في 5G) وتليها KT و LG U+ بصالات مطار إنتشون.`,
    },
    weather: {
      en: `🌤️ **Seoul Weather:** Spring/Autumn crisp and beautiful, Summer warm with rain (26-31°C), Winter cold (-7 to 3°C with snow).`,
      ar: `🌤️ **طقس سيول:** معتدل وجميل ربيعاً وخريفاً، دافئ صيفاً (26°-31°م)، وبارد شتاءً (-7° إلى 3°م مع ثلوج).`,
    },
    transport: {
      en: `🚕 **Transport in Seoul:** Kakao T app for taxis; Seoul Subway & City Buses using the T-Money card.`,
      ar: `🚕 **المواصلات في سيول:** تطبيق Kakao T لسيارات الأجرة؛ وشبكة مترو وحافلات سيول ببطاقة T-Money الذكية.`,
    },
  },

  // 7. JAPAN / TOKYO
  'japan': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Tokyo:** Glitch Coffee Roasters (Jimbocho & Ginza - rare Geisha light roasts), Fuglen Tokyo (Shibuya), Koffee Mameya (Omotesando), Blue Bottle Kiyosumi.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في طوكيو (اليابان):** غليتش كوفي (Glitch Coffee Roasters - جينزا وجيمبوتشو لمحاصيل قيشا النادرة)، فوجلين طوكيو (شيبويا)، كوفي مامييا (أوموتيساندو)، وبلو بوتل كيو سومي.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Tokyo:** Halal Wagyu Yakiniku Panga (Taito City - certified A5 halal Wagyu BBQ), Ayam-YA Halal Ramen (Ueno & Okachimachi), Gyumon Halal BBQ (Shibuya), Sushiro.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في طوكيو:** مطعم بانغا (Panga لمشاوي لحم الواغيو الياباني A5 الحلال المعتمد)، مطعم أيامي-يا لرامن الدجاج الحلال في أوينو، ومشاوي غيومون الحلال في شيبويا.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Tokyo:** Tokyo Disneyland, Tokyo DisneySea, Universal Studios Japan (Osaka), Fuji-Q Highland, Warner Bros. Studio Tour Tokyo.`,
      ar: `🎡 **أفضل مدن الملاهي في طوكيو (اليابان):** طوكيو ديزني لاند، طوكيو ديزني سي، منتزه فوجي كيو هايلاند (Fuji-Q لأقوى قطارات الموت)، وجولة استوديوهات هاري بوتر.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Tokyo:** Aman Tokyo (Otemachi), Palace Hotel Tokyo, Park Hyatt Tokyo (Shinjuku).`,
      ar: `🏨 **أفضل الفنادق في طوكيو:** فندق أمان طوكيو، بالاس هوتيل طوكيو، وبارك حياة طوكيو في شينجوكو.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Tokyo:** Japanese ceremonial Matcha green tea, Tokyo Banana sweets, handmade Japanese kitchen knives (Kappabashi), Ginza luxury shopping.`,
      ar: `🎁 **أفضل الهدايا والتسوق في طوكيو:** شاي الماتشا الياباني الفاخر، حلويات طوكيو بانانا، سكاكين المطبخ اليابانية المصنوعة يدوياً (كاباباشي)، ومتاجر حي جينزا.`,
    },
    sim: {
      en: `📱 **SIM Cards in Japan:** NTT Docomo, SoftBank, and au. Available at Haneda (HND) and Narita (NRT) airports.`,
      ar: `📱 **شرائح الإنترنت في اليابان:** شبكة NTT Docomo (الأقوى والأوسع) وتليها SoftBank بصالات مطار هانيدا وناريتا.`,
    },
    weather: {
      en: `🌤️ **Tokyo Weather:** Cherry Blossom spring (Mar-May), Summer warm/humid (28-34°C), Autumn vibrant, Winter mild (4-12°C).`,
      ar: `🌤️ **طقس طوكيو:** ربيع أزهار الكرز (15°-22°م)، دافئ صيفاً (28°-34°م)، ومعتدل شتاءً (4°-12°م).`,
    },
    transport: {
      en: `🚕 **Transport in Tokyo:** Go Taxi & JapanTaxi app; Tokyo Metro & JR Yamanote Line with Suica / Pasmo (Apple Wallet).`,
      ar: `🚕 **المواصلات في طوكيو:** تطبيق Go Taxi؛ وشبكة قطارات ومترو طوكيو ببطاقة Suica أو Pasmo عبر Apple Wallet.`,
    },
  },

  // 8. TURKEY / ISTANBUL
  'turkey': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Istanbul:** Petra Roasting Co. (Gayrettepe & Kanyon), Kronotrop (Cihangir), Coffee Department (Balat), Mandabatmaz (Historic Turkish coffee since 1967).`,
      ar: `☕ **أفضل مقاهي القهوة في إسطنبول (تركيا):** بترا روستينغ (Petra Roasting Co للبن المختص والـ V60)، كرونوتروب (جهانغير)، كوفي ديبارتمنت (بالات)، ومقهى ماندا باتماز التاريخي للقهوة التركية على الجمر منذ 1967.`,
    },
    food: {
      en: `🍽️ **Top BBQ Grills & Halal in Istanbul:** Nusr-Et Steakhouse (Etiler & Grand Bazaar), Günaydın Kebap (Florya & Nişantaşı), Develi (Samatya & Kalamış - 100% Halal kebabs), Hafiz Mustafa.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والحلال في إسطنبول:** نصرت ستيك هاوس (Nusr-Et)، غوناييدن كباب (Gunaydin للمشاوي التركية الفاخرة)، مطعم ديڤيلي التاريخي (Develi للكباب واللحوم على الفحم حلال 100%)، وحلويات حافظ مصطفى.`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Istanbul:** Vialand Theme Park (Isfanbul), Viaport Marina (Tuzla Red Fire coaster), Marina Aquapark, Istanbul Aquarium.`,
      ar: `🎡 **أفضل مدن الملاهي في إسطنبول (تركيا):** فيالاند إسطنبول (Vialand / Isfanbul بقطار الموت وقلعة الأساطير)، فيابورت مارينا، مارينا أكوابارك المائية، وأكواريوم إسطنبول.`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Istanbul:** Çırağan Palace Kempinski (Bosphorus), Four Seasons Hotel Istanbul at the Bosphorus, Swissôtel The Bosphorus.`,
      ar: `🏨 **أفضل الفنادق في إسطنبول:** فندق قصر تشيران كمبينسكي (على البوسفور مباشرة)، فور سيزونز البوسفور، وسويس أوتيل.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Istanbul:** Turkish delight (Lokum) from Hafiz Mustafa, Turkish apple tea, handmade ceramic bowls, Grand Bazaar gold & leather.`,
      ar: `🎁 **أفضل الهدايا والتسوق في إسطنبول:** الحلقوم التركي الأصلي من حافظ مصطفى، الشاي التركي وفناجينه الزجاجية، الخزف العثماني اليدوي، والتسوق في البازار الكبير (جراند بازار).`,
    },
    sim: {
      en: `📱 **SIM Cards in Turkey:** Turkcell (#1 best coverage), Vodafone, and Türk Telekom. Available at Istanbul Airport (IST).`,
      ar: `📱 **شرائح الإنترنت في تركيا:** شركة Turkcell (الأقوى والأوسع تغطية) وتليها فودافون وتورك تليكوم بصالات مطار إسطنبول.`,
    },
    weather: {
      en: `🌤️ **Istanbul Weather:** Spring/Autumn pleasant (16-22°C), Summer warm (28-32°C), Winter cool/rainy with occasional snow (3-9°C).`,
      ar: `🌤️ **طقس إسطنبول:** معتدل ومنعش ربيعاً وخريفاً (16°-22°م)، دافئ صيفاً (28°-32°م)، وبارد ممطر شتاءً (3°-9°م).`,
    },
    transport: {
      en: `🚕 **Transport in Istanbul:** BiTaksi and Uber; Istanbul Metro, Tram, & Bosphorus Ferries with Istanbulkart.`,
      ar: `🚕 **المواصلات في إسطنبول:** تطبيق BiTaksi وتطبيق Uber؛ ومترو وترام وعبارات البوسفور ببطاقة Istanbulkart.`,
    },
  },

  // 9. GREECE / ATHENS
  'greece': {
    coffee: {
      en: `☕ **Top Specialty Coffee in Athens:** Taf Coffee (Emmanouil Benaki - world championship baristas), Underdog (Thissio), Drip Coffee (Koukaki), Coffee Dive.`,
      ar: `☕ **أفضل مقاهي القهوة المختصة في أثينا (اليونان):** تاف كوفي (Taf Coffee - حائز على بطولات العالم للباريستا والمحاصيل الفاخرة)، أندر دوج (Underdog بحي ثيسيو)، ودريب كوفي بجوار الأكروبوليس.`,
    },
    food: {
      en: `🍽️ **Top BBQ & Halal in Athens:** Dionysos Zonar's (Acropolis view dining), O Thanasis (Monastiraki kebab skewers), Raja Jee Halal Restaurant, Psarotaverna fresh seafood tavernas.`,
      ar: `🍽️ **أفضل مطاعم المشاوي والمأكولات في أثينا:** ديونيسوس زونارز بإطلالة الأكروبوليس، مطعم أو ثاناسيس (O Thanasis لأسياخ الكباب والشواء بموناستيراكي)، ومطاعم الأسماك والمأكولات البحرية الطازجة (Psarotaverna).`,
    },
    attractions: {
      en: `🎡 **Top Theme Parks in Athens:** Allou! Fun Park (Greece's premier amusement park), Aquapolis Athens Water Park.`,
      ar: `🎡 **أفضل مدن الملاهي في أثينا (اليونان):** ألوو فن بارك (Allou! Fun Park أكبر مدينة ملاهي في اليونان)، وحديقة أكوابوليس المائية (Aquapolis Athens).`,
    },
    hotels: {
      en: `🏨 **Top Hotels in Athens:** Hotel Grande Bretagne (Syntagma Square), King George, Four Seasons Astir Palace Hotel Athens.`,
      ar: `🏨 **أفضل الفنادق في أثينا:** فندق غراند بريتاني التاريخي (ساحة سينتاجما)، كينغ جورج، وفور سيزونز أستير بالاس.`,
    },
    souvenirs: {
      en: `🎁 **Best Gifts in Athens:** Extra virgin Greek olive oil, Kalamata olives, natural olive oil soap, Mati evil eye blue charms, Plaka leather sandals.`,
      ar: `🎁 **أفضل الهدايا والتسوق في أثينا:** زيت الزيتون البكر الممتاز، صابون زيت الزيتون الطبيعي، التعويذات الزرقاء التراثية، والصنادل الجلدية المصنوعة يدوياً في حي بلاكا.`,
    },
    sim: {
      en: `📱 **SIM Cards in Greece:** Cosmote (#1 coverage across mainland and Greek islands), Vodafone, and Nova.`,
      ar: `📱 **شرائح الإنترنت في اليونان:** شركة Cosmote (الأقوى والأوسع تغطية في الجزر والمدن) وتليها فودافون.`,
    },
    weather: {
      en: `🌤️ **Athens Weather:** Mediterranean sunny climate; sunny spring/autumn (18-25°C), hot summer (32-37°C), mild winter (9-15°C).`,
      ar: `🌤️ **طقس أثينا:** متوسطي مشمس؛ دافئ ومعتدل ربيعاً وخريفاً (18°-25°م)، حار صيفاً (32°-37°م)، ومعتدل شتاءً (9°-15°م).`,
    },
    transport: {
      en: `🚕 **Transport in Athens:** FreeNow and Uber; Athens Metro & Tram system using the Ath.ena Ticket.`,
      ar: `🚕 **المواصلات في أثينا:** تطبيق FreeNow وتطبيق Uber؛ وشبكة مترو وترام أثينا ببطاقة Ath.ena Ticket.`,
    },
  },
};
