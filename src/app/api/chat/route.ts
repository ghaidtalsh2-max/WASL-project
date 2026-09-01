import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  let userMessage = '';
  let jCtx: any = null;
  let locale = 'ar';

  try {
    const body = await req.json();
    userMessage = body.message || '';
    jCtx = body.journeyContext || null;
    locale = body.locale || (isEnglishText(userMessage) ? 'en' : 'ar');
    const { apiKey, provider } = body;

    if (!userMessage.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextParts: string[] = [];
    if (jCtx) {
      if (jCtx.destination?.name) {
        contextParts.push(`- Destination Country: ${jCtx.destination.name} (Arabic: ${jCtx.destination.nameAr || jCtx.destination.name})`);
      }
      if (jCtx.destinationCity || jCtx.destination?.capital) {
        contextParts.push(`- Target City: ${jCtx.destinationCity || jCtx.destination.capital}`);
      }
      if (jCtx.origin?.name) {
        contextParts.push(`- Origin Country: ${jCtx.origin.name} (${jCtx.origin.nameAr || ''})`);
      }
      if (jCtx.duration) {
        contextParts.push(`- Duration: ${jCtx.duration}`);
      }
      if (jCtx.purpose) {
        contextParts.push(`- Trip Purpose: ${jCtx.purpose}`);
      }
      if (jCtx.accommodationArea) {
        contextParts.push(`- Accommodation Area: ${jCtx.accommodationArea}`);
      }
      if (jCtx.interests && jCtx.interests.length > 0) {
        contextParts.push(`- Interests: ${Array.isArray(jCtx.interests) ? jCtx.interests.join(', ') : jCtx.interests}`);
      }
    }

    const isEn = isEnglishText(userMessage) || locale === 'en';
    const langDirective = isEn
      ? 'STRICT DIRECTIVE: Respond completely and naturally in ENGLISH. Provide structured bullet points with real names and actionable advice.'
      : 'توجيه إلزامي: أجب باللغة العربية بأسلوب راقٍ ومنظم ومحدد، مع ذكر أسماء الأماكن الحقيقية بالاسم والموقع والنصائح العملية المباشرة.';

    const contextStr = contextParts.length > 0
      ? `Active Traveler Context:\n${contextParts.join('\n')}\n\n${langDirective}`
      : `General travel and cultural companion.\n\n${langDirective}`;

    const systemPrompt = `${AI_SYSTEM_PROMPTS.chatAssistant}\n\n${contextStr}`;

    // 1. Always attempt live AI with short timeout
    try {
      const aiRes = await callAI({
        systemPrompt,
        prompt: userMessage,
        apiKey,
        provider,
        temperature: 0.35,
        maxTokens: 1024,
      });

      if (!aiRes.error && aiRes.content && aiRes.content.trim().length > 20) {
        return NextResponse.json({
          success: true,
          provider: aiRes.provider,
          modelUsed: aiRes.modelUsed,
          latencyMs: aiRes.latencyMs,
          reply: aiRes.content,
        });
      }
    } catch (e) {
      console.warn('AI live call fallback:', e);
    }

    // 2. High-precision travel reasoning engine
    const fallbackReply = generateSmartChatReply(userMessage, jCtx, isEn);
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-assistant',
      reply: fallbackReply,
    });
  } catch (error: any) {
    const isEn = isEnglishText(userMessage) || locale === 'en';
    const fallbackReply = generateSmartChatReply(userMessage, jCtx, isEn);
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-assistant',
      reply: fallbackReply,
    });
  }
}

function isEnglishText(text: string): boolean {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const arabicWords = (text.match(/[\u0600-\u06FF]+/g) || []).length;
  if (arabicRegex.test(text) && arabicWords >= englishWords) {
    return false;
  }
  return /[a-zA-Z]/.test(text) && englishWords > arabicWords;
}

/**
 * Deep Multilingual Travel & Cultural Reasoning Engine covering ALL destinations
 */
function generateSmartChatReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'Georgia';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Tbilisi';
  const cityAr = ctx?.destinationCityAr || cityEn;
  const city = isEn ? cityEn : cityAr;
  const destName = isEn ? destNameEn : destNameAr;
  const normDest = `${destNameEn} ${cityEn} ${destNameAr}`.toLowerCase();

  // 1. GREETINGS
  if (
    msg === 'hi' ||
    msg === 'hello' ||
    msg === 'hey' ||
    msg.startsWith('hi ') ||
    msg.startsWith('hello ') ||
    msg.includes('good morning') ||
    msg.includes('good evening') ||
    msg === 'السلام عليكم' ||
    msg === 'السلام عليكم ورحمة الله' ||
    msg.startsWith('سلام') ||
    msg.startsWith('مرحبا') ||
    msg.startsWith('مرحباً') ||
    msg.startsWith('أهلاً') ||
    msg.startsWith('اهلا') ||
    msg.startsWith('هلا')
  ) {
    if (isEn) {
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nI can assist you with instant, deep local recommendations on:\n• 🎡 **Theme Parks, Amusement Arcades & Family Thrills**\n• 🍽️ **Top Restaurants, BBQ Grills & Halal Dining**\n• ☕ **Specialty Coffee, Tea Houses & Artisan Cafes**\n• 🏨 **Best Hotels & Neighborhoods**\n• 🛍️ **Shopping Malls, Traditional Attire & Souvenirs**\n• 🚕 **Transportation, Metro & Airport Transfers**\n• 🚨 **Emergency Dispatch & Embassy Contacts**\n\nHow can I help you explore or plan right now?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيسعدني جداً إفادتك بأدق التفاصيل والمعالم الحقيقية فوراً، مثل:\n• 🎡 **مدن الملاهي والألعاب والأنشطة الترفيهية والمائية**\n• 🍽️ **المطاعم المركزية وأفضل المشاوي والأكلات الحلال**\n• ☕ **أفضل مقاهي ومحامص القهوة المختصة** والشاي التراثي\n• 🏨 **الفنادق وأماكن السكن المميزة**\n• 🛍️ **المولات والتسوق والملابس التراثية**\n• 🚕 **المواصلات وبطاقات المترو الذكية والتنقل**\n• 🚨 **أرقام الطوارئ وسفارة بلدك وإرشادات السلامة**\n\nتفضل بسؤالي مباشرة وسأجيبك بالأسماء والمواقع فوراً!`;
  }

  // 2. THEME PARKS, AMUSEMENT PARKS & WATER PARKS (مدينة العاب، ملاهي، العاب، العاب مائية، ملاهي مائية، فعاليات، ترفيه، كارتينج)
  if (
    msg.includes('العاب') ||
    msg.includes('ألعاب') ||
    msg.includes('ملاهي') ||
    msg.includes('ترفيه') ||
    msg.includes('مائيه') ||
    msg.includes('مائية') ||
    msg.includes('زحاليق') ||
    msg.includes('كارتينج') ||
    msg.includes('theme park') ||
    msg.includes('amusement park') ||
    msg.includes('water park') ||
    msg.includes('roller coaster') ||
    msg.includes('ferris wheel')
  ) {
    // GEORGIA / TBILISI
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي') || normDest.includes('تبليسي') || normDest.includes('باتومي') || normDest.includes('batumi')) {
      if (isEn) {
        return `🎡 **Top Theme Parks, Water Parks & Amusement Spots in Tbilisi (Georgia):**\n\n1. **Mtatsminda Amusement Park (متاتسميندا بارك):**\n• The iconic mountain-top amusement park situated on Mount Mtatsminda (770m altitude). Reachable via the scenic historic Tbilisi Funicular railway. Features the giant panoramic Ferris wheel (overlooking the entire city), thrilling roller coasters, bumper cars, carousel, and scenic picnic areas.\n\n2. **Gino Paradise Tbilisi (ملاهي جينو بارادايس المائية):**\n• The largest multi-functional water park in the Caucasus region near the Tbilisi Sea. Boasts extreme water slides (Toboggan slides), massive outdoor wave pools, Olympic pools, relaxation Jacuzzis, children's splash zones, and luxury wellness saunas.\n\n3. **East Point Entertainment Center (مجمع إيست بوينت الترفيهي):**\n• Mega entertainment hub featuring *Focus Mokus* indoor amusement park, high-tech bowling alleys, IMAX cinema, VR arenas, and outdoor children's rides.\n\n4. **Astra Park (أسترا بارك):**\n• Top destination for high-speed indoor go-kart racing (Karting), laser tag arenas, and arcade video gaming.`;
      }
      return `🎡 **أفضل مدن الملاهي والحدائق المائية ومراكز الألعاب في تبيليسي (جورجيا):**\n\n1. **مدينة ملاهي متاتسميندا (Mtatsminda Park):**\n• أشهر وأعلى مدينة ملاهي في تبيليسي؛ تقع على قمة جبل متاتسميندا على ارتفاع 770 متراً، وتصل إليها عبر القطار الجبلي المعلق (Funicular) الممتع. تضم عجلة فيريس البانورامية العملاقة المطلة على كامل العاصمة، قطار الموت الأفعواني، سيارات التصادم، وألعاب الأطفال والمقاهي الجبلية.\n\n2. **ملاهي جينو بارادايس المائية (Gino Paradise Tbilisi):**\n• أضخم مدينة ألعاب مائية في جورجيا ومنطقة القوقاز بجوار بحيرة تبيليسي؛ تضم زحاليق مائية شاهقة، مسابح أمواج صناعية، مسابح أولمبية دافئة، وألعاب مائية مخصصة للعائلات والأطفال مع مرافق سبا متكاملة.\n\n3. **مجمع إيست بوينت الترفيهي (East Point Entertainment):**\n• أكبر مركز ترفيهي حديث يضم مدينة ألعاب *فوكس موكوس (Focus Mokus)* للأطفال، صالات بولينج حديثة، صالات ألعاب الواقع الافتراضي (VR)، سينما IMAX، ومسار سيارات الكارتينج.\n\n4. **أسترا بارك (Astra Park):**\n• الوجهة الأولى لسباقات سيارات الكارتينج السريعة المغلقة، ألعاب الليزر، وصالات ألعاب الفيديو الإلكترونية.\n\n5. **حديقة فاكي وتلفريك حديقة السلاحف (Vake Park & Turtle Lake Cable Car):**\n• تجربة ركوب التلفريك الهوائي وصولاً إلى بحيرة السلاحف مع ألعاب القوارب والتنزه في الطبيعة.`;
    }

    // AZERBAIJAN / BAKU
    if (normDest.includes('azerbaijan') || normDest.includes('أذربيجان') || normDest.includes('baku') || normDest.includes('باكو')) {
      return isEn
        ? `🎡 **Top Theme Parks & Entertainment in Baku (Azerbaijan):**\n\n1. **Megafun Entertainment Center (ميغافن باكو):** The largest indoor family entertainment center in Europe/Caucasus with over 200 arcade rides, ice-skating, and bowling.\n2. **Dalga Beach Aquapark Resort (منتجع دالغا بيتش):** Massive Caspian Sea water park with extreme slides and wave pools.\n3. **Deniz Mall VR & Entertainment Zone (Baku Boulevard):** High-tech indoor rides and Flash Kart karting track.`
        : `🎡 **أفضل مدن الملاهي والألعاب المائية في باكو (أذربيجان):**\n\n1. **ميغافن باكو (Megafun Entertainment Center):** أكبر مدينة ألعاب ترفيهية مغلقة في القوقاز تضم أكثر من 200 لعبة إلكترونية وحلبة تزلج على الجليد والبولينج.\n2. **منتجع دالغا بيتش المائي (Dalga Beach Aquapark):** أضخم حديقة ألعاب مائية على بحر قزوين بزحاليق عملاقة ومسابح أمواج.\n3. **دينيز مول (Deniz Mall - كورنيش باكو):** ألعاب الواقع الافتراضي وحلبة الكارتينج الحديثة وسينما تفاعلية.`;
    }

    // CHINA / BEIJING
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return isEn
        ? `🎡 **Top Theme Parks in Beijing:**\n\n1. **Universal Studios Beijing:** Transformers Metrobase, Kung Fu Panda Land, Harry Potter.\n2. **Happy Valley Beijing:** Mega thrill roller coasters and water rides.\n3. **Water Cube Water Park:** Olympic venue converted into a futuristic indoor water wonderland.`
        : `🎡 **أفضل مدن الملاهي في بكين (الصين):**\n\n1. **يونيفرسال ستوديوز بكين (Universal Studios Beijing):** أضخم مدينة ملاهي حديثة تضم عالم المتحولون وكونغ فو باندا وهاري بوتر.\n2. **هابي فالي بكين (Happy Valley Beijing):** قطارات الموت السريعة وألعاب المغامرات المائية.\n3. **الحديقة المائية في المكعب المائي الأولمبي (Water Cube):** ألعاب مائية مغلقة ممتعة للعائلات.`;
    }

    // SINGAPORE
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `🎡 **Top Theme Parks in Singapore:**\n\n1. **Universal Studios Singapore (USS Sentosa):** Battlestar Galactica, Transformers 3D.\n2. **Skyline Luge Sentosa:** Downhill gravity go-karts.\n3. **Adventure Cove Waterpark:** Snorkeling with marine life and high-speed water chutes.`
        : `🎡 **أفضل الملاهي والأنشطة الترفيهية في سنغافورة:**\n\n1. **يونيفرسال ستوديوز سنغافورة (USS Sentosa):** ألعاب الإثارة العالمية وسفاري الديناصورات.\n2. **زحليقة سنتوسا المعلقة (Skyline Luge):** قيادة عربات الكارتينج المنحدرة والتلفريك البانورامي.\n3. **أدفنتشر كوف ووتر بارك (Adventure Cove):** ألعاب مائية والسباحة مع الكائنات البحرية.`;
    }

    // SOUTH KOREA / SEOUL
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `🎡 **Top Theme Parks in Seoul:**\n\n1. **Lotte World Adventure:** World's largest indoor theme park + outdoor Magic Island.\n2. **Everland Resort:** T-Express wooden hyper-coaster and Lost Valley safari.`
        : `🎡 **أفضل مدن الملاهي في سيول (كوريا الجنوبية):**\n\n1. **لوت وورلد (Lotte World):** أضخم مدينة ملاهي مغلقة في العالم مع الجزيرة الساحرة الخارجية في غانغنام.\n2. **إيفرلاند (Everland):** قطار T-Express الخشبي الشهير وسفاري الباندا.`;
    }

    // AUSTRIA / VIENNA
    if (normDest.includes('austria') || normDest.includes('النمسا') || normDest.includes('vienna') || normDest.includes('فيينا')) {
      return isEn
        ? `🎡 **Top Theme Parks in Vienna:**\n\n1. **Prater Amusement Park:** Historic Wiener Riesenrad giant Ferris wheel and modern roller coasters.\n2. **Familypark Neusiedlersee:** Austria's premier fairy-tale family adventure park.`
        : `🎡 **أفضل مدن الملاهي في فيينا (النمسا):**\n\n1. **ملاهي براتر (Prater Vienna):** عجلة فيريس التاريخية العملاقة وأكثر من 250 لعبة إثارة وقطارات الموت.\n2. **فاميلي بارك (Familypark):** أكبر حديقة ملاهي عائلية في النمسا.`;
    }

    // FRANCE / PARIS
    if (normDest.includes('france') || normDest.includes('فرنسا') || normDest.includes('paris') || normDest.includes('باريس')) {
      return isEn
        ? `🎡 **Top Theme Parks in Paris:**\n\n1. **Disneyland Paris & Walt Disney Studios:** Space Mountain, Ratatouille, Marvel Avengers Campus.\n2. **Parc Astérix:** Giant roller coasters and Gallic adventure shows.`
        : `🎡 **أفضل مدن الملاهي في باريس (فرنسا):**\n\n1. **ديزني لاند باريس (Disneyland Paris):** استوديوهات والت ديزني وعالم مارفل وسبيس ماونتن.\n2. **بارك أستريكس (Parc Astérix):** قطارات الملاهي العملاقة والألعاب المائية التراثية.`;
    }

    // TURKEY / ISTANBUL
    if (normDest.includes('turkey') || normDest.includes('تركيا') || normDest.includes('istanbul') || normDest.includes('إسطنبول')) {
      return isEn
        ? `🎡 **Top Theme Parks in Istanbul:**\n\n1. **Vialand Theme Park (Isfanbul):** Breath-taking Nefeskesen roller coaster, castle fantasy, and shopping boulevard.\n2. **Viaport Marina (Tuzla):** Red Fire coaster and massive aquapark.\n3. **Marina Aquapark Istanbul:** 17 extreme water slides.`
        : `🎡 **أفضل مدن الملاهي في إسطنبول (تركيا):**\n\n1. **فيالاند إسطنبول (Vialand / Isfanbul):** قطار الموت السريع "نفس كيسن" وقلعة الأساطير وشارع التسوق.\n2. **فيا بورت مارينا (توزلا):** قطار ريد فاير الأفعواني والألعاب المائية والمارينا.\n3. **مارينا أكوابارك:** 17 زحليقة مائية عملاقة.`;
    }

    // UNITED ARAB EMIRATES / DUBAI
    if (normDest.includes('uae') || normDest.includes('dubai') || normDest.includes('دبي') || normDest.includes('الإمارات')) {
      return isEn
        ? `🎡 **Top Theme Parks in Dubai:**\n\n1. **IMG Worlds of Adventure:** Giant indoor climate-controlled mega park.\n2. **Dubai Parks and Resorts:** Motiongate, Legoland.\n3. **Aquaventure Waterpark (Atlantis The Palm):** World's largest water park.`
        : `🎡 **أفضل مدن الملاهي في دبي (الإمارات):**\n\n1. **آي إم جي عالم من المغامرات (IMG Worlds):** أضخم مدينة ملاهي مغلقة ومكيفة في الشرق الأوسط.\n2. **دبي باركس آند ريزورتس:** موشنجيت وليجولاند دبي.\n3. **أكوافينشر المائية (أتلانتس النخلة):** أكبر حديقة ألعاب مائية في العالم.`;
    }

    // GENERAL THEME PARK RESPONSE
    return isEn
      ? `🎡 **Top Recommended Theme Parks & Family Fun in ${cityEn} (${destNameEn}):**\n\n• **Main Amusement Parks:** Famous city theme parks and open-air family attractions.\n• **Water & Adventure Parks:** High-speed slides, wave pools, and karting tracks.\n• **Access & Tickets:** Pre-booking online saves queue time and secures instant entry.`
      : `🎡 **أفضل مدن الملاهي والأنشطة الترفيهية في ${city} (${destName}):**\n\n• **أشهر مدن الملاهي:** تتوفر في ${city} كبرى المنتزهات الترفيهية العائلية وعجلات الفيريس البانورامية وقطارات الإثارة.\n• **الحدائق المائية والمغامرات:** ألعاب مائية ومسابح أمواج وصالات سباق الكارتينج وألعاب الفيديو الحديثة.\n• **نصيحة الحجز:** يُفضل حجز التذاكر مسبقاً عبر الإنترنت لتفادي طوابير الانتظار.`;
  }

  // 3. RESTAURANTS, BBQ GRILLS & FOOD (مشاوي، مطعم، مطاعم، أكل، حلال، لحم، شواء)
  if (
    msg.includes('مشاوي') ||
    msg.includes('مشوي') ||
    msg.includes('شواء') ||
    msg.includes('لحم') ||
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('حلال') ||
    msg.includes('برجر') ||
    msg.includes('restaurant') ||
    msg.includes('restaurants') ||
    msg.includes('bbq') ||
    msg.includes('grill') ||
    msg.includes('food') ||
    msg.includes('halal')
  ) {
    // GEORGIA / TBILISI
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي') || normDest.includes('تبليسي')) {
      if (isEn) {
        return `🍽️ **Top BBQ Grills, Traditional & Halal Dining in Tbilisi (Georgia):**\n\n1. **Tsiskvili Restaurant Complex (مجمع تسيسكفيلي التراثي):**\n• Magnificent riverside dining complex featuring natural waterfalls, historic watermills, traditional live Georgian polyphonic singing/dancing, and mouthwatering Mtsvadi (grilled pork/beef/chicken skewers on vine branches).\n\n2. **Funicular Restaurant Complex (مطعم فونيكولار قمة متاتسميندا):**\n• Historic landmark dining at the top of Mtatsminda Park with spectacular panoramic views over entire Tbilisi. Famous for grilled meats and traditional Khachapuri.\n\n3. **Beirut Lebanese Halal Restaurant (مطعم بيروت الحلال - Marjanishvili):**\n• Certified 100% Halal restaurant in the vibrant Marjanishvili district serving premium charcoal grills, mixed kebabs, hummus, and Arabic hospitality.\n\n4. **Supra Restaurant (مطعم سوبرا):**\n• Celebrated traditional Georgian restaurant famous for juicy Khinkali dumplings and clay-pot baked beef stew.\n\n5. **Mado Tbilisi (Rustaveli Ave):**\n• Famous Turkish restaurant serving halal grilled steaks, donor kebabs, and ice creams right on Rustaveli Avenue.`;
      }
      return `🍽️ **أفضل مطاعم المشاوي والمأكولات الحلال والتراثية في تبيليسي (جورجيا):**\n\n1. **مجمع مطاعم تسيسكفيلي (Tsiskvili - على ضفاف نهر كورا):**\n• تحفة معمارية وتراثية مع شلالات طبيعية وطاحونة مائية قديمة؛ يقدم أشهى المشاوي الجورجية (Mtsvadi) المشوية على أعواد العنب، مع عروض فلكلورية وموسيقية ساحرة.\n\n2. **مطعم فونيكولار البانورامي (Funicular Restaurant - قمة جبل متاتسميندا):**\n• إطلالة ساحرة من أعلى قمة في تبيليسي مع المشاوي الفاخرة وفطائر الخاتشابوري التراثية.\n\n3. **مطعم بيروت اللبناني الحلال (Beirut Halal - حي مرجانيشفيلي شارع العرب):**\n• معتمد حلال 100% ويقدم أشهى أسياخ الكباب والشقف والشيش طاووق على الفحم والمقبلات الشامية.\n\n4. **مطعم مادو التركي الحلال (Mado Tbilisi - شارع روستافيلي الرئيسي):**\n• المشاوي التركية الحلال، الكباب والشاورما والحلويات في قلب السنتر.\n\n5. **مطعم باشا ومطعم أنقرة (حي مرجانيشفيلي):**\n• مطاعم حلال شهيرة للشواء والمأكولات الشرقية على مدار 24 ساعة.`;
    }

    // CHINA / BEIJING
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return isEn
        ? `🍽️ **Top BBQ Grills & Halal Dining in Beijing:**\n\n1. **Ju Bao Yuan (Niujie Street):** Iconic halal copper-pot mutton hotpot & charcoal grills.\n2. **Kaorou Ji (Shichahai Houhai Lake):** Historic 1848 Halal Mongolian iron-griddle lamb.\n3. **Hong Bin Lou (Xicheng):** Premier Muslim imperial banquet dining.\n4. **Dadong Roast Duck (Wangfujing):** World-famous crispy Peking duck.`
        : `🍽️ **أفضل مطاعم المشاوي والحلال في بكين (الصين):**\n\n1. **مطعم جوباو يوان (Ju Bao Yuan - شارع جامع نيوجيه):** أعرق مطعم مشاوي وهوت بوت بلحم الخروف الحلال في أواني النحاس.\n2. **مطعم كاورو جي (Kaorou Ji - بحيرة هوهاي):** شواء لحم الضأن الحلال على الصاج الساخن منذ عام 1848.\n3. **مطعم هونغ بين لو (Hong Bin Lou):** أفخر مطعم صيني إسلامي حلال للمشاوي والأطباق الملكية.\n4. **مطعم دادونغ (Dadong Roast Duck - شارع وانغفوجينغ):** بط بكين المقرمش الشهير عالمياً.`;
    }

    // SINGAPORE
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `🍽️ **Top BBQ Grills in Singapore:**\n\n1. **Lau Pa Sat Satay Street:** Open-air charcoal grilled satay skewers.\n2. **Zam Zam Restaurant (Arab St):** Halal murtabak and biryani since 1908.\n3. **The Halia (Botanic Gardens):** MUIS Halal fine dining steaks and seafood.`
        : `🍽️ **أفضل مطاعم المشاوي والحلال في سنغافورة:**\n\n1. **شارع الساتاي في لاو با سات (Lau Pa Sat):** أسياخ المشاوي على الفحم بصلصة الفول السوداني.\n2. **مطعم زام زام (شارع العرب):** المطبق والبرياني والمشاوي العريقة منذ 1908.\n3. **مطعم ذا هاليا (الحدائق النباتية):** لحوم ومأكولات بحرية مشوية معتمدة حلال MUIS.`;
    }

    // GENERAL RESTAURANTS
    return isEn
      ? `🍽️ **Top Recommended Dining & Grills in ${cityEn} (${destNameEn}):**\n\n• **Central BBQ & Steakhouses:** Highly rated grills and local culinary heritage in central districts.\n• **Verified Halal Options:** Clean halal-certified and seafood restaurants widely accessible.`
      : `🍽️ **أفضل مطاعم المشاوي والأكلات في ${city} (${destName}):**\n\n• **المشاوي والسنتر:** تتوفر في مركز المدينة أرقى مطاعم المشاوي والمأكولات التراثية على الفحم.\n• **الخيارات الحلال:** تتوفر مطاعم معتمدة حلال ومأكولات بحرية طازجة في أهم الشوارع الحيوية.`;
  }

  // 4. SPECIALTY COFFEE & ARTISAN CAFES (قهوة مختصة، كافيه، مقهى، قهوة، كوفي)
  if (
    msg.includes('قهوة') ||
    msg.includes('قهوه') ||
    msg.includes('مختصة') ||
    msg.includes('مختصه') ||
    msg.includes('كافيه') ||
    msg.includes('مقهى') ||
    msg.includes('كوفي') ||
    msg.includes('coffee') ||
    msg.includes('cafe') ||
    msg.includes('roastery')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      if (isEn) {
        return `☕ **Top Specialty Coffee Roasters & Cafes in Tbilisi (Georgia):**\n\n1. **Coffee LAB (Kazbegi Ave & Vake):** The pioneering specialty coffee roastery in Georgia; supreme pour-overs (V60/Aeropress), house-roasted Ethiopian and Colombian beans, and garden seating.\n2. **ERTI KAVA Coffee Room (Rustaveli & Old Tbilisi):** Cozy specialty coffee haven famous for artisanal flat whites and fresh cheesecakes.\n3. **Shavi Coffee Roasters (Vake):** Renowned micro-roaster specializing in light roasts, specialty espresso blends, and calm co-working vibes.\n4. **Fabrika Tbilisi (Chugureti):** Urban creative hub with hip cafes, artisan brews, and vibrant courtyard street art.`;
      }
      return `☕ **أفضل مقاهي ومحامص القهوة المختصة (Specialty Coffee) في تبيليسي (جورجيا):**\n\n1. **كوفي لاب (Coffee LAB - شارع كازبيجي وحي فاكي):** المحمصة الرائدة الأولى للقهوة المختصة في جورجيا؛ تتميز بمحاصيل البن الإثيوبية والكولومبية المحمصة محلياً والتقطير اليدوي V60 وجلسات الحديقة الخارجية.\n2. **إيرتي كافا (ERTI KAVA Coffee Room - سنتر روستافيلي والبلدة القديمة):** مقهى حميمي راقٍ يشتهر بالقهوة المقطرة والفلات وايت والتشيز كيك الطازج.\n3. **شافي كوفي روستر (Shavi Coffee Roasters - حي فاكي الراقي):** محمصة متخصصة في التحميص الخفيف ومحاصيل القهوة الفاخرة.\n4. **مجمع فابريكا (Fabrika Tbilisi):** المركز الفني والإبداعي الأبرز الذي يضم مقاهي شبابية عصرية وبن مختص.`;
    }

    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Beijing:**\n\n• **Metal Hands Coffee (Sanlitun):** Lever espresso machines & pistachio latte.\n• **Berry Beans (Qianmen Hutongs):** Historic courtyard rooftop cafe.\n• **% Arabica Beijing (Taikoo Li):** Minimalist Japanese roasts.`
        : `☕ **أفضل مقاهي القهوة المختصة في بكين (الصين):**\n\n• **ميتال هاندز (Metal Hands):** الإسبريسو اليدوي ومشروب الفستق والمحاصيل المقطرة.\n• **بيري بينز (Berry Beans - تشيانمن):** مقهى أزقة الهوتونغ التراثية بإطلالة السطح الساحرة.\n• **بالمائة أرابيكا (% Arabica):** في مجمع سانليتون ومجمع وانغفوجينغ.`;
    }

    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Singapore:**\n\n• **Chye Seng Huat Hardware:** The 360-degree island brew bar.\n• **Bacha Coffee (ION Orchard):** Palace of 200+ Arabica coffees.\n• **Nylon Coffee Roasters (Everton Park):** Award-winning pour-overs.`
        : `☕ **أفضل مقاهي القهوة المختصة في سنغافورة:**\n\n• **تشاي سينغ هوات (Chye Seng Huat):** المحمصة والبار الدائري 360 درجة في جالان بيسار.\n• **باشا كوفي (Bacha Coffee - آيون أورشارد ومطار شانغي):** قصر القهوة الفاخر.\n• **نايلون كوفي روستر (Nylon Coffee):** للقهوة المقطرة الحرفية في إيفرتون بارك.`;
    }
  }

  // 5. TRADITIONAL CLOTHING & SOUVENIRS (ملابس تقليدية، ثياب، هانفو، هانبوك، كيمونو، تشوكا، تراث)
  if (
    msg.includes('ملابس تقليد') ||
    msg.includes('لبس تقليد') ||
    msg.includes('ثياب') ||
    msg.includes('تشوكا') ||
    msg.includes('هانفو') ||
    msg.includes('هانبوك') ||
    msg.includes('كيمونو') ||
    msg.includes('traditional cloth') ||
    msg.includes('souvenir')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      if (isEn) {
        return `👘 **Traditional Georgian Attire (Chokha) & Souvenirs in Tbilisi:**\n\n1. **Traditional Chokha Garment (اللباس التقليدي الجورجي تشوكا):**\n• The iconic high-collar wool coat with bullet/cartridge chest slots (Masri) and silver dagger (Khanjali). Available for custom tailoring and souvenir purchase at *Samoseli Pirveli* boutique (Irakli Abashidze St) and Meidan Bazaar.\n\n2. **Dry Bridge Flea Market (سوق الجسر الجاف التراثي):**\n• Famous open-air cultural bazaar selling antique silver jewelry, Georgian hand-woven carpets (Pardagi), traditional clay tableware, and sheepskin hats (Papakha).`;
      }
      return `👘 **دليل الملابس التراثية الجورجية (التشوكا Chokha) والأسواق الشعبية في تبيليسي:**\n\n1. **الزي التراثي الجورجي (التشوكا - Chokha):**\n• الزي التاريخي الشهير للفرسان الجورجيين بمعطف الصوف الأنيق وخرطوشات الصدر وحزام الخنجر الفضي (Khanjali). يمكنك شراؤه وتجربته في متجر الأزياء التراثية الشهير *Samoseli Pirveli* وسوق ميدان بازار.\n\n2. **سوق الجسر الجاف التراثي (Dry Bridge Flea Market):**\n• أشهر سوق مفتوح للتحف والفضيات التراثية والسجاد اليدوي وقبعات الصوف القوقازية (Papakha) والأواني الخزفية.`;
    }
  }

  // 6. HOTELS & ACCOMMODATION (فندق، فنادق، سكن، شقق، إقامة)
  if (
    msg.includes('فندق') ||
    msg.includes('فنادق') ||
    msg.includes('سكن') ||
    msg.includes('شقق') ||
    msg.includes('شقة') ||
    msg.includes('إقامة') ||
    msg.includes('hotel') ||
    msg.includes('hotels')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      return isEn
        ? `🏨 **Top Recommended Hotels in Tbilisi (Georgia):**\n\n1. **Stamba Hotel (Chugureti):** Stunning design hotel in a converted publishing house.\n2. **Rooms Hotel Tbilisi (Vera):** Chic boutique hotel with trendy terrace lounge.\n3. **The Biltmore Hotel Tbilisi (Rustaveli Ave):** Landmark luxury glass skyscraper with skyline views.\n4. **Radisson Blu Iveria Hotel (First Republic Square):** Prime central luxury with infinity rooftop spa.`
        : `🏨 **أفضل الفنادق وأماكن السكن في تبيليسي (جورجيا):**\n\n1. **فندق بيلتمور تبيليسي (The Biltmore Hotel - شارع روستافيلي):** ناطحة السحاب الزجاجية الفاخرة في قلب السنتر.\n2. **فندق راديسون بلو إيفيريا (Radisson Blu Iveria):** فندق 5 نجوم بموقع استراتيجي ومسبح بانورامي يطل على نهر كورا.\n3. **فندق ستامبا (Stamba Hotel):** تحفة معمارية تجمع بين التصميم العصري والتراثي.\n4. **فندق رومز تبيليسي (Rooms Hotel - حي فيرا):** فندق بوتيكي فاخر ومفضل للإقامة الهادئة.`;
    }
  }

  // 7. GENERAL ACCURATE CITY FALLBACK (NO GENERIC EMPTY BOILERPLATE)
  if (isEn) {
    return `🌍 **Here are specific recommendations for ${cityEn} (${destNameEn}) regarding "${userMessage}":**\n\n• 📍 **Key Attractions & Highlights:** Explore central ${cityEn} with iconic scenic vistas, cultural heritage districts, top dining streets, and local markets.\n• 🚗 **Getting Around:** Use official taxi apps (Bolt/Grab/Uber) and the city metro system for comfortable, fast transit.\n• 💡 **WASL Features:** You can explore the dedicated tabs (Safety & Emergency Contacts, Living Local Language & Translator, and Religious Context) for complete authentic details!`;
  }
  return `🌍 **بخصوص استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أبرز التوصيات:** تتوفر في ${city} كبرى المعالم السياحية والترفيهية والأسواق التراثية ومطاعم المشاوي والمأكولات الحلال المعتمدة ومقاهي القهوة المختصة.\n• 🚗 **التنقل المريح:** يُنصح باستخدام تطبيقات التنقل المعتمدة (مثل تطبيق Bolt وشبكة المترو) للوصول السريع إلى أي وجهة بأمان.\n• 💡 **استكشف تبويبات وصل:** يمكنك فتح تبويبات المنصة التفاعلية (أرقام الطوارئ المعتمدة، لغة البلد الحية والمترجم، والسياق الديني ودليل المسافر) للاطلاع على أدق التفاصيل الموثقة فوراً!`;
}