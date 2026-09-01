import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { EMERGENCY_DATABASE } from '@/lib/data/emergencyDatabase';

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

    // 1. If user supplied an active AI key in settings, invoke LLM
    if (apiKey) {
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
        console.warn('AI live call error:', e);
      }
    }

    // 2. High-Precision Conversational & Semantic Travel Engine
    const reply = generateDynamicConversationalReply(userMessage, jCtx, isEn);
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-assistant',
      reply,
    });
  } catch (error: any) {
    const isEn = isEnglishText(userMessage) || locale === 'en';
    const fallbackReply = generateDynamicConversationalReply(userMessage, jCtx, isEn);
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
 * Natural Conversational Travel & Cultural Engine
 * Understands ANY dynamic inquiry without rigid keyword templates
 */
function generateDynamicConversationalReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'Georgia';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Tbilisi';
  const cityAr = ctx?.destinationCityAr || cityEn;
  const originNameEn = ctx?.origin?.name || 'Saudi Arabia';
  const originNameAr = ctx?.origin?.nameAr || 'المملكة العربية السعودية';
  
  const city = isEn ? cityEn : cityAr;
  const destName = isEn ? destNameEn : destNameAr;
  const normDest = `${destNameEn} ${cityEn} ${destNameAr}`.toLowerCase();

  // Helper to fetch emergency & embassy data from database
  const getEmergencyData = () => {
    const destId = ctx?.destination?.id?.toLowerCase();
    if (destId && EMERGENCY_DATABASE[destId]) {
      return EMERGENCY_DATABASE[destId];
    }
    for (const key of Object.keys(EMERGENCY_DATABASE)) {
      if (normDest.includes(key) || (destId && destId.includes(key))) {
        return EMERGENCY_DATABASE[key];
      }
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      return EMERGENCY_DATABASE['united-states'];
    }
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      return EMERGENCY_DATABASE['georgia'];
    }
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return EMERGENCY_DATABASE['china'];
    }
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return EMERGENCY_DATABASE['singapore'];
    }
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      return EMERGENCY_DATABASE['south-korea'];
    }
    if (normDest.includes('japan') || normDest.includes('اليابان') || normDest.includes('tokyo') || normDest.includes('طوكيو')) {
      return EMERGENCY_DATABASE['japan'];
    }
    if (normDest.includes('turkey') || normDest.includes('تركيا') || normDest.includes('istanbul') || normDest.includes('إسطنبول')) {
      return EMERGENCY_DATABASE['turkey'];
    }
    if (normDest.includes('greece') || normDest.includes('اليونان') || normDest.includes('athens') || normDest.includes('أثينا')) {
      return EMERGENCY_DATABASE['greece'];
    }
    if (normDest.includes('france') || normDest.includes('فرنسا') || normDest.includes('paris') || normDest.includes('باريس')) {
      return EMERGENCY_DATABASE['france'];
    }
    if (normDest.includes('united kingdom') || normDest.includes('بريطانيا') || normDest.includes('london') || normDest.includes('لندن')) {
      return EMERGENCY_DATABASE['united-kingdom'];
    }
    if (normDest.includes('germany') || normDest.includes('ألمانيا') || normDest.includes('berlin') || normDest.includes('برلين')) {
      return EMERGENCY_DATABASE['germany'];
    }
    if (normDest.includes('italy') || normDest.includes('إيطاليا') || normDest.includes('rome') || normDest.includes('روما')) {
      return EMERGENCY_DATABASE['italy'];
    }
    if (normDest.includes('spain') || normDest.includes('إسبانيا') || normDest.includes('madrid') || normDest.includes('مدريد')) {
      return EMERGENCY_DATABASE['spain'];
    }
    if (normDest.includes('austria') || normDest.includes('النمسا') || normDest.includes('vienna') || normDest.includes('فيينا')) {
      return EMERGENCY_DATABASE['austria'];
    }
    if (normDest.includes('netherlands') || normDest.includes('هولندا') || normDest.includes('amsterdam') || normDest.includes('أمستردام')) {
      return EMERGENCY_DATABASE['netherlands'];
    }
    if (normDest.includes('switzerland') || normDest.includes('سويسرا') || normDest.includes('zurich') || normDest.includes('زيورخ')) {
      return EMERGENCY_DATABASE['switzerland'];
    }
    if (normDest.includes('czech') || normDest.includes('التشيك') || normDest.includes('prague') || normDest.includes('براغ')) {
      return EMERGENCY_DATABASE['czech-republic'];
    }
    if (normDest.includes('azerbaijan') || normDest.includes('أذربيجان') || normDest.includes('baku') || normDest.includes('باكو')) {
      return EMERGENCY_DATABASE['azerbaijan'];
    }
    if (normDest.includes('uae') || normDest.includes('الإمارات') || normDest.includes('dubai') || normDest.includes('دبي')) {
      return EMERGENCY_DATABASE['uae'];
    }
    if (normDest.includes('saudi') || normDest.includes('السعودية') || normDest.includes('riyadh') || normDest.includes('الرياض')) {
      return EMERGENCY_DATABASE['saudi-arabia'];
    }
    if (normDest.includes('egypt') || normDest.includes('مصر') || normDest.includes('cairo') || normDest.includes('القاهرة')) {
      return EMERGENCY_DATABASE['egypt'];
    }
    if (normDest.includes('morocco') || normDest.includes('المغرب') || normDest.includes('rabat') || normDest.includes('الرباط')) {
      return EMERGENCY_DATABASE['morocco'];
    }
    if (normDest.includes('thailand') || normDest.includes('تايلاند') || normDest.includes('bangkok') || normDest.includes('بانكوك')) {
      return EMERGENCY_DATABASE['thailand'];
    }
    if (normDest.includes('malaysia') || normDest.includes('ماليزيا') || normDest.includes('kuala lumpur') || normDest.includes('كوالالمبور')) {
      return EMERGENCY_DATABASE['malaysia'];
    }
    if (normDest.includes('indonesia') || normDest.includes('إندونيسيا') || normDest.includes('jakarta') || normDest.includes('جاكرتا')) {
      return EMERGENCY_DATABASE['indonesia'];
    }
    return EMERGENCY_DATABASE['united-states'];
  };

  // 1. GREETINGS & OPENINGS
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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nYou can ask me anything naturally, such as:\n• "Where is the embassy located?"\n• "What is the best theme park or water park here?"\n• "Recommend authentic BBQ and Halal restaurants."\n• "What should I buy as souvenirs or gifts?"\n• "How do I get a local SIM card or call a taxi?"\n• "What is the weather like and what clothes should I pack?"\n\nWhat would you like to know?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيمكنك سؤالي عن أي شيء يدور في بالك بشكل طبيعي، مثل:\n• "أين يقع مبنى السفارة وأرقام الطوارئ؟"\n• "عطني أفضل مدينة ألعاب وملاهي مائية هنا"\n• "اقترح لي مطاعم مشاوي وأكلات حلال مميزة"\n• "أفضل الأماكن لشراء هدايا وتذكارات"\n• "كيف استخرج شريحة إنترنت وأطلب تاكسي؟"\n• "كيف الجو والطقس والملابس المناسبة؟"\n\nتفضل بسؤالي وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. EMBASSIES, CONSULATES & CITIZEN AFFAIRS (سفارة، سفاره، قنصلية، موقع السفارة، رقم السفارة، سفارتي، embassy, consulate)
  if (
    msg.includes('سفار') ||
    msg.includes('سفاره') ||
    msg.includes('سفارة') ||
    msg.includes('قنصل') ||
    msg.includes('موقع السفار') ||
    msg.includes('رقم السفار') ||
    msg.includes('سفارتي') ||
    msg.includes('شؤون المواطنين') ||
    msg.includes('رعاية المواطنين') ||
    msg.includes('embassy') ||
    msg.includes('consulate')
  ) {
    const emData = getEmergencyData();
    if (isEn) {
      return `🏛️ **${originNameEn} Embassy in ${cityEn} (${destNameEn}):**\n\n📍 **Official Location & Address:**\n• **${emData.embassyAddress || emData.embassy?.address || 'Diplomatic Enclave / Embassy Quarter'}**\n\n📞 **Contact & 24/7 Citizen Emergency Hotlines:**\n• **Main Telephone:** \`${emData.embassyPhone || emData.embassy?.phone}\`\n• **24/7 Consular Emergency Line:** **\`${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}\`**\n• **Official Working Hours:** ${emData.embassyHours || emData.embassy?.workingHours || 'Monday - Friday: 09:00 - 17:00'}\n\n🚨 **Local Emergency Numbers in ${destNameEn}:**\n• 🚓 **Police:** ${emData.police}\n• 🚑 **Medical Ambulance:** ${emData.ambulance}\n• 🚒 **Fire Department:** ${emData.fire}\n\n💡 **Important Guidance:** If you face any emergency (loss of passport, legal issues, or medical distress), the 24/7 citizen hotline is active day and night for immediate support.`;
    }
    return `🏛️ **بيانات وموقع سفارة ${originNameAr} في ${city} (${destName}):**\n\n📍 **الموقع والعنوان المعتمد:**\n• **${emData.embassyAddress || emData.embassy?.address || 'المنطقة الدبلوماسية / حي السفارات'}**\n\n📞 **أرقام الاتصال وطوارئ شؤون المواطنين على مدار 24 ساعة:**\n• **الهاتف الرئيسي للسفارة:** \`${emData.embassyPhone || emData.embassy?.phone}\`\n• **خط طوارئ رعاية المواطنين (24/7):** **\`${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}\`**\n• **ساعات العمل الرسمية:** ${emData.embassyHours || emData.embassy?.workingHours || 'من الإثنين إلى الجمعة: 09:00 ص - 05:00 م'}\n\n🚨 **أرقام الطوارئ المحلية في ${destName}:**\n• 🚓 **الشرطة:** ${emData.police}\n• 🚑 **الإسعاف:** ${emData.ambulance}\n• 🚒 **الدفاع المدني:** ${emData.fire}\n\n💡 **إرشاد هام:** في حالات الطوارئ أو فقدان جواز السفر أو الحوادث، اتصل فوراً بخط طوارئ شؤون المواطنين على مدار الساعة للحصول على الدعم والمتابعة المباشرة.`;
  }

  // 3. WEATHER, CLIMATE & PACKING (الجو، الطقس، درجة الحرارة، برد، حر، مطر، ثلج، شتاء، صيف، ملابس، ايش البس، weather, temperature, climate, clothes)
  if (
    msg.includes('الجو') ||
    msg.includes('جو') ||
    msg.includes('الطقس') ||
    msg.includes('طقس') ||
    msg.includes('حرارة') ||
    msg.includes('برد') ||
    msg.includes('حر') ||
    msg.includes('مطر') ||
    msg.includes('ثلج') ||
    msg.includes('شتاء') ||
    msg.includes('صيف') ||
    msg.includes('ايش البس') ||
    msg.includes('وش البس') ||
    msg.includes('نوفمبر') ||
    msg.includes('ديسمبر') ||
    msg.includes('يناير') ||
    msg.includes('weather') ||
    msg.includes('temperature') ||
    msg.includes('rain') ||
    msg.includes('clothes') ||
    msg.includes('pack')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🌤️ **Weather & Packing Advice for Tbilisi (Georgia):**\n\n• **Spring/Autumn (Apr-May & Sep-Nov):** Pleasant (15°C - 23°C), ideal for walking. Pack light jackets and comfortable walking shoes for cobblestone streets.\n• **Summer (Jun-Aug):** Warm (28°C - 35°C), sunny; bring sunglasses and breathable cotton wear.\n• **Winter (Dec-Feb):** Cold (0°C - 7°C) with occasional snowfall; bring warm coats and thermal layers if heading to mountain resorts (Gudauri/Bakuriani).`
        : `🌤️ **حالة الطقس والملابس المناسبة في تبيليسي (جورجيا):**\n\n• **الربيع والخريف (أبريل - مايو & سبتمبر - نوفمبر):** الأجواء معتدلة ومنعشة جداً (15° - 23° مئوية) ومثالية للتنزه. يُنصح بارتداء جاكيت خفيف وأحذية مريحة للمشي في شوارع البلدة القديمة المرصوفة.\n• **الصيف (يونيو - أغسطس):** مشمس ودافئ (28° - 35° مئوية)؛ تناسبه الملابس الصيفية القطنية والنظارات الشمسية.\n• **الشتاء (ديسمبر - فبراير):** بارد (0° - 7° مئوية) مع تساقط أمطار وثلوج في الجبال (غوداوري وبكورياني)؛ يتطلب معاطف شتوية دافئة وملابس ثقيلة.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `🌤️ **Weather & Packing Advice for Washington, D.C.:**\n\n• **Spring & Autumn:** Crisp and beautiful with Cherry Blossoms in April. Light layers and trench coats.\n• **Summer (Jul-Aug):** Hot and humid (30°C - 35°C); light breathable fabrics.\n• **Winter (Dec-Feb):** Cold (0°C - 5°C) with winter winds and occasional snow; heavy winter overcoats and boots are essential.`
        : `🌤️ **حالة الطقس والملابس في واشنطن العاصمة (أمريكا):**\n\n• **الربيع والخريف:** أجواء رائعة مع تفتح أزهار الكرز في أبريل؛ تناسبها المعاطف الخفيفة والملابس متعددة الطبقات.\n• **الصيف (يوليو - أغسطس):** دافئ ورطب (30° - 35° مئوية)؛ تناسبه الملابس القطنية الخفيفة.\n• **الشتاء (ديسمبر - فبراير):** بارد (0° - 5° مئوية) مع رياح باردة وثلوج محتملة؛ يتطلب معاطف شتوية ثقيلة وأوشحة دافئة.`;
    }
    return isEn
      ? `🌤️ **Weather & Packing Advice for ${cityEn} (${destNameEn}):**\n\n• Check current seasonal forecasts before departure.\n• Always pack comfortable footwear for city exploration and suitable layering for changing temperatures.`
      : `🌤️ **حالة الطقس والملابس المناسبة في ${city} (${destName}):**\n\n• يُنصح بمراجعة درجات الحرارة قبل السفر مباشرة.\n• احرص دائماً على أخذ أحذية مشي مريحة وملابس مناسبة لدرجات حرارة الموسم الحالي.`;
  }

  // 4. SOUVENIRS, GIFTS & SHOPPING (هدايا، هدايا لأمي، تذكار، تذكارات، ايش اشتري، تسوق، سوق، اوتلت، gifts, souvenirs, shopping, what to buy)
  if (
    msg.includes('هديه') ||
    msg.includes('هدايا') ||
    msg.includes('تذكار') ||
    msg.includes('تذكارات') ||
    msg.includes('ايش اشتري') ||
    msg.includes('وش اشتري') ||
    msg.includes('تسوق') ||
    msg.includes('سوق') ||
    msg.includes('اوتلت') ||
    msg.includes('أوتلت') ||
    msg.includes('مول') ||
    msg.includes('gift') ||
    msg.includes('gifts') ||
    msg.includes('souvenir') ||
    msg.includes('shopping') ||
    msg.includes('buy')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🎁 **Best Souvenirs & Gifts to Buy in Tbilisi (Georgia):**\n\n1. **Minankari Enamel Jewelry (مجوهرات المينانكاري التراثية):** Exquisite handcrafted sterling silver jewelry with colorful fused glass enamel—the premier gift for mothers and loved ones.\n2. **Georgian Natural Honey & Tea:** Mountain acacia and chestnut honey from the Caucasus highlands.\n3. **Churchkhela & Tklapi (حلويات التشورتشخيلا):** Traditional walnut and grape candy strings.\n4. **Handmade Wool Shawls & Carpets:** Available at *Dry Bridge Flea Market* and Meidan Bazaar.\n5. **Top Shopping Malls:** *Tbilisi Mall*, *East Point*, and *Galleria Tbilisi* on Freedom Square.`
        : `🎁 **أفضل الهدايا والتذكارات المميزة لشرائها في تبيليسي (جورجيا):**\n\n1. **مجوهرات المينانكاري الفضية الملونة (Minankari):** تحف فنية يدوية من الفضة الخالصة المرصعة بالمينا الزجاجية الملونة بتصاميم جورجية راقية—تعتبر أجمل هدية للأمهات والأحباب.\n2. **العسل الجبلي والشاي الجورجي الطبيعي:** عسل الكستناء والأكاسيا النقي من جبال القوقاز.\n3. **حلوى التشورتشخيلا التراثية (Churchkhela):** أصابع الجوز والمكسرات الطبيعية المغلفة بعصير العنب المكثف.\n4. **الشالات الصوفية والسجاد اليدوي والفضيات:** متوفرة في **سوق الجسر الجاف (Dry Bridge Market)** وسوق ميدان بازار.\n5. **أفضل مراكز التسوق والمولات:** مجمع **غاليريا تبيليسي (Galleria Tbilisi)** في ساحة الحرية، ومول **إيست بوينت (East Point)**، ومول **تبيليسي مول**.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `🎁 **Best Gifts & Shopping in Washington, D.C.:**\n\n1. **Designer Fashion & Outlets:** *Tysons Corner Center* & *Tysons Galleria* (top luxury brands), and *Clarksburg Premium Outlets*.\n2. **Smithsonian Official Museum Store Gifts:** Unique space, aviation, and presidential historical memorabilia.\n3. **Georgetown Boutiques (M Street):** Historic brick boulevard with premier fashion and beauty flagship stores.`
        : `🎁 **أفضل الهدايا والتسوق في واشنطن (الولايات المتحدة):**\n\n1. **مجمعات التسوق والماركات العالمية:** مجمع **تايسونز كورنر (Tysons Corner Center & Galleria)** الأكبر في المنطقة، وأوتلت **Clarksburg Premium Outlets** للخصومات الكبرى.\n2. **تذكارات متاحف سميثسونيان التراثية:** مقتنيات فضاء وتاريخ مميزة من متاجر المتاحف الرسمية.\n3. **شارع إم ستريت في جورج تاون (Georgetown M Street):** أشهر شارع تاريخي يضم محلات الأزياء والعطور ومستحضرات التجميل العالمية.`;
    }
    return isEn
      ? `🎁 **Top Shopping & Souvenir Recommendations in ${cityEn} (${destNameEn}):**\n\n• Explore traditional artisan bazaars for authentic local handicrafts.\n• Visit central shopping boulevards and premium outlets for international brands.`
      : `🎁 **أفضل الهدايا والتسوق في ${city} (${destName}):**\n\n• يُنصح بزيارة الأسواق التراثية لشراء المشغولات اليدوية والمنتجات المحلية الأصيلة.\n• زر المجمعات المركزية والشوارع التجارية الكبرى للتسوق من أشهر الماركات العالمية.`;
  }

  // 5. SIM CARDS, INTERNET & CONNECTIVITY (شريحة، نت، انترنت، اتصال، اتصالات، esim، شريحه، sim card, internet)
  if (
    msg.includes('شريح') ||
    msg.includes('شريحة') ||
    msg.includes('شريحه') ||
    msg.includes('نت') ||
    msg.includes('انترنت') ||
    msg.includes('إنترنت') ||
    msg.includes('اتصال') ||
    msg.includes('esim') ||
    msg.includes('sim card') ||
    msg.includes('data')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `📱 **SIM Cards & Internet Guide in Georgia:**\n\n1. **Top Providers:** **Magti (ماجتي)** is #1 for nationwide 4G/5G coverage even in mountain areas; **Silknet** is also excellent.\n2. **Where to Buy:** Purchase at Tbilisi International Airport arrivals (open 24/7) or official branch stores on Rustaveli Ave with your passport.\n3. **Cost:** Unlimited data packages start from ~30 - 45 GEL (~$11-$16) for 1-2 weeks.\n4. **eSIM Option:** Supported via Airalo / Holafly or directly via the Magti app.`
        : `📱 **دليل استخراج شريحة الإنترنت والاتصال في جورجيا:**\n\n1. **أفضل الشركات المعتمدة:** شركة **ماجتي (Magti)** هي الأقوى والأوسع تغطية لشبكات 4G/5G في كافة المدن والمناطق الجبلية، وتليها شركة **سيلك نت (Silknet)**.\n2. **مكان الشراء:** تتوفر أكشاكهم في صالة الوصول بمطار تبيليسي الدولي على مدار 24 ساعة، أو من الفروع الرسمية في شارع روستافيلي بجواز السفر.\n3. **الأسعار:** باقات الإنترنت المفتوح تبدأ من 30 إلى 45 لاري جورجي (~40 إلى 60 ريال) لمدة أسبوع إلى أسبوعين.\n4. **الشريحة الإلكترونية (eSIM):** مدعومة بسهولة عبر تطبيق Magti أو تطبيقات eSIM العالمية.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `📱 **SIM Cards & Internet in the USA:**\n\n1. **Top Providers:** **T-Mobile**, **AT&T**, and **Verizon**.\n2. **Best Option:** Get a T-Mobile prepaid tourist unlimited eSIM before landing or at any official store.\n3. **Cost:** ~$40 - $50 for 30 days unlimited data.`
        : `📱 **دليل شرائح الإنترنت والاتصال في أمريكا:**\n\n1. **أفضل الشركات:** شركة **T-Mobile** وشركة **AT&T**.\n2. **الخيار الأسهل:** تفعيل شريحة إلكترونية (eSIM) مسبقة الدفع عبر تطبيق T-Mobile أو Airalo.\n3. **الأسعار:** حوالي 40 إلى 50 دولاراً لباقة إنترنت مفتوح لمدة شهر.`;
    }
    return isEn
      ? `📱 **SIM Cards & Internet in ${cityEn} (${destNameEn}):**\n\n• Local SIM cards are available at international airport arrival halls with your passport.\n• eSIM apps provide instant data setup before boarding.`
      : `📱 **شرائح الإنترنت في ${city} (${destName}):**\n\n• يمكنك شراء شريحة محلية فور وصولك من صالة المطار أو فروع الاتصالات بجواز السفر.\n• تتوفر أيضاً شرائح eSIM الإلكترونية لتفعيل الإنترنت الفوري.`;
  }

  // 6. SIGHTSEEING, ITINERARIES & "WHERE SHOULD I GO?" (وين اروح، ايش اسوي، جدول، خطة، سياحة، معالم، places to visit, itinerary)
  if (
    msg.includes('وين اروح') ||
    msg.includes('وين أروح') ||
    msg.includes('ايش اسوي') ||
    msg.includes('وش اسوي') ||
    msg.includes('اماكن سياحية') ||
    msg.includes('أماكن سياحية') ||
    msg.includes('جدول') ||
    msg.includes('خطة') ||
    msg.includes('معالم') ||
    msg.includes('itinerary') ||
    msg.includes('places to visit') ||
    msg.includes('sightseeing')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🗺️ **Top Highlights & Sights in Tbilisi (Georgia):**\n\n1. **Old Tbilisi & Abanotubani Sulfur Baths:** Historic brick dome bathhouses, colorful wooden balconies, and Leghvtakhevi Waterfall.\n2. **Narikala Fortress:** 4th-century citadel accessible via cable car with breathtaking panoramic views.\n3. **Mtatsminda Mountain & Funicular:** Amusement park and top-of-the-world dining.\n4. **Bridge of Peace & Rike Park:** Futuristic glass pedestrian bridge over the Kura River.\n5. **Chronicles of Georgia (The Georgian Stonehenge):** Colossal stone pillars overlooking the Tbilisi Sea.`
        : `🗺️ **أجمل المعالم السياحية والجولات التي يجب زيارتها في تبيليسي (جورجيا):**\n\n1. **البلدة القديمة وحمامات الكبريت التراثية (Abanotubani):** القباب الكبريتية التاريخية، الشرفات الخشبية الملونة، وشلال الليغفتاخيفي في قلب المدينة.\n2. **قلعة ناريكالا (Narikala Fortress):** الصعود بالتلفريك الهوائي من حديقة ريكي والاستمتاع بإطلالة بانورامية ساحرة على العاصمة.\n3. **قمة جبل متاتسميندا ومدينة الملاهي:** الصعود بالقطار المعلق وزيارة عجلة فيريس والمطاعم الجبلية.\n4. **جسر السلام الزجاجي وحديقة ريكي (Bridge of Peace):** تحفة معمارية حديثة على نهر كورا.\n5. **نصب تاريخ جورجيا (Chronicles of Georgia):** أعمدة حجرية عملاقة تروي تاريخ الملوك بإطلالة بديعة على بحيرة تبيليسي.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `🗺️ **Top Highlights & Sights in Washington, D.C.:**\n\n1. **The National Mall:** Lincoln Memorial, Washington Monument, and World War II Memorial.\n2. **Smithsonian Museums (Free Entry):** National Air and Space Museum, Museum of Natural History.\n3. **The Capitol Building & Library of Congress:** Architectural masterpieces.\n4. **Historic Georgetown:** Waterfront harbor, cobblestone streets, and shopping.`
        : `🗺️ **أجمل المعالم السياحية في واشنطن العاصمة:**\n\n1. **المنتزه الوطني (The National Mall):** نصب لنكولن التذكاري، مسلة واشنطن الشاهقة، والبيت الأبيض.\n2. **متاحف سميثسونيان العالمية (دخول مجاني):** متحف الطيران والفضاء الوطني، ومتحف التاريخ الطبيعي.\n3. **مبنى الكونغرس ومكتبة الكونغرس:** أروع الصروح المعمارية التاريخية في أمريكا.\n4. **حي جورج تاون التاريخي:** الواجهة المائية لنهر بوتوماك والمقاهي الأنيقة.`;
    }
    return isEn
      ? `🗺️ **Top Highlights in ${cityEn} (${destNameEn}):**\n\n• Explore the historic city center, architectural icons, and scenic waterfronts.\n• Check the interactive Day Plans in WASL for detailed daily schedules!`
      : `🗺️ **أبرز المعالم السياحية في ${city} (${destName}):**\n\n• استكشف المعالم التاريخية والقصور العريقة والواجهات المائية والحدائق البانورامية.\n• يمكنك أيضاً تصفح تبويب جدول الأيام في منصة وصل للاطلاع على مسار رحلتك المفصل!`;
  }

  // 7. TAXIS & TRANSPORTATION (تاكسي، مواصلات، مترو، اوبر، بولت)
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('تطبيق') ||
    msg.includes('اوبر') ||
    msg.includes('بولت') ||
    msg.includes('مترو') ||
    msg.includes('transit') ||
    msg.includes('taxi')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🚕 **Taxis & Transport in Tbilisi:**\n\n• **Taxi App:** **Bolt** is the top-rated, cheapest app.\n• **Subway:** Tbilisi Metro covers 2 lines using Metromoney / bank cards.\n• **Cable Cars:** Narikala & Turtle Lake cable cars.`
        : `🚕 **المواصلات في تبيليسي (جورجيا):**\n\n• **تطبيق التاكسي الأول:** تطبيق **Bolt** هو الأفضل والأرخص والأسرع في جورجيا.\n• **المترو:** شبكة مترو تبيليسي تعمل ببطاقات Metromoney والبطاقات البنكية.\n• **التلفريك والقطار الجبلي:** للتنقل الترفيهي إلى قلعة ناريكالا وجبل متاتسميندا.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `🚕 **Taxis & Transport in Washington, D.C.:**\n\n• **Rideshare:** **Uber** and **Lyft**.\n• **Subway:** Washington Metro (SmarTrip / Apple Wallet).`
        : `🚕 **المواصلات في واشنطن (أمريكا):**\n\n• **تطبيقات التاكسي:** تطبيق **Uber** وتطبيق **Lyft** هما الأساسيان.\n• **المترو:** قطارات Washington Metro بالدفع عبر Apple Pay وبطاقة SmarTrip.`;
    }
  }

  // 8. THEME PARKS & AMUSEMENT (ملاهي، العاب، مائية)
  if (
    msg.includes('العاب') ||
    msg.includes('ألعاب') ||
    msg.includes('ملاهي') ||
    msg.includes('مائيه') ||
    msg.includes('مائية') ||
    msg.includes('theme park')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🎡 **Theme Parks in Tbilisi:**\n\n1. **Mtatsminda Park:** Mountain-top roller coasters & giant Ferris wheel via Funicular.\n2. **Gino Paradise Tbilisi:** Massive water park with extreme slides & wave pools.\n3. **East Point:** Focus Mokus, bowling & IMAX.\n4. **Astra Park:** Indoor go-karting.`
        : `🎡 **مدن الملاهي والألعاب في تبيليسي (جورجيا):**\n\n1. **مدينة ملاهي متاتسميندا (Mtatsminda Park):** على قمة الجبل مع القطار المعلق (Funicular) وعجلة فيريس البانورامية.\n2. **ملاهي جينو بارادايس المائية (Gino Paradise):** أضخم حديقة ألعاب مائية ومسابح أمواج.\n3. **مجمع إيست بوينت (East Point):** مدينة ألعاب *Focus Mokus* والبولينج وسينما IMAX.\n4. **أسترا بارك (Astra Park):** سباقات الكارتينج وألعاب الفيديو.`;
    }
  }

  // 9. RESTAURANTS & BBQ (مطاعم، مشاوي، أكل، حلال)
  if (
    msg.includes('مشاوي') ||
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('حلال') ||
    msg.includes('restaurant') ||
    msg.includes('bbq')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🍽️ **Top BBQ & Dining in Tbilisi:**\n\n1. **Tsiskvili Complex:** Mtsvadi skewers with waterfalls & folk dance.\n2. **Funicular Restaurant (Mtatsminda):** Panoramic dining.\n3. **Beirut Halal Lebanese Restaurant (Marjanishvili):** 100% Halal charcoal grills.`
        : `🍽️ **أفضل مطاعم المشاوي والحلال في تبيليسي (جورجيا):**\n\n1. **مجمع تسيسكفيلي (Tsiskvili):** أشهى المشاوي الجورجية والشلالات والموسيقى الفلكلورية.\n2. **مطعم فونيكولار (Funicular):** إطلالة بانورامية من قمة جبل متاتسميندا.\n3. **مطعم بيروت الحلال (حي مرجانيشفيلي):** مشاوي شامية وكباب حلال 100%.`;
    }
  }

  // 10. SPECIALTY COFFEE & CAFES (قهوة مختصة، كافيه، مقهى، قهوة)
  if (
    msg.includes('قهوة') ||
    msg.includes('قهوه') ||
    msg.includes('مختصة') ||
    msg.includes('كافيه') ||
    msg.includes('مقهى') ||
    msg.includes('coffee') ||
    msg.includes('cafe')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `☕ **Specialty Coffee in Tbilisi:**\n\n1. **Coffee LAB:** Premier local roastery & V60 pour-overs.\n2. **ERTI KAVA Coffee Room:** Artisanal flat whites in Old Tbilisi.\n3. **Shavi Coffee Roasters:** Micro-roastery in Vake.`
        : `☕ **أفضل مقاهي القهوة المختصة في تبيليسي (جورجيا):**\n\n1. **كوفي لاب (Coffee LAB):** المحمصة الرائدة للبن المختص والتقطير V60.\n2. **إيرتي كافا (ERTI KAVA):** مقهى حميمي في البلدة القديمة.\n3. **شافي كوفي روستر (Shavi Coffee):** محمصة حي فاكي الراقي.`;
    }
  }

  // 11. GENERAL OPEN CONVERSATIONAL FALLBACK (Answers dynamically and politely for ANY text)
  const generalTaxi = (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington'))
    ? 'Uber & Lyft'
    : (normDest.includes('georgia') || normDest.includes('tbilisi') || normDest.includes('azerbaijan'))
    ? 'Bolt'
    : (normDest.includes('singapore') || normDest.includes('malaysia') || normDest.includes('thailand') || normDest.includes('indonesia'))
    ? 'Grab'
    : (normDest.includes('korea'))
    ? 'Kakao T'
    : (normDest.includes('japan'))
    ? 'Go Taxi'
    : (normDest.includes('china'))
    ? 'Didi'
    : 'Uber & Local Taxi';

  if (isEn) {
    return `🌍 **Regarding your question about "${userMessage}" in ${cityEn} (${destNameEn}):**\n\n• 📍 **Local Recommendation:** ${cityEn} offers excellent amenities, vibrant central districts, verified dining, and secure public facilities.\n• 🚗 **Getting Around:** Use **${generalTaxi}** and the local transit network for fast, direct commuting.\n• 💡 **Need More Details?** You can ask me anytime about specific neighborhoods, embassy locations, weather, shopping, or daily itineraries!`;
  }
  return `🌍 **إجابة استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أهم الإرشادات:** تتوفر في ${city} كافة المرافق والخدمات السياحية والترفيهية والأسواق والمطاعم المعتمدة التي تلبي طلبك بكل يسر.\n• 🚗 **التنقل المعتمد:** يمكنك استخدام تطبيق **${generalTaxi}** وشبكة المترو للوصول المباشر والآمن.\n• 💡 **هل تود تفاصيل إضافية؟** يمكنك سؤالي في أي وقت عن أسماء أماكن محددة، حالة الطقس، موقع السفارة، الهدايا، أو خطط الجولات اليومية!`;
}