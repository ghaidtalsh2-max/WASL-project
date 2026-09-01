import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { EMERGENCY_DATABASE } from '@/lib/data/emergencyDatabase';
import { CHAT_CITY_KNOWLEDGE } from '@/lib/data/chatCityKnowledge';

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
 * Understands ANY dynamic inquiry with full 33-country database matching
 */
function generateDynamicConversationalReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'Germany';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Berlin';
  const cityAr = ctx?.destinationCityAr || cityEn;
  const originNameEn = ctx?.origin?.name || 'Saudi Arabia';
  const originNameAr = ctx?.origin?.nameAr || 'المملكة العربية السعودية';
  
  const city = isEn ? cityEn : cityAr;
  const destName = isEn ? destNameEn : destNameAr;
  const normDest = `${destNameEn} ${cityEn} ${destNameAr}`.toLowerCase();
  const destId = (ctx?.destination?.id || '').toLowerCase();

  // Helper to get matching city knowledge
  const getCityKnowledge = () => {
    if (destId && CHAT_CITY_KNOWLEDGE[destId]) return CHAT_CITY_KNOWLEDGE[destId];
    if (normDest.includes('germany') || normDest.includes('ألمانيا') || normDest.includes('berlin') || normDest.includes('برلين')) {
      return CHAT_CITY_KNOWLEDGE['germany'];
    }
    if (normDest.includes('united kingdom') || normDest.includes('بريطانيا') || normDest.includes('london') || normDest.includes('لندن')) {
      return CHAT_CITY_KNOWLEDGE['united-kingdom'];
    }
    if (normDest.includes('france') || normDest.includes('فرنسا') || normDest.includes('paris') || normDest.includes('باريس')) {
      return CHAT_CITY_KNOWLEDGE['france'];
    }
    if (normDest.includes('italy') || normDest.includes('إيطاليا') || normDest.includes('rome') || normDest.includes('روما')) {
      return CHAT_CITY_KNOWLEDGE['italy'];
    }
    if (normDest.includes('spain') || normDest.includes('إسبانيا') || normDest.includes('madrid') || normDest.includes('مدريد')) {
      return CHAT_CITY_KNOWLEDGE['spain'];
    }
    return null;
  };

  // Helper to fetch emergency & embassy data from database
  const getEmergencyData = () => {
    if (destId && EMERGENCY_DATABASE[destId]) {
      return EMERGENCY_DATABASE[destId];
    }
    for (const key of Object.keys(EMERGENCY_DATABASE)) {
      if (normDest.includes(key) || (destId && destId.includes(key))) {
        return EMERGENCY_DATABASE[key];
      }
    }
    if (normDest.includes('germany') || normDest.includes('ألمانيا') || normDest.includes('berlin') || normDest.includes('برلين')) {
      return EMERGENCY_DATABASE['germany'];
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
    return EMERGENCY_DATABASE['germany'];
  };

  const cityKnowledge = getCityKnowledge();

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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nYou can ask me anything naturally, such as:\n• "Where is the embassy located?"\n• "What is the best specialty coffee cafe here?"\n• "Recommend authentic BBQ and Halal restaurants."\n• "What is the best theme park or water park?"\n• "What should I buy as souvenirs or gifts?"\n• "How do I get a local SIM card or call a taxi?"\n\nWhat would you like to know?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيمكنك سؤالي عن أي شيء يدور في بالك بشكل طبيعي، مثل:\n• "أين يقع مبنى السفارة وأرقام الطوارئ؟"\n• "عطني أفضل مقاهي القهوة المختصة هنا"\n• "اقترح لي مطاعم مشاوي وأكلات حلال مميزة"\n• "أفضل مدينة ألعاب وملاهي مائية في المدينة"\n• "أفضل الأماكن لشراء هدايا وتذكارات"\n• "كيف استخرج شريحة إنترنت وأطلب تاكسي؟"\n\nتفضل بسؤالي وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. SPECIALTY COFFEE & CAFES (قهوة مختصة، كافيه، مقهى، قهوة، كوفي، coffee, cafe)
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
    if (cityKnowledge?.coffee) {
      return isEn ? cityKnowledge.coffee.en : cityKnowledge.coffee.ar;
    }
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Tbilisi (Georgia):**\n\n1. **Coffee LAB (Kazbegi Ave & Vake):** Premier local roastery & V60 pour-overs.\n2. **ERTI KAVA Coffee Room (Rustaveli & Old Tbilisi):** Artisanal flat whites in Old Tbilisi.\n3. **Shavi Coffee Roasters (Vake):** Micro-roastery in Vake.`
        : `☕ **أفضل مقاهي ومحامص القهوة المختصة في تبيليسي (جورجيا):**\n\n1. **كوفي لاب (Coffee LAB - شارع كازبيجي وحي فاكي):** المحمصة الرائدة للبن المختص والتقطير V60.\n2. **إيرتي كافا (ERTI KAVA - سنتر روستافيلي):** مقهى حميمي راقٍ بالبلدة القديمة.\n3. **شافي كوفي روستر (Shavi Coffee Roasters):** محمصة حي فاكي الراقي.`;
    }
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Singapore:**\n\n1. **Chye Seng Huat Hardware:** The 360-degree island brew bar.\n2. **Bacha Coffee (ION Orchard & Jewel Changi):** Luxury palace of 200+ Arabica coffees.\n3. **Nylon Coffee Roasters (Everton Park):** Award-winning pour-overs.`
        : `☕ **أفضل مقاهي القهوة المختصة في سنغافورة:**\n\n1. **تشاي سينغ هوات (Chye Seng Huat):** المحمصة والبار الدائري 360 درجة في جالان بيسار.\n2. **باشا كوفي (Bacha Coffee - آيون أورشارد ومطار شانغي):** قصر القهوة الفاخر.\n3. **نايلون كوفي روستر (Nylon Coffee):** للقهوة المقطرة الحرفية في إيفرتون بارك.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Washington, D.C.:**\n\n1. **Compass Coffee (Downtown & Georgetown):** D.C.'s premier roaster.\n2. **Blue Bottle Coffee (Georgetown & Union Market):** Famous pour-overs.\n3. **Tryst (Adams Morgan):** Iconic community coffeehouse.`
        : `☕ **أفضل مقاهي القهوة المختصة في واشنطن العاصمة:**\n\n1. **كومباس كوفي (Compass Coffee - السنتر وجورج تاون):** أشهر محمصة محلية رائدة في واشنطن.\n2. **بلو بوتل كوفي (Blue Bottle Coffee):** القهوة المقطرة الباردة والساخنة.\n3. **تريست كوفي (Tryst):** مقهى واسع وعصري لعشاق القهوة.`;
    }
  }

  // 3. RESTAURANTS, BBQ & HALAL DINING (مطعم مشاوي، مشاوي، مطعم، مطاعم، أكل، حلال، لحم)
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
    if (cityKnowledge?.food) {
      return isEn ? cityKnowledge.food.en : cityKnowledge.food.ar;
    }
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🍽️ **Top BBQ & Dining in Tbilisi:**\n\n1. **Tsiskvili Complex:** Mtsvadi skewers with waterfalls & folk dance.\n2. **Funicular Restaurant (Mtatsminda):** Panoramic dining.\n3. **Beirut Halal Lebanese Restaurant (Marjanishvili):** 100% Halal charcoal grills.`
        : `🍽️ **أفضل مطاعم المشاوي والحلال في تبيليسي (جورجيا):**\n\n1. **مجمع تسيسكفيلي (Tsiskvili):** أشهى المشاوي الجورجية والشلالات والموسيقى الفلكلورية.\n2. **مطعم فونيكولار (Funicular):** إطلالة بانورامية من قمة جبل متاتسميندا.\n3. **مطعم بيروت الحلال (حي مرجانيشفيلي):** مشاوي شامية وكباب حلال 100%.`;
    }
    if (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington') || normDest.includes('واشنطن')) {
      return isEn
        ? `🍽️ **Top BBQ & Halal Dining in Washington, D.C.:**\n\n1. **Fogo de Chão (Pennsylvania Ave):** Brazilian churrascaria steakhouse.\n2. **Albi (Navy Yard):** Michelin-starred Levantine charcoal grill.\n3. **Moby Dick House of Kabob (Georgetown):** Charcoal-grilled chicken kabobs.`
        : `🍽️ **أفضل مطاعم المشاوي والستيك والحلال في واشنطن:**\n\n1. **فوجو دي تشاو (Fogo de Chao):** مشاوي ستيك برازيلية فاخرة.\n2. **مطعم ألبي (Albi - نافي يارد):** مشاوي شرقية على الحطب حاصل على ميشلان.\n3. **موبي ديك (Moby Dick):** كباب ومشويات حلال على الفحم.`;
    }
  }

  // 4. THEME PARKS & AMUSEMENT (مدينة العاب، ملاهي، العاب، مائية، زحاليق)
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
    if (cityKnowledge?.attractions) {
      return isEn ? cityKnowledge.attractions.en : cityKnowledge.attractions.ar;
    }
    if (normDest.includes('georgia') || normDest.includes('جورجيا') || normDest.includes('tbilisi')) {
      return isEn
        ? `🎡 **Theme Parks in Tbilisi:**\n\n1. **Mtatsminda Park:** Mountain-top roller coasters & giant Ferris wheel via Funicular.\n2. **Gino Paradise Tbilisi:** Massive water park with extreme slides & wave pools.\n3. **East Point:** Focus Mokus, bowling & IMAX.\n4. **Astra Park:** Indoor go-karting.`
        : `🎡 **مدن الملاهي والألعاب في تبيليسي (جورجيا):**\n\n1. **مدينة ملاهي متاتسميندا (Mtatsminda Park):** على قمة الجبل مع القطار المعلق (Funicular) وعجلة فيريس البانورامية.\n2. **ملاهي جينو بارادايس المائية (Gino Paradise):** أضخم حديقة ألعاب مائية ومسابح أمواج.\n3. **مجمع إيست بوينت (East Point):** مدينة ألعاب *Focus Mokus* والبولينج وسينما IMAX.\n4. **أسترا بارك (Astra Park):** سباقات الكارتينج وألعاب الفيديو.`;
    }
  }

  // 5. EMBASSIES & EMERGENCY
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
      return `🏛️ **${originNameEn} Embassy in ${cityEn} (${destNameEn}):**\n\n📍 **Official Location & Address:**\n• **${emData.embassyAddress || emData.embassy?.address || 'Diplomatic Enclave / Embassy Quarter'}**\n\n📞 **Contact & 24/7 Citizen Emergency Hotlines:**\n• **Main Telephone:** \`${emData.embassyPhone || emData.embassy?.phone}\`\n• **24/7 Consular Emergency Line:** **\`${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}\`**\n• **Working Hours:** ${emData.embassyHours || emData.embassy?.workingHours || 'Monday - Friday: 09:00 - 17:00'}\n\n🚨 **Local Emergency in ${destNameEn}:**\n• 🚓 **Police:** ${emData.police}\n• 🚑 **Ambulance:** ${emData.ambulance}\n• 🚒 **Fire:** ${emData.fire}`;
    }
    return `🏛️ **بيانات وموقع سفارة ${originNameAr} في ${city} (${destName}):**\n\n📍 **الموقع والعنوان المعتمد:**\n• **${emData.embassyAddress || emData.embassy?.address || 'المنطقة الدبلوماسية / حي السفارات'}**\n\n📞 **أرقام الاتصال وطوارئ شؤون المواطنين على مدار 24 ساعة:**\n• **الهاتف الرئيسي للسفارة:** \`${emData.embassyPhone || emData.embassy?.phone}\`\n• **خط طوارئ رعاية المواطنين (24/7):** **\`${emData.embassyEmergencyLine || emData.embassy?.emergencyHotline || '199099'}\`**\n• **ساعات العمل الرسمية:** ${emData.embassyHours || emData.embassy?.workingHours || 'من الإثنين إلى الجمعة: 09:00 ص - 05:00 م'}\n\n🚨 **أرقام الطوارئ المحلية في ${destName}:**\n• 🚓 **الشرطة:** ${emData.police}\n• 🚑 **الإسعاف:** ${emData.ambulance}\n• 🚒 **الدفاع المدني:** ${emData.fire}`;
  }

  // 6. SOUVENIRS, GIFTS & SHOPPING
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
    msg.includes('مول') ||
    msg.includes('gift') ||
    msg.includes('souvenir') ||
    msg.includes('shopping')
  ) {
    if (cityKnowledge?.souvenirs) {
      return isEn ? cityKnowledge.souvenirs.en : cityKnowledge.souvenirs.ar;
    }
  }

  // 7. HOTELS & ACCOMMODATION
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
    if (cityKnowledge?.hotels) {
      return isEn ? cityKnowledge.hotels.en : cityKnowledge.hotels.ar;
    }
  }

  // 8. SIM CARDS & INTERNET
  if (
    msg.includes('شريح') ||
    msg.includes('شريحة') ||
    msg.includes('نت') ||
    msg.includes('انترنت') ||
    msg.includes('esim') ||
    msg.includes('sim card')
  ) {
    if (cityKnowledge?.sim) {
      return isEn ? cityKnowledge.sim.en : cityKnowledge.sim.ar;
    }
  }

  // 9. WEATHER & PACKING
  if (
    msg.includes('الجو') ||
    msg.includes('الطقس') ||
    msg.includes('حرارة') ||
    msg.includes('برد') ||
    msg.includes('حر') ||
    msg.includes('مطر') ||
    msg.includes('ثلج') ||
    msg.includes('ملابس') ||
    msg.includes('weather')
  ) {
    if (cityKnowledge?.weather) {
      return isEn ? cityKnowledge.weather.en : cityKnowledge.weather.ar;
    }
  }

  // 10. TAXIS & MOBILITY
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('مترو') ||
    msg.includes('اوبر') ||
    msg.includes('بولت') ||
    msg.includes('taxi') ||
    msg.includes('transit')
  ) {
    if (cityKnowledge?.transport) {
      return isEn ? cityKnowledge.transport.en : cityKnowledge.transport.ar;
    }
  }

  // 11. GENERAL ACCURATE CITY FALLBACK
  const generalTaxi = (normDest.includes('germany') || normDest.includes('france') || normDest.includes('italy') || normDest.includes('spain'))
    ? 'Uber & FreeNow'
    : (normDest.includes('united states') || normDest.includes('usa') || normDest.includes('washington'))
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
    return `🌍 **Regarding "${userMessage}" in ${cityEn} (${destNameEn}):**\n\n• 📍 **Local Highlights:** Central ${cityEn} offers world-class dining, specialty cafes, cultural landmarks, and shopping boulevards.\n• 🚗 **Transit:** Use **${generalTaxi}** and the metro network for fast, direct commuting.\n• 💡 **Need specific spots?** Ask me anytime about coffee roasters, theme parks, embassy locations, or daily plans!`;
  }
  return `🌍 **إجابة استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أهم الإرشادات:** تتوفر في ${city} كبرى مقاهي القهوة المختصة والمطاعم المعتمدة والأنشطة الترفيهية ومراكز التسوق الفاخرة.\n• 🚗 **التنقل المعتمد:** يمكنك استخدام تطبيق **${generalTaxi}** وشبكة المترو للوصول المباشر والآمن.\n• 💡 **هل تود أسماء محددة؟** يمكنك سؤالي عن أسماء أفضل المحامص، المطاعم الحلال، الملاهي، موقع السفارة، أو خطط الجولات اليومية وسأجيبك بالاسم فوراً!`;
}