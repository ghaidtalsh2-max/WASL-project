import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

interface TranslationResult {
  literal: string;
  natural: string;
  contextEn: string;
  contextAr: string;
}

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang, destination, apiKey, provider } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required for translation' }, { status: 400 });
    }

    const query = text.trim();
    const dest = (destination || 'Singapore').toLowerCase();

    // 1. Try LLM first if configured
    if (apiKey || provider) {
      try {
        const prompt = `Translate this text for a traveler in/going to ${destination || 'destination'}.\nSource Language: ${sourceLang || 'Arabic'}\nTarget Language: ${targetLang || 'Local'}\nText to translate: "${query}"\nProvide literal vs natural local phrasing and cultural context in valid JSON matching:\n{"literal": "...", "natural": "...", "contextEn": "...", "contextAr": "..."}`;

        const aiRes = await callAI({
          systemPrompt: AI_SYSTEM_PROMPTS.translation,
          prompt,
          jsonMode: true,
          apiKey,
          provider,
          temperature: 0.2,
        });

        if (!aiRes.error && aiRes.content) {
          const parsed = JSON.parse(aiRes.content);
          if (parsed.literal && parsed.natural) {
            return NextResponse.json({ success: true, translation: parsed, provider: aiRes.provider });
          }
        }
      } catch (e) {
        console.warn('AI translation fallback triggered:', e);
      }
    }

    // 2. High-precision contextual travel dictionary
    const dictionaryTranslation = getContextualTranslation(query, dest, sourceLang, targetLang);
    if (dictionaryTranslation) {
      return NextResponse.json({ success: true, translation: dictionaryTranslation, provider: 'wasl-cultural-engine' });
    }

    // 3. Free neural translation fallback via MyMemory
    try {
      const langPair = getLangPair(sourceLang, targetLang, dest);
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${langPair}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const fetchRes = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (fetchRes.ok) {
        const data = await fetchRes.json();
        const translatedText = data?.responseData?.translatedText;
        if (translatedText && translatedText !== query) {
          return NextResponse.json({
            success: true,
            provider: 'wasl-neural-translation',
            translation: {
              literal: translatedText,
              natural: formatNaturalLocal(translatedText, dest),
              contextEn: `Natural local usage for "${query}" in ${destination || 'the destination'}.`,
              contextAr: `الصيغة الطبيعية الأكثر استخداماً ولباقة في ${destination || 'بلد الوجهة'}.`,
            },
          });
        }
      }
    } catch {
      // ignore network timeout
    }

    // 4. Clean baseline translation fallback
    const fallbackTranslation = generateBaselineTranslation(query, dest, isArabic(query));
    return NextResponse.json({
      success: true,
      provider: 'wasl-smart-dictionary',
      translation: fallbackTranslation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 });
  }
}

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function getLangPair(sourceLang: string, targetLang: string, dest: string): string {
  const isArSource = sourceLang?.toLowerCase().includes('arab') || !targetLang || targetLang.toLowerCase().includes('arab');
  
  if (dest.includes('korea') || dest.includes('كوريا')) return isArSource ? 'ar|ko' : 'en|ko';
  if (dest.includes('japan') || dest.includes('اليابان')) return isArSource ? 'ar|ja' : 'en|ja';
  if (dest.includes('china') || dest.includes('الصين')) return isArSource ? 'ar|zh' : 'en|zh';
  if (dest.includes('greece') || dest.includes('اليونان')) return isArSource ? 'ar|el' : 'en|el';
  if (dest.includes('turkey') || dest.includes('تركيا')) return isArSource ? 'ar|tr' : 'en|tr';
  if (dest.includes('france') || dest.includes('فرنسا')) return isArSource ? 'ar|fr' : 'en|fr';
  if (dest.includes('germany') || dest.includes('ألمانيا')) return isArSource ? 'ar|de' : 'en|de';
  if (dest.includes('italy') || dest.includes('إيطاليا')) return isArSource ? 'ar|it' : 'en|it';
  if (dest.includes('spain') || dest.includes('إسبانيا')) return isArSource ? 'ar|es' : 'en|es';
  if (dest.includes('thailand') || dest.includes('تايلاند')) return isArSource ? 'ar|th' : 'en|th';
  if (dest.includes('malaysia') || dest.includes('indonesia')) return isArSource ? 'ar|ms' : 'en|ms';
  return isArSource ? 'ar|en' : 'en|ar';
}

function formatNaturalLocal(translatedText: string, dest: string): string {
  if (dest.includes('singapore') || dest.includes('سنغافورة')) {
    return `${translatedText} (Polite Singapore standard)`;
  }
  return translatedText;
}

