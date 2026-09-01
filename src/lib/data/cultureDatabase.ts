import { CultureGuidance } from './defaultJourneys';

export const CULTURE_DATABASE: Record<string, CultureGuidance> = {
  'south-korea': {
    knowTheCulture: {
      history: {
        title: '5,000 Years of Heritage & Dynastic Legacy',
        titleAr: '5,000 عام من التاريخ والإرث الإمبراطوري الكوري',
        content: 'From ancient kingdoms and the Joseon Dynasty to rapid post-war modernization (Miracle on the Han River), Korea blends profound historical resilience with cutting-edge global innovation.',
        contentAr: 'من الممالك الكورية القديمة وسلالة جوسون العريقة إلى النهضة الاقتصادية والتكنولوجية المعاصرة (معجزة نهر الهان)، تجمع كوريا بين الأصالة التراثية والريادة العالمية.',
      },
      clothing: {
        title: 'Traditional Hanbok & Modern Smart Urban Elegance',
        titleAr: 'أزياء الهانبوك التراثية والأناقة العصرية',
        content: 'Traditional Hanbok is celebrated during weddings, national holidays, and palace visits. In everyday city life, clean, stylish smart-casual fashion is standard.',
        contentAr: 'يُرتدى الهانبوك الكوري التقليدي في الأعياد الوطنية والمناسبات وزيارات القصور التراثية، بينما تسود الأناقة العصرية المحتشمة في الحياة اليومية.',
      },
      foodCulture: {
        title: 'Communal Dining, Banchan & Culinary Harmony',
        titleAr: 'المائدة المشتركة وأطباق البانتشان والتناغم الغذائي',
        content: 'Meals are communal experiences centered around rice, hearty stews, Korean BBQ, and an array of complimentary side dishes (Banchan including Kimchi).',
        contentAr: 'تناول الطعام تجربة اجتماعية عائلية تقوم على مشاركة الأطباق الرئيسية، حساء اللحم، والمشاوي، وتشكيلة الأطباق الجانبية الغنية (البانتشان والكمتشي).',
      },
      familySocial: {
        title: 'Confucian Roots & Deep Respect for Hierarchy',
        titleAr: 'القيم الكونفوشيوسية واحترام التسلسل العمري',
        content: 'Family bonds, filial piety (Hyo), and deference to seniors and elders govern social relationships, workplace etiquette, and speech levels.',
        contentAr: 'الترابط الأسري، بر الوالدين، وتقدير كبار السن هي الركائز الأساسية التي تنظم العلاقات الاجتماعية وآداب الحديث والتعامل.',
      },
      dailyLifestyle: {
        title: 'Pali-Pali (Quick-Paced) Dynamic City Life',
        titleAr: 'ثقافة "بالي-بالي" (السرعة والإنجاز الفعال)',
        content: 'A high-energy, efficient daily rhythm where punctuality, ultra-fast public transit, round-the-clock convenience stores, and seamless digital technology define daily life.',
        contentAr: 'إيقاع حياة سريع وعالي الكفاءة يتميز بدقة المواعيد، تطور شبكات المواصلات، وتوافر المتاجر والخدمات الذكية على مدار 24 ساعة.',
      },
      greetings: {
        title: 'Polite Bowing (인사 - Insa) & Warm Deference',
        titleAr: 'الانحناء المهذب (إنسا) والتحية الراقية',
        content: 'A slight bow (15° to 30°) accompanied by "Annyeonghaseyo" is the standard respectful greeting for shopkeepers, hosts, and acquaintances.',
        contentAr: 'الانحناء الخفيف بالرأس والكتفين (15-30 درجة) مع قول "أنيونغ هاسيو" هو التحية المهذبة المعتمدة في كافة المعاملات.',
      },
      communication: {
        title: 'Nunchi (눈치) — High-Context Sensitivity & Harmony',
        titleAr: 'قيمة "نونتشي" (الذكاء الاجتماعي ومراعاة المشاعر)',
        content: 'Koreans value "Nunchi" (the art of listening and reading the room) to maintain harmony and avoid public embarrassment or confrontational speech.',
        contentAr: 'يُقدر الكوريون مهارة قراءة المواقف ومراعاة مشاعر الحاضرين للحفاظ على التناغم الاجتماعي وتجنب الإحراج أو الحديث الصدامي.',
      },
      traditions: {
        title: 'Jeong (정) — Profound Human Warmth & Loyalty',
        titleAr: 'قيمة "جيونغ" (الدفء الإنساني وكرم المشاعر)',
        content: 'An emotional bond of warmth, generosity, and genuine care that locals show toward guests and community members.',
        contentAr: 'رابطة عاطفية عميقة تعبر عن كرم الضيافة والاهتمام الصادق بمساعدة الضيف والمسافر وإكرامه.',
      },
      celebrations: {
        title: 'Seollal (New Year) & Chuseok (Harvest Thanksgiving)',
        titleAr: 'عيدا "سولال" (رأس السنة) و"تشوسوك" (الحصاد)',
        content: 'Grand family holidays where generations reunite, perform ancestral memorial rites, play folk games, and share traditional rice cakes (Songpyeon).',
        contentAr: 'أكبر الأعياد الوطنية حيث تجتمع العائلات لتبادل التهاني وتناول كعك الأرز التراثي (سونغبيون) وارتداء الأزياء التقليدية.',
      },
      socialValues: {
        title: 'Public Order, Safety & Collective Responsibility',
        titleAr: 'النظام العام والأمان والمسؤولية المجتمعية',
        content: 'South Korea is one of the safest nations globally, marked by exceptional honesty, clean public spaces, and collective respect for rules.',
        contentAr: 'تعد كوريا من أكثر دول العالم أماناً ونظافة، مع احترام فائق للقوانين والأمانة والأماكن العامة.',
      },
      modernVsTraditional: {
        title: 'Historic Palaces Beside Futuristic Smart Cities',
        titleAr: 'تعانق القصور الإمبراطورية مع ناطحات السحاب الذكية',
        content: '600-year-old Joseon royal palaces stand gracefully alongside futuristic digital media districts, high-speed KTX rail, and K-Pop entertainment hubs.',
        contentAr: 'تتجاور القصور الملكية التاريخية مع أحدث الأبراج الذكية وقطارات KTX الفائقة السرعة واستوديوهات الكيبوب العالمية.',
      },
    },
    howToBehave: {
      dos: [
        {
          title: 'Use Two Hands When Giving or Receiving Items',
          titleAr: 'استخدم كلتا اليدين عند الأخذ والعطاء',
          desc: 'Always use both hands when handing payment cards, money, drinks, or gifts as a mark of respect.',
          descAr: 'استخدم كلتا اليدين أو اسند ساعدك الأيمن بيدك اليسرى عند إعطاء أو استلام البطاقات والنقود والهدايا.',
        },
        {
          title: 'Remove Shoes When Entering Homes and Hanok Stays',
          titleAr: 'اخلع الحذاء عند دخول المنازل وأماكن الإقامة التراثية',
          desc: 'Take off outdoor footwear at the entrance foyer and step into indoor slippers.',
          descAr: 'اخلع الحذاء عند عتبة المنازل، بيوت الهانوك، وقاعات المعابد وارتدِ الخفاف المنزلية أو الجوارب النظيفة.',
        },
        {
          title: 'Wear Hanbok for Free Palace Entry',
          titleAr: 'ارتدِ الهانبوك للدخول المجاني للقصور الملكية',
          desc: 'Renting and wearing traditional Hanbok grants free entry to Gyeongbokgung and Changdeokgung palaces.',
          descAr: 'ارتداء الهانبوك الكوري يمنحك تصريح دخول مجاني لكافة القصور الإمبراطورية في سيول.',
        },
      ],
      donts: [
        {
          title: 'Never Write Names in Red Ink',
          titleAr: 'تجنب كتابة أسماء الأشخاص بالحبر الأحمر',
          desc: 'In Korean superstition, writing a living person’s name in red symbolizes death or misfortune.',
          descAr: 'كتابة اسم شخص بالحبر الأحمر ترتبط في الموروث القديم بالوفاة؛ استخدم دائماً الحبر الأسود أو الأزرق.',
        },
        {
          title: 'Do Not Stick Chopsticks Upright in Rice',
          titleAr: 'لا تغرس عيدان الأكل عمودياً في طبق الأرز',
          desc: 'Sticking chopsticks vertically resembles ancestral funeral incense rites; place them on the side rest.',
          descAr: 'غرس عيدان الطعام عمودياً في الأرز يشبه طقوس الجنائز؛ ضع العيدان دائماً على الحامل المخصص بجانب الطبق.',
        },
        {
          title: 'Do Not Leave Cash Tips (Tipping is Not Practiced)',
          titleAr: 'تجنب ترك البقشيش (الإكرامية غير متبعة)',
          desc: 'Tipping at restaurants, taxis, or cafes is not customary and may cause polite confusion.',
          descAr: 'البقشيش غير معتاد في المطاعم أو سيارات الأجرة في كوريا، وجودة الخدمة مشمولة بالكامل.',
        },
      ],
      goodToKnow: [
        {
          title: 'T-Money Card Works Nationwide',
          titleAr: 'بطاقة T-Money تعمل في كافة مدن كوريا',
          desc: 'A single T-Money transit card works on subways, city buses, and taxis in Seoul, Busan, and Jeju.',
          descAr: 'بطاقة مواصلات واحدة تكفي للتنقل بالمترو والحافلات والتاكسي في جميع أنحاء كوريا الجنوبية.',
        },
        {
          title: 'Subway Priority Seats are Reserved at All Times',
          titleAr: 'مقاعد الأولوية في المترو مخصصة دائماً',
          desc: 'Leave pink and end-row priority seats open for the elderly, pregnant, and disabled even if cars are empty.',
          descAr: 'اترك المقاعد المخصصة لكبار السن والحوامل فارغة دائماً حتى في حال خلو عربة المترو.',
        },
      ],
    },
    disclaimer: 'Cultural norms reflect general social traditions and may vary between generations. Courtesy and a friendly smile are universally appreciated.',
    disclaimerAr: 'تعكس هذه الإرشادات القيم الاجتماعية السائدة في المجتمع الكوري، واللباقة والابتسامة الصادقة كفيلة بفتح كافة الأبواب.',
  },

  'greece': {
    knowTheCulture: {
      history: {
        title: 'Cradle of Western Civilization & Philosophy',
        titleAr: 'مهد الحضارة والفلسفة والديمقراطية',
        content: 'From classical Athens and Alexander the Great to the Byzantine Empire, Greek heritage forms foundational pillars of world philosophy, arts, and democracy.',
        contentAr: 'من أثينا الكلاسيكية وسقراط وأفلاطون إلى الإمبراطورية البيزنطية، شكلت اليونان مهد الفلسفة والعلوم والفنون والديمقراطية في العالم.',
      },
      clothing: {
        title: 'Mediterranean Casual & Church Modesty',
        titleAr: 'الأناقة المتوسطية المريحة والحشمة في الأماكن الدينية',
        content: 'Breezy linen and comfortable casual resort wear in coastal islands; conservative coverage (shoulders and knees) required in monasteries and churches.',
        contentAr: 'تسود الملابس الكتانية الخفيفة والمريحة في الجزر والمدن، مع ضرورة تغطية الكتفين والركبتين عند زيارة الأديرة التاريخية.',
      },
      foodCulture: {
        title: 'Mediterranean Gastronomy & Sharing Mezedes',
        titleAr: 'المطبخ المتوسطي الصحي ومشاركة أطباق المازة',
        content: 'Centuries of olive oil culinary mastery, fresh seafood, feta cheese, and leisurely communal dining lasting for hours.',
        contentAr: 'تقاليد عريقة تعتمد على زيت الزيتون البكر الممتاز، الخضار، المأكولات البحرية الطازجة، وتناول الوجبات العائلية الممتدة لساعات.',
      },
      familySocial: {
        title: 'Sacred Hospitality (Philoxenia) & Family Centricity',
        titleAr: 'كرم الضيافة (فيلوكسينيا) والترابط الأسري',
        content: 'An ancient Hellenic duty to treat foreign visitors with deep warmth, generous hospitality, and heartfelt respect.',
        contentAr: 'فضيلة يونانية تاريخية تعتبر إكرام المسافر والترحيب به واجباً إنسانياً نبيلاً يعكس كرم وسخاء أهل البلد.',
      },
      dailyLifestyle: {
        title: 'Siga-Siga (Slow Living) & Evening Promenade (Volta)',
        titleAr: 'ثقافة "سيغا-سيغا" (التأني والاستمتاع بالحياة)',
        content: 'A relaxed lifestyle prioritizing good conversations, late dinners (after 9:00 PM), and sunset strolls along plazas and harbors.',
        contentAr: 'نمط حياة هادئ يركز على راحة البال، العشاء المتأخر بعد 9:00 مساءً، والتنزه المسائي (Volta) في الميادين والمرافئ الساحلية.',
      },
      greetings: {
        title: 'Warm Eye Contact & "Kalimera / Yia Sas"',
        titleAr: 'التحية الدافئة والتواصل البصري الصادق',
        content: 'Firm handshakes and friendly eye contact among strangers; cheerful kisses on both cheeks among friends and acquaintances.',
        contentAr: 'المصافحة الواثقة مع التواصل البصري المباشر وقول "كالي ميرا" صباحاً أو "ياساس" تحية للأشخاص والمجموعات.',
      },
      communication: {
        title: 'Passionate Expression & Animated Gestures',
        titleAr: 'التعبير العاطفي ولغة الجسد الحيوية',
        content: 'Lively vocal inflection and hand movements indicate passion and deep conversational engagement, not anger.',
        contentAr: 'يتحدث اليونانيون بحماس وعاطفة ظاهرة وحركات يد تعبيرية تعكس التفاعل الصادق والمحبة.',
      },
      traditions: {
        title: 'Kefi (Joy of Living) & Festive Music',
        titleAr: 'قيمة "كيفي" (البهجة وحب الحياة والموسيقى)',
        content: 'A vibrant cultural state of high spirits, spontaneous singing, traditional bouzouki music, and celebrating the moment.',
        contentAr: 'حالة من الفرح والحيوية والاحتفاء باللحظة الحاضرة ومشاركة الموسيقى والموائد الدافئة.',
      },
      celebrations: {
        title: 'Pascha (Easter) & Summer Island Panigiria',
        titleAr: 'عيد الفصح واحتفالات القرى الصيفية (Panigiria)',
        content: 'Deeply celebrated festivals featuring candlelit processions, folk dancing in village squares, and shared community feasts.',
        contentAr: 'مهرجانات شعبية عامرة بمسيرات الشموع والرقصات الفلكلورية والولائم المفتوحة في ساحات القرى والجزر.',
      },
      socialValues: {
        title: 'Freedom, Community Pride & Open Dialogue',
        titleAr: 'الحرية والاعتزاز الوطني والحوار المفتوح',
        content: 'Pride in Greek heritage, open cafe debates on history and sports, and strong civic solidarity.',
        contentAr: 'اعتزاز كبير بالتراث اليوناني، حب الحوار والنقاش في المقاهي المفتوحة، والتضامن الإنساني.',
      },
      modernVsTraditional: {
        title: 'Ancient Ruins Integrated into Modern Urban Life',
        titleAr: 'انسجام الآثار الإغريقية مع نبض العاصمة الحديثة',
        content: 'The 2,500-year-old Parthenon watches over vibrant rooftop cafes, bustling nightlife, and modern Mediterranean art galleries.',
        contentAr: 'يقف معبد البارثينون شامخاً منذ 2,500 عام فوق أفق أثينا العصري المليء بالمقاهي البانورامية والمعارض الفنية الحديثة.',
      },
    },
    howToBehave: {
      dos: [
        {
          title: 'Embrace Leisurely Multi-Course Dining',
          titleAr: 'استمتع بالوجبات الهادئة ومشاركة الأطباق',
          desc: 'Dining in tavernas is an unrushed social celebration; take your time to savor fresh mezze and seafood.',
          descAr: 'تناول الطعام في المطاعم اليونانية تجربة ممتعة تمتد لساعات دون استعجال، فاستمتع بالمقبلات الطازجة.',
        },
        {
          title: 'Dress Modestly in Monasteries (Meteora)',
          titleAr: 'التزم بالحشمة في الأديرة التاريخية',
          desc: 'Ensure shoulders and knees are covered when entering historic Orthodox monasteries and churches.',
          descAr: 'احرص على تغطية الكتفين والركبتين عند زيارة أديرة ميتيورا والكنائس الأثرية.',
        },
      ],
      donts: [
        {
          title: 'Never Use the "Moutza" Open-Palm Hand Gesture',
          titleAr: 'تجنب إشارة الكف المفتوح الموجه (الموتزا Moutza)',
          desc: 'Showing an open palm facing someone’s face with fingers spread is an ancient, offensive insult in Greece.',
          descAr: 'توجيه راحة اليد المفتوحة بأصابع مفرودة نحو وجه شخص آخر يعتبر إهانة بالغة في الثقافة اليونانية.',
        },
      ],
      goodToKnow: [
        {
          title: 'Tipping in Greece',
          titleAr: 'أعراف البقشيش في اليونان',
          desc: 'Rounding up the bill or leaving 5-10% in cash for good service in tavernas is customary and appreciated.',
          descAr: 'ترك إكرامية بسيطة (5-10%) نقداً أو جبر المبلغ للأعلى في المطاعم أمر شائع ومُقدَّر لحسن الخدمة.',
        },
      ],
    },
    disclaimer: 'Social customs reflect traditional Hellenic hospitality. Showing genuine friendliness and respect ensures an unforgettable experience.',
    disclaimerAr: 'تعكس هذه الإرشادات قيم كرم الضيافة اليونانية الأصيلة، والتعامل باحترام وود يضمن لك رحلة ممتعة.',
  },
};
