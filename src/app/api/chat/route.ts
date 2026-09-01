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
      if (jCtx.accommodationStatus) {
        contextParts.push(`- Accommodation Status: ${jCtx.accommodationStatus}`);
      }
      if (jCtx.interests && jCtx.interests.length > 0) {
        contextParts.push(`- Interests: ${Array.isArray(jCtx.interests) ? jCtx.interests.join(', ') : jCtx.interests}`);
      }
      if (jCtx.dates) {
        contextParts.push(`- Travel Dates/Season: ${jCtx.dates}`);
      }
      if (jCtx.travelStyle) {
        contextParts.push(`- Travel Style: ${jCtx.travelStyle}`);
      }
    }

    const isEn = isEnglishText(userMessage) || locale === 'en';
    const langDirective = isEn
      ? 'STRICT DIRECTIVE: Respond completely and naturally in ENGLISH. Provide structured bullet points with real names and actionable advice.'
      : 'توجيه إلزامي: أجب باللغة العربية بأسلوب راقٍ ومنظم ومحدد، مع ذكر أسماء الأماكن الحقيقية والنصائح العملية.';

    const contextStr = contextParts.length > 0
      ? `Active Traveler Context:\n${contextParts.join('\n')}\n\n${langDirective}`
      : `General travel and cultural companion.\n\n${langDirective}`;

    const systemPrompt = `${AI_SYSTEM_PROMPTS.chatAssistant}\n\n${contextStr}`;

    const aiRes = await callAI({
      systemPrompt,
      prompt: userMessage,
      apiKey,
      provider,
      temperature: 0.35,
      maxTokens: 1024,
    });

    if (aiRes.error || !aiRes.content) {
      const fallbackReply = generateSmartChatReply(userMessage, jCtx, isEn);
      return NextResponse.json({
        success: true,
        provider: 'wasl-smart-assistant',
        reply: fallbackReply,
      });
    }

    return NextResponse.json({
      success: true,
      provider: aiRes.provider,
      modelUsed: aiRes.modelUsed,
      latencyMs: aiRes.latencyMs,
      reply: aiRes.content,
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

/**
 * Detects if the text is primarily English
 */
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
  const destNameEn = ctx?.destination?.name || 'Your Destination';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'City Center';
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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nI can assist you with instant, deep local recommendations on:\n• 🍽️ **Top Restaurants, Cafes & Halal Dining** (Local cuisine, burgers, Middle Eastern)\n• 🏨 **Best Hotels & Neighborhoods** (Central luxury, scenic views, family suites)\n• 🛍️ **Open-Air Malls, Traditional Souqs, Hanbok & Boutiques**\n• 🚕 **Transportation, Rideshare (Uber/Careem/Grab), T-Money & Metro Navigation**\n• 🎓 **Universities, Medical Centers & Relocation Services**\n• 🚨 **Emergency Lines, Consular Support & Local Safety Tips**\n\nHow can I help you explore or plan right now?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيسعدني جداً إفادتك بأدق التفاصيل العملية، مثل:\n• 🍽️ **المطاعم والمقاهي والأكلات الحلال** (المحلية، المشاوي، السنتر، الشعبية)\n• 🏨 **أفضل الفنادق وأماكن السكن** (إطلالات مميزة، السنتر، شقق عائلية)\n• 🛍️ **الملابس التقليدية والأسواق التراثية والمولات الكبرى**\n• 🎡 **خطط الجولات السياحية والملاهي والأنشطة الترفيهية**\n• 🚕 **المواصلات، بطاقات التنقل الذكية (T-Money/Suica)، والمترو**\n• 🚨 **أرقام الطوارئ وسفارة بلدك وإرشادات السلامة**\n\nتفضل بسؤالي مباشرة وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. TRADITIONAL CLOTHING & CULTURAL ATTIRE (ملابس تقليدية، هانبوك، كيمونو، ثوب، تراث، تأجير هانبوك)
  if (
    msg.includes('ملابس تقليد') ||
    msg.includes('لبس تقليد') ||
    msg.includes('هانبوك') ||
    msg.includes('كيمونو') ||
    msg.includes('تأجير') ||
    msg.includes('ازياء تقليدية') ||
    msg.includes('أزياء تقليدية') ||
    msg.includes('traditional cloth') ||
    msg.includes('traditional dress') ||
    msg.includes('hanbok') ||
    msg.includes('kimono')
  ) {
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      if (isEn) {
        return `👘 **Traditional Korean Clothing (Hanbok - 한복) Guide in Seoul:**\n\n1. **Top Rental & Purchase Areas:**\n• **Insadong Street (인사동) & Bukchon Hanok Village (북촌한옥마ئل):** The epicenter of traditional culture with hundreds of Hanbok rental boutiques and artisan craft shops.\n• **Hanboknam (한복남 - Gyeongbokgung branch):** Offers over 500 premium and royal Hanbok styles with hairstyling, accessories, and locker services (approx. 15,000 - 25,000 KRW / ~$12-$20 for 2-4 hours).\n• **Oneday Hanbok & In Korea Hanbok:** Popular rental shops right next to Gyeongbokgung Station (Exit 2).\n\n2. **Buying Authentic Hanbok:**\n• **Gwangjang Market (광장시장 - 2nd Floor):** Historic silk market specializing in custom-tailored, heirloom-quality Hanboks.\n• **Dongdaemun Hanbok Market:** Extensive fabric and ready-made traditional attire.\n\n💡 **Pro Tip:** Wearing a Hanbok grants you **100% FREE Admission** to all royal palaces in Seoul (Gyeongbokgung, Changdeokgung, Deoksugung)!`;
      }
      return `👘 **دليل شراء وتأجير الملابس التقليدية الكورية (الهانبوك - Hanbok) في سيول:**\n\n1. **أشهر محلات وتجارب تأجير الهانبوك (Hanbok Rental):**\n• **قرية بوكتشون التراثية وشارع إنسادونغ (Insadong & Bukchon):** المنطقة الأشهر في سيول لارتداء وتأجير الهانبوك والتجول بين أزقة البيوت التراثية.\n• **محل هانبوك نام (Hanboknam - فرع قصر غيونغبوكغونغ):** يضم أكثر من 500 تصميم للهانبوك الملكي والكلاسيكي مع تسريحات شعر وإكسسوارات تراثية (الأسعار تبدأ من 15,000 إلى 25,000 وون كوري / ~45 إلى 75 ريال لساعتين إلى 4 ساعات).\n• **محل Oneday Hanbok ومحل In Korea Hanbok:** بالقرب من محطة مترو Gyeongbokgung.\n\n2. **أفضل الأسواق لشراء الهانبوك الكوري الأصلي والأقمشة:**\n• **سوق غوانغ جانغ التراثي (Gwangjang Market - الدور الثاني):** أعرق سوق للحرير والمنسوجات التراثية لتفصيل وشراء الهانبوك الأصلي.\n• **سوق دونغ ديمون للحرير والأقمشة (Dongdaemun Silk Market).**\n\n💡 **ميزة ذهبية للمسافر:** ارتداء الهانبوك يمنحك **دخولاً مجانياً 100%** لكافة القصور الملكية الإمبراطورية في سيول (قصر غيونغبوكغونغ، تشانغدوكغونغ، وقصر دوكسوغونغ)!`;
    }

    if (normDest.includes('japan') || normDest.includes('اليابان') || normDest.includes('tokyo') || normDest.includes('طوكيو') || normDest.includes('kyoto') || normDest.includes('كيوتو')) {
      return isEn
        ? `👘 **Traditional Kimono & Yukata Guide in Japan:**\n\n• **Asakusa (Tokyo) & Gion (Kyoto):** Top areas for renting authentic Kimono and Yukata (e.g., *Wargo Kimono*, *Yae Kimono*).\n• **Ginza Motoji (Tokyo):** Renowned high-end boutique for purchasing master-woven silk kimonos.\n• **Nakamise Shopping Street:** Great for lightweight casual Yukata, sandals (Geta), and fans.`
        : `👘 **دليل الملابس التقليدية اليابانية (الكيمونو واليوكاتا) في اليابان:**\n\n• **حي أساكوسا (طوكيو) وحي غيون التراثي (كيوتو):** أشهر وجهات تأجير الكيمونو مع التصوير الفوتوغرافي (مثل محلات *Wargo* و *Yae Kimono*).\n• **شارع ناكاميسي التراثي:** لشراء أثواب اليوكاتا الصيفية القطنية الخفيفة والصنادل الخشبية (Geta).\n• **منطقة غينزا (Ginza Motoji):** للملابس الحريرية الفاخرة المنسوجة يدوياً.`;
    }
  }

  // 3. 2-DAY PLANS, THEME PARKS, GAMES & ACTIVITIES (خطة ليومين، العاب، ملاهي، فعاليات، برنامج ترفيهي)
  if (
    msg.includes('العاب') ||
    msg.includes('ألعاب') ||
    msg.includes('ملاهي') ||
    msg.includes('خطة') ||
    msg.includes('خطه') ||
    msg.includes('يومين') ||
    msg.includes('ترفيه') ||
    msg.includes('فعاليات') ||
    msg.includes('theme park') ||
    msg.includes('roller coaster') ||
    msg.includes('games') ||
    msg.includes('2 days') ||
    msg.includes('two days') ||
    msg.includes('amusement')
  ) {
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      if (isEn) {
        return `🎢 **Vibrant 2-Day Action, Theme Parks & Games Itinerary for Seoul:**\n\n🎡 **Day 1: Mega Theme Park & Skyline Thrills (Jamsil & Gangnam)**\n• 🌅 **Morning & Afternoon (10:00 AM - 04:00 PM):**\n  - **Lotte World Adventure (롯데월드):** The world's largest indoor theme park + outdoor Magic Island over Seokchon Lake. Experience thrilling rides like the *French Revolution VR Roller Coaster*, *Atlantis*, and *Gyro Drop*.\n• ☀️ **Late Afternoon (04:30 PM - 06:30 PM):**\n  - **Lotte World Tower (Seoul Sky 555m):** Ride the ultra-fast Sky Shuttle to the 123rd floor glass observation deck.\n• 🌙 **Evening (07:00 PM - 10:00 PM):**\n  - **Gangnam COEX Mega Mall:** Starfield Library + VR gaming zones & arcade arenas + Dinner at *Maple Tree House*.\n\n🎢 **Day 2: Outdoor Thrills & Youth Entertainment (Everland & Hongdae)**\n• 🌅 **Morning & Afternoon (09:30 AM - 04:30 PM):**\n  - **Everland Resort (에버랜드):** South Korea's massive outdoor park featuring the world-famous *T-Express* (one of the steepest wooden roller coasters in the world), Panda World safari, and Amazon Express.\n• 🌙 **Evening (06:00 PM - 11:00 PM):**\n  - **Hongdae Youth Street (홍대):** Experience vibrant street busking performances, retro multi-floor arcade halls (Zzang Games), escape rooms, and trendy themed cafes.`;
      }
      return `🎢 **خطة متكاملة وحيوية لمدة يومين مليئة بالملاهي والألعاب والأنشطة في سيول:**\n\n🎡 **اليوم الأول: عالم الملاهي الشاهقة وألعاب الإثارة (حي جامسيل وغانغنام)**\n• 🌅 **الفترة الصباحية والظهيرة (10:00 ص - 4:00 م):**\n  - **منتزه لوت وورلد (Lotte World Adventure):** أضخم مدينة ملاهي مغلقة في العالم بالإضافة إلى الجزيرة الساحرة المفتوحة فوق بحيرة سيوكتشون. استمتع بألعاب الإثارة الكبرى مثل قطار الرعب *French Revolution VR*، وقطار *Atlantis* المائي السريع، وبرج السقوط الحر *Gyro Drop*.\n• ☀️ **فترة العصر (4:30 م - 6:30 م):**\n  - **برج لوت وورلد (Seoul Sky - بارتفاع 555 متراً):** الصعود بالمصعد فائق السرعة إلى الطابق 123 والممشى الزجاجي المعلق بإطلالة بانورامية على كامل سيول.\n• 🌙 **المساء والسهرة (7:00 م - 10:00 م):**\n  - **مجمع كويكس مول (COEX Mall - غانغنام):** استكشاف مكتبة ستارفيلد الشهيرة وصالات ألعاب الواقع الافتراضي (VR Gaming Arcades) ثم عشاء بمطعم مشاوي فاخر.\n\n🎢 **اليوم الثاني: المغامرات الكبرى وصالات ألعاب الشباب (إيفرلاند وهونغداي)**\n• 🌅 **الصباح والظهيرة (9:30 ص - 4:30 م):**\n  - **منتجع إيفرلاند الترفيهي (Everland Resort):** أكبر منتزه ترفيهي مفتوح في كوريا الجنوبية؛ يضم قطار **T-Express** (أحد أسرع وأعلى قطارات الملاهي الخشبية في العالم بزاوية هبوط 77 درجة!)، وسفاري عالم الباندا ووديان الألعاب المائية.\n• 🌙 **المساء والسهرة (6:00 م - 11:00 م):**\n  - **شارع هونغداي الحيوي (Hongdae Youth Street):** أجواء الشارع الحية مع عروض الرقص الحي وصالات ألعاب الفيديو التفاعلية الضخمة المكونة من عدة طوابق (*Zzang Games*)، وغرف الهروب الذكية، ومقاهي الكيبوب المبتكرة!`;
    }

    if (normDest.includes('orlando') || normDest.includes('أورلاندو') || normDest.includes('florida')) {
      return isEn
        ? `🎢 **2-Day Epic Theme Park Itinerary in Orlando, Florida:**\n\n• **Day 1:** Magic Kingdom (Space Mountain, TRON Lightcycle / Run) + Fireworks.\n• **Day 2:** Universal Studios & Islands of Adventure (VelociCoaster, Hagrid's Magical Creatures, Wizarding World of Harry Potter).`
        : `🎢 **خطة يومين ممتعة للملاهي والألعاب في أورلاندو (فلوريدا):**\n\n• **اليوم الأول:** منتزه ديزني ماجيك كينغدوم (قطار الفضاء TRON و Space Mountain) وعروض الألعاب النارية الليلية.\n• **اليوم الثاني:** منتزه يونيفرسال آيلاندز أوف أدفنتشر (قطار فيلوسيكوستر السريع، وعالم هاري بوتر السحري).`;
    }
  }

  // 4. CENTRAL RESTAURANTS & FOOD (مطاعم في السنتر، مطاعم، أكل، حلال، ميونغ دونغ، غداء، عشاء)
  if (
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('سنتر') ||
    msg.includes('حلال') ||
    msg.includes('برجر') ||
    msg.includes('مشاوي') ||
    msg.includes('restaurant') ||
    msg.includes('restaurants') ||
    msg.includes('food') ||
    msg.includes('dining') ||
    msg.includes('halal')
  ) {
    // SEOUL CENTRAL RESTAURANTS
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      if (isEn) {
        return `🍽️ **Top Central Restaurants & Dining Spots in Seoul (Myeongdong & Downtown):**\n\n1. **Myeongdong Kyoja (명동교자 - Myeongdong Center):**\n• Michelin Bib Gourmand legendary restaurant in the heart of Myeongdong serving signature handmade knife-cut noodles (Kalguksu) and steamed dumplings (Mandu).\n\n2. **Tosokchon Samgyetang (토속촌 삼계탕 - Near Gyeongbokgung Palace):**\n• The most famous traditional royal ginseng chicken soup restaurant in Seoul, cooked with 30 herbs in a historic Hanok house.\n\n3. **Certified Halal Korean Dining (Itaewon & Myeongdong):**\n• **Eid Halal Korean Food (Itaewon):** Certified authentic Korean beef bulgogi and bibimbap.\n• **Makan Halal Restaurant:** Traditional Korean dishes with full KMF halal certification.\n• **Busan Jib Halal (Myeongdong):** Halal Korean spicy braised chicken, bulgogi, and seafood hotpot in central Myeongdong.\n\n4. **Maple Tree House (메이플트리 - Itaewon / Gangnam):**\n• Upscale, modern Korean BBQ specialist renowned for premium aged Hanwoo beef cooked tableside.\n\n5. **Gwangjang Market (광장시장):**\n• The historic epicenter for authentic Korean street food (crispy mung bean pancakes, kalguksu, and tteokbokki).`;
      }
      return `🍽️ **أفضل المطاعم في قلب سنتر سيول (ميونغ دونغ، إنسادونغ، وإتايوان):**\n\n1. **مطعم ميونغ دونغ كيوجا (Myeongdong Kyoja - في قلب سنتر ميونغ دونغ):**\n• من أشهر المطاعم الحائزة على تصنيف ميشلان؛ يقدم المعكرونة الكورية اليدوية الكلاسيكية (Kalguksu) والزلابية المطهوة على البخار (Mandu) بنكهات استثنائية.\n\n2. **مطعم توسوكشون سامغيتانغ (Tosokchon - بجوار قصر غيونغبوكغونغ):**\n• أعرق مطعم في كوريا لحساء الدجاج والجينسنغ الملكي التقليدي (Samgyetang) في بيت هانوك تراثي فخم.\n\n3. **المطاعم الحلال المعتمدة في السنتر:**\n• **مطعم بوسان جيب الحلال (Busan Jib Halal - داخل ميونغ دونغ):** يقدم المشاوي الكورية الحلال (Bulgogi)، أطباق الدجاج الحارة، والشوربات البحرية في قلب سنتر ميونغ دونغ.\n• **مطعم عيد للأكلات الكورية الحلال (Eid Halal - إتايوان):** معتمد رسمياً من KMF لأطباق اللحم البقري والبيبيمباب.\n• **مطعم ماكان (Makan Halal):** تشكيلة أطباق كورية أصيلة حلال 100%.\n\n4. **مطعم مابل تري هاوس (Maple Tree House - المشاوي الكورية الفاخرة):**\n• يقدم لحم البقر الكوري الفاخر (Hanwoo Beef) مع المشاوي على الطاولة في أجواء عصرية راقية.\n\n5. **سوق غوانغ جانغ الشعبي (Gwangjang Market):**\n• أقدم سوق مفتوح لتذوق أكلات الشارع الكورية الطازجة والفطائر المقرمشة بأسعار ممتازة.`;
    }

    // CAIRO RESTAURANTS
    if (normDest.includes('cairo') || normDest.includes('قاهرة') || normDest.includes('egypt') || normDest.includes('مصر')) {
      return isEn
        ? `🍽️ **Top Restaurants in Central Cairo:**\n\n• **Abou El Sid (Zamalek):** Authentic Egyptian cuisine in a 1940s oriental atmosphere.\n• **Zitouni (Four Seasons Nile Plaza):** Luxurious buffet with direct Nile views.\n• **Koshary Abou Tarek (Downtown):** Legendary world-famous Koshary.`
        : `🍽️ **أفضل المطاعم في سنتر القاهرة:**\n\n• **مطعم أبو السيد (الزمالك):** ملوخية بالبط، طواجن وحمام محشي في أجواء شرقية راقية.\n• **مطعم زيتوني (فورسيزونز نايل بلازا):** أطباق شرقية فاخرة بإطلالة مباشرة على النيل.\n• **كشري أبو طارق (وسط البلد):** تجربة الكشري المصري الأشهر عالمياً.`;
    }

    // ORLANDO RESTAURANTS
    if (normDest.includes('orlando') || normDest.includes('أورلاندو') || normDest.includes('florida')) {
      return isEn
        ? `🍽️ **Top Central Dining in Orlando:**\n\n• **Cedar's Restaurant (Sand Lake Rd / Restaurant Row):** Upscale Lebanese & Halal grills.\n• **Habibi Lebanese Cuisine (I-Drive):** Authentic shawarma and wraps.\n• **The Capital Grille (International Drive):** Premium aged steaks and seafood.`
        : `🍽️ **أفضل المطاعم في أورلاندو:**\n\n• **مطعم سيدارز اللبناني (شارع ساند ليك):** مشاوي حلال ومقبلات لبنانية راقية.\n• **مطعم حبيبي (إنترناشونال درايف):** شاورما وكباب وفلافل على مدار الساعة.\n• **ذا كابيتال جريل (I-Drive):** أطباق اللحوم الفاخرة والمأكولات البحرية.`;
    }
  }

  // 5. HOTELS & ACCOMMODATION
  if (
    msg.includes('فندق') ||
    msg.includes('فنادق') ||
    msg.includes('سكن') ||
    msg.includes('شقق') ||
    msg.includes('شقة') ||
    msg.includes('اقامة') ||
    msg.includes('إقامة') ||
    msg.includes('نيل') ||
    msg.includes('اطلالة') ||
    msg.includes('hotel') ||
    msg.includes('hotels') ||
    msg.includes('stay')
  ) {
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `🏨 **Top Recommended Hotels in Seoul:**\n\n1. **Four Seasons Hotel Seoul (Gwanghwamun):** Ultra-luxury 5-star next to Gyeongbokgung Palace.\n2. **Signiel Seoul (Lotte World Tower):** World-class hotel on floors 76-101 with breathtaking panoramic views.\n3. **Lotte Hotel Seoul (Myeongdong):** Central luxury hotel directly connected to Lotte Department Store and metro.`
        : `🏨 **أفضل الفنادق وأماكن السكن في سيول:**\n\n1. **فندق فورسيزونز سيول (Four Seasons Seoul - جوانغهوامون):** أفخم فندق 5 نجوم في قلب المدينة بجوار قصر غيونغبوكغونغ.\n2. **فندق سيغنييل سيول (Signiel Seoul - برج لوت وورلد):** إقامة أسطورية في الطوابق 76 إلى 101 بإطلالات بانورامية على أفق سيول.\n3. **فندق لوت سيول (Lotte Hotel Seoul - ميونغ دونغ):** موقع استراتيجي في سنتر ميونغ دونغ متصل مباشرة بالمول والمترو.`;
    }

    if (normDest.includes('cairo') || normDest.includes('قاهرة') || normDest.includes('egypt') || normDest.includes('مصر')) {
      return isEn
        ? `🏨 **Top Nile View Hotels in Cairo:**\n\n1. **Four Seasons Nile Plaza (Garden City):** Iconic Nile views with private balconies.\n2. **Sofitel Cairo Nile El Gezirah (Zamalek):** Island resort with infinity pool over the Nile.\n3. **The Nile Ritz-Carlton (Tahrir Square):** Historic luxury between the Nile and museum.`
        : `🏨 **أفضل فنادق القاهرة المطلة على النيل:**\n\n1. **فورسيزونز نايل بلازا (جاردن سيتي):** أرقى فنادق النيل مع شرفات خاصة ومطاعم عالمية.\n2. **سوفيتيل كايرو نايل الجزيرة (الزمالك):** مسبح إنفينيتي يطفو فوق النيل ومطاعم عائمة.\n3. **نايل ريتز-كارلتون (ميدان التحرير):** موقع استراتيجي بين كورنيش النيل والمتحف المصري.`;
    }
  }

  // 6. TRANSPORTATION, T-MONEY, METRO & UBER
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('مترو') ||
    msg.includes('تيموني') ||
    msg.includes('t-money') ||
    msg.includes('t money') ||
    msg.includes('taxi') ||
    msg.includes('uber') ||
    msg.includes('metro') ||
    msg.includes('transit')
  ) {
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return isEn
        ? `🚕 **Seoul Transit & T-Money Navigation Guide:**\n\n1. **T-Money Transit Card:** Buy at any convenience store (GS25, CU, 7-Eleven) for ~4,000 KRW and top up with cash. Tap upon boarding and exiting subways, buses, and taxis.\n2. **Seoul Metro:** One of the world's cleanest, safest, and most punctual subway networks with color-coded English signs.\n3. **Taxi & Rideshare:** Use **Kakao T** or **Uber (UT)** for upfront dispatch and fixed pricing.`
        : `🚕 **دليل المواصلات وبطاقة T-Money في سيول:**\n\n1. **بطاقة T-Money الذكية:** اشترِ البطاقة من أي بقالة (GS25 أو CU أو 7-Eleven) بحوالي 4,000 وون واشحنها نقداً. تعمل باللمس عند ركوب ونزول المترو والحافلات والتاكسي.\n2. **مترو سيول:** من أحدث وأنظف شبكات المترو في العالم، مرمز بالألوان واللوحات باللغة الإنجليزية ومكيفة بالكامل.\n3. **تطبيقات التاكسي والتوصيل:** استخدم تطبيق **Uber (UT)** أو **Kakao T** لتحديد المسار والدفع الإلكتروني السلس.`;
    }
  }

  // 7. GENERAL SPECIFIC FALLBACK
  if (isEn) {
    return `🌍 **Welcome! Here are tailored insights for ${cityEn} (${destNameEn}):**\n\nRegarding your question: *"${userMessage}"*\n\n• 📍 **Destination Highlights:** ${cityEn} offers world-class attractions, vibrant culture, and dedicated traveler facilities.\n• 🚗 **Mobility:** Rideshare apps (Uber/Kakao T/Grab) and public transit provide fast, comfortable navigation.\n• 🍽️ **Dining & Shopping:** Central shopping boulevards feature diverse local gastronomy, Halal options, and artisan markets.\n• 💡 **WASL Tabs:** Check the interactive tabs in WASL (Daily Itinerary, Safety, Accommodations, and Living Language) for full details!`;
  }
  return `🌍 **مرحباً بك! يسعدني إفادتك بخصوص رحلتك إلى ${city} (${destName}):**\n\nبخصوص استفسارك: "${userMessage}"\n\n• 📍 **عن المدينة:** تتميز ${city} بكافة الخدمات السياحية والخدمية المتطورة لضمان إقامة مريحة وممتعة.\n• 🚗 **التنقل والمواصلات:** يُنصح بالاعتماد على التطبيقات الذكية والمترو لسهولة الوصول ودقة المواعيد.\n• 🍽️ **المطاعم والأنشطة:** تتوفر خيارات واسعة من المطاعم العالمية والمحلية والأسواق في المناطق المركزية.\n• 💡 **الدعم المتكامل:** يمكنك استكشاف تبويبات منصة وصل (الجدول اليومي، الفنادق، الطوارئ، والتسوق ولغة البلد الحية) للاطلاع على كافة التفاصيل بدقة!`;
}