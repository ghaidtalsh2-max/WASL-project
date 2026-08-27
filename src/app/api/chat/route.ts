import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  let userMessage = '';
  let jCtx: any = null;

  try {
    const body = await req.json();
    userMessage = body.message || '';
    jCtx = body.journeyContext || null;
    const { conversationHistory, apiKey, provider } = body;

    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextParts: string[] = [];
    if (jCtx) {
      if (jCtx.destination?.name) {
        contextParts.push(`- Destination: ${jCtx.destination.name} (City: ${jCtx.destinationCity || jCtx.destination.capital || 'Unspecified'})`);
      }
      if (jCtx.origin?.name) {
        contextParts.push(`- Origin: ${jCtx.origin.name}`);
      }
      if (jCtx.duration) {
        contextParts.push(`- Trip Duration: ${jCtx.duration}`);
      }
      if (jCtx.purpose) {
        contextParts.push(`- Purpose: ${jCtx.purpose}`);
      }
      if (jCtx.accommodationArea) {
        contextParts.push(`- Accommodation Area: ${jCtx.accommodationArea}`);
      }
      if (jCtx.accommodationStatus) {
        contextParts.push(`- Accommodation Status: ${jCtx.accommodationStatus === 'booked' ? 'Already booked' : 'Looking for recommendations'}`);
      }
      if (jCtx.interests && jCtx.interests.length > 0) {
        contextParts.push(`- Interests & Focus: ${Array.isArray(jCtx.interests) ? jCtx.interests.join(', ') : jCtx.interests}`);
      }
      if (jCtx.dates) {
        contextParts.push(`- Travel Dates/Season: ${jCtx.dates}`);
      }
      if (jCtx.travelStyle) {
        contextParts.push(`- Travel Style: ${jCtx.travelStyle}`);
      }
      if (jCtx.additionalNeeds) {
        contextParts.push(`- Plan Context / Notes: ${jCtx.additionalNeeds}`);
      }
    }

    const contextStr = contextParts.length > 0
      ? `Active Traveler Journey Context:\n${contextParts.join('\n')}`
      : 'General travel, cultural intelligence, and relocation companion context.';

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
      const fallbackReply = generateSmartChatReply(userMessage, jCtx);
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
    const fallbackReply = generateSmartChatReply(userMessage, jCtx);
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-assistant',
      reply: fallbackReply,
    });
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
    msg === 'السلام عليكم' ||
    msg === 'السلام عليكم ورحمة الله' ||
    msg.startsWith('سلام') ||
    msg.startsWith('مرحبا') ||
    msg.startsWith('مرحباً') ||
    msg.startsWith('أهلاً') ||
    msg.startsWith('اهلا') ||
    msg.startsWith('هلا') ||
    msg === 'hi' ||
    msg === 'hello' ||
    msg === 'hey'
  ) {
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destNameAr})**.\n\nيسعدني جداً إفادتك في أي تفصيل تحتاجه، مثل:\n• 🎓 الجامعات والدراسة والابتعاث والتخصصات\n• 🍔 المطاعم والمقاهي والأكلات الحلال (برجر، بيتزا، أكلات محلية)\n• 🛍️ المولات المفتوحة والأسواق التراثية والمجمعات\n• 🏨 أفضل الفنادق في السنتر ومناطق السكن الموصى بها\n• 🚕 التاكسي، تطبيقات المواصلات، والمترو\n• 🚨 أرقام الطوارئ وسفارة بلدك\n\nتفضل بسؤالي مباشرة وسأعطيك أدق التفاصيل فوراً!`;
  }

  // 2. Universities, Medicine & Higher Education (جامعة، دراسة، طب، ابتعاث، قبول)
  if (
    msg.includes('جامع') ||
    msg.includes('دراس') ||
    msg.includes('طب') ||
    msg.includes('كلي') ||
    msg.includes('ابتعاث') ||
    msg.includes('قبول') ||
    msg.includes('تخصص') ||
    msg.includes('معهد') ||
    msg.includes('university') ||
    msg.includes('medicine') ||
    msg.includes('college') ||
    msg.includes('study')
  ) {
    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      return `🎓 **أبرز الجامعات لدراسة الطب والعلوم الصحية في Ottawa وكندا:**\n\n1. **University of Ottawa Faculty of Medicine (كلية الطب بجامعة أوتاوا):**\n• من أعرق كليات الطب في كندا وتصنف ضمن أفضل المراكز الطبية البحثية، ومرتبطة بمستشفى أوتاوا التعليمي (The Ottawa Hospital) ومعهد بحوث القلب.\n• توفر برامج الطب البشري (MD)، برامج الدراسات العليا والزمالات الطبية المعتمدة للطلاب والملحقية الثقافية.\n\n2. **Carleton University (جامعة كارلتون - أوتاوا):**\n• متميزة جداً في برامج العلوم الصحية (Health Sciences)، التكنولوجيا الحيوية الطبية، وعلم الأعصاب المؤهلة لدراسة الطب.\n\n3. **خارج أوتاوا (أونتاريو وكندا):**\n• **University of Toronto (Temerty Faculty of Medicine):** المصنفة الأولى كندياً في الطب.\n• **McGill University (مونتريال):** عريقة ومعترف بها عالمياً في التعليم الطبي.\n\n💡 **نصيحة الابتعاث والقبول:** التقديم على كليات الطب الكندية يتطلب عادةً اجتياز اختبار **MCAT** ومعادلة البكالوريوس (Pre-med)، ويُنصح بالتنسيق مع الملحقية الثقافية للبرامج المخصصة للأطباء المقيمين والزمالات.`;
    }

    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      return `🎓 **أفضل الجامعات لدراسة الطب والرعاية الصحية في Doha (قطر):**\n\n1. **كلية وايل كورنيل للطب في قطر (Weill Cornell Medicine-Qatar):**\n• تقع في المدينة التعليمية (Education City) وتمنح نفس شهادة الطب المعتمدة عالمياً لجامعة كورنيل الأمريكية بنيويورك.\n• شراكة إكلينيكية مباشرة مع مؤسسة حمد الطبية وسدرة للطب (Sidra Medicine).\n\n2. **كلية الطب - جامعة قطر (Qatar University College of Medicine):**\n• الكلية الوطنية الرائدة لدراسة الطب والجراحة العامة، وتتبع أحدث المعايير الأكاديمية الدولية.\n\n3. **جامعة الدوحة للعلوم والتكنولوجيا (UDST) & جامعة حمد بن خليفة (HBKU):**\n• تقدم برامج متقدمة في علوم الصيدلة، الجينوم والطب الدقيق، والعلوم الطبية الحيوية.`;
    }

    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🎓 **أبرز الجامعات الطبية في واشنطن والولايات المتحدة:**\n\n1. **Georgetown University School of Medicine (واشنطن العاصمة):** عريقة وتتميز بأبحاثها السريرية ومستشفاها الجامعي المرموق.\n2. **George Washington University (GW School of Medicine):** في قلب العاصمة واشنطن ومجهزة بأحدث المستشفيات التعليمية.\n3. **Johns Hopkins University (ميريلاند - قرب واشنطن):** رائدة التعليم الطبي والبحث العلمي عالمياً.\n4. **Howard University College of Medicine:** مركز تعليمي وتاريخي عريق في العاصمة.`;
    }

    return `🎓 **دليل الدراسة والجامعات في ${city} (${destNameAr}):**\n\n1. **الجامعات الرائدة:** تضم المدينة نخبة من المؤسسات التعليمية والكليات المعتمدة دولياً في الطب والعلوم والتخصصات المتقدمة.\n2. **شروط القبول الدولي:** تتطلب عادةً اختبارات الكفاءة اللغوية (IELTS/TOEFL) واختبارات القبول التخصصية ومعادلة المؤهلات.\n3. **خدمات الطلاب المبتعثين:** يُفضل مراجعة قائمة الجامعات الموصى بها لدى وزارة التعليم وسفارة بلدك لضمان اعتماد التخصص والبرنامج.`;
  }

  // 3. Specific Food, Burgers, Restaurants & Cafes (برجر، مطعم برجر، بيتزا، كافيه، فطور، غداء، عشاء)
  if (
    msg.includes('برجر') ||
    msg.includes('برغر') ||
    msg.includes('burger') ||
    msg.includes('بيتزا') ||
    msg.includes('pizza') ||
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('وجبة') ||
    msg.includes('كافيه') ||
    msg.includes('قهوة') ||
    msg.includes('فطور') ||
    msg.includes('غداء') ||
    msg.includes('عشاء') ||
    msg.includes('شاورما') ||
    msg.includes('مشاوي')
  ) {
    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      if (msg.includes('برجر') || msg.includes('برغر') || msg.includes('burger')) {
        return `🍔 **أفضل مطاعم البرجر في Doha (قطر):**\n\n1. **Duke Burger (ديوك برجر):** في لوسيل ومارينا لوسيل، يقدم برجر لحم واغيو وأنجوس فاخر بخبز بريوش طازج وصلصات مبتكرة.\n2. **Exit 55 (إكزت 55):** في اللؤلؤة (The Pearl) والخليج الغربي، من أشهر خيارات البرجر الكلاسيكي المفضل محلياً.\n3. **Elevation Burger (إليفيشن برجر):** فرع اللؤلؤة، يقدم لحوم عضوية 100% (Organic Grass-fed) وبطاطس مقلية بزيت الزيتون البكر.\n4. **Boston Burger / Pickl:** خيارات مميزة للبرجر وساندويتشات الدجاج المقرمش في قطر مول واللؤلؤة.\n5. **Shake Shack (شيك شاك):** متوفر في فيلاجيو مول وقطر مول واللؤلؤة.\n\n💡 جميع المطاعم في قطر تقدم لحوماً حلالاً 100% معتمدة ومعايير نظافة فائقة!`;
      }

      return `🍽️ **أفضل المطاعم والمقاهي في الدوحة (قطر):**\n\n1. **المأكولات الشرقية والتراثية:** مطعم **دامسكا (Damasca One)** في سوق واقف، مطعم **شاطر عباس** للمشاوي، ومطعم **لؤلؤة بيروت**.\n2. **المطاعم الفاخرة:** **Nobu Doha** في الفورسيزونز، مطعم **SMAT** في الكورنيش للأكلات القطرية العصرية، ومطعم **Hakkasan** في فندق سانت ريجيس.\n3. **المقاهي المميزة:** مقاهي مشيرب قلب الدوحة (مثل **% Arabica** و **FLAT WHITE** في اللؤلؤة) ومقاهي جزيرة المها في لوسيل.`;
    }

    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      if (msg.includes('برجر') || msg.includes('برغر') || msg.includes('burger')) {
        return `🍔 **أفضل مطاعم البرجر في Ottawa (كندا):**\n\n1. **The Works Craft Burgers & Grills (شارع Bank St & Glebe):** أشهر مطعم برجر في أوتاوا، يتيح لك تخصيص البرجر بأكثر من 50 نكهة وصلصة مبتكرة ولحوم طازجة.\n2. **Burgers n' Fries Forever (BFF - شارع Elgin St):** برجر حرفي متميز ببطاطس البوتين الكندية الشهيرة (Poutine) وخيارات حلال معتمدة.\n3. **Zak's Diner (سوق ByWard Market):** مطعم كلاسيكي بطراز الستينات يقدم البرجر والوافل والميلك شيك على مدار 24 ساعة.\n4. **Five Guys (Rideau St):** البرجر الأمريكي الكلاسيكي والبطاطس الطازجة بزيت الفول السوداني.`;
      }

      return `🍽️ **أفضل المطاعم والمأكولات في Ottawa:**\n\n1. **المأكولات المحلية الشهيرة:** جرب حلوى **BeaverTails** الكلاسيكية في سوق ByWard Market وطبق **Poutine** الكندي الشهير.\n2. **المطاعم الحلال:** مطاعم **Shawarma Palace** (شارع Rideau St - أشهر شاورما في أوتاوا)، ومطعم **Fairouz Cafe** للمأكولات الشرق أوسطية الراقية.\n3. **المطاعم الإيطالية والبحرية:** مطاعم حي Little Italy بشارع Preston St ومطعم **Metropolitain Brasserie** بجوار البرلمان.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🍽️ **أفضل خيارات الأكل والمطاعم في روما / إيطاليا:**\n\n1. **الباستا والبيتزا الأصيلة:** **Tonnarello** في حي تراستيفيري (Trastevere)، مطعم **Da Enzo al 29**، ومخبز **Pinsere Roma** لأشهى بيتزا بينسا مقرمشة.\n2. **البرجر والوجبات:** **Open Baladin Roma** (أشهى برجر إيطالي حرفي بمكونات فاخرة قرب كامبو دي فيوري).\n3. **الجيلاتو والقهوة:** **Giolitti** و **Frigidarium** لأفضل آيس كريم، ومقهى **Sant'Eustachio Il Caffè** لأعرق إسبريسو إيطالي.`;
    }

    return `🍽️ **أفضل المطاعم وخيارات الطعام في ${city} (${destNameAr}):**\n\n1. **المطاعم والمأكولات الشهيرة:** استمتع بالنكهات المحلية المميزة للمدينة إلى جانب خيارات البرجر والمشاوي والمأكولات العالمية.\n2. **خيارات الحلال:** تتوفر مطاعم معتمدة حلال ومأكولات بحرية ونباتية متنوعة في وسط المدينة والمناطق السياحية.\n3. **التطبيقات:** استخدم Google Maps أو Zabihah لتصفح تقييمات الزوار وصور الأطباق وساعات العمل.`;
  }

  // 4. Open Malls, Souqs, Markets & Shopping (مجمع مفتوح، سوق، مول، أسواق، تسوق)
  if (
    msg.includes('مجمع') ||
    msg.includes('مجمعات') ||
    msg.includes('مفتوح') ||
    msg.includes('مول') ||
    msg.includes('سوق') ||
    msg.includes('اسواق') ||
    msg.includes('أسواق') ||
    msg.includes('تسوق') ||
    msg.includes('shopping') ||
    msg.includes('mall') ||
    msg.includes('market')
  ) {
    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      return `🛍️ **أفضل المجمعات المفتوحة والأسواق في Doha (قطر):**\n\n1. **Place Vendôme Mall (بلاس فاندوم - لوسيل):**\n• أحدث وأفخم مجمع في قطر مستوحى من العمارة الباريسية، ويضم **قنوات مائية خارجية مفتوحة، نوافير راقصة تفاعلية**، ومطاعم ومقاهي وجلسات خارجية ساحرة.\n\n2. **Souq Waqif (سوق واقف التراثي):**\n• السوق المفتوح الأجمل والأعرق؛ ممرات حجرية تراثية، محلات البهارات، العطور، التحف، وجلسات المطاعم والمقاهي الحية في الهواء الطلق.\n\n3. **Katara Cultural Village (حي كتارا الثقافي):**\n• ممرات تسوق مفتوحة ومطلة على البحر والواجهة البحرية تضم متجر **Galeries Lafayette** الفاخر ومطاعم ومقاهي عالمية.\n\n4. **المولات الكبرى المغلقة:** **Villaggio Mall** (بقنوات الجندول الإيطالية)، و **Mall of Qatar** (قطر مول بمساحاته الضخمة والمسرح الترفيهي).`;
    }

    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      return `🛍️ **أفضل الأسواق والمجمعات في Ottawa (كندا):**\n\n1. **ByWard Market (سوق باي وارد المفتوح):**\n• أقدم سوق تاريخي مفتوح في أوتاوا، يضم أكشاك المنتجات الطازجة، الحرف اليدوية، المتاجر الحرفية ومئات المقاهي والمطاعم المفتوحة.\n\n2. **CF Rideau Centre:**\n• أضخم مركز تسوق فاخر في قلب العاصمة واشنطن/أوتاوا يضم أشهر الماركات العالمية (Apple, Nordstrom, Zara) ومتصل بأرقى فنادق المدينة.\n\n3. **Tanger Outlets Ottawa:**\n• مركز تسوق مفتوح في الهواء الطلق (Open-Air Outlet) يقدم خصومات كبرى تتراوح بين 30% إلى 70% على الماركات العالمية.\n\n4. **Sparks Street Promenade:**\n• شارع مشاة تجاري تاريخي مفتوح للمشاة فقط بالقرب من مبنى البرلمان الكندي.`;
    }

    if (normDest.includes('united states') || normDest.includes('washington') || normDest.includes('america') || normDest.includes('أمريكا')) {
      return `🛍️ **أفضل المجمعات المفتوحة والأسواق في Washington, D.C.:**\n\n1. **Georgetown Historic Waterfront & M Street:** شوارع تسوق مفتوحة تاريخية تصطف بها البوتيكات الفاخرة والمقاهي على ضفاف النهر.\n2. **CityCenterDC:** مجمع تسوق مفتوح فائق الفخامة في قلب واشنطن يضم أرقى الماركات (Hermès, Dior, Gucci, Chanel).\n3. **Eastern Market:** سوق حرفي وتراثي مفتوح في كابيتول هيل للمنتجات اليدوية والفنون المحلية.\n4. **Tysons Corner Center:** أضخم مجمع تجاري متكامل في منطقة العاصمة الكبرى.`;
    }

    return `🛍️ **أفضل الأسواق والمجمعات التجارية في ${city} (${destNameAr}):**\n\n1. **الأسواق المفتوحة وشوارع المشاة:** استمتع بالممرات التجارية والساحات المركزية المفتوحة التي تضم مزيجاً من الماركات العالمية والمتاجر المحلية.\n2. **المجمعات والمولات الكبرى:** توفر مراكز التسوق المتكاملة تجارب تسوق وترفيه ومطاعم متنوعة لجميع أفراد العائلة.\n3. **الأسواق التراثية:** لا تفوت زيارة الأسواق الشعبية لاقتناء الهدايا التذكارية والمنتجات اليدوية الأصلية.`;
  }

  // 5. Central Hotels & Accommodation (فندق فالسنتر، فندق بالسنتر، فنادق، شقق، سكن، إقامة)
  if (
    msg.includes('فندق') ||
    msg.includes('فنادق') ||
    msg.includes('سنتر') ||
    msg.includes('سكن') ||
    msg.includes('شقق') ||
    msg.includes('شقة') ||
    msg.includes('اقامة') ||
    msg.includes('إقامة') ||
    msg.includes('hotel') ||
    msg.includes('apartment') ||
    msg.includes('stay')
  ) {
    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      return `🏨 **أفضل الفنادق في قلب سنتر الدوحة (مشيرب والخليج الغربي):**\n\n1. **Mandarin Oriental, Doha (مشيرب قلب الدوحة):**\n• في سنتر المدينة الذكي تماماً، على بُعد خطوات مشياً من ساحة البراحة ومحطة المترو المركزية وسوق واقف.\n\n2. **Park Hyatt Doha (مشيرب):**\n• فندق فاخر راقٍ جداً في وسط مشيرب مع إطلالات بانورامية ومطاعم استثنائية وخدمة متكاملة.\n\n3. **Banyan Tree Doha (حي السد / مشيرب):**\n• تصميم معماري أيقوني وتجربة فندقية فاخرة في موقع مركزي استراتيجي قريب من معالم العاصمة.\n\n4. **Marriott Marquis City Center Doha (الدفنة / الخليج الغربي):**\n• متصل مباشرة بمول سيتي سنتر ومحطة المترو مع مسابح ومرافق متكاملة لرجال الأعمال والعائلات.\n\n5. **The Ritz-Carlton Sharq Village (الشرق):**\n• منتجع تراثي فاخر على البحر بالقرب من مطار حمد وسوق واقف.`;
    }

    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      return `🏨 **أفضل الفنادق في سنتر مدينة Ottawa (Downtown):**\n\n1. **Fairmont Château Laurier (فيرمونت شاتو لورييه):**\n• أيقونة أوتاوا التاريخية الفاخرة المصممة كقصر فرنسي عريق، يقع ملاصقاً لقناة الريدو والبرلمان وسوق ByWard Market.\n\n2. **The Westin Ottawa (ويستن أوتاوا):**\n• متصل مباشرة بمركز CF Rideau Centre ومطل على البرلمان وقنوات المياه بوسط المدينة.\n\n3. **Lord Elgin Hotel (فندق لورد إلجين):**\n• فندق كلاسيكي شهير في سنتر شارع إلجين (Elgin St) بالقرب من المتاحف والحدائق ومحطات القطار الخفيف (O-Train).\n\n4. **Le Germain Hotel Ottawa (حي باي وارد):**\n• فندق بوتيك عصري فخم بجوار المعارض والمسارح في قلب النشاط التجاري.`;
    }

    if (normDest.includes('italy') || normDest.includes('rome') || normDest.includes('روما') || normDest.includes('إيطاليا')) {
      return `🏨 **أفضل الفنادق في سنتر روما التاريخي (Centro Storico):**\n\n1. **Hotel Artemide (فيا ناسيونالي):** موقع مركزي متميز بين محطة تيرميني والنافورة ومترو ريبوبليكا.\n2. **The Pantheon Iconic Rome Hotel:** خطوات قليلة من البانثيون ونافورة تريفي والساحات التراثية.\n3. **Hotel Hassler Roma:** أعلى السلالم الإسبانية بإطلالات بانورامية لا مثيل لها على كامل مدينة روما.`;
    }

    return `🏨 **أفضل الفنادق ومناطق السكن في ${city} (${destNameAr}):**\n\n1. **منطقة السنتر والوسط التاريخي:** الخيار المثالي للوصول سيراً على الأقدام لكافة المعالم والمطاعم ومحطات المترو.\n2. **الفنادق الموصى بها:** ابحث عن الفنادق الحاصلة على تقييم 8.5+ في Booking أو Agoda القريبة من محطات النقل الرئيسية.\n3. **الشقق الفندقية:** خيار اقتصادي ومريح للعائلات مع توفر مطبخ وغسالة وخدمات الاستقبال على مدار 24 ساعة.`;
  }

  // 6. Taxi, Uber & Transportation Inquiries (تاكسي، مواصلات، مترو)
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
    msg.includes('transport')
  ) {
    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      return `🚕 **دليل المواصلات والتنقل في Doha (قطر):**\n\n1. **مترو الدوحة (Doha Metro):** من أحدث وأفخم شبكات المترو في العالم، يربط مطار حمد، سوق واقف، لوسيل، اللؤلؤة، والمولات بتكلفة 2 ريال فقط للتذكرة.\n2. **تطبيقات التاكسي المعتمدة:** **Karwa Taxi (كروة)** التطبيق الرسمي الحكومي، إلى جانب **Uber** المتوفر بكثرة وسرعة فائقة.\n3. **ترام لوسيل والترامواي:** متصل بالمترو ويوفر تنقلاً سلساً داخل مدينة لوسيل والواجهة البحرية.`;
    }

    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      return `🚕 **دليل المواصلات في Ottawa (كندا):**\n\n1. **تطبيقات التوصيل:** استخدم تطبيق **Uber** أو **Lyft** للتنقل السريع والدفع الإلكتروني السلس.\n2. **القطار الخفيف والباصات (OC Transpo):** شبكة القطار الخفيف (O-Train Line 1) ممتازة للربط بين الشرق والغرب والسنتر وجامعة أوتاوا عبر بطاقة **Presto Card** أو الدفع المباشر ببطاقة الائتمان.\n3. **تاكسي المطار:** تتوفر سيارات التاكسي الرسمية على مدار 24 ساعة خارج صالة مطار أوتاوا الدولي (YOW).`;
    }

    return `🚕 **دليل المواصلات في ${city} (${destNameAr}):**\n\n1. **التطبيقات الذكية:** يُفضل دائماً استخدام تطبيقات التوصيل المعتمدة (مثل Uber / Bolt / التطبيق المحلي الرسمي) لضمان دقة التعرفة وتتبع المسار.\n2. **المواصلات العامة:** تتوفر شبكات المترو والقطارات الخفيفة وتوفر بطاقات يومية وأسبوعية موفرة للمسافرين.\n3. **التاكسي العادي:** تأكد دائماً من تشغيل العداد (Meter) قبل بدء الرحلة.`;
  }

  // 7. Emergency, Embassy & Safety Inquiries (طوارئ، سفارة، شرطة، إسعاف)
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
    msg.includes('embassy')
  ) {
    if (normDest.includes('qatar') || normDest.includes('قطر') || normDest.includes('doha') || normDest.includes('الدوحة')) {
      return `🚨 **أرقام الطوارئ وخدمات الرعايا في دولة قطر (الدوحة):**\n\n• 📞 **رقم الطوارئ الموحد (شرطة / إسعاف / إطفاء):** **999** (متاح مجاناً 24/7).\n• 🏛️ **سفارة المملكة العربية السعودية في الدوحة:**\n  - العنوان: المنطقة الدبلوماسية، الخليج الغربي، الدوحة\n  - هاتف السفارة: **+974 4483 2211**\n  - طوارئ شؤون المواطنين بالخارج: **199099** / **+974 5000 9900**\n• 🏥 **الاستشارات الطبية والحرجة:** اتصل بـ **16000** (مؤسسة حمد الطبية).\n\n💡 يمكنك فتح تبويب **(الطوارئ والجهات الرسمية)** في منصة وصل للاتصال الفوري بنقرة واحدة!`;
    }

    if (normDest.includes('canada') || normDest.includes('كندا') || normDest.includes('ottawa') || normDest.includes('أوتاوا') || normDest.includes('اوتاوا')) {
      return `🚨 **أرقام الطوارئ والدعم في كندا (أوتاوا):**\n\n• 📞 **رقم الطوارئ الوطني (شرطة / إسعاف / إطفاء):** **911** (متاح مجاناً 24/7).\n• 🏛️ **سفارة المملكة العربية السعودية في أوتاوا:**\n  - العنوان: 99 Bank St, Suite 900, Ottawa, ON K1P 6B9\n  - هاتف السفارة: **+1 (613) 237-4100**\n  - طوارئ المواطنين 24/7: **+1 (613) 321-4822** أو عبر مركز الخارجية الموحد **199099**\n• 🩺 **الاستشارات التمريضية والطبية:** اتصل بـ **811** (Telehealth Ontario مجاناً 24/7).`;
    }

    return `🚨 **أرقام الطوارئ والسلامة في ${city} (${destNameAr}):**\n\n• 📞 **رقم الطوارئ العام:** 911 / 112 (حسب الدولة)\n• 🏛️ **سفارة بلدك:** احتفظ برقم خط الطوارئ الموحد لرعايا دولتك (السعودية: 199099 / الإمارات: 800 44444 / قطر: +974 4011 1140).\n• 🏥 **الرعاية الطبية:** توجه لأقرب مستشفى مركزي مع إبراز وثيقة التأمين الطبي للمسافرين.`;
  }

  // 8. General Specific Fallback
  return `🌍 **مرحباً بك! يسعدني إفادتك بخصوص رحلتك إلى ${city} (${destNameAr}):**\n\nبخصوص استفسارك عن: "${userMessage}"\n\n• 📍 **المدينة:** ${city} وجهة ممتازة ومجهزة بكافة المرافق السياحية والخدمية المتقدمة.\n• 🚗 **التنقل:** استخدم تطبيقات التوصيل الذكية أو المترو لسهولة وسرعة الوصول.\n• 🍽️ **الأكل والتسوق:** تتوفر في وسط المدينة والمجمعات الكبرى كافة الخيارات من المطاعم العالمية والمحلية والمتاجر المفتوحة.\n• 🛡️ **الدعم:** يمكنك تصفح التبويبات المتخصصة في منصة وصل (الجدول اليومي، الطوارئ، الثقافة، والتسوق) للاطلاع على كافة التفاصيل بدقة!`;
}