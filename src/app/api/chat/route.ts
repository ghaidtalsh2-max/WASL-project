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
      return `Hello and welcome! 🌟\n\nI am your personal WASL AI Companion for your journey to **${cityEn} (${destNameEn})**.\n\nI can assist you with instant, deep local recommendations on:\n• 🍽️ **Top Restaurants, Cafes & Halal Dining** (Local cuisine, burgers, Middle Eastern)\n• 🏨 **Best Hotels & Neighborhoods** (Central luxury, scenic views, family suites)\n• 🛍️ **Open-Air Malls, Traditional Souqs & Boutiques**\n• 🚕 **Transportation, Rideshare (Uber/Careem/Grab) & Metro Navigation**\n• 🎓 **Universities, Medical Centers & Relocation Services**\n• 🚨 **Emergency Lines, Consular Support & Local Safety Tips**\n\nHow can I help you explore or plan right now?`;
    }
    return `وعليكم السلام ورحمة الله وبركاته! 🌟\n\nأهلاً بك! أنا مساعدك الذكي المباشر لرحلتك إلى **${city} (${destName})**.\n\nيسعدني جداً إفادتك بأدق التفاصيل العملية، مثل:\n• 🍽️ **المطاعم والمقاهي والأكلات الحلال** (المحلية، البرجر، المشاوي، الشرقية)\n• 🏨 **أفضل الفنادق وأماكن السكن** (إطلالات مميزة، السنتر، شقق عائلية)\n• 🛍️ **المجمعات المفتوحة والأسواق التراثية والمولات**\n• 🚕 **المواصلات، تطبيقات التوصيل الذكية، والمترو**\n• 🎓 **الجامعات والدراسة والرعاية الطبية**\n• 🚨 **أرقام الطوارئ وسفارة بلدك وإرشادات السلامة**\n\nتفضل بسؤالي مباشرة وسأجيبك بأدق التفاصيل فوراً!`;
  }

  // 2. HOTELS & ACCOMMODATION (فنادق، سكن، شقق، إقامة، إطلالة النيل، قرب ديزني)
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
    msg.includes('أطلاله') ||
    msg.includes('أطلالة') ||
    msg.includes('hotel') ||
    msg.includes('hotels') ||
    msg.includes('apartment') ||
    msg.includes('stay') ||
    msg.includes('resort') ||
    msg.includes('nile')
  ) {
    // CAIRO & EGYPT HOTELS
    if (normDest.includes('cairo') || normDest.includes('قاهرة') || normDest.includes('egypt') || normDest.includes('مصر')) {
      if (isEn) {
        return `🏨 **Top Hotels in Cairo with Stunning Nile & Landmark Views:**\n\n1. **Four Seasons Hotel Cairo at Nile Plaza (Garden City):**\n• The premier luxury hotel on the Nile with private balconies overlooking the river, 8 world-class restaurants, and serene spa.\n\n2. **Sofitel Cairo Nile El Gezirah (Zamalek Island):**\n• A tranquil luxury haven right on the southern tip of Zamalek with an infinity pool directly above the Nile and riverfront dining.\n\n3. **The Nile Ritz-Carlton, Cairo (Downtown / Tahrir):**\n• Situated between the Nile Corniche and the Egyptian Museum, offering front-row views of Cairo Tower and the Nile.\n\n4. **Kempinski Nile Hotel (Garden City):**\n• Boutique luxury hotel offering European elegance with a rooftop pool and panoramic river views.\n\n5. **Marriott Mena House, Cairo (Giza Pyramids):**\n• Legendary historic palace nestled in 40 acres of lush gardens with dramatic direct views of the Great Pyramids.\n\n💡 **Booking Tip:** For guaranteed Nile views, select 'Nile View Superior/Deluxe Room' and request higher floors.`;
      }
      return `🏨 **أفضل فنادق القاهرة بإطلالات ساحرة على نهر النيل ومعالم العاصمة:**\n\n1. **فندق فورسيزونز القاهرة نايل بلازا (Four Seasons Nile Plaza - جاردن سيتي):**\n• أرقى فنادق النيل على الإطلاق؛ يتميز بشرفات خاصة تطل مباشرة على النهر، 8 مطاعم عالمية، وموقع هادئ في جاردن سيتي.\n\n2. **فندق سوفيتيل كايرو نايل الجزيرة (Sofitel Cairo Nile El Gezirah - الزمالك):**\n• يقع في الطرف الجنوبي لجزيرة الزمالك العريقة، ويضم مسبح إنفينيتي يطفو فوق مياه النيل ومطاعم عائمة ساحرة.\n\n3. **فندق نايل ريتز-كارلتون (The Nile Ritz-Carlton - ميدان التحرير والكورنيش):**\n• موقع استراتيجي بين كورنيش النيل والمتحف المصري، بإطلالات بانورامية على برج القاهرة وجسر قصر النيل.\n\n4. **فندق كمبينسكي نايل القاهرة (Kempinski Nile Hotel - جاردن سيتي):**\n• فندق بوتيك أوروبي فخم يوفر مسبحاً على السطح وإطلالات بانورامية مفتوحة على النيل وخدمة كونسيرج ممتازة.\n\n5. **فندق ماريوت مينا هاوس (Marriott Mena House - الأهرامات):**\n• قصر تاريخي أسطوري وسط 40 فداناً من الحدائق الغناء بإطلالة مباشرة مذهلة على أهرامات الجيزة.\n\n💡 **نصيحة الحجز:** عند الحجز عبر Booking أو موقع الفندق، احرص على اختيار فئة (Nile View Room) واطلب الأدوار العليا لإطلالة كاملة.`;
    }

    // ORLANDO & FLORIDA HOTELS
    if (normDest.includes('orlando') || normDest.includes('أورلاندو') || normDest.includes('florida') || normDest.includes('فلوريدا')) {
      if (isEn) {
        return `🏨 **Top Recommended Hotels & Resorts in Orlando, Florida:**\n\n1. **Four Seasons Resort Orlando at Walt Disney World Resort (Golden Oak):**\n• AAA Five Diamond luxury inside Disney with a private 5-acre water park, Michelin-starred Capa steakhouse, and nightly park fireworks views.\n\n2. **Universal’s Cabana Bay Beach Resort:**\n• Excellent 1950s themed family suites accommodating up to 6 guests, lazy river, 2 pools, bowling alley, and early park admission to Volcano Bay.\n\n3. **Floridays Resort Orlando (International Drive South):**\n• Luxurious 2 and 3-bedroom family condos with full granite kitchens, Jacuzzi tubs, private balconies, and shuttles to Disney/Universal.\n\n4. **Waldorf Astoria Orlando (Bonnet Creek):**\n• Luxurious, peaceful oasis surrounded by nature reserve with championship golf course, spa, and Disney shuttle services.\n\n💡 **Tip:** If traveling with family, serviced condo suites on International Drive or Disney Good Neighbor hotels offer great convenience and kitchen amenities!`;
      }
      return `🏨 **أفضل الفنادق والمنتجعات الموصى بها في Orlando (فلوريدا):**\n\n1. **فندق فورسيزونز أورلاندو (Four Seasons Orlando at Walt Disney World):**\n• أفخم منتجع داخل بوابات ديزني مع حديقة مائية خاصة بمساحة 5 أفدنة وسبا ومشاهدة ألعاب ديزني النارية من الشرفات.\n\n2. **منتجع كابانا باي بيتش من يونيفرسال (Universal's Cabana Bay Beach Resort):**\n• أجنحة عائلية واسعة تستوعب حتى 6 أفراد مع مطابخ صغيرة، نهر كسلان، مسبحين ضخمين، ودخول مبكر لمنتزه فولكانو باي المائي.\n\n3. **منتجع فلوريدايز أورلاندو (Floridays Resort Orlando - شارع إنترناشونال درايف):**\n• شقق فندقية عائلية فسيحة (2 إلى 3 غرف نوم) بمطابخ متكاملة وغسالة وصالات واسعة وقريبة من المولات والمطاعم.\n\n4. **والدورف أستوريا أورلاندو (Waldorf Astoria Orlando - بونيت كريك):**\n• واحة فخمة محاطة بالمحميات الطبيعية مع ملاعب غولف ومسابح هادئة وقريبة من منتزهات ديزني.`;
    }

    // GENERAL CITY HOTELS
    if (isEn) {
      return `🏨 **Top Accommodation Options in ${cityEn} (${destNameEn}):**\n\n1. **Downtown / Central 5-Star Luxury:**\n• Located in the city center within walking distance of prime attractions, business districts, and transit hubs.\n\n2. **Serviced Family Residences & Apart-Hotels:**\n• Ideal for families or extended stays with multi-bedroom configurations, fully equipped kitchens, laundry, and 24/7 reception.\n\n3. **Boutique & Lifestyle Hotels:**\n• High-rated properties (8.8+ on Booking & Trip.com) offering authentic local design, modern amenities, and prime dining access.\n\n💡 Check the **(Accommodations)** section in WASL to view verified deep links directly to Booking.com and Trip.com for ${cityEn}!`;
    }
    return `🏨 **أفضل خيارات السكن والفنادق في ${city} (${destName}):**\n\n1. **الفنادق الفاخرة في قلب السنتر:**\n• الخيار الأمثل للوصول السهل لكافة المعالم السياحية والمطاعم ومحطات المترو سيراً على الأقدام.\n\n2. **الشقق الفندقية العائلية (Serviced Apartments):**\n• خيار مريح واقتصادي للعائلات يوفر غرفتين أو 3 غرف نوم ومطبخاً متكاملاً وغسالة مع خدمات استقبال 24 ساعة.\n\n3. **فنادق البوتيك ذات التقييم المرتفع:**\n• احرص على اختيار الفنادق الحاصلة على تقييم 8.8+ في Booking و Agoda القريبة من خطوط المواصلات الحيوية.\n\n💡 يمكنك تصفح قسم **(الفنادق والإقامة)** في منصة وصل للحصول على روابط مباشرة ومؤكدة للحجز!`;
  }

  // 3. RESTAURANTS, FOOD, ARABIC / HALAL DINING (مطاعم، أكل، برجر، حلال، مطعم عربي، شاورما، مقاهي)
  if (
    msg.includes('مطعم') ||
    msg.includes('مطاعم') ||
    msg.includes('أكل') ||
    msg.includes('اكل') ||
    msg.includes('برجر') ||
    msg.includes('برغر') ||
    msg.includes('شاورما') ||
    msg.includes('مشاوي') ||
    msg.includes('عربي') ||
    msg.includes('حلال') ||
    msg.includes('كافيه') ||
    msg.includes('قهوة') ||
    msg.includes('فطور') ||
    msg.includes('غداء') ||
    msg.includes('عشاء') ||
    msg.includes('بيتزا') ||
    msg.includes('restaurant') ||
    msg.includes('restaurants') ||
    msg.includes('food') ||
    msg.includes('halal') ||
    msg.includes('arabic restaurant') ||
    msg.includes('burger') ||
    msg.includes('cafe') ||
    msg.includes('dining') ||
    msg.includes('eat')
  ) {
    // ORLANDO ARABIC & HALAL RESTAURANTS
    if (normDest.includes('orlando') || normDest.includes('أورلاندو') || normDest.includes('florida') || normDest.includes('فلوريدا')) {
      if (isEn) {
        return `🍽️ **Top Authentic Arabic & Halal Restaurants in Orlando, Florida:**\n\n1. **Cedar's Restaurant (Restaurant Row - Sand Lake Rd):**\n• One of Orlando's most renowned upscale Lebanese & Middle Eastern restaurants. Features premium mixed grills, fresh mezze, hummus, and outdoor seating.\n\n2. **Habibi Lebanese Cuisine (International Drive):**\n• Outstanding authentic Lebanese wraps, chicken shawarma, falafel platters, lamb kabobs, and freshly baked pita bread right on I-Drive.\n\n3. **Jerusalem Middle Eastern Restaurant (Kissimmee / Vineland):**\n• Traditional Arabic family-style platters, mansaf, mandi, grilled meats, and fresh salads close to Disney parks.\n\n4. **Flame Kabob (Dr. Phillips / Sand Lake Rd):**\n• Flavorful halal Persian and Mediterranean kebabs, saffron rice, and grilled platters with generous portions.\n\n5. **Al-Madina Restaurant & Market (Orlando):**\n• Authentic Arabic home-style dishes, shawarma, and a Middle Eastern market with halal products.\n\n💡 **Halal Tip:** Restaurant Row on Sand Lake Road and South International Drive have the highest concentration of certified Halal dining in Orlando!`;
      }
      return `🍽️ **أفضل المطاعم العربية والمأكولات الحلال في Orlando (فلوريدا):**\n\n1. **مطعم سيدارز اللبناني (Cedar's Restaurant - شارع ساند ليك):**\n• من أرقى المطاعم اللبنانية في أورلاندو (منطقة Restaurant Row)، يقدم مشاوي مشكلة فاخرة، مقبلات طازجة وجلسات خارجية راقية.\n\n2. **مطعم حبيبي (Habibi Lebanese Cuisine - إنترناشونال درايف):**\n• شاورما دجاج ولحم على الطريقة الأصلية، كباب، فلافل ومقبلات شرقية في موقع حيوي على شارع I-Drive.\n\n3. **مطعم القدس (Jerusalem Middle Eastern Restaurant - كيسيمي/ديزني):**\n• أطباق عائلية تراثية، مندي، مشويات، ومأكولات شرقية قريبة من منتزهات ديزني.\n\n4. **مطعم فليم كباب (Flame Kabob - دكتور فيليبس):**\n• كباب لحم ودجاج متبل، أرز بالزعفران، وأطباق متوسطية حلال بنكهات أصيلة.\n\n💡 تتركز معظم المطاعم العربية والحلال في شارع Sand Lake Road وشارع International Drive.`;
    }

    // CAIRO & EGYPT FOOD
    if (normDest.includes('cairo') || normDest.includes('قاهرة') || normDest.includes('egypt') || normDest.includes('مصر')) {
      if (isEn) {
        return `🍽️ **Top Restaurants & Dining Spots in Cairo:**\n\n1. **Traditional Egyptian Cuisine:**\n• **Abou El Sid (Zamalek):** Legendary authentic Egyptian dishes (Molokhia with duck, Stuffed pigeon, Tagines) in a 1940s oriental atmosphere.\n• **Koshary Abou Tarek (Downtown):** The ultimate world-famous Egyptian Koshary experience.\n\n2. **Nile-Front Scenic Dining:**\n• **Zitouni (Four Seasons Nile Plaza):** Luxurious authentic Lebanese and oriental buffet directly overlooking the Nile.\n• **Sequoia / Crimson Bar & Grill (Zamalek):** Stylish riverfront terraces with Mediterranean dining and sunset views.\n\n3. **Cafes & Heritage:**\n• **El Fishawy Cafe (Khan El Khalili):** Over 200 years old historic cafe for mint tea and Sahlab in the heart of old Cairo.`;
      }
      return `🍽️ **أفضل المطاعم والمقاهي في القاهرة:**\n\n1. **المأكولات المصرية الأصيلة:**\n• **مطعم أبو السيد (Abou El Sid - الزمالك):** أشهى طواجن، ملوخية بالبط، حمام محشي، في أجواء تراثية شرقية راقية.\n• **كشري أبو طارق (وسط البلد):** التجربة الأشهر للكشري المصري الأصيل.\n• **كبابجي الأزهر فرحات (الأزهر وشارع فيصل):** كباب وكفتة وحمام مشوي على الفحم.\n\n2. **المطاعم الفاخرة المطلة على النيل:**\n• **مطعم زيتوني (Zitouni - فورسيزونز نايل بلازا):** بوفيه وأطباق شرقية فاخرة بإطلالة مباشرة على النيل.\n• **مطعم كريمزون (Crimson Bar & Grill - الزمالك):** تراس ساحر يطل على النيل للمأكولات الإيطالية واللحوم المشوية.\n\n3. **المقاهي التاريخية:**\n• **مقهى الفيشاوي (خان الخليلي):** أعرق مقهى في مصر (منذ عام 1797) لجلسات الشاي بالنعناع والقهوة المظبوطة.`;
    }

    // GENERAL CITY RESTAURANTS
    if (isEn) {
      return `🍽️ **Top Dining & Culinary Recommendations in ${cityEn} (${destNameEn}):**\n\n1. **Local Culinary Specialties:**\n• Explore authentic signature dishes prepared by top-rated local eateries and heritage dining spots.\n\n2. **Halal & International Dining:**\n• Certified Halal restaurants, gourmet burger joints, and Middle Eastern grills are readily available in central tourist zones.\n\n3. **Atmospheric Cafes:**\n• Enjoy specialty coffee roasters and open-air terrace seating in pedestrian shopping plazas.\n\n💡 Use Google Maps or Zabihah app to filter by top customer ratings and verify open hours!`;
    }
    return `🍽️ **أفضل المطاعم والمأكولات في ${city} (${destName}):**\n\n1. **المأكولات المحلية الشهيرة:**\n• استمتع بتجربة الأطباق الوطنية الأصيلة للمدينة في أرقى المطاعم المصنفة بتوصيات الزوار.\n\n2. **خيارات الأكل الحلال والشرقي:**\n• تتوفر خيارات متعددة من المطاعم المعتمدة حلال والمشاوي والبرجر والمطاعم البحرية في وسط المدينة والمجمعات.\n\n3. **المقاهي المميزة:**\n• مقاهي القهوة المختصة والجلسات المفتوحة في المماشي السياحية والساحات المركزية.`;
  }

  // 4. SUGGESTIONS, ITINERARIES & "WHAT SHOULD I DO?" (عطني اقتراح، اقترح لي، ماذا أفعل، جدول، اقتراح)
  if (
    msg.includes('اقتراح') ||
    msg.includes('أقترح') ||
    msg.includes('اقترح') ||
    msg.includes('جدول') ||
    msg.includes('برنامج') ||
    msg.includes('ماذا افعل') ||
    msg.includes('ماذا أفعل') ||
    msg.includes('فعاليات') ||
    msg.includes('suggest') ||
    msg.includes('suggestion') ||
    msg.includes('itinerary') ||
    msg.includes('what to do') ||
    msg.includes('activities') ||
    msg.includes('recommend')
  ) {
    if (normDest.includes('cairo') || normDest.includes('قاهرة') || normDest.includes('egypt') || normDest.includes('مصر')) {
      if (isEn) {
        return `✨ **Curated 1-Day Highlights Itinerary for Cairo:**\n\n• 🌅 **Morning (09:00 AM - 01:00 PM):**\n  - Visit the **Giza Pyramids & Sphinx** (or the Grand Egyptian Museum GEM).\n  - Lunch at *Marriott Mena House* overlooking the Pyramids.\n\n• ☀️ **Afternoon (02:00 PM - 05:30 PM):**\n  - Explore **National Museum of Egyptian Civilization (NMEC)** to view the Royal Mummies Hall.\n  - Stroll through the leafy arts district of **Zamalek**.\n\n• 🌙 **Evening (06:30 PM - 10:30 PM):**\n  - Private Nile Felucca sailboat ride at sunset from Garden City / Dokki.\n  - Authentic dinner at *Abou El Sid* in Zamalek or *Zitouni*.\n  - Late evening walk in historic **Khan El Khalili Souq** and mint tea at *El Fishawy*.`;
      }
      return `✨ **اقتراح جدول يومي مميز وممتع في القاهرة:**\n\n• 🌅 **الفترة الصباحية (9:00 ص - 1:00 م):**\n  - زيارة **أهرامات الجيزة وأبو الهول** أو المتحف المصري الكبير (GEM).\n  - تناول وجبة غداء راقية بإطلالة الأهرامات في مطعم *139 Pavilion* بفندق مينا هاوس.\n\n• ☀️ **فترة الظهيرة والعصر (2:00 م - 5:30 م):**\n  - جولة في **المتحف القومي للحضارة المصرية (الفسطاط)** لمشاهدة قاعة المومياوات الملكية المبهرة.\n  - جولة تسوق وتجول في شوارع **حي الزمالك** الهادئة ومقاهيه الفنية.\n\n• 🌙 **المساء والسهرة (6:30 م - 10:30 م):**\n  - جولة نيلية خاصة بفلوكة شراعية وقت الغروب من مرسى جاردن سيتي أو الزمالك.\n  - عشاء مصري أصيل في *مطعم أبو السيد* أو عشاء نيللي في *سوفيتيل الجزيرة*.\n  - سهرة تراثية في **سوق خان الخليلي** التاريخي وشاي بالنعناع في مقهى الفيشاوي!`;
    }

    if (normDest.includes('orlando') || normDest.includes('أورلاندو') || normDest.includes('florida') || normDest.includes('فلوريدا')) {
      if (isEn) {
        return `✨ **Curated Highlights Itinerary for Orlando:**\n\n• 🌅 **Morning:**\n  - Early entry to **Walt Disney World (Magic Kingdom or EPCOT)** or **Universal Studios**.\n\n• ☀️ **Afternoon:**\n  - Scenic boat tour through the historic lakes and mansions of **Winter Park**.\n  - Shopping at **The Mall at Millenia** or **Orlando International Premium Outlets**.\n\n• 🌙 **Evening:**\n  - Gourmet dinner on Restaurant Row (*Cedar's* or *The Capital Grille* on Sand Lake Rd).\n  - Stroll through **Disney Springs** to enjoy live music and waterfront dessert spots.`;
      }
      return `✨ **اقتراح جدول يومي سياحي متكامل في Orlando:**\n\n• 🌅 **الفترة الصباحية:**\n  - دخول مبكر لأحد منتزهات ديزني الكبرى (**EPCOT أو Magic Kingdom**) أو منتزه **Universal Studios**.\n\n• ☀️ **فترة الظهيرة:**\n  - جولة القوارب الطبيعية في بحيرات حي **Winter Park** الساحر.\n  - جولة تسوق في **The Mall at Millenia** أو **Orlando Premium Outlets** بتخفيضاتها الكبرى.\n\n• 🌙 **المساء والسهرة:**\n  - عشاء في مطعم عربي راقٍ (*مطعم سيدارز* في شارع ساند ليك) أو مطاعم المشاوي.\n  - جولة مسائية ممتعة في **Disney Springs** المفتوح مع العروض الحية والمتاجر العالمية.`;
    }

    // GENERAL SUGGESTION
    if (isEn) {
      return `✨ **Curated Daily Highlights for ${cityEn} (${destNameEn}):**\n\n• 🌅 **Morning:** Explore the iconic historical landmarks and central historic plazas.\n• ☀️ **Afternoon:** Visit top-rated museums, art galleries, and open-air shopping districts.\n• 🌙 **Evening:** Dine at a top scenic restaurant, followed by a relaxing stroll through lively pedestrian boulevards.\n\n💡 Check the **(Daily Itinerary)** tab on WASL for a detailed, day-by-day interactive itinerary!`;
    }
    return `✨ **اقتراح يومي مميز لرحلتك في ${city} (${destName}):**\n\n• 🌅 **الصباح:** جولة استكشافية لأبرز المعالم التاريخية والساحات المركزية للمدينة.\n• ☀️ **الظهيرة:** زيارة المتاحف الوطنية والحدائق الشهيرة والتسوق في المجمعات المفتوحة.\n• 🌙 **المساء:** عشاء راقٍ في مطعم محلي مميز، وجولة مشي مسائية في المماشي الحيوية.\n\n💡 يمكنك فتح تبويب **(الجدول اليومي التفاعلي)** في منصة وصل للاطلاع على تفاصيل كل يوم مقسمة بالخرائط والأنشطة!`;
  }

  // 5. SHOPPING, MALLS & SOUQS (تسوق، سوق، مول، مجمعات، اسواق)
  if (
    msg.includes('تسوق') ||
    msg.includes('سوق') ||
    msg.includes('مول') ||
    msg.includes('مجمع') ||
    msg.includes('أسواق') ||
    msg.includes('اسواق') ||
    msg.includes('outlet') ||
    msg.includes('shopping') ||
    msg.includes('mall') ||
    msg.includes('souq')
  ) {
    if (isEn) {
      return `🛍️ **Top Shopping Malls & Traditional Markets in ${cityEn} (${destNameEn}):**\n\n1. **Prime Luxury Centers:** Flagship high-end international designer brands and entertainment.\n2. **Open-Air Promenades & Outlets:** Outdoor walkable boulevards with designer discount stores (30%-70% off).\n3. **Historic & Artisan Souqs:** Authentic local craft markets for spices, textiles, perfumes, and unique souvenirs.\n\n💡 Most international shopping centers offer instant VAT / Tax-Free refund processing for international tourists.`;
    }
    return `🛍️ **أفضل مراكز التسوق والأسواق في ${city} (${destName}):**\n\n1. **المجمعات والمولات الكبرى:** تضم أرقى الماركات العالمية والمطاعم وصالات السينما والترفيه العائلي.\n2. **الآوت لت (Outlets) والمجمعات المفتوحة:** مراكز تسوق في الهواء الطلق تقدم تخفيضات كبرى بين 30% إلى 70% على الماركات الشهيرة.\n3. **الأسواق التراثية والشعبية:** فرصة رائعة لشراء الهدايا التذكارية، التحف، والمنتجات الحرفية الأصلية.\n\n💡 تذكر طلب فواتير استرداد الضريبة (Tax-Free) عند التسوق للمسافرين الدوليين!`;
  }

  // 6. TRANSPORTATION & TAXI (تاكسي، مواصلات، مترو، اوبر، باص)
  if (
    msg.includes('تاكسي') ||
    msg.includes('مواصلات') ||
    msg.includes('مترو') ||
    msg.includes('باص') ||
    msg.includes('قطار') ||
    msg.includes('اوبر') ||
    msg.includes('أوبر') ||
    msg.includes('توصيل') ||
    msg.includes('taxi') ||
    msg.includes('uber') ||
    msg.includes('metro') ||
    msg.includes('transit') ||
    msg.includes('transport')
  ) {
    if (isEn) {
      return `🚕 **Transportation & Mobility Guide in ${cityEn} (${destNameEn}):**\n\n1. **Rideshare Apps:** Use verified apps like **Uber / Careem / Bolt / Lyft** for upfront pricing, seamless card payments, and GPS tracking.\n2. **Metro & Public Transit:** Fast, cost-effective transit with rechargeable cards available at all central stations.\n3. **Official Airport Taxis:** Available 24/7 at airport designated taxi ranks; ensure the meter is running or pre-book through official desks.`;
    }
    return `🚕 **دليل المواصلات والتنقل في ${city} (${destName}):**\n\n1. **التطبيقات الذكية المعتمدة:** استخدم تطبيقات التوصيل الرسمية (مثل Uber / Careem / Bolt / Lyft) لضمان دقة التعرفة وتتبع المسار والدفع الإلكتروني.\n2. **المترو والقطارات الخفيفة:** وسيلة سريعة واقتصادية لتفادي الازدحام مع توفر بطاقات يومية وأسبوعية موفرة.\n3. **تاكسي المطار الرسمي:** متوفر على مدار 24 ساعة خارج صالات الوصول مع الالتزام بتشغيل العداد.`;
  }

  // 7. EMERGENCY, EMBASSY & SAFETY (طوارئ، سفارة، شرطة، اسعاف، امان، سلامة)
  if (
    msg.includes('طوارئ') ||
    msg.includes('سفارة') ||
    msg.includes('شرطة') ||
    msg.includes('إسعاف') ||
    msg.includes('اسعاف') ||
    msg.includes('مستشفى') ||
    msg.includes('أمان') ||
    msg.includes('سلامة') ||
    msg.includes('emergency') ||
    msg.includes('embassy') ||
    msg.includes('police') ||
    msg.includes('hospital')
  ) {
    if (isEn) {
      return `🚨 **Emergency, Safety & Consular Support in ${cityEn} (${destNameEn}):**\n\n• 📞 **Emergency Numbers:** Dial **911** (USA/Canada) or **112 / 999** (Europe & UK).\n• 🏛️ **Your Embassy / Consulate:** Keep your home country's 24/7 citizen emergency hotline saved (e.g., Saudi MOFA hotline: +966 9200 11114 / 199099).\n• 🏥 **Medical Emergency:** Head to the nearest central university hospital emergency room and present your international travel insurance policy.`;
    }
    return `🚨 **أرقام الطوارئ والسلامة في ${city} (${destName}):**\n\n• 📞 **رقم الطوارئ الموحد:** اتصل برقم **911** (أمريكا/كندا) أو **112 / 999** (أوروبا وبريطانيا) أو **122 / 123** (مصر).\n• 🏛️ **سفارة بلدك:** احتفظ برقم خط طوارئ المواطنين بالخارج الموحد (السعودية: 199099 / الإمارات: 80044444 / الكويت: +965 159).\n• 🏥 **الرعاية الطبية الطارئة:** توجه لأقرب مستشفى مركزي مع إبراز وثيقة التأمين الطبي للمسافرين.\n\n💡 يمكنك زيارة تبويب **(الطوارئ والجهات الرسمية)** في منصة وصل للاتصال الفوري بنقرة واحدة!`;
  }

  // 8. GENERAL HIGH-QUALITY CONTEXTUAL ANSWER
  if (isEn) {
    return `🌍 **Welcome! Here is tailored information for your trip to ${cityEn} (${destNameEn}):**\n\nRegarding your inquiry: *"${userMessage}"*\n\n• 📍 **Destination Insights:** ${cityEn} provides modern infrastructure, rich culture, and excellent traveler amenities.\n• 🚗 **Getting Around:** Rideshare applications (Uber/Lyft/Careem) and public transit provide fast, comfortable navigation.\n• 🍽️ **Dining & Shopping:** Central districts and major boulevards host diverse dining, certified Halal options, and premier shopping outlets.\n• 💡 **Interactive Tools:** Explore the specialized tabs in WASL (Daily Itinerary, Safety, Accommodations, and Culture) for curated real-world details!`;
  }
  return `🌍 **مرحباً بك! يسعدني إفادتك بخصوص رحلتك إلى ${city} (${destName}):**\n\nبخصوص استفسارك: "${userMessage}"\n\n• 📍 **عن المدينة:** تتميز ${city} بكافة الخدمات السياحية والخدمية المتطورة لضمان إقامة مريحة وممتعة.\n• 🚗 **التنقل والمواصلات:** يُنصح بالاعتماد على التطبيقات الذكية والمترو لسهولة الوصول ودقة المواعيد.\n• 🍽️ **المطاعم والأنشطة:** تتوفر خيارات واسعة من المطاعم العالمية والمحلية والأسواق في المناطق المركزية.\n• 💡 **الدعم المتكامل:** يمكنك استكشاف تبويبات منصة وصل (الجدول اليومي، الفنادق، الطوارئ، والتسوق) للاطلاع على كافة التفاصيل بدقة!`;
}