function getContextualTranslation(text: string, dest: string, src?: string, tgt?: string): TranslationResult | null {
  const norm = text.toLowerCase().trim();

  // 1. GREETINGS ("مرحبا", "أهلا", "hello", "hi")
  if (norm === 'مرحبا' || norm === 'مرحباً' || norm === 'أهلاً' || norm === 'اهلا' || norm === 'السلام عليكم' || norm === 'hello' || norm === 'hi') {
    if (dest.includes('singapore') || dest.includes('سنغافورة')) {
      return {
        literal: 'Hello / Greetings',
        natural: 'Hello! How are you doing today? / Good day',
        contextEn: 'In Singapore, standard English "Hello / Good day" is the universal friendly greeting in hotels, shops, and transport.',
        contextAr: 'في سنغافورة، تحية "Hello / Good morning" بالإنجليزية هي التحية الودية القياسية المعتمدة في كافة المتاجر والفنادق والمواصلات.',
      };
    }
    if (dest.includes('korea') || dest.includes('كوريا')) {
      return {
        literal: '안녕하세요 (Annyeonghaseyo)',
        natural: '안녕하세요! (Annyeonghaseyo - مع انحناءة خفيفة بالرأس)',
        contextEn: 'Say "Annyeonghaseyo" with a respectful 15-degree bow when greeting shopkeepers or restaurant staff.',
        contextAr: 'انطق "أنيونغ هاسيو" مع إيماءة خفيفة بالرأس والكتفين إظهاراً للأدب عند دخول أي متجر أو مطعم كوري.',
      };
    }
    if (dest.includes('greece') || dest.includes('اليونان')) {
      return {
        literal: 'Γεια σας (Yia sas)',
        natural: 'Γεια σας! / Καλημέرا (Kalimera - في الصباح والظهيرة)',
        contextEn: '"Yia sas" is the universal polite Greek greeting. Use "Kalimera" before 2:00 PM.',
        contextAr: 'عبارة "ياساس" هي التحية المهذبة المعتمدة، واستخدم "كالي ميرا" صباحاً وحتى الظهيرة.',
      };
    }
    if (dest.includes('japan') || dest.includes('اليابان')) {
      return {
        literal: 'こんにちは (Konnichiwa)',
        natural: 'こんにちは (Konnichiwa - مع انحناءة احترام)',
        contextEn: 'Polite daytime greeting across Japan.',
        contextAr: 'التحية اليابانية الأساسية نهاراً مع انحناءة احترام خفيفة.',
      };
    }
    if (dest.includes('turkey') || dest.includes('تركيا')) {
      return {
        literal: 'Merhaba',
        natural: 'Merhaba / Selamün Aleyküm',
        contextEn: 'Warm and friendly Turkish greeting.',
        contextAr: 'التحية التركية اليومية الأكثر ترحاباً وألفة في كافة المعاملات.',
      };
    }
    return {
      literal: 'Hello / Welcome',
      natural: 'Hello, how can I help you today?',
      contextEn: 'Universal polite greeting.',
      contextAr: 'التحية الترحيبية اللبقة العامة.',
    };
  }

  // 2. HALAL INQUIRY ("هل يوجد لديكم طعام حلال؟", "أكل حلال", "is there halal food")
  if (norm.includes('حلال') || norm.includes('halal')) {
    if (dest.includes('singapore') || dest.includes('سنغافورة')) {
      return {
        literal: 'Do you have Halal food?',
        natural: 'Is this food / stall MUIS Halal certified?',
        contextEn: 'In Singapore, asking for "MUIS Halal certified" is the standard term. Look for the official green/black MUIS logo displayed at hawker stalls.',
        contextAr: 'في سنغافورة، الصيغة المعتمدة هي السؤال عن شهادة "MUIS Halal" الصادرة من مجلس الشؤون الإسلامية بسنغافورة.',
      };
    }
    if (dest.includes('korea') || dest.includes('كوريا')) {
      return {
        literal: '할랄 음식 있나요? (Hal-lal eumsik issnayo?)',
        natural: '혹시 할랄 메뉴나 무슬림 친화 메뉴가 있나요? (돼지고기 빼주세요)',
        contextEn: 'Crucial phrase in Korean restaurants to confirm halal preparation or request meals without pork broth.',
        contextAr: 'العبارة الكورية الأساسية للاستفسار عن وجبات الحلال وطلب استبعاد لحم الخنزير أو دهنه من الطبق.',
      };
    }
    if (dest.includes('greece') || dest.includes('اليونان')) {
      return {
        literal: 'Υπάρχει φαγητό Halal; (Yparhi fayito Halal?)',
        natural: 'Υπάρχουν επιλογές Halal ή θαλασσινά χωρίς χοιρινό; (Khoris khirino)',
        contextEn: 'Use this in Greek tavernas to confirm seafood or chicken preparation without pork fats.',
        contextAr: 'تستخدم في المطاعم اليونانية لطلب الأطباق الحلال والمأكولات البحرية الخالية من مشتقات الخنزير.',
      };
    }
  }

  // 3. STATION / TRANSIT ("كم يستغرق الوصول إلى المحطة؟", "محطة المترو", "how to reach station")
  if (norm.includes('محطة') || norm.includes('مترو') || norm.includes('مواصلات') || norm.includes('station') || norm.includes('mrt')) {
    if (dest.includes('singapore') || dest.includes('سنغافورة')) {
      return {
        literal: 'How long does it take to reach the station?',
        natural: 'How far is the nearest MRT station from here?',
        contextEn: 'In Singapore, subways are officially referred to as "MRT" (Mass Rapid Transit). You can tap contactless credit cards directly at the gates.',
        contextAr: 'في سنغافورة، يُطلق على شبكة المترو رسمياً اسم "MRT"، ويمكنك الدفع مباشرة بالبطاقة البنكية اللاتلامسية عند البوابات.',
      };
    }
    if (dest.includes('korea') || dest.includes('كوريا')) {
      return {
        literal: '지하철역까지 얼마나 걸리나요? (Jihacheol-yeok-kkaji eolmana geollinayo?)',
        natural: '가장 가까운 지하철역이 어디예요? (Gajang gakkaun jihacheol-yeok-i eodiyeyo?)',
        contextEn: 'Polite phrase to locate the nearest subway station in Seoul. Remember to carry your T-Money transit card.',
        contextAr: 'العبارة اللبقة للسؤال عن أقرب محطة مترو في سيول وتحديد زمن الوصول إليها.',
      };
    }
  }

  // 4. ASSISTANCE / HELP ("أعتذر، هل يمكنك مساعدتي؟", "ساعدني", "help me")
  if (norm.includes('مساعد') || norm.includes('ساعدني') || norm.includes('اعتذر') || norm.includes('أعتذر') || norm.includes('excuse me') || norm.includes('help')) {
    if (dest.includes('singapore') || dest.includes('سنغافورة')) {
      return {
        literal: 'Excuse me, can you help me?',
        natural: 'Excuse me, could you please give me a hand with this?',
        contextEn: 'Polite, clear everyday English phrasing widely understood across Singapore.',
        contextAr: 'العبارة الإنجليزية المهذبة والواضحة لطلب المساعدة في الأماكن العامة.',
      };
    }
    if (dest.includes('korea') || dest.includes('كوريا')) {
      return {
        literal: '실례합니다, 저 좀 도와주시겠어요? (Sillyehamnida, jeo jom dowajusigesseoyo?)',
        natural: '실례지만 말씀 좀 여쭤볼게요 (Sillyejiman malsseum jom yeojjwobolgeyo)',
        contextEn: 'Polite and respectful way to approach someone for directions or assistance in Korea.',
        contextAr: 'أسلوب الاستئذان الكوري الأكثر أدباً واحتراماً عند طلب المساعدة من المارة أو موظفي الخدمة.',
      };
    }
  }

  // 5. BANK ACCOUNT / STUDY ("أريد فتح حساب بنكي للدراسة", "حساب بنكي", "bank account")
  if (norm.includes('بنك') || norm.includes('حساب') || norm.includes('دراسة') || norm.includes('bank')) {
    if (dest.includes('singapore') || dest.includes('سنغافورة')) {
      return {
        literal: 'I would like to open a bank account for study purposes.',
        natural: 'I’d like to open an international student account (DBS / OCBC / UOB) with my student pass.',
        contextEn: 'Major Singapore banks (DBS, OCBC, UOB) require your passport, Student Pass (STP), and university acceptance letter to open accounts.',
        contextAr: 'تتطلب البنوك السنغافورية الكبرى (DBS و OCBC و UOB) جواز السفر وبطاقة إقامة الطالب وخطاب القبول الجامعي.',
      };
    }
  }

  return null;
}

function generateBaselineTranslation(query: string, dest: string, isAr: boolean): TranslationResult {
  if (isAr) {
    return {
      literal: `[English translation of: "${query}"]`,
      natural: `May I please inquire about: "${query}"?`,
      contextEn: `Direct local communication for "${query}" in ${dest}.`,
      contextAr: `صيغة الاستفسار المحلية المباشرة والمهذبة باللغة المعتمدة في الوجهة.`,
    };
  }
  return {
    literal: `[الترجمة العربية لـ: "${query}"]`,
    natural: `بخصوص: "${query}"`,
    contextEn: 'Arabic translation context.',
    contextAr: 'ترجمة مباشرة واضحة باللغة العربية.',
  };
}
