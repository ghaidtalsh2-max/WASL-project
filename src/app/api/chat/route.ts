import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, journeyContext, conversationHistory, apiKey, provider } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextParts: string[] = [];
    if (journeyContext) {
      if (journeyContext.destination?.name) {
        contextParts.push(`- Destination: ${journeyContext.destination.name} (City: ${journeyContext.destinationCity || journeyContext.destination.capital || 'Unspecified'})`);
      }
      if (journeyContext.origin?.name) {
        contextParts.push(`- Origin: ${journeyContext.origin.name}`);
      }
      if (journeyContext.duration) {
        contextParts.push(`- Trip Duration: ${journeyContext.duration}`);
      }
      if (journeyContext.purpose) {
        contextParts.push(`- Purpose: ${journeyContext.purpose}`);
      }
      if (journeyContext.accommodationArea) {
        contextParts.push(`- Accommodation Area: ${journeyContext.accommodationArea}`);
      }
      if (journeyContext.accommodationStatus) {
        contextParts.push(`- Accommodation Status: ${journeyContext.accommodationStatus === 'booked' ? 'Already booked' : 'Looking for recommendations'}`);
      }
      if (journeyContext.interests && journeyContext.interests.length > 0) {
        contextParts.push(`- Interests & Focus: ${Array.isArray(journeyContext.interests) ? journeyContext.interests.join(', ') : journeyContext.interests}`);
      }
      if (journeyContext.dates) {
        contextParts.push(`- Travel Dates/Season: ${journeyContext.dates}`);
      }
      if (journeyContext.travelStyle) {
        contextParts.push(`- Travel Style: ${journeyContext.travelStyle}`);
      }
      if (journeyContext.additionalNeeds) {
        contextParts.push(`- Plan Context / Notes: ${journeyContext.additionalNeeds}`);
      }
    }

    const contextStr = contextParts.length > 0
      ? `Active Traveler Journey Context:\n${contextParts.join('\n')}`
      : 'General travel, cultural intelligence, and relocation companion context.';

    const systemPrompt = `${AI_SYSTEM_PROMPTS.chatAssistant}\n\n${contextStr}`;

    const prompt = message;

    const aiRes = await callAI({
      systemPrompt,
      prompt,
      apiKey,
      provider,
      temperature: 0.35,
      maxTokens: 1024,
    });

    if (aiRes.error) {
      const fallbackReply = generateSmartChatReply(message, journeyContext);
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
    return NextResponse.json({ error: error.message || 'Chat assistant error', errorCode: 'AI_PROVIDER_ERROR' }, { status: 500 });
  }
}

/**
 * Intelligent Local Travel & Cultural Engine
 * Provides instant, deep, context-aware answers for all travel questions
 * when external LLM API is unreachable or rate-limited.
 */
