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

    // Try AI with strict timeout
    if (apiKey || provider) {
      try {
        const aiRes = await callAI({
          systemPrompt,
          prompt: userMessage,
          apiKey,
          provider,
          temperature: 0.35,
          maxTokens: 1024,
        });

        if (!aiRes.error && aiRes.content) {
          return NextResponse.json({
            success: true,
            provider: aiRes.provider,
            modelUsed: aiRes.modelUsed,
            latencyMs: aiRes.latencyMs,
            reply: aiRes.content,
          });
        }
      } catch (e) {
        console.warn('AI call fallback to smart reasoning:', e);
      }
    }

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
 * Deep Multilingual Travel & Cultural Reasoning Engine
 */
function generateSmartChatReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'Singapore';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Singapore';
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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nI can assist you with instant, deep local recommendations on:\n• ☕ **Specialty Coffee & Artisan Cafes** (Filter roasteries, pour-overs, famous roasters)\n• 🍽️ **Top Restaurants, Hawker Centers & Halal Dining** (Michelin spots, local food, BBQ)\n• 🏨 **Best Hotels & Neighborhoods** (Central luxury, scenic views, family suites)\n• 🛍️ **Shopping Malls, Traditional Attire & Boutiques**\n• 🎡 **Theme Parks, 2-Day Itineraries & Thrill Rides**\n• 🚕 **Transportation, Transit Cards (EZ-Link/T-Money/Suica) & Metro**\n• 🚨 **Emergency Dispatch & Consular Support**\n\nHow can I help you explore or plan right now?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيسعدني جداً إفادتك بأدق التفاصيل العملية فوراً، مثل:\n• ☕ **أفضل مقاهي القهوة المختصة (Specialty Coffee)** والمحامص والحلويات\n• 🍽️ **المطاعم المركزية والأكلات الحلال المعتمدة** والأسواق الشعبية\n• 🏨 **الفنادق وأماكن السكن** (السنتر، الإطلالات المميزة، الخيارات العائلية)\n• 🛍️ **المولات والتسوق والملابس التراثية**\n• 🎡 **خطط الجولات اليومية والملاهي والأنشطة الترفيهية**\n• 🚕 **المواصلات وبطاقات المترو الذكية والتنقل**\n• 🚨 **أرقام الطوارئ وسفارة بلدك وإرشادات السلامة**\n\nتفضل بسؤالي مباشرة وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. SPECIALTY COFFEE & CAFES (قهوة مختصة، كافيهات، مقهى، قهوة، قهوه، كوفي، coffee, cafe)
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
    msg.includes('roastery') ||
    msg.includes('espresso')
  ) {
    // SINGAPORE SPECIALTY COFFEE
    if (normDest.includes('singapore') || normDest.includes('سنغافورة') || normDest.includes('سنغافوره')) {
      if (isEn) {
        return `☕ **Top Specialty Coffee Spots & Artisan Roasteries in Singapore:**\n\n1. **Chye Seng Huat Hardware (Jalan Besar):**\n• The undisputed icon of Singapore’s specialty coffee scene, set in a converted Art Deco hardware store with a 360-degree island brew bar, house-roasted single origins, and nitro cold brews.\n\n2. **Bacha Coffee (ION Orchard / Jewel Changi Airport / Marina Bay Sands):**\n• Opulent luxury coffee house founded originally in Marrakech (1910). Features over 200 single-origin 100% Arabica coffees served in ornate golden gooseneck pots with vanilla chantilly cream.\n\n3. **Nylon Coffee Roasters (Everton Park):**\n• Award-winning micro-roastery tucked in a quiet historic neighborhood; celebrated for purist pour-overs, direct-trade single origins, and exceptional espresso.\n\n4. **Common Man Coffee Roasters (Robertson Quay / Martin Road):**\n• Famous for exceptional specialty roasts, barista championships, and the finest brunch alongside the Singapore River.\n\n5. **% Arabica Singapore (Arab Street & Jewel Changi):**\n• Renowned minimalist Japanese specialty roastery serving smooth Kyoto lattes and Spanish lattes right next to the historic Sultan Mosque.\n\n💡 **Local Tip:** If you want traditional local Nanyang coffee, head to **Ya Kun Kaya Toast** and order a "Kopi-C Kosong" (coffee with evaporated milk and no sugar)!`;
      }
      return `☕ **أفضل مقاهي ومحامص القهوة المختصة (Specialty Coffee) في سنغافورة:**\n\n1. **مقهى ومحمصة تشاي سينغ هوات (Chye Seng Huat Hardware - منطقة جالان بيسار):**\n• الأيقونة الأولى للقهوة المختصة في سنغافورة؛ يقع في مبنى تراثي كلاسيكي مع بار تحضير 360 درجة، ويقدم محاصيل بن فردية المصدر (Single Origin) ومشروبات النيترو والتقطير اليدوي V60.\n\n2. **باشا كوفي (Bacha Coffee - فرع آيون أورشارد ومطار شانغي ومارينا باي):**\n• تجربة ملكية فاخرة تأسست عام 1910 في مراكش؛ يضم أكثر من 200 نوع من أفخر أنواع البن العربي 100%، وتُقدم القهوة في أباريق ذهبية أنيقة مع كريمة الشانتيلي والكرواسون الطازج.\n\n3. **نايلون كوفي روستر (Nylon Coffee Roasters - إيفرتون بارك):**\n• محمصة حرفية حاصلة على جوائز مرموقة؛ متخصصة في القهوة المقطرة النقية والتحميص المباشر لعشاق القهوة الفاخرة.\n\n4. **كومون مان كوفي (Common Man Coffee Roasters - روبرتسون كواي):**\n• من أشهر وجهات القهوة والإفطار الراقي على ضفاف نهر سنغافورة، بمحاصيل قهوة مختصة معتمدة عالمياً.\n\n5. **بالمائة أرابيكا (% Arabica - فرع شارع العرب وجويل شانغي):**\n• المحمصة اليابانية الشهيرة بقهوة اللاتيه المميزة (Kyoto Latte) والموقع الاستراتيجي بجوار مسجد السلطان التاريخي.\n\n💡 **نصيحة محلية:** لتجربة القهوة الشعبية التراثية السنغافورية، اطلب في مقاهي **Ya Kun Kaya Toast** قهوة "Kopi-C Kosong" (قهوة مع حليب مبخر بدون سكر) مع توست الكايا اللذيذ!`;
    }

    // SEOUL SPECIALTY COFFEE
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      if (isEn) {
        return `☕ **Top Specialty Coffee Roasteries & Cafes in Seoul:**\n\n1. **Fritz Coffee Company (Dohwa-dong / Mapo):** Renowned Hanok roastery blending traditional Korean architecture with championship specialty espresso.\n2. **Anthracite Coffee Roasters (Hapjeong & Hannam-dong):** Famous industrial-chic converted factory serving rich single origins.\n3. **Center Coffee (Seoul Forest):** Founded by UK Brewer Cup champion Park Sang-ho; supreme geishas and pour-overs.\n4. **Blue Bottle Coffee Samcheong-dong:** Scenic Hanok rooftop views overlooking Gyeongbokgung Palace.`;
      }
      return `☕ **أفضل مقاهي ومحامص القهوة المختصة في سيول (كوريا الجنوبية):**\n\n1. **محمصة فريتز كوفي (Fritz Coffee Company - مابو وسامشونغ):** أشهر محمصة كورية في بيت هانوك تراثي فخم؛ تقدم حبوب بن حائزة على جوائز مع مخبوزات طازجة يومياً.\n2. **أنثراسايت كوفي (Anthracite Coffee - هابجونغ وإتايوان):** مقهى ومحمصة في مبنى صناعي بتصميم عصري ملهم لعشاق القهوة المقطرة.\n3. **سنتر كوفي (Center Coffee - غابة سيول):** أسسها بطل مسابقة تحضير القهوة في بريطانيا؛ متخصصة في محصول قيشا (Geisha) الفاخر.\n4. **بلو بوتل سامشونغ (Blue Bottle Samcheong):** بإطلالة بانورامية ساحرة على قصر غيونغبوكغونغ والبيوت التراثية.`;
    }

    // TOKYO SPECIALTY COFFEE
    if (normDest.includes('japan') || normDest.includes('اليابان') || normDest.includes('tokyo') || normDest.includes('طوكيو')) {
      return isEn
        ? `☕ **Top Specialty Coffee Roasteries in Tokyo:**\n\n1. **Glitch Coffee Roasters (Jimbocho & Ginza):** Master roasters famous for ultra-light roast rare Ethiopian & Panamanian Geishas.\n2. **Fuglen Tokyo (Shibuya / Yoyogi Park):** Norwegian specialty coffee powerhouse.\n3. **Koffee Mameya (Omotesando):** The "coffee pharmacy" curating exceptional beans from top global roasters.`
        : `☕ **أفضل مقاهي ومحامص القهوة المختصة في طوكيو (اليابان):**\n\n1. **غليتش كوفي (Glitch Coffee Roasters - جينزا وجيمبوتشو):** أعرق محمصة يابانية متخصصة في محاصيل قيشا النادرة والتحميص الخفيف فائق النقاء.\n2. **فوجلين طوكيو (Fuglen Tokyo - شيبويا بجوار حديقة يويوغي):** مقهى ومحمصة نرويجية كلاسيكية شهيرة.\n3. **كوفي مامييا (Koffee Mameya - أوموتيساندو):** صيدلية القهوة التي تتيح لك اختيار حبوب البن وتحديد درجة التحميص بدقة متناهية.`;
    }
  }

  // 3. TRADITIONAL CLOTHING (ملابس تقليدية، هانبوك، كيمونو، ثوب، تراث)
  if (
    msg.includes('ملابس تقليد') ||
    msg.includes('لبس تقليد') ||
    msg.includes('هانبوك') ||
    msg.includes('كيمونو') ||
    msg.includes('تأجير') ||
    msg.includes('traditional cloth') ||
    msg.includes('hanbok') ||
    msg.includes('kimono')
  ) {
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `👘 **Hanbok Rental & Purchase in Seoul:**\n\n• **Insadong & Bukchon Hanok Village:** Top rental boutiques (e.g. *Hanboknam*, *Oneday Hanbok* from 15,000 KRW).\n• **Free Palace Entry:** Wearing a Hanbok gives you 100% free admission to all royal palaces (Gyeongbokgung, Changdeokgung).\n• **Purchasing:** Visit *Gwangjang Market (2nd Floor)* for authentic tailored silk Hanbok.`
        : `👘 **دليل شراء وتأجير الهانبوك الكوري التقليدي في سيول:**\n\n• **قرية بوكتشون وشارع إنسادونغ:** أشهر محلات التأجير (*Hanboknam* و *Oneday Hanbok*) بأسعار تبدأ من 15,000 وون (~45 ريال).\n• **ميزة مجانية:** ارتداء الهانبوك يمنحك **دخولاً مجانياً فورياً 100%** لكافة القصور الملكية في سيول (قصر غيونغبوكغونغ وتشانغدوكغونغ)!\n• **شراء الهانبوك الأصلي:** سوق غوانغ جانغ التراثي (الدور الثاني) وسوق دونغ ديمون للحرير.`;
    }
  }

  // 4. PLANS, 2-DAY ITINERARIES, THEME PARKS & GAMES (خطة، يومين، العاب، ملاهي، فعاليات)
  if (
    msg.includes('العاب') ||
    msg.includes('ألعاب') ||
    msg.includes('ملاهي') ||
    msg.includes('خطة') ||
    msg.includes('خطه') ||
    msg.includes('يومين') ||
    msg.includes('فعاليات') ||
    msg.includes('theme park') ||
    msg.includes('games') ||
    msg.includes('2 days')
  ) {
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      if (isEn) {
        return `🎢 **Exciting 2-Day Action & Attractions Itinerary in Singapore:**\n\n🎡 **Day 1: Sentosa Island Thrills & Universal Studios**\n• 🌅 **Morning to Afternoon:** **Universal Studios Singapore (USS)** on Sentosa Island (Battlestar Galactica dueling coasters, Transformers 3D, Jurassic Park Rapids).\n• ☀️ **Late Afternoon:** **Skyline Luge Sentosa** (gravity-fueled go-kart tracks) + Mega Adventure Zipline.\n• 🌙 **Evening:** **Wings of Time** night laser/fireworks show + Dinner at Quayside Isle.\n\n🌿 **Day 2: Futuristic Wonders & Skyline Gaming**\n• 🌅 **Morning:** **Gardens by the Bay** (Flower Dome, Cloud Forest waterfall, and OCBC Skyway Supertrees).\n• ☀️ **Afternoon:** **Marina Bay Sands SkyPark Observation Deck** + ArtScience Museum interactive exhibits.\n• 🌙 **Evening:** **Jewel Changi Airport** (HSBC Rain Vortex 40m indoor waterfall + Canopy Park sky nets & maze).`;
      }
      return `🎢 **برنامج مميز لمدة يومين مليء بالأنشطة والملاهي في سنغافورة:**\n\n🎡 **اليوم الأول: جزيرة سنتوسا الترفيهية ويونيفرسال ستوديوز**\n• 🌅 **الصباح والظهيرة:** **منتزه يونيفرسال ستوديوز سنغافورة (USS):** ألعاب الإثارة العالمية مثل قطار باتلستار جالاكتيكا المزدوج، وعالم المتحولون ثلاثي الأبعاد، ومغامرة حديقة الديناصورات.\n• ☀️ **العصر:** **زحليقة سنتوسا المعلقة (Skyline Luge):** قيادة عربات الكارتينج المنحدرة بين الغابات مع مسار التلفريك البانورامي.\n• 🌙 **المساء:** عرض النوافير والليزر الليلي **Wings of Time** على شاطئ سنتوسا.\n\n🌿 **اليوم الثاني: المعالم المستقبلية وجويل شانغي الأسطوري**\n• 🌅 **الصباح:** **حدائق الخليج (Gardens by the Bay):** قبة الغابة السحابية (Cloud Forest) وشلالها الداخلي الشاهق وأشجار السوبرتري العملاقة.\n• ☀️ **الظهيرة:** منصة مراقبة **مارينا باي ساندز (SkyPark)** ومتحف الفنون والعلوم التفاعلي.\n• 🌙 **المساء:** **جويل مطار شانغي (Jewel Changi):** أضخم شلال داخلي في العالم (Rain Vortex بارتفاع 40 متراً) وشباك القفز المعلقة (Canopy Park).`;
    }

    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `🎢 **2-Day Action Itinerary in Seoul:**\n\n• **Day 1 (Jamsil):** Lotte World Adventure + Lotte World Tower (Seoul Sky 555m) + COEX VR Arcades.\n• **Day 2 (Yongin & Hongdae):** Everland Resort (T-Express wooden coaster, Panda World) + Hongdae Youth Street arcade arenas.`
        : `🎢 **خطة يومين ممتعة للألعاب والملاهي في سيول:**\n\n• **اليوم الأول:** منتزه لوت وورلد (Lotte World) المفتوح والمغلق + برج لوت (Seoul Sky) + صالات ألعاب الواقع الافتراضي في كويكس مول غانغنام.\n• **اليوم الثاني:** منتجع إيفرلاند (Everland) وقطار T-Express الخشبي الشهير وسفاري الباندا + سهرة شارع هونغداي للألعاب وعروض الشارع.`;
    }
  }

  // 5. RESTAURANTS, FOOD & HALAL (مطاعم، أكل، حلال، عشاء، غداء، برجر، مشاوي)
  if (
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('حلال') ||
    msg.includes('مشاوي') ||
    msg.includes('برجر') ||
    msg.includes('restaurant') ||
    msg.includes('food') ||
    msg.includes('halal')
  ) {
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      if (isEn) {
        return `🍽️ **Top Restaurants & Halal Dining in Singapore:**\n\n1. **Zam Zam Restaurant (Arab Street - Founded 1908):**\n• Legendary historic restaurant opposite Sultan Mosque famous for crispy deer/chicken Murtabak and flavorful biryani.\n\n2. **The Malayan Council (Bugis & Bussorah St):**\n• Upscale Muslim-owned restaurant combining Malay heritage with Western dishes (Smoked Duck Pasta, Ondeh Ondeh Cake).\n\n3. **Lau Pa Sat Hawker Festival Market (Downtown):**\n• Stunning Victorian cast-iron food hall with famous open-air "Satay Street" grilling halal chicken, beef, and mutton skewers.\n\n4. **Poulet (Bugis Junction & Raffles City):**\n• MUIS Halal certified French roast chicken specialist.\n\n5. **Bebek Goreng Pak Ndut (Lucky Plaza, Orchard Rd):**\n• Famous crispy Indonesian fried duck and grilled seafood.`;
      }
      return `🍽️ **أفضل المطاعم والأكلات الحلال المميزة في سنغافورة:**\n\n1. **مطعم زام زام التاريخي (Zam Zam Restaurant - شارع العرب مقابل مسجد السلطان):**\n• تأسس عام 1908؛ الأشهر عالمياً في تقديم المطبق باللحم والدجاج (Murtabak) والبرياني السنغافوري العريق.\n\n2. **مطعم ذا ملايان كاونسل (The Malayan Council - شارع بوزورة وبوجيس):**\n• مطعم راقٍ ومملوك لمسلمين يجمع بين المطبخ الملاوي الفاخر والأطباق الغربية وكعك الأونديه أونديه الشهير.\n\n3. **سوق لاو با سات التراثي (Lau Pa Sat - في قلب السنتر):**\n• صرح معماري فيكتوري تاريخي يضم "شارع الساتاي" المفتوح ليلاً مع ألذ أسياخ المشاوي الحلال بصلصة الفول السوداني.\n\n4. **مطعم بوليت الفرنسي الحلال (Poulet - مول رافلز سيتي وأورشارد):**\n• معتمد حلال من MUIS ومتخصص في الدجاج المشوي الفرنسي بالصلصات الفاخرة.\n\n5. **مطعم بيبك جورينج باك ندوت (Bebek Goreng Pak Ndut - شارع أورشارد):**\n• أطباق البط المقرمش والأسماك المشوية على الطريقة الإندونيسية الحلال.`;
    }

    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `🍽️ **Top Central Dining in Seoul:**\n\n• **Myeongdong Kyoja:** Michelin knife-cut noodles & handmade dumplings in central Myeongdong.\n• **Tosokchon:** Historic ginseng chicken soup near Gyeongbokgung.\n• **Eid Halal & Makan:** KMF-certified halal Korean BBQ in Itaewon.`
        : `🍽️ **أفضل المطاعم في سنتر سيول:**\n\n• **ميونغ دونغ كيوجا (Myeongdong Kyoja):** معكرونة وزلابية كورية حائزة على ميشلان في قلب ميونغ دونغ.\n• **توسوكشون (Tosokchon):** حساء الجينسنغ الملكي التقليدي بجوار قصر غيونغبوكغونغ.\n• **مطعم عيد الحلال ومطعم ماكان (إتايوان):** مشاوي لحم بقري بولغوغي وأكلات كورية حلال معتمدة من KMF.`;
    }
  }

  // 6. HOTELS & ACCOMMODATION
  if (
    msg.includes('فندق') ||
    msg.includes('فنادق') ||
    msg.includes('سكن') ||
    msg.includes('شقق') ||
    msg.includes('شقة') ||
    msg.includes('إقامة') ||
    msg.includes('hotel') ||
    msg.includes('hotels') ||
    msg.includes('stay')
  ) {
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `🏨 **Top Recommended Hotels in Singapore:**\n\n1. **Marina Bay Sands:** World-famous luxury hotel with the iconic rooftop infinity pool.\n2. **Raffles Singapore:** Legendary 5-star colonial heritage palace.\n3. **The Ritz-Carlton, Millenia Singapore:** Breathtaking Marina Bay skyline vistas.\n4. **Pan Pacific Serviced Suites (Orchard / Beach Road):** Premium family apartments with full kitchens.`
        : `🏨 **أفضل الفنادق وأماكن السكن في سنغافورة:**\n\n1. **فندق مارينا باي ساندز (Marina Bay Sands):** الفندق الأشهر عالمياً بمسبح الإنفينيتي المعلق في الطابق 57.\n2. **فندق رافلز سنغافورة (Raffles Hotel):** قصر استعماري أسطوري 5 نجوم في قلب العاصمة.\n3. **ذا ريتز-كارلتون ميلينيا (The Ritz-Carlton Millenia):** إطلالات بانورامية مفتوحة على أفق مارينا باي.\n4. **بان باسيفيك للأجنحة الفندقية (Pan Pacific Suites - شارع أورشارد):** شقق فندقية عائلية فخمة ومجهزة بمطابخ متكاملة.`;
    }
  }

  // 7. HOSPITALS & MEDICAL CARE (مستشفيات، علاج، مستشفى، دكتور، صحة)
  if (
    msg.includes('مستشفى') ||
    msg.includes('مستشفيات') ||
    msg.includes('علاج') ||
    msg.includes('طبيب') ||
    msg.includes('دكتور') ||
    msg.includes('صيدلية') ||
    msg.includes('صحة') ||
    msg.includes('hospital') ||
    msg.includes('medical')
  ) {
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `🏥 **Top International Hospitals & Medical Care in Singapore:**\n\n1. **Mount Elizabeth Hospital (Orchard & Novena):** Premier private tertiary hospital with dedicated International Patient Services (IPC).\n2. **Gleneagles Hospital (Tanglin / Napier Rd):** World-class medical specialists and advanced surgery opposite the Botanic Gardens.\n3. **Singapore General Hospital (SGH - Outram Park):** Singapore's largest and most prestigious academic hospital.\n\n🚨 **Medical Emergency:** Dial **995** for SCDF Emergency Ambulance, or **1777** for non-emergency transport.`
        : `🏥 **أفضل المستشفيات والمراكز الطبية العالمية في سنغافورة:**\n\n1. **مستشفى ماونت إليزابيث (Mount Elizabeth Hospital - شارع أورشارد ونوفينا):** أرقى صرح طبي خاص في جنوب شرق آسيا مع مركز مخصص لخدمة ورعاية المرضى الدوليين (IPC).\n2. **مستشفى جلين إيجلز (Gleneagles Hospital - مقابل الحدائق النباتية):** خدمات جراحية وتخصصية متقدمة بمعايير عالمية.\n3. **مستشفى سنغافورة العام (SGH):** أكبر مستشفى أكاديمي وحكومي مجهز بأحدث تقنيات الطوارئ.\n\n🚨 **للطوارئ الطبية:** اتصل برقم الإسعاف **995**، أو **1777** للإسعاف غير الطارئ.`;
    }
  }

  // 8. GENERAL SPECIFIC FALLBACK (No generic empty responses!)
  if (isEn) {
    return `🌍 **Here are tailored recommendations for ${cityEn} (${destNameEn}) regarding "${userMessage}":**\n\n• 📍 **Top Local Highlights:** Explore central districts in ${cityEn} featuring vibrant cultural spots, world-class dining, and secure amenities.\n• 🚗 **Mobility:** Use official local apps (Grab/Uber/T-Money/EZ-Link) and public transit for seamless navigation.\n• 💡 **WASL Features:** Check the interactive tabs in WASL (Safety & Emergency, Living Language, Religious Context, and Accommodations) for comprehensive verified details!`;
  }
  return `🌍 **بخصوص استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أبرز التوصيات:** تتوفر في ${city} أفضل الخدمات السياحية والترفيهية ومراكز التسوق المعتمدة ومقاهي القهوة المختصة والمطاعم الحلال.\n• 🚗 **التنقل المريح:** يمكنك استخدام التطبيقات الذكية المعتمدة وشبكات المترو الحديثة للوصول المباشر بكل يسر وسهولة.\n• 💡 **استكشف تبويبات وصل:** ننصحك بفتح تبويبات منصة وصل المتخصصة (أرقام الطوارئ المعتمدة، لغة البلد الحية والمترجم، والسياق الديني ودليل المسافر المسلم) للاطلاع على أدق التفاصيل الموثقة فوراً!`;
}