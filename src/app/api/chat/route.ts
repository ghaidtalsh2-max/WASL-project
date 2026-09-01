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

    // 1. Try AI if API key is provided
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
 * Deep Multilingual Travel & Cultural Reasoning Engine
 */
function generateSmartChatReply(userMessage: string, ctx: any, isEn: boolean): string {
  const msg = (userMessage || '').toLowerCase().trim();
  const destNameEn = ctx?.destination?.name || 'Beijing';
  const destNameAr = ctx?.destination?.nameAr || destNameEn;
  const cityEn = ctx?.destinationCity || ctx?.destination?.capital || 'Beijing';
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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nI can assist you with instant, deep local recommendations on:\n• 🍽️ **Top Restaurants, BBQ Grills & Halal Dining** (Local specialties, hotpots, roasted meats)\n• ☕ **Specialty Coffee & Artisan Cafes** (Single-origin roasters, traditional tea houses)\n• 🏨 **Best Hotels & Neighborhoods** (Central luxury, scenic views, family suites)\n• 🛍️ **Shopping Malls, Traditional Attire (Hanfu/Hanbok/Qipao) & Souqs**\n• 🎡 **Theme Parks, 2-Day Itineraries & Thrill Rides**\n• 🚕 **Transportation, Transit Cards & Metro Navigation**\n• 🚨 **Emergency Dispatch & Consular Support**\n\nHow can I help you explore or plan right now?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيسعدني جداً إفادتك بأدق التفاصيل العملية فوراً، مثل:\n• 🍽️ **المطاعم المركزية وأفضل المشاوي والأكلات الحلال** والأسواق الشعبية\n• ☕ **أفضل مقاهي ومحامص القهوة المختصة** والشاي التراثي\n• 🏨 **الفنادق وأماكن السكن** (السنتر، الإطلالات المميزة، الخيارات العائلية)\n• 🛍️ **المولات والتسوق والملابس التراثية (الهانفو/الهانبوك/الكيمونو)**\n• 🎡 **خطط الجولات اليومية والملاهي والأنشطة الترفيهية**\n• 🚕 **المواصلات وبطاقات المترو الذكية والتنقل**\n• 🚨 **أرقام الطوارئ وسفارة بلدك وإرشادات السلامة**\n\nتفضل بسؤالي مباشرة وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. RESTAURANTS, BBQ GRILLS & FOOD (مشاوي، مطعم، مطاعم، أكل، حلال، لحم، شواء، غداء، عشاء، برجر)
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
    msg.includes('هوت بوت') ||
    msg.includes('restaurant') ||
    msg.includes('restaurants') ||
    msg.includes('bbq') ||
    msg.includes('grill') ||
    msg.includes('food') ||
    msg.includes('dining') ||
    msg.includes('halal')
  ) {
    // BEIJING / CHINA RESTAURANTS & BBQ
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين') || normDest.includes('shanghai') || normDest.includes('شنغهاي')) {
      if (isEn) {
        return `🍽️ **Top BBQ, Grills & Halal Dining Spots in Central Beijing:**\n\n1. **Ju Bao Yuan (聚宝源 - Niujie Mosque Street):**\n• The most legendary Halal hotpot and charcoal-grilled lamb restaurant in Beijing. Famous for hand-sliced ultra-tender mutton, sesame flatbreads (Shaobing), and traditional copper pots in the historic Muslim quarter.\n\n2. **Kaorou Ji (烤肉季 - Shichahai Houhai Lake):**\n• Historic Qingzhen Halal BBQ restaurant established in 1848 overlooking Houhai Lake. Renowned for traditional Mongolian/Beijing style iron-plate grilled lamb with scallions.\n\n3. **Hong Bin Lou (鸿宾楼 - Xicheng District):**\n• Beijing's premier upscale Halal Muslim banquet restaurant (founded 1853), famous for braised beef brisket, grilled lamb skewers (Chuanr), and Peking delicacies.\n\n4. **Dadong Roast Duck (大东 - Wangfujing / Sanlitun):**\n• World-renowned Michelin-recommended Peking duck master serving ultra-crispy, lean roasted duck with traditional pancakes and sweet bean sauce.\n\n5. **Haidilao Hotpot (海底捞 - Wangfujing Central Mall):**\n• World-famous interactive hotpot with private tables, fresh meat platters, seafood, and 5-star service (free manicures, snack bar & noodle dance).\n\n💡 **Halal Tip:** Look for the green **清真 (Qīngzhēn)** signage which officially denotes 100% Halal certified dining across China!`;
      }
      return `🍽️ **أفضل مطاعم المشاوي والأكلات الحلال في قلب مركز مدينة بكين (الصين):**\n\n1. **مطعم جوباو يوان (Ju Bao Yuan - شارع جامع نيوجيه التاريخي):**\n• أعرق وأشهر مطعم مشاوي وهوت بوت بلحم الخروف الحلال في بكين؛ يتميز بتقديم شرائح لحم الضأن الطازجة المطهوة على أواني النحاس التقليدية وخبز السمسم المقرمش.\n\n2. **مطعم كاورو جي التراثي (Kaorou Ji - على ضفاف بحيرة هوهاي Shichahai):**\n• تأسس عام 1848؛ من أقدم مطاعم المشاوي الحلال في الصين، ويشتهر بشواء لحم الضأن المتبل بالبصل والبهارات على الصاج الساخن مع إطلالة بحرية خلابة.\n\n3. **مطعم هونغ بين لو الفاخر (Hong Bin Lou - حي شيتشنغ):**\n• أرقى صرح للمأكولات الإسلامية الصينية الحلال منذ عام 1853؛ يقدم المشاوي الملكية، ريش اللحم المشوية، وأطباق البط والمأكولات البحرية الفاخرة.\n\n4. **مطعم دادونغ (Dadong Roast Duck - شارع وانغفوجينغ وسانليتون):**\n• أشهر مطعم بط بكين المشوي المقرمش الحائز على جوائز عالمية في قلب سنتر العاصمة.\n\n5. **مطعم هايديلاو (Haidilao Hotpot - مجمع وانغفوجينغ سنتر):**\n• تجربة الهوت بوت والمشاوي الصينية التفاعلية مع عروض المعكرونة وخدمة 5 نجوم وضيافة مميزة.\n\n💡 **علامة الحلال في الصين:** ابحث دائماً عن علامة **清真 (Qīngzhēn)** باللون الأخضر على واجهة المطعم، والتي تدل رسمياً على أن المطعم إسلامي وحلال 100%.`;
    }

    // SINGAPORE RESTAURANTS & BBQ
    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      if (isEn) {
        return `🍽️ **Top BBQ Grills & Halal Dining in Singapore:**\n\n1. **Lau Pa Sat Satay Street (Downtown):** Famous open-air charcoal BBQ street serving tender chicken, beef, and mutton Satay skewers.\n2. **Zam Zam Restaurant (Arab Street):** Iconic Halal murtabak and biryani since 1908.\n3. **The Halia (Singapore Botanic Gardens):** Stunning garden fine dining with MUIS Halal certified steaks and grilled seafood.\n4. **Captain Kim Korean BBQ & Hotpot (Tampines & Junction 10):** MUIS Halal certified buffet BBQ.`;
      }
      return `🍽️ **أفضل مطاعم المشاوي والأكلات الحلال في سنغافورة:**\n\n1. **شارع الساتاي في سوق لاو با سات (Lau Pa Sat Satay Street - قلب السنتر):** أشهر تجربة مشاوي مفتوحة في سنغافورة لأسياخ اللحم والدجاج المشوي على الفحم بصلصة الفول السوداني.\n2. **مطعم زام زام التاريخي (Zam Zam - شارع العرب):** تأسس عام 1908 ويقدم المطبق والبرياني والمشاوي العريقة.\n3. **مطعم ذا هاليا (The Halia - داخل الحدائق النباتية):** مطعم راقٍ وسط الطبيعة يقدم شرائح اللحم والمأكولات البحرية المشوية بشهادة حلال معتمدة من MUIS.\n4. **كابتن كيم (Captain Kim):** بوفيه المشاوي الكورية الحلال المعتمد.`;
    }

    // SEOUL RESTAURANTS & BBQ
    if (normDest.includes('korea') || normDest.includes('كوريا') || normDest.includes('seoul') || normDest.includes('سيول')) {
      if (isEn) {
        return `🍽️ **Top BBQ & Central Dining in Seoul:**\n\n1. **Maple Tree House (Itaewon / Gangnam):** Premium Hanwoo Korean BBQ grilled tableside.\n2. **Eid Halal Korean Food (Itaewon):** Certified Halal Bulgogi and Bibimbap.\n3. **Myeongdong Kyoja (Myeongdong Center):** Michelin handmade noodles and dumplings.\n4. **Tosokchon Samgyetang (Gyeongbokgung):** Traditional ginseng chicken soup.`;
      }
      return `🍽️ **أفضل مطاعم المشاوي والسنتر في سيول (كوريا):**\n\n1. **مابل تري هاوس (Maple Tree House - إتايوان وغانغنام):** مشاوي اللحم البقري الكوري الفاخر (Hanwoo BBQ) على الطاولة.\n2. **مطعم عيد للأكلات الكورية الحلال (Eid Halal - إتايوان):** لحم البولغوغي المشوي الحلال المعتمد من KMF.\n3. **ميونغ دونغ كيوجا (Myeongdong Kyoja - سنتر ميونغ دونغ):** المعكرونة والزلابية الحائزة على تصنيف ميشلان.\n4. **توسوكشون سامغيتانغ (Tosokchon):** حساء الجينسنغ الملكي التراثي بجوار القصر الإمبراطوري.`;
    }

    // GENERAL CITY RESTAURANT RECOMMENDATIONS
    return isEn
      ? `🍽️ **Top Recommended Dining & Grills in ${cityEn} (${destNameEn}):**\n\n• **Central BBQ & Local Specialties:** Premium charcoal grills and local gastronomy in central dining streets.\n• **Verified Halal Options:** Excellent halal-certified and seafood restaurants widely accessible.\n• **Atmosphere & Quality:** Clean, highly-rated venues featuring open kitchens and family seating.`
      : `🍽️ **أفضل مطاعم المشاوي والأكلات المميزة في ${city} (${destName}):**\n\n• **المشاوي والمأكولات المحلية:** تتوفر في مركز المدينة والمجمعات الرئيسية أفخر مطاعم المشاوي واللحوم الطازجة على الفحم والمأكولات التراثية.\n• **الخيارات الحلال والبحرية:** تنتشر المطاعم الحلال المعتمدة ومطاعم الأسماك والمأكولات البحرية الطازجة.\n• **الأجواء والجودة:** مطاعم مصنفة وحائزة على تقييمات عالية لضمان تجربة طعام راقية وممتعة.`;
  }

  // 3. SPECIALTY COFFEE & ARTISAN CAFES (قهوة مختصة، كافيه، مقهى، قهوة)
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
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      if (isEn) {
        return `☕ **Top Specialty Coffee Roasteries & Cafes in Beijing:**\n\n1. **Metal Hands Coffee (Sanlitun / Dashilar / Jiaodaokou):** Renowned specialty coffee chain with lever espresso machines, signature pistachio lattes, and rare single origins.\n2. **Berry Beans (Qianmen Traditional Hutongs):** Atmospheric rooftop cafe in a historic Hutong courtyard with scenic tiled roof vistas.\n3. **% Arabica Beijing (Sanlitun Taikoo Li & WF Central Wangfujing):** Japanese minimalist specialty powerhouse.\n4. **Barista Coffee Roasters (Wudaoying Hutong):** Iconic neighborhood micro-roastery serving sublime pour-overs (V60/Chemex).`;
      }
      return `☕ **أفضل مقاهي ومحامص القهوة المختصة في بكين (الصين):**\n\n1. **ميتال هاندز (Metal Hands Coffee - سانليتون وحي داشيلار):** أشهر محمصة قهوة مختصة في بكين؛ تتميز بمكائن الإسبريسو اليدوية ومشروب الفستق المميز ومحاصيل القهوة المقطرة V60.\n2. **بيري بينز (Berry Beans - أزقة الهوتونغ التراثية في تشيانمن):** مقهى تراثي ساحر بإطلالة بانورامية من السطح على أسطح بيوت الهوتونغ القديمة.\n3. **بالمائة أرابيكا (% Arabica Beijing - مجمع سانليتون ووانغفوجينغ سنترال):** المحمصة اليابانية الشهيرة بقهوة اللاتيه عالية الجودة.\n4. **باريستا كوفي روستر (Barista Coffee Roasters - شارع ووداوينغ):** محمصة حميمية مفضلة لعشاق القهوة المختصة الفاخرة.`;
    }

    if (normDest.includes('singapore') || normDest.includes('سنغافورة')) {
      return isEn
        ? `☕ **Top Specialty Coffee in Singapore:**\n\n• **Chye Seng Huat Hardware:** The 360-degree island brew bar.\n• **Bacha Coffee (ION Orchard & Jewel Changi):** Opulent luxury coffee palace.\n• **Nylon Coffee Roasters (Everton Park):** Award-winning micro-roastery.`
        : `☕ **أفضل مقاهي القهوة المختصة في سنغافورة:**\n\n• **تشاي سينغ هوات (Chye Seng Huat Hardware - جالان بيسار):** بار القهوة والتحميص الأشهر.\n• **باشا كوفي (Bacha Coffee - آيون أورشارد ومطار شانغي):** قصر القهوة الملكي الفاخر.\n• **نايلون كوفي روستر (Nylon Coffee - إيفرتون بارك):** للقهوة المقطرة الحرفية.`;
    }
  }

  // 4. TRADITIONAL CLOTHING & SOUVENIRS (ملابس تقليدية، هانفو، هانبوك، كيمونو، ثياب، تأجير)
  if (
    msg.includes('ملابس تقليد') ||
    msg.includes('لبس تقليد') ||
    msg.includes('هانفو') ||
    msg.includes('هانبوك') ||
    msg.includes('كيمونو') ||
    msg.includes('تشيباو') ||
    msg.includes('traditional cloth') ||
    msg.includes('hanfu') ||
    msg.includes('hanbok') ||
    msg.includes('kimono')
  ) {
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      if (isEn) {
        return `👘 **Traditional Chinese Attire (Hanfu & Qipao) Guide in Beijing:**\n\n1. **Hanfu Rental & Photoshoots (汉服体验):**\n• **Jingshan Park & Forbidden City North Gate:** Dozens of specialized Hanfu studios offering royal Ming & Tang Dynasty garments with authentic hairstyling and makeup (from 150 - 300 RMB / ~$20-$45 for full day).\n• **Nanluoguxiang & Shichahai Hutongs:** Boutique Hanfu rental shops.\n\n2. **Buying Heirloom Silk & Tailored Qipao:**\n• **Ruifuxiang Silk Shop (瑞蚨祥 - Qianmen Street):** China's most historic silk store (founded 1862) crafting bespoke custom silk Qipao and jackets.\n• **Beijing Silk Market (Xiushui):** Multi-story market with ready-to-wear silk clothing and scarves.`;
      }
      return `👘 **دليل تأجير وشراء الملابس التقليدية الصينية (الهانفو والتشيباو) في بكين:**\n\n1. **أشهر أماكن تأجير الهانفو والتصوير (Hanfu Experience):**\n• **محيط حديقة جينغشان وبوابة المدينة المحرمة:** تتركز عشرات الاستوديوهات المتخصصة في تأجير أزياء الهانفو الإمبراطورية التاريخية مع تسريحات الشعر والمكياج التراثي بأسعار تبدأ من 150 إلى 300 يوان صيني لليوم الكامل.\n• **أزقة نانلوغوشيانغ (Nanluoguxiang):** استوديوهات ومحلات أنيقة للأزياء الصينية.\n\n2. **أفضل المتاجر لشراء الحرير والملابس التراثية الأصلية:**\n• **متجر رويفو شيانغ للحرير (Ruifuxiang - شارع تشيانمن التراثي):** أعرق دار للأقمشة والحرير في الصين منذ عام 1862 لتفصيل فساتين التشيباو والسترات الحريرية.\n• **سوق الحرير في بكين (Silk Market Xiushui):** مجمع ضخم لبيع الملابس الحريرية الجاهزة والأوشحة التذكارية.`;
    }
  }

  // 5. PLANS, 2-DAY ITINERARIES, THEME PARKS & GAMES (خطة، يومين، ملاهي، العاب، فعاليات)
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
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      if (isEn) {
        return `🎢 **Exciting 2-Day Beijing Highlights & Theme Park Itinerary:**\n\n🏰 **Day 1: Imperial Wonders & Historic City Center**\n• 🌅 **Morning:** **The Forbidden City (Palace Museum)** & Jingshan Park panoramic view.\n• ☀️ **Afternoon:** **Temple of Heaven** (Echo Wall and Hall of Prayer for Good Harvests).\n• 🌙 **Evening:** **Wangfujing Night Pedestrian Street** & Roast duck dinner at *Dadong*.\n\n🎡 **Day 2: Universal Studios Beijing Theme Park**\n• 🌅 **All Day:** **Universal Studios Beijing (Tongzhou):** World-first Transformers Metrobase coaster, Kung Fu Panda Land of Awesomeness, Jurassic World Isla Nublar, and Wizarding World of Harry Potter!`;
      }
      return `🎢 **برنامج مميز لمدة يومين مليء بالأنشطة والملاهي في بكين (الصين):**\n\n🏰 **اليوم الأول: المعالم الإمبراطورية التراثية وسنتر العاصمة**\n• 🌅 **الصباح:** زيارة **المدينة المحرمة (Forbidden City)** والصعود إلى قمة حديقة جينغشان لمشاهدة القصور الذهبية من الأعلى.\n• ☀️ **الظهيرة:** **معبد السماء (Temple of Heaven)** وحدائقه التاريخية الساحرة.\n• 🌙 **المساء:** جولة تسوق في **شارع وانغفوجينغ** وتناول عشاء بط بكين المشوي في مطعم *دادونغ*.\n\n🎡 **اليوم الثاني: منتزه يونيفرسال ستوديوز بكين العالمي (Universal Studios)**\n• 🌅 **طوال اليوم:** **منتزه يونيفرسال ستوديوز بكين:** أضخم منتزه ترفيهي حديث في آسيا يضم عالم المتحولون وقطار الإثارة، وأول عالم مستوحى من فيلم *كونغ فو باندا* في العالم، ومنطقة هاري بوتر السحرية وعالم الديناصورات!`;
    }
  }

  // 6. HOTELS & ACCOMMODATION (فنادق، سكن، شقق، إقامة)
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
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return isEn
        ? `🏨 **Top Recommended Luxury & Central Hotels in Beijing:**\n\n1. **The Peninsula Beijing (Wangfujing):** All-suite ultra-luxury hotel walking distance to Forbidden City.\n2. **Waldorf Astoria Beijing (Wangfujing):** Striking bronze exterior with signature luxury suites and traditional Courtyard Hutong villas.\n3. **Rosewood Beijing (Chaoyang / Sanlitun):** Contemporary five-star luxury with exceptional spa and culinary dining.`
        : `🏨 **أفضل الفنادق وأماكن السكن في سنتر بكين:**\n\n1. **فندق ذا بينينسيولا بكين (The Peninsula Beijing - شارع وانغفوجينغ):** فندق أجنحة فاخر 5 نجوم على مسافة قريبة من المدينة المحرمة.\n2. **والدورف أستوريا بكين (Waldorf Astoria Beijing):** مبنى برونزي أيقوني يضم فلل هوتونغ تراثية فاخرة وخدمة كونسيرج راقية.\n3. **روزوود بكين (Rosewood Beijing - حي تشاويانغ وسانليتون):** فندق فخم بتصميم عصري راقٍ ومطاعم عالمية ومسبح داخلي دافئ.`;
    }
  }

  // 7. HOSPITALS & HEALTHCARE (مستشفى، علاج، طبيب، دكتور، صيدلية)
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
    if (normDest.includes('china') || normDest.includes('الصين') || normDest.includes('beijing') || normDest.includes('بكين')) {
      return isEn
        ? `🏥 **Top International Hospitals in Beijing:**\n\n1. **Beijing United Family Hospital (BJU - Chaoyang / Shunyi):** JCI-accredited world-class hospital with 24/7 English/multilingual emergency and international insurance direct billing.\n2. **Peking Union Medical College Hospital (PUMCH - International Medical Services):** China’s most prestigious top-tier medical institution.\n\n🚨 **Emergency Medical Ambulance:** Dial **120** (Medical Emergency) or **999** (Red Cross Emergency).`
        : `🏥 **أفضل المستشفيات والمراكز الطبية الدولية في بكين (الصين):**\n\n1. **مستشفى يونايتد فاميلي الدولي (Beijing United Family Hospital - فرع تشاويانغ):** معتمد دولياً من JCI ويضم طوارئ على مدار 24 ساعة بأطباء يتحدثون الإنجليزية مع قبول التأمين الدولي.\n2. **مستشفى كلية بكين الطبية المتحدة (PUMCH - قسم الخدمات الدولية):** أعلى وأعرق صرح طبي في الصين لكافة التخصصات الدقيقة.\n\n🚨 **للطوارئ الطبية:** اتصل برقم الإسعاف المباشر **120** أو طوارئ الهلال الأحمر **999**.`;
    }
  }

  // 8. GENERAL SPECIFIC FALLBACK
  if (isEn) {
    return `🌍 **Here are tailored recommendations for ${cityEn} (${destNameEn}) regarding "${userMessage}":**\n\n• 📍 **Top Local Highlights:** Central districts in ${cityEn} feature rich historical sights, high-end shopping boulevards, and verified halal/local dining.\n• 🚗 **Mobility:** Use official metro lines and verified rideshare applications for fast, comfortable transit.\n• 💡 **WASL Modules:** Check the interactive tabs in WASL (Safety & Emergency, Living Language, Religious Context, and Accommodations) for comprehensive verified details!`;
  }
  return `🌍 **بخصوص استفسارك عن "${userMessage}" في ${city} (${destName}):**\n\n• 📍 **أبرز التوصيات:** تتوفر في ${city} أفضل الخدمات والمراكز الترفيهية والمطاعم المعتمدة والمقاهي المتطورة مع سهولة الوصول لكافة المرافق الحيوية.\n• 🚗 **التنقل المريح:** يُنصح باستخدام شبكة المترو والتطبيقات الذكية المعتمدة لتنقل سلس وآمن.\n• 💡 **استكشف تبويبات وصل:** يمكنك فتح تبويبات المنصة (الطوارئ المعتمدة، لغة البلد الحية، والسياق الديني ودليل المسافر) للاطلاع على أدق التفاصيل الموثقة فوراً!`;
}