function generateSmartChatReply(userMessage: string, ctx: any): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destName = ctx?.destination?.name || 'وجهتك';
  const destNameAr = ctx?.destination?.nameAr || destName;
  const city = ctx?.destinationCity || ctx?.destination?.capital || 'المدينة';
  const normDest = `${destName} ${city}`.toLowerCase();

  // 1. Greetings & Pleasantries
  if (
    msg.includes('السلام') ||
    msg.includes('مرحبا') ||
    msg.includes('مرحباً') ||
    msg.includes('أهلاً') ||
    msg.includes('اهلا') ||
    msg.includes('هلا') ||
    msg.includes('صباح') ||
    msg.includes('مساء') ||
    msg === 'hi' ||
    msg === 'hello' ||
    msg === 'hey'
  ) {
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك في منصة "وصل". أنا مساعدك الذكي لرحلتك إلى **${city} (${destNameAr})**.\n\nيسعدني الإجابة عن أي استفسار يخص:\n• 🚕 طلب التاكسي والمواصلات والعبارات المحلية\n• 🛍️ أفضل وجهات التسوق والأسواق الشعبية\n• 🍽️ المطاعم الموصى بها وخيارات الأكل الحلال\n• 🏛️ جدول الرحلة اليومي وأبرز المعالم\n• 🚨 أرقام الطوارئ وسفارة بلدك وقواعد الأمان\n\nما الذي تود معرفته بالتحديد اليوم؟`;
  }

  // 2. Taxi, Uber & Transportation Inquiries
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('مترو') ||
    msg.includes('باص') ||
    msg.includes('قطار') ||
    msg.includes('تنقل') ||
    msg.includes('سيارة') ||
    msg.includes('توصيل') ||
    msg.includes('taxi') ||
    msg.includes('uber') ||
    msg.includes('metro') ||
    msg.includes('bus') ||
    msg.includes('transport')
  ) {
    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🚕 **دليل المواصلات وطلب التاكسي في Washington, D.C. / الولايات المتحدة:**\n\n1. **تطبيقات التوصيل المعتمدة:** يُفضل استخدام تطبيق **Uber** أو **Lyft** للدفع الإلكتروني والتنقل السلس وتجنب سوء التفاهم في الأسعار.\n\n2. **مترو واشنطن (DC Metro):** سريع وآمن جداً، ويمكنك الدفع عبر بطاقة **SmarTrip** أو عبر Apple Pay / Google Pay مباشرة عند بوابات الدخول.\n\n3. **طلب تاكسي باللغة الإنجليزية (English Phrases):**\n• *"Excuse me, can you take me to [اسم المكان أو الفندق], please?"* (من فضلك، هل يمكنك إيصالي إلى...؟)\n• *"Could you please turn on the meter?"* (هل يمكنك تشغيل العداد من فضلك؟)\n• *"How much will it approximately cost?"* (كم ستكون التكلفة التقديرية؟)\n• *"Can I pay by card?"* (هل يمكنني الدفع بالبطاقة؟)\n\n💡 **نصيحة وصل:** في سيارات التاكسي العادية بأمريكا، يُتوقع تقديم إكرامية (Tip) بنسبة 15% - 20% للسائق.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🚕 **دليل المواصلات وطلب التاكسي في روما / إيطاليا:**\n\n1. **تطبيقات التاكسي الرسمية:** استخدم تطبيق **FreeNow** أو **itTaxi**، أو تطبيق **Uber** (Uber Black متوفر في روما).\n\n2. **التاكسي الأبيض الرسمي:** لا تشير للتاكسي في الشارع عادةً بل توجّه لمحطات التاكسي الرسمية (Taxi Stands) في الساحات الرئيسية ومحطات القطار، وتأكد من وجود العداد.\n\n3. **عبارات طلب التاكسي بالإيطالية والإنجليزية:**\n• بالإيطالية: *"Buongiorno! Per favore, mi può portare a [اسم الوجهة]?"* (صباح الخير، من فضلك خذني إلى...)\n• بالإنجليزية: *"Hello, can you take me to [اسم الفندق], please?"*\n• *"Accetta la carta di credito?"* (هل تقبل بطاقة مدى/فيزا؟)\n\n4. **مترو روما (Metropolitana):** التذكرة الموحدة (BIT) تبلغ 1.50 يورو وتتيح لك ركوب المترو والباصات لمدة 100 دقيقة.`;
    }

    if (normDest.includes('turkey') || normDest.includes('istanbul') || normDest.includes('إسطنبول') || normDest.includes('تركيا')) {
      return `🚕 **دليل المواصلات والتاكسي في إسطنبول / تركيا:**\n\n1. **تطبيقات التوصيل:** استخدم **BiTaksi** أو **Uber**، لتجنب مشاكل الأسعار والتأكد من فتح العداد (Taksimetre).\n2. **كرت إسطنبول (Istanbulkart):** الوسيلة الأوفر لركوب المترو، الترامواي، والعبارات البحرية بين الجانبين الأوروبي والآسيوي.\n3. **عبارات تركية لطلب التاكسي:**\n• *"Merhaba! Lütfen beni [اسم الفندق أو المكان]'e götürür müsünüz?"* (مرحباً، هل يمكنك أخذي إلى... من فضلك؟)\n• *"Taksimetreyi açar mısınız lütfen?"* (هل يمكنك تشغيل العداد من فضلك؟)\n• *"Ne kadar tutar?"* (كم الحساب؟)`;
    }

    return `🚕 **دليل المواصلات في ${city} (${destNameAr}):**\n\n1. **التطبيقات الذكية:** يُنصح دائماً باستخدام تطبيقات التوصيل الرسمية (مثل Uber أو Bolt أو FreeNow حسب الوجهة) لضمان معرفة السعر وتتبع المسار بدقة.\n\n2. **العبارات المفيدة بالإنجليزية:**\n• *"Hello! Please take me to [اسم المكان أو الفندق]."\n• *"Please make sure the meter is running."*\n• *"Do you accept credit card payments?"*\n\n3. **المواصلات العامة:** تتوفر بطاقات المواصلات الموحدة في محطات المترو والقطارات وتوفر عليك ما يصل إلى 40% من تكلفة التنقل الفردي.`;
  }

  // 3. Shopping & Markets Inquiries
  if (
    msg.includes('تسوق') ||
    msg.includes('سوق') ||
    msg.includes('شراء') ||
    msg.includes('مول') ||
    msg.includes('ماركات') ||
    msg.includes('هدايا') ||
    msg.includes('متاجر') ||
    msg.includes('shopping') ||
    msg.includes('mall') ||
    msg.includes('market') ||
    msg.includes('souvenir')
  ) {
    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🛍️ **أفضل وجهات التسوق في Washington, D.C. والمناطق المجاورة:**\n\n1. **Georgetown (حي جورج تاون التاريخي):** جادة M Street الشهيرة بمتاجر الماركات العالمية، البوتيكات الراقية، والمقاهي العريقة على ضفاف النهر.\n2. **CityCenterDC:** مركز التسوق الفاخر في قلب واشنطن للماركات العالمية الكبرى مثل Gucci و Dior و Louis Vuitton.\n3. **Tysons Corner Center & Tysons Galleria:** أضخم مجمع تجاري في منطقة العاصمة يضم أكثر من 300 متجر ومطاعم متنوعة (على بُعد مسافة قصيرة بالمترو في فرجينيا).\n4. **Eastern Market:** سوق تراثي أصيل للمنتجات الحرفية والتحف الفنية والهدايا التذكارية المحلية.\n\n💡 **نصيحة ضريبية:** تبلغ ضريبة المبيعات في واشنطن 6% وتُضاف عند الدفع في الكاشير.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🛍️ **أفضل وجهات التسوق في روما / إيطاليا:**\n\n1. **Via del Corso:** الشارع الأطول والأشهر في قلب روما، يضم جميع الماركات الشهيرة والمتاجر الإيطالية المتنوعة.\n2. **Via dei Condotti (جوار السلالم الإسبانية):** شارع الماركات الفاخرة الإيطالية والعالمية (Gucci, Prada, Armani, Bulgari).\n3. **Campo de' Fiori & Monti District:** حي مونتي وبوتيكات الحرفيين للمصنوعات الجلدية الإيطالية اليدوية والإكسسوارات الفريدة.\n4. **Castel Romano Designer Outlet:** آوتلت ضخم خارج المدينة يوفر خصومات 30% - 70% على الماركات الإيطالية.\n\n💡 **استرداد الضريبة (Tax Free):** اطلب نموذج Tax-Free عند الشراء بأكثر من 70.01 يورو لاسترداد ضريبة القيمة المضافة في المطار قبل مغادرة الاتحاد الأوروبي.`;
    }

    return `🛍️ **أفضل وجهات التسوق في ${city} (${destNameAr}):**\n\n1. **الشوارع التجارية الرئيسية:** استكشف الساحات والجادات المركزية في قلب المدينة حيث تتركز كبرى الماركات والمتاجر المفتوحة.\n2. **الأسواق التراثية والمحلية:** مكان رائع لاقتناء الهدايا التذكارية والمنتجات اليدوية المصنوعة محلياً.\n3. **المجمعات والمولات الكبرى:** توفر تجربة تسوق متكاملة مع خيارات المطاعم والترفيه.\n\n💡 **نصيحة:** احرص على السؤال عن نموذج استرداد الضريبة السياحية (Tax Free) إذا كانت مشترياتك مؤهلة!`;
  }

  // 4. Halal Food & Dining Inquiries
  if (
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('حلال') ||
    msg.includes('طعام') ||
    msg.includes('فطور') ||
    msg.includes('غداء') ||
    msg.includes('عشاء') ||
    msg.includes('كافيه') ||
    msg.includes('قهوة') ||
    msg.includes('food') ||
    msg.includes('halal') ||
    msg.includes('restaurant') ||
    msg.includes('cafe') ||
    msg.includes('dining')
  ) {
    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🍽️ **دليل المطاعم والأكل الحلال في Washington, D.C.:**\n\n1. **المطاعم الحلال الشهيرة:**\n• **The Halal Guys / DC Doner:** خيارات سريعة ولذيذة من الشاورما والمشاوي الحلال المعتمدة.\n• **Maiwand Grill / Moby Dick House of Kabob:** أشهى أطباق الكباب والأرز الأفغاني والإيراني الحلال.\n• **Fogo de Chão (Halal on Request):** تجربة مشاوي برازيلية راقية مع طلب اللحوم الحلال المسبق.\n• **Lebanese Taverna (Connecticut Ave):** مأكولات شامية ولبنانية أصيلة بأجواء راقية.\n\n2. **تطبيقات مفيدة:** يمكنك استخدام تطبيق **Zabihah** أو **HalalTrip** لاستكشاف مئات الخيارات الحلال بالقرب من موقعك الحالي بدقة.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🍽️ **دليل المطاعم والأكل الحلال في روما:**\n\n1. **المأكولات الإيطالية الحلال والآمنة:**\n• جرب الباستا الكلاسيكية الخالية من اللحوم مثل **Pasta al Pomodoro**، **Cacio e Pepe**، والبيتزا بجبنة الموزاريلا والخضار الطازجة (**Pizza Margherita**).\n• **مطعم Luna Caprese / Halal Vatican:** يقدم البيتزا والباستا بمكونات حلال معتمدة قرب الفاتيكان ومحطة تيرميني.\n• **Ali Baba Restaurant (حي Tor Pignattara):** شاورما ومشاوي شرقية معتمدة حلال.\n\n2. **الجيلاتو الإيطالي الشهير (Gelato):**\n• توجه إلى **Giolitti** أو **Frigidarium** بالقرب من البانثيون لتجربة أفضل آيس كريم إيطالي أصيل!`;
    }

    return `🍽️ **دليل الأكل والمطاعم الحلال في ${city} (${destNameAr}):**\n\n1. **المطاعم الشرقية والآسيوية:** تتوفر خيارات واسعة من المطابخ اللبنانية، التركية، والهندية التي تقدم لحوماً معتمدة حلال.\n2. **المأكولات البحرية والنباتية:** خيار ممتاز وآمن دائماً لتجربة النكهات المحلية في المدينة.\n3. **تطبيق Zabihah & Google Maps:** ابحث بكلمة *"Halal Food near me"* للاطلاع على تقييمات المسافرين وساعات العمل.`;
  }

  // 5. Emergency, Embassy & Safety Inquiries
  if (
    msg.includes('طوارئ') ||
    msg.includes('سفارة') ||
    msg.includes('شرطة') ||
    msg.includes('إسعاف') ||
    msg.includes('اسعاف') ||
    msg.includes('مستشفى') ||
    msg.includes('طبيب') ||
    msg.includes('صيدلية') ||
    msg.includes('أمان') ||
    msg.includes('سلامة') ||
    msg.includes('emergency') ||
    msg.includes('police') ||
    msg.includes('embassy') ||
    msg.includes('hospital') ||
    msg.includes('safety')
  ) {
    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🚨 **أرقام الطوارئ وخدمة الرعايا في Washington, D.C. / الولايات المتحدة:**\n\n• 📞 **رقم الطوارئ الموحد (شرطة / إسعاف / إطفاء):** **911** (متاح مجاناً 24/7).\n• 🏛️ **سفارة المملكة العربية السعودية في واشنطن:**\n  - العنوان: 601 New Hampshire Ave NW, Washington, DC 20037\n  - هاتف الطوارئ لشؤون المواطنين: **+1 (202) 342-3800** أو عبر المركز الموحد **199099**\n• 💊 **صيدليات 24 ساعة:** سلاسل **CVS Pharmacy** و **Walgreens** تتوفر في كل أحياء واشنطن.\n\n💡 يمكنك أيضاً فتح تبويب **(الطوارئ والجهات الرسمية)** في منصة وصل للوصول السريع لجميع الخدمات بنقرة واحدة!`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🚨 **أرقام الطوارئ والدعم في روما / إيطاليا:**\n\n• 📞 **رقم الطوارئ الأوروبي الموحد:** **112**\n• 🚓 **الشرطة الإيطالية (Polizia / Carabinieri):** **113** / **112**\n• 🚑 **الإسعاف الطبي (Pronto Soccorso):** **118**\n• 🏛️ **سفارة المملكة العربية السعودية في روما:**\n  - العنوان: Via Archimede 124, 00197 Roma\n  - هاتف الطوارئ: **+39 06 884 0807** / طوارئ الرعايا 24/7.\n• 💊 **صيدليات الطوارئ (Farmacia Notturna):** صيدلية Farmacia Piram بجوار محطة Termini تعمل 24 ساعة.`;
    }

    return `🚨 **أرقام الطوارئ والسلامة في ${city} (${destNameAr}):**\n\n• 📞 **رقم الطوارئ العام:** 112 / 911 (حسب الدولة)\n• 🏛️ **سفارة بلدك:** يُنصح دائماً بالاحتفاظ برقم خط الطوارئ الخاص برعايا دولتك المسجل في تطبيق الخارجية أو تبويب الطوارئ في وصل.\n• 🏥 **الرعاية الصحية:** احرص على إبراز وثيقة التأمين الطبي السياحي عند زيارة أي مركز طبي معتمد.`;
  }

  // 6. Culture, Tipping & Etiquette Inquiries
  if (
    msg.includes('ثقافة') ||
    msg.includes('عادات') ||
    msg.includes('تقاليد') ||
    msg.includes('بقشيش') ||
    msg.includes('إكرامية') ||
    msg.includes('اكرامية') ||
    msg.includes('ملابس') ||
    msg.includes('تصوير') ||
    msg.includes('culture') ||
    msg.includes('tipping') ||
    msg.includes('customs') ||
    msg.includes('etiquette')
  ) {
    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🌍 **أبرز التوجيهات الثقافية وقواعد البقشيش في أمريكا:**\n\n1. **البقشيش (Tipping):** يعتبر جزءاً أساسياً من دخل العاملين في قطاع الضيافة:\n• المطاعم وخدمة الطاولات: 15% - 20% من قيمة الفاتورة.\n• التاكسي وسائقي Uber: 10% - 15%.\n• خدمة حمل الحقائب في الفنادق: $2 - $5 للحقيبة.\n\n2. **المساحة الشخصية والتحية:** الأمريكيون يقدّرون المساحة الشخصية (Arm's length) والابتسامة وعبارة *"How are you today?"* عند التعامل مع البائعين.\n\n3. **الالتزام بالقوانين:** تجنب التدخين في الأماكن المغلقة ومحطات المترو والحدائق العامة ما لم تكن هناك منطقة مخصصة.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🌍 **التوجيهات الثقافية وقواعد اللباقة في إيطاليا:**\n\n1. **البقشيش (Coperto / Tipping):** تجد في الفاتورة بنداً باسم *Coperto* (رسوم الجلوس والخبز حوالي 2-3 يورو للشخص)، والبقشيش الإضافي اختياري تماماً (يكفي ترك 1-2 يورو أو تقريب الحساب).\n2. **قواعد القهوة الإيطالية:** شرب الكابتشينو (Cappuccino) تقليد صباحي فقط حتى الساعة 11:00 صباحاً؛ بعد الظهر يفضل الإيطاليون طلب الإسبريسو (Espresso / Caffè Normale).\n3. **قواعد اللباس في المعالم التاريخية:** عند زيارة الفاتيكان أو الكنائس التاريخية، يجب تغطية الأكتاف والركبتين احتراماً لتعليمات الدخول الرسمية.`;
    }

    return `🌍 **التوجيهات الثقافية في ${city} (${destNameAr}):**\n\n1. **اللباقة والتحية:** استخدام عبارات الشكر والتحية المحلية يترك انطباعاً رائعاً لدى السكان المحليين.\n2. **قواعد التصوير:** احرص على استئذان الأشخاص قبل تصويرهم وتجنب تصوير المباني الحكومية أو الأمنية.\n3. **المواعيد والالتزام:** يُقدّر احترام المواعيد في المواصلات والجولات السياحية المحجوزة مسبقاً.`;
  }

  // 7. Itinerary & Plan Inquiries
  if (
    msg.includes('خطة') ||
    msg.includes('خطه') ||
    msg.includes('جدول') ||
    msg.includes('يومي') ||
    msg.includes('اماكن') ||
    msg.includes('أماكن') ||
    msg.includes('معالم') ||
    msg.includes('سياحة') ||
    msg.includes('زيارة') ||
    msg.includes('برنامج') ||
    msg.includes('itinerary') ||
    msg.includes('plan') ||
    msg.includes('places') ||
    msg.includes('attractions')
  ) {
    return `🗺️ **برنامج رحلتك في ${city} (${destNameAr}):**\n\nلقد أعددنا لك مساراً يومياً متكاملاً ومدروساً لتغطية كامل مدة رحلتك:\n• 🌅 **الفترة الصباحية:** استكشاف المعالم التاريخية والمتاحف الكبرى بأوقات مريحة وتجنب الازدحام.\n• ☀️ **فترة الظهيرة:** زيارة الساحات والحدائق والأسواق الحرفية مع استراحة غداء في مطاعم مختارة.\n• 🌙 **الفترة المسائية:** الاستمتاع بالمطلات البانورامية وقت الغروب وتجارب العشاء الممتعة.\n\n👉 يمكنك تصفح الأيام (D1, D2...) واختيار الأسابيع مباشرة من شاشة **(الجدول اليومي والمعالم)** في الصفحة الرئيسية!`;
  }

  // 8. General / Fallback Smart Travel Answer
  return `🌍 **مرحباً بك! يسعدني إفادتك بخصوص رحلتك إلى ${city} (${destNameAr}):**\n\nبناءً على تفاصيل رحلتك، إليك أهم النقاط الإرشادية:\n• 📍 **التنقل:** استخدم التطبيقات الذكية الموثوقة أو المترو لسهولة الحركة.\n• 🍽️ **الأكل:** تتنوع الخيارات بين المأكولات المحلية الشهيرة والمطاعم الحلال المعتمدة.\n• 🛡️ **الأمان:** احتفظ بصورة من جواز سفرك وتأشيرتك وأرقام الطوارئ على هاتفك دائماً.\n\nهل تود الاستفسار عن تفاصيل معينة مثل (المواصلات، التسوق، المطاعم، أو جدول الأيام)؟ أنا هنا لمساعدتك!`;
}

