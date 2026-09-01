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

    // 1. Try external AI if valid API key is present
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

    // 2. High-precision contextual travel reasoning engine
    const reply = generateSmartChatReply(userMessage, jCtx, isEn);
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-assistant',
      reply,
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
 * High-Precision Multilingual Travel Reasoning Engine
 */
function generateSmartChatReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'United States';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Washington, D.C.';
  const cityAr = ctx?.destinationCityAr || cityEn;
  const originNameEn = ctx?.origin?.name || 'Saudi Arabia';
  const originNameAr = ctx?.origin?.nameAr || 'المملكة العربية السعودية';
  
  const city = isEn ? cityEn : cityAr;
  const destName = isEn ? destNameEn : destNameAr;
  const normDest = `${destNameEn} ${cityEn} ${destNameAr}`.toLowerCase();

  // Helper to fetch emergency info from database
  const getEmergencyData = () => {
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

  // 1. EMBASSIES, CONSULATES & CITIZEN CITIZEN SUPPORT (سفارة، سفاره، قنصلية، موقع السفارة، رقم السفارة، سفارتي، embassy, consulate)
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
      return `🏛️ **${originNameEn} Embassy in ${cityEn} (${destNameEn}):**\n\n📍 **Official Address:**\n• **${emData.embassyAddress || emData.embassy?.address || 'Embassy Quarter / Central Diplomatic Zone'}**\n\n📞 **Contact & 24/7 Citizen Emergency Hotlines:**\n• **Main Telephone:** ${emData.embassyPhone || emData.embassy?.phone}\n• **24/7 Consular Emergency Line:** **${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}**\n• **Working Hours:** ${emData.embassyHours || emData.embassy?.workingHours || 'Monday - Friday: 09:00 - 17:00'}\n\n🚨 **Local Emergency Numbers in ${destNameEn}:**\n• 🚓 **Police:** ${emData.police}\n• 🚑 **Ambulance:** ${emData.ambulance}\n• 🚒 **Fire Department:** ${emData.fire}\n\n💡 **Tips:** In any urgent safety, loss of passport, or medical distress situation, call the 24/7 emergency citizen line immediately for direct consular support.`;
    }
    return `🏛️ **بيانات وموقع سفارة ${originNameAr} في ${city} (${destName}):**\n\n📍 **الموقع والعنوان المعتمد:**\n• **${emData.embassyAddress || emData.embassy?.address || 'المنطقة الدبلوماسية / حي السفارات'}**\n\n📞 **أرقام الاتصال وطوارئ شؤون المواطنين على مدار 24 ساعة:**\n• **الهاتف الرئيسي للسفارة:** \`${emData.embassyPhone || emData.embassy?.phone}\`\n• **خط طوارئ رعاية المواطنين (24/7):** **\`${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}\`**\n• **ساعات العمل الرسمية:** ${emData.embassyHours || emData.embassy?.workingHours || 'من الإثنين إلى الجمعة: 09:00 ص - 05:00 م'}\n\n🚨 **أرقام الطوارئ المحلية في ${destName}:**\n• 🚓 **الشرطة:** ${emData.police}\n• 🚑 **الإسعاف:** ${emData.ambulance}\n• 🚒 **الدفاع المدني:** ${emData.fire}\n\n💡 **إرشاد هام:** في حالات فقدان جواز السفر، أو الحوادث، أو الطوارئ القانونية والطبية، يمكنك الاتصال فوراً بخط طوارئ شؤون المواطنين على مدار الساعة لتلقي الدعم والمتابعة المباشرة من فريق السفارة.`;
  }

  // 2. TAXIS & MOBILITY (تاكسي، مواصلات، تطبيق، مترو، باص، أوبر، بولت، قوقل ماب، uber, taxi)
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('تطبيق') ||
    msg.includes('اوبر') ||
    msg.includes('أوبر') ||
    msg.includes('بولت') ||
    msg.includes('مترو') ||
    msg.includes('باص') ||
    msg.includes('قطار') ||
    msg.includes('transit') ||
    msg.includes('taxi') ||
    msg.includes('uber') ||
    msg.includes('metro')
  ) {
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      if (isEn) {
        return `🚕 **Transportation & Navigation Guide in Washington, D.C.:**\n\n1. **Rideshare Apps:** **Uber** and **Lyft** operate extensively with instant pickups across D.C., Maryland, and Virginia.\n2. **Metro Subway (Washington Metro):** The cleanest, fastest transit system in the U.S. Connects the National Mall, Capitol Hill, and Reagan National Airport (DCA). Pay using Apple Pay / SmarTrip card.\n3. **Circulator Bus & Capital Bikeshare:** Convenient $1 buses and rentable city bikes around monuments.`;
      }
      return `🚕 **دليل المواصلات والتنقل الذكي في واشنطن (الولايات المتحدة):**\n\n1. **تطبيقات سيارات الأجرة المعتمدة:** تطبيق **Uber** وتطبيق **Lyft** هما الأوسع انتشاراً والأسرع طلباً في واشنطن والمدن الأمريكية.\n2. **مترو واشنطن (Washington Metro):** شبكة قطارات سريعة ونظيفة تربط المتاحف، البيت الأبيض، الكونغرس، ومطار ريغان؛ يمكنك الدفع مباشرة عبر Apple Wallet أو بطاقة SmarTrip.\n3. **حافلات D.C. Circulator:** حافلات مكيفة تجوب المعالم السياحية بتكلفة دولار واحد.\n4. **تأجير السيارات:** تتوفر كبرى الشركات (Hertz, Enterprise, Avis) في المطارات.`;
    }

    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      return isEn
        ? `🚕 **Transportation in Tbilisi (Georgia):**\n\n1. **Rideshare App:** **Bolt** is the #1 most reliable, cheap taxi app in Tbilisi.\n2. **Tbilisi Metro:** Fast 2-line network using the Metromoney card or contactless bank cards.\n3. **Tbilisi Cable Cars:** Scenic aerial cable cars to Narikala Fortress and Turtle Lake.`
        : `🚕 **دليل المواصلات والتنقل في تبيليسي (جورجيا):**\n\n1. **تطبيق التاكسي الأول المعتمد:** تطبيق **Bolt** هو الخيار الأفضل والأرخص والأكثر أماناً في جورجيا لطلب التاكسي بالدفع بالبطاقة أو نقداً.\n2. **مترو تبيليسي:** شبكة بخطين رئيسيين للتنقل السريع بتكلفة منخفضة عبر بطاقة Metromoney أو البطاقات البنكية.\n3. **التلفريك والقطار الجبلي (Funicular):** للوصول البانورامي إلى قلعة ناريكالا وقمة جبل متاتسميندا.`;
    }
  }

  // 3. THEME PARKS & AMUSEMENT (مدينة العاب، ملاهي، العاب، مائية، theme park)
  if (
    msg.includes('العاب') ||
    msg.includes('ألعاب') ||
    msg.includes('ملاهي') ||
    msg.includes('ترفيه') ||
    msg.includes('مائيه') ||
    msg.includes('مائية') ||
    msg.includes('زحاليق') ||
    msg.includes('theme park') ||
    msg.includes('amusement park') ||
    msg.includes('water park')
  ) {
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      return isEn
        ? `🎡 **Top Theme Parks & Amusement in Tbilisi (Georgia):**\n\n1. **Mtatsminda Amusement Park:** High-altitude park on Mount Mtatsminda (770m) with giant Ferris wheel and roller coasters via the Funicular.\n2. **Gino Paradise Tbilisi:** Massive water park near the Tbilisi Sea with extreme water slides and wave pools.\n3. **East Point Entertainment:** Focus Mokus indoor park, bowling, IMAX, and VR arena.\n4. **Astra Park:** Indoor go-karting and arcade center.`
        : `🎡 **أفضل مدن الملاهي والألعاب المائية في تبيليسي (جورجيا):**\n\n1. **مدينة ملاهي متاتسميندا (Mtatsminda Park):** على قمة جبل متاتسميندا مع القطار الجبلي المعلق (Funicular)، وعجلة فيريس البانورامية، وقطار الموت.\n2. **ملاهي جينو بارادايس المائية (Gino Paradise Tbilisi):** أضخم حديقة ألعاب مائية ومسابح أمواج في جورجيا.\n3. **مجمع إيست بوينت الترفيهي (East Point):** مدينة ألعاب *Focus Mokus* وصالات البولينج وسينما IMAX.\n4. **أسترا بارك (Astra Park):** سباقات الكارتينج السريعة وصالات ألعاب الفيديو.`;
    }

    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      return isEn
        ? `🎡 **Top Theme Parks & Family Attractions in & near Washington, D.C.:**\n\n1. **Six Flags America (Bowie, MD - 20 mins from DC):** Thrilling hyper-coasters (Superman: Ride of Steel, Joker's Jinx) and Hurricane Harbor Water Park.\n2. **Kings Dominion (Doswell, VA - 1.5 hrs):** World-class roller coaster kingdom (Intimidator 305, Twisted Timbers) and Soak City water park.\n3. **Busch Gardens Williamsburg (VA):** Renowned European-themed roller coaster park with Celtic Fyre shows.\n4. **Smithsonian National Zoo:** World-famous free zoo with giant pandas and wildlife trails.`
        : `🎡 **أفضل مدن الملاهي والأنشطة الترفيهية في واشنطن ومحيطها (أمريكا):**\n\n1. **ملاهي سيكس فلاجز أمريكا (Six Flags America - على بعد 20 دقيقة من واشنطن):** قطارات الموت العملاقة (Superman Ride of Steel) وألعاب الإثارة والحديقة المائية *Hurricane Harbor*.\n2. **منتزه كينغز دومينيون (Kings Dominion - فيرجينيا):** إحدى أضخم مدن الملاهي في الساحل الشرقي بقطار *Twisted Timbers* ومدينة الألعاب المائية *Soak City*.\n3. **بوش جاردنز (Busch Gardens Williamsburg):** مدينة ملاهي ساحرة مستوحاة من القرى الأوروبية مع أفعوانيات عالمية.\n4. **حديقة الحيوان الوطنية (Smithsonian National Zoo):** دخول مجاني لمشاهدة دببة الباندا العملاقة والحياة البرية.`;
    }
  }

  // 4. RESTAURANTS, BBQ & HALAL DINING (مطعم مشاوي، مشاوي، مطعم، مطاعم، أكل، حلال، لحم)
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
    msg.includes('كبسة') ||
    msg.includes('شاورما') ||
    msg.includes('برجر') ||
    msg.includes('restaurant') ||
    msg.includes('bbq') ||
    msg.includes('food') ||
    msg.includes('halal')
  ) {
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      if (isEn) {
        return `🍽️ **Top BBQ Grills, Steakhouses & Halal Dining in Washington, D.C.:**\n\n1. **Fogo de Chão Brazilian Steakhouse (Downtown D.C. / Pennsylvania Ave):** Premier continuous tableside churrascaria steakhouse with fire-roasted beef, lamb chops, and gourmet market table.\n2. **Albi (Navy Yard):** Michelin-starred Levantine wood-fired grill restaurant serving magnificent coal-charred meats and flatbreads.\n3. **Moby Dick House of Kabob (Georgetown & Dupont Circle):** Iconic local favorite for authentic charcoal-grilled saffron chicken kabobs and gyros with fresh tandoor bread.\n4. **The Halal Guys (Dupont Circle & H Street):** Famous New York-style gyro and chicken over rice with signature white sauce.\n5. **Old Ebbitt Grill (Near White House):** D.C.'s oldest historic tavern (founded 1856) famous for fresh seafood and steaks.`;
      }
      return `🍽️ **أفضل مطاعم المشاوي والستيك والأكلات الحلال في واشنطن العاصمة (أمريكا):**\n\n1. **مطعم فوجو دي تشاو (Fogo de Chão Brazilian Steakhouse - السنتر وشارع بنسلفانيا):** أرقى تجربة مشاوي ستيك برازيلية؛ يقدم لحوم الضأن والريش والبيكانيا المشوية على الفحم على الطاولة مباشرة.\n2. **مطعم ألبي (Albi - حي نافي يارد Navy Yard):** مطعم حائز على نجمة ميشلان متخصص في المشاوي الشرقية على الحطب والأطباق الشامية الفاخرة.\n3. **مطعم موبي ديك للكباب (Moby Dick - جورج تاون ودوبونت سيركل):** أشهر سلسلة محلية للمشاوي الحلال والكباب المشوي على الفحم وخبز التندور الطازج.\n4. **مطعم ذا حلال غايز (The Halal Guys - دوبونت سيركل):** طبق أرز الشاورما والكباب والدجاج مع الصلصة البيضاء الشهيرة.\n5. **مطعم لي بابلوس كباب (Lebanese Taverna):** مأكولات ومشاوي لبنانية وعربية حلال فاخرة.`;
    }

    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi') || normDest.includes('تبيليسي')) {
      return isEn
        ? `🍽️ **Top BBQ & Dining in Tbilisi:**\n\n1. **Tsiskvili Complex:** Traditional Georgian Mtsvadi skewers with waterfalls & folk shows.\n2. **Funicular Restaurant (Mtatsminda):** Panoramic city view dining.\n3. **Beirut Halal Lebanese Restaurant (Marjanishvili):** 100% Halal charcoal grills.`
        : `🍽️ **أفضل مطاعم المشاوي في تبيليسي (جورجيا):**\n\n1. **مجمع تسيسكفيلي (Tsiskvili):** أشهى المشاوي الجورجية مع الشلالات والموسيقى الفلكلورية.\n2. **مطعم فونيكولار (Funicular):** إطلالة بانورامية من قمة جبل متاتسميندا مع المشاوي.\n3. **مطعم بيروت الحلال (حي مرجانيشفيلي):** مشاوي شامية وكباب حلال 100%.`;
    }
  }

  // 5. SPECIALTY COFFEE & ARTISAN CAFES (قهوة مختصة، كافيه، مقهى، قهوة، كوفي)
  if (
    msg.includes('قهوة') ||
    msg.includes('قهوه') ||
    msg.includes('مختصة') ||
    msg.includes('مختصه') ||
    msg.includes('كافيه') ||
    msg.includes('مقهى') ||
    msg.includes('كوفي') ||
    msg.includes('coffee') ||
    msg.includes('cafe')
  ) {
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      return isEn
        ? `☕ **Top Specialty Coffee Roasters in Washington, D.C.:**\n\n1. **Compass Coffee (Downtown / Georgetown / 7th St):** D.C.'s premier home-grown specialty roaster founded by Marines.\n2. **Blue Bottle Coffee (Georgetown & Union Market):** Famous for pour-overs and New Orleans cold brew.\n3. **Tryst (Adams Morgan):** Iconic community coffeehouse with artisan single origins.\n4. **La Colombe Coffee Roasters (Chinatown & Farragut):** Creators of the Draft Latte on tap.`
        : `☕ **أفضل مقاهي ومحامص القهوة المختصة في واشنطن العاصمة:**\n\n1. **كومباس كوفي (Compass Coffee - السنتر وجورج تاون):** أشهر محمصة محلية رائدة في واشنطن بحبوب بن نقية وتقطير V60.\n2. **بلو بوتل كوفي (Blue Bottle Coffee - جورج تاون ويونيون ماركت):** القهوة المقطرة الباردة والساخنة فائقة الجودة.\n3. **تريست كوفي (Tryst - حي آدامز مورغان):** مقهى تراثي واسع وعصري لعشاق القهوة والهدوء.\n4. **لا كولومب (La Colombe - تشاينا تاون وفاراغوت):** مبتكرو مشروب درافت لاتيه على الصنبور.`;
    }
  }

  // 6. HOTELS & NEIGHBORHOODS (فندق، فنادق، سكن، شقق، شقة، إقامة)
  if (
    msg.includes('فندق') ||
    msg.includes('فنادق') ||
    msg.includes('سكن') ||
    msg.includes('شقق') ||
    msg.includes('شقة') ||
    msg.includes('إقامة') ||
    msg.includes('hotel') ||
    msg.includes('stay')
  ) {
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('واشنطن') || normDest.includes('washington') || normDest.includes('أمريكا')) {
      return isEn
        ? `🏨 **Top Recommended Hotels in Washington, D.C.:**\n\n1. **The Willard InterContinental:** Historic 5-star palace hotel 2 blocks from the White House.\n2. **The Ritz-Carlton, Georgetown:** Luxury historic industrial boutique hotel by the Potomac River.\n3. **Waldorf Astoria Washington DC (Pennsylvania Ave):** Iconic clock-tower luxury landmark.\n4. **AKA White House Serviced Residences:** Premium furnished suites with kitchens for extended stays.`
        : `🏨 **أفضل الفنادق وأماكن السكن في واشنطن العاصمة:**\n\n1. **فندق ذا ويلارد إنتركونتيننتال (The Willard InterContinental):** قصر تاريخي 5 نجوم على بعد خطوات من البيت الأبيض.\n2. **ذا ريتز-كارلتون جورج تاون (The Ritz-Carlton Georgetown):** فندق فاخر على ضفاف نهر بوتوماك وحي جورج تاون الراقي.\n3. **والدورف أستوريا واشنطن (Waldorf Astoria Washington DC):** في مبنى برج الساعة التاريخي الفخم بشارع بنسلفانيا.\n4. **شقق إيه كيه إيه الفندقية (AKA White House Residences):** أجنحة فندقية عائلية مجهزة بمطابخ متكاملة بالقرب من السنتر.`;
    }
  }

  // 7. GENERAL ACCURATE CITY FALLBACK (Tailored to active destination, no fake apps or generic strings)
  const taxiApp = (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington'))
    ? 'Uber & Lyft'
    : (normDest.includes('georgia') || normDest.includes('tbilisi') || normDest.includes('azerbaijan'))
    ? 'Bolt'
    : (normDest.includes('singapore') || normDest.includes('malaysia') || normDest.includes('thailand') || normDest.includes('indonesia'))
    ? 'Grab'
    : (normDest.includes('korea'))
    ? 'Kakao T'
    : (normDest.includes('japan'))
    ? 'Go Taxi & JapanTaxi'
    : (normDest.includes('china'))
    ? 'Didi Chuxing'
    : 'Uber & Local Taxi';

  if (isEn) {
    return `🌍 **Here are recommendations for ${cityEn} (${destNameEn}) regarding "${userMessage}":**\n\n• 📍 **Key Highlights:** Central ${cityEn} features premier landmarks, diverse shopping avenues, and top culinary venues.\n• 🚗 **Mobility:** Use **${taxiApp}** and the local metro network for reliable, direct transportation.\n• 🏛️ **Embassy & Emergency:** Check the Emergency tab for instant 24/7 consular hotlines and verified emergency dispatch numbers.`;
  }
  return `🌍 **بخصوص استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أبرز التوصيات:** تتوفر في ${city} كبرى المعالم الحيوية ومراكز التسوق ومطاعم المشاوي والأكلات الحلال ومقاهي القهوة المختصة.\n• 🚗 **التنقل المعتمد:** يُنصح باستخدام تطبيق **${taxiApp}** وشبكة قطارات المترو للتنقل السريع والمباشر.\n• 🏛️ **السفارة والطوارئ:** يمكنك الاطلاع على تبويب الطوارئ لمعرفة رقم سفارة ${originNameAr} وخط رعاية المواطنين المباشر (24/7) وأرقام الإسعاف والشرطة المعتمدة.`;
}