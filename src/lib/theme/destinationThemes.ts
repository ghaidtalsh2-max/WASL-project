export interface DestinationTheme {
  id: string;
  name: string;
  nameAr: string;
  primary: string; // Hex / HSL
  secondary: string;
  accent: string;
  glow: string;
  bgGradient: string;
  cardBg: string;
  borderGlow: string;
  particleType: 'sakura' | 'sand' | 'stars' | 'bubbles' | 'leaves' | 'majestic';
  particleColor: string;
  description: string;
  atmosphereName: string;
  atmosphereNameAr: string;
}

export const defaultThemes: Record<string, DestinationTheme> = {
  default: {
    id: 'default',
    name: 'Cosmic WASL',
    nameAr: 'وصل الكوني',
    primary: '#EC4899', // Pink rose
    secondary: '#8B5CF6', // Soft purple
    accent: '#38BDF8', // Sky cyan
    glow: 'rgba(236, 72, 153, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #17112E 0%, #0B0E17 60%, #06080F 100%)',
    cardBg: 'rgba(19, 23, 39, 0.75)',
    borderGlow: 'rgba(236, 72, 153, 0.3)',
    particleType: 'stars',
    particleColor: '#F472B6',
    description: 'Universal cosmic human connection',
    atmosphereName: 'Cosmic Horizon',
    atmosphereNameAr: 'الأفق الكوني',
  },
  japan: {
    id: 'japan',
    name: 'Japan',
    nameAr: 'اليابان',
    primary: '#F472B6', // Sakura pink
    secondary: '#6366F1', // Deep indigo
    accent: '#FDA4AF', // Soft cherry
    glow: 'rgba(244, 114, 182, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #25122E 0%, #0F1226 55%, #080A16 100%)',
    cardBg: 'rgba(23, 20, 42, 0.78)',
    borderGlow: 'rgba(244, 114, 182, 0.35)',
    particleType: 'sakura',
    particleColor: '#FDA4AF',
    description: 'Sakura-inspired blossom elegance with deep indigo night',
    atmosphereName: 'Sakura & Night Indigo',
    atmosphereNameAr: 'أزهار الكرز ونيلي الليل',
  },
  'saudi-arabia': {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    primary: '#FB7185', // Taif Rose
    secondary: '#F59E0B', // Desert Gold
    accent: '#10B981', // Oasis Green
    glow: 'rgba(251, 113, 133, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #29151B 0%, #0E1424 55%, #070B16 100%)',
    cardBg: 'rgba(24, 22, 38, 0.78)',
    borderGlow: 'rgba(251, 113, 133, 0.35)',
    particleType: 'sand',
    particleColor: '#FBBF24',
    description: 'Taif rose pink, warm golden desert dunes & royal deep navy',
    atmosphereName: 'Taif Rose & Desert Dunes',
    atmosphereNameAr: 'ورد الطائف وكثبان الذهب',
  },
  turkey: {
    id: 'turkey',
    name: 'Turkey',
    nameAr: 'تركيا',
    primary: '#FB923C', // Warm Terracotta
    secondary: '#06B6D4', // Bosphorus Turquoise
    accent: '#FDE047', // Warm Cream Gold
    glow: 'rgba(251, 146, 60, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #2A1713 0%, #0D1728 55%, #060C17 100%)',
    cardBg: 'rgba(26, 22, 36, 0.78)',
    borderGlow: 'rgba(251, 146, 60, 0.35)',
    particleType: 'majestic',
    particleColor: '#38BDF8',
    description: 'Warm Anatolian terracotta with deep Bosphorus turquoise',
    atmosphereName: 'Bosphorus & Anatolian Terracotta',
    atmosphereNameAr: 'البوسفور والفخار الأناضولي',
  },
  france: {
    id: 'france',
    name: 'France',
    nameAr: 'فرنسا',
    primary: '#60A5FA', // Parisian Azure
    secondary: '#F472B6', // Muted Rose
    accent: '#FEF08A', // Warm Ivory
    glow: 'rgba(96, 165, 250, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #151D33 0%, #0D1224 55%, #070914 100%)',
    cardBg: 'rgba(19, 24, 42, 0.78)',
    borderGlow: 'rgba(96, 165, 250, 0.32)',
    particleType: 'stars',
    particleColor: '#93C5FD',
    description: 'Parisian blue, champagne ivory & muted rose elegance',
    atmosphereName: 'Parisian Azure & Champagne',
    atmosphereNameAr: 'أزرق باريسي ووردي أنيق',
  },
  'united-kingdom': {
    id: 'united-kingdom',
    name: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    primary: '#F87171', // Royal Crimson
    secondary: '#3B82F6', // Westminster Blue
    accent: '#E2E8F0', // London Mist
    glow: 'rgba(248, 113, 113, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #24141E 0%, #0E1326 55%, #060914 100%)',
    cardBg: 'rgba(20, 23, 40, 0.78)',
    borderGlow: 'rgba(248, 113, 113, 0.3)',
    particleType: 'stars',
    particleColor: '#60A5FA',
    description: 'Westminster navy, royal crimson & subtle London mist',
    atmosphereName: 'Westminster & Royal Crimson',
    atmosphereNameAr: 'أزرق وستمنستر والقرمزي الملكي',
  },
  'south-korea': {
    id: 'south-korea',
    name: 'South Korea',
    nameAr: 'كوريا الجنوبية',
    primary: '#F43F5E', // Korean Rose
    secondary: '#06B6D4', // Seoul Cyber Cyan
    accent: '#A855F7', // Hanbok Violet
    glow: 'rgba(244, 63, 94, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #281123 0%, #0D152B 55%, #060A18 100%)',
    cardBg: 'rgba(22, 20, 42, 0.78)',
    borderGlow: 'rgba(244, 63, 94, 0.35)',
    particleType: 'sakura',
    particleColor: '#38BDF8',
    description: 'Seoul futuristic neon cyan & traditional Korean hanbok rose',
    atmosphereName: 'Seoul Neon & Lotus Blossom',
    atmosphereNameAr: 'نيون سيئول وزهرة اللوتس',
  },
  'united-states': {
    id: 'united-states',
    name: 'United States',
    nameAr: 'الولايات المتحدة',
    primary: '#38BDF8', // Atlantic Blue
    secondary: '#EF4444', // Liberty Red
    accent: '#FCD34D', // Gold
    glow: 'rgba(56, 189, 248, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #121E36 0%, #0C1224 55%, #050814 100%)',
    cardBg: 'rgba(18, 24, 44, 0.78)',
    borderGlow: 'rgba(56, 189, 248, 0.32)',
    particleType: 'stars',
    particleColor: '#BAE6FD',
    description: 'Atlantic blue, liberty crimson & cosmopolitan brilliance',
    atmosphereName: 'Cosmopolitan Skyline',
    atmosphereNameAr: 'أفق المدن الكبرى',
  },
  germany: {
    id: 'germany',
    name: 'Germany',
    nameAr: 'ألمانيا',
    primary: '#F59E0B', // Amber Gold
    secondary: '#10B981', // Forest Green
    accent: '#94A3B8', // Industrial Steel
    glow: 'rgba(245, 158, 11, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #261E14 0%, #101622 55%, #080B12 100%)',
    cardBg: 'rgba(24, 25, 34, 0.78)',
    borderGlow: 'rgba(245, 158, 11, 0.3)',
    particleType: 'leaves',
    particleColor: '#FCD34D',
    description: 'Black Forest green, precision steel & amber warmth',
    atmosphereName: 'Black Forest & Modern Precision',
    atmosphereNameAr: 'الغابة السوداء والدقة الحديثة',
  },
  uae: {
    id: 'uae',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    primary: '#F59E0B', // Desert Gold
    secondary: '#10B981', // Emerald
    accent: '#38BDF8', // Gulf Cyan
    glow: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #2B1D12 0%, #0D1726 55%, #070B14 100%)',
    cardBg: 'rgba(25, 24, 38, 0.78)',
    borderGlow: 'rgba(245, 158, 11, 0.35)',
    particleType: 'sand',
    particleColor: '#FDE68A',
    description: 'Futuristic Gulf skyline, oasis emerald & brilliant gold',
    atmosphereName: 'Arabian Gulf Brilliance',
    atmosphereNameAr: 'إشراقة الخليج العربي',
  },
  egypt: {
    id: 'egypt',
    name: 'Egypt',
    nameAr: 'مصر',
    primary: '#F59E0B', // Pharaonic Gold
    secondary: '#0284C7', // Nile Lapis Blue
    accent: '#E11D48', // Lotus Crimson
    glow: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #2A1C12 0%, #0E1528 55%, #070A16 100%)',
    cardBg: 'rgba(25, 23, 38, 0.78)',
    borderGlow: 'rgba(245, 158, 11, 0.35)',
    particleType: 'sand',
    particleColor: '#FBBF24',
    description: 'Pharaonic gold, Nile lapis & ancient majesty',
    atmosphereName: 'Nile Lapis & Pharaonic Gold',
    atmosphereNameAr: 'ذهب الفراعنة ولازورد النيل',
  },
  morocco: {
    id: 'morocco',
    name: 'Morocco',
    nameAr: 'المغرب',
    primary: '#2563EB', // Majorelle Blue
    secondary: '#EA580C', // Saffron Terracotta
    accent: '#10B981', // Atlas Cedar Green
    glow: 'rgba(37, 99, 235, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #151D38 0%, #181224 55%, #090814 100%)',
    cardBg: 'rgba(22, 23, 40, 0.78)',
    borderGlow: 'rgba(37, 99, 235, 0.35)',
    particleType: 'majestic',
    particleColor: '#60A5FA',
    description: 'Majorelle blue, Atlas cedar & saffron terracotta',
    atmosphereName: 'Majorelle Blue & Saffron',
    atmosphereNameAr: 'أزرق ماجوريل والزعفران',
  },
  italy: {
    id: 'italy',
    name: 'Italy',
    nameAr: 'إيطاليا',
    primary: '#10B981', // Tuscan Cypress
    secondary: '#E11D48', // Venetian Coral
    accent: '#F59E0B', // Mediterranean Sun
    glow: 'rgba(16, 185, 129, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #142820 0%, #0E1526 55%, #060914 100%)',
    cardBg: 'rgba(20, 26, 38, 0.78)',
    borderGlow: 'rgba(16, 185, 129, 0.32)',
    particleType: 'leaves',
    particleColor: '#6EE7B7',
    description: 'Tuscan hills, Venetian coral & Mediterranean sun',
    atmosphereName: 'Tuscan Cypress & Venetian Coral',
    atmosphereNameAr: 'سرو توسكانا ومرجان البندقية',
  },
  spain: {
    id: 'spain',
    name: 'Spain',
    nameAr: 'إسبانيا',
    primary: '#EF4444', // Flamenco Crimson
    secondary: '#F59E0B', // Andalusian Ochre
    accent: '#8B5CF6', // Alhambra Twilight
    glow: 'rgba(239, 68, 68, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #2A1215 0%, #101426 55%, #070914 100%)',
    cardBg: 'rgba(25, 21, 38, 0.78)',
    borderGlow: 'rgba(239, 68, 68, 0.32)',
    particleType: 'majestic',
    particleColor: '#FCA5A5',
    description: 'Flamenco crimson, Andalusian sun & Alhambra twilight',
    atmosphereName: 'Andalusian Ochre & Flamenco',
    atmosphereNameAr: 'مغرة الأندلس والقرمزي الإسباني',
  },
  malaysia: {
    id: 'malaysia',
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    primary: '#06B6D4', // Tropical Turquoise
    secondary: '#F59E0B', // Hibiscus Gold
    accent: '#10B981', // Rainforest Jade
    glow: 'rgba(6, 182, 212, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #112630 0%, #0C1524 55%, #060A14 100%)',
    cardBg: 'rgba(19, 25, 40, 0.78)',
    borderGlow: 'rgba(6, 182, 212, 0.32)',
    particleType: 'leaves',
    particleColor: '#67E8F9',
    description: 'Rainforest jade, tropical turquoise & hibiscus gold',
    atmosphereName: 'Tropical Turquoise & Rainforest',
    atmosphereNameAr: 'فيروز استوائي وغابات المطر',
  },
  china: {
    id: 'china',
    name: 'China',
    nameAr: 'الصين',
    primary: '#E11D48', // Imperial Crimson / Rose
    secondary: '#F59E0B', // Silk Gold / Amber
    accent: '#10B981', // Jade Green
    glow: 'rgba(225, 29, 72, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #2E1218 0%, #121024 55%, #080712 100%)',
    cardBg: 'rgba(26, 20, 36, 0.82)',
    borderGlow: 'rgba(225, 29, 72, 0.35)',
    particleType: 'majestic',
    particleColor: '#FDE047',
    description: 'Imperial crimson, golden silk & jade harmony',
    atmosphereName: 'Imperial Crimson & Silk Gold',
    atmosphereNameAr: 'القرمزي الإمبراطوري والحرير الذهبي',
  },
  kuwait: {
    id: 'kuwait',
    name: 'Kuwait',
    nameAr: 'الكويت',
    primary: '#06B6D4', // Gulf Azure
    secondary: '#10B981', // Oasis Emerald
    accent: '#F59E0B', // Desert Sand Gold
    glow: 'rgba(6, 182, 212, 0.38)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #12222E 0%, #0D1626 55%, #060914 100%)',
    cardBg: 'rgba(20, 24, 40, 0.78)',
    borderGlow: 'rgba(6, 182, 212, 0.32)',
    particleType: 'sand',
    particleColor: '#38BDF8',
    description: 'Kuwait towers azure, emerald oasis & Arabian Gulf breeze',
    atmosphereName: 'Arabian Gulf Azure & Towers',
    atmosphereNameAr: 'أزرق الخليج وأبراج الكويت',
  },
  mauritius: {
    id: 'mauritius',
    name: 'Mauritius',
    nameAr: 'موريشيوس',
    primary: '#14B8A6', // Tropical Ocean Turquoise / Teal
    secondary: '#F43F5E', // Coral Rose
    accent: '#FBBF24', // Sun Amber Gold
    glow: 'rgba(20, 184, 166, 0.42)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #0D282E 0%, #0B1728 55%, #050B14 100%)',
    cardBg: 'rgba(16, 28, 44, 0.8)',
    borderGlow: 'rgba(20, 184, 166, 0.38)',
    particleType: 'bubbles',
    particleColor: '#2DD4BF',
    description: 'Tropical turquoise lagoon, coral reefs & volcanic sunset glow',
    atmosphereName: 'Turquoise Lagoons & Coral Sunset',
    atmosphereNameAr: 'الفيروز الاستوائي والشعاب المرجانية',
  },
  greece: {
    id: 'greece',
    name: 'Greece',
    nameAr: 'اليونان',
    primary: '#38BDF8', // Aegean Sky Blue
    secondary: '#818CF8', // Mediterranean Indigo
    accent: '#FDE047', // Sunlit Marble White / Gold
    glow: 'rgba(56, 189, 248, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% 10%, #0F2038 0%, #0B1428 55%, #050A16 100%)',
    cardBg: 'rgba(16, 24, 46, 0.8)',
    borderGlow: 'rgba(56, 189, 248, 0.35)',
    particleType: 'stars',
    particleColor: '#7DD3FC',
    description: 'Aegean sea azure, sunlit Cycladic white & Mediterranean warmth',
    atmosphereName: 'Aegean Azure & Cycladic Sun',
    atmosphereNameAr: 'أزرق بحر إيجه وشمس كيكلادس',
  },
};

/**
 * Returns a dynamically synthesized or predefined theme for any country name / slug
 */
export function getDestinationTheme(destinationNameOrSlug?: string): DestinationTheme {
  if (!destinationNameOrSlug) return defaultThemes.default;

  const normalized = destinationNameOrSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-');

  // Direct match
  if (defaultThemes[normalized]) {
    return defaultThemes[normalized];
  }

  // Partial matches
  for (const [key, theme] of Object.entries(defaultThemes)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return theme;
    }
  }

  // Name match against standard list
  const nameLower = destinationNameOrSlug.toLowerCase();
  if (nameLower.includes('china') || nameLower.includes('beijing') || nameLower.includes('shanghai') || nameLower.includes('guangzhou') || nameLower.includes('shenzhen') || nameLower.includes('صين')) {
    return defaultThemes.china;
  }
  if (nameLower.includes('kuwait') || nameLower.includes('كويت')) {
    return defaultThemes.kuwait;
  }
  if (nameLower.includes('japan') || nameLower.includes('tokyo') || nameLower.includes('kyoto') || nameLower.includes('osaka') || nameLower.includes('يابان')) {
    return defaultThemes.japan;
  }
  if (nameLower.includes('saudi') || nameLower.includes('riyadh') || nameLower.includes('jeddah') || nameLower.includes('mecca') || nameLower.includes('سعودي')) {
    return defaultThemes['saudi-arabia'];
  }
  if (nameLower.includes('turk') || nameLower.includes('istanbul') || nameLower.includes('ankara') || nameLower.includes('تركيا')) {
    return defaultThemes.turkey;
  }
  if (nameLower.includes('france') || nameLower.includes('paris') || nameLower.includes('lyon') || nameLower.includes('فرنسا')) {
    return defaultThemes.france;
  }
  if (nameLower.includes('britain') || nameLower.includes('uk') || nameLower.includes('london') || nameLower.includes('england') || nameLower.includes('بريطانيا')) {
    return defaultThemes['united-kingdom'];
  }
  if (nameLower.includes('korea') || nameLower.includes('seoul') || nameLower.includes('busan') || nameLower.includes('كوريا')) {
    return defaultThemes['south-korea'];
  }
  if (nameLower.includes('america') || nameLower.includes('usa') || nameLower.includes('york') || nameLower.includes('أمريكا') || nameLower.includes('امريكا')) {
    return defaultThemes['united-states'];
  }
  if (nameLower.includes('germany') || nameLower.includes('berlin') || nameLower.includes('munich') || nameLower.includes('ألمانيا') || nameLower.includes('المانيا')) {
    return defaultThemes.germany;
  }
  if (nameLower.includes('emirates') || nameLower.includes('dubai') || nameLower.includes('abu dhabi') || nameLower.includes('uae') || nameLower.includes('إمارات') || nameLower.includes('امارات')) {
    return defaultThemes.uae;
  }
  if (nameLower.includes('egypt') || nameLower.includes('cairo') || nameLower.includes('alexandria') || nameLower.includes('مصر')) {
    return defaultThemes.egypt;
  }
  if (nameLower.includes('morocco') || nameLower.includes('marrakech') || nameLower.includes('casablanca') || nameLower.includes('rabat') || nameLower.includes('المغرب')) {
    return defaultThemes.morocco;
  }
  if (nameLower.includes('ital') || nameLower.includes('rome') || nameLower.includes('milan') || nameLower.includes('إيطاليا') || nameLower.includes('ايطاليا')) {
    return defaultThemes.italy;
  }
  if (nameLower.includes('spain') || nameLower.includes('madrid') || nameLower.includes('barcelona') || nameLower.includes('إسبانيا') || nameLower.includes('اسبانيا')) {
    return defaultThemes.spain;
  }
  if (nameLower.includes('malaysia') || nameLower.includes('kuala') || nameLower.includes('ماليزيا')) {
    return defaultThemes.malaysia;
  }

  // Dynamic algorithmic theme generation for arbitrary global destinations
  let hash = 0;
  for (let i = 0; i < destinationNameOrSlug.length; i++) {
    hash = destinationNameOrSlug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 45) % 360;
  const hue3 = (hue1 + 180) % 360;

  return {
    id: normalized,
    name: destinationNameOrSlug,
    nameAr: destinationNameOrSlug,
    primary: `hsl(${hue1}, 85%, 65%)`,
    secondary: `hsl(${hue2}, 75%, 55%)`,
    accent: `hsl(${hue3}, 80%, 70%)`,
    glow: `hsla(${hue1}, 85%, 65%, 0.35)`,
    bgGradient: `radial-gradient(ellipse at 50% 10%, hsl(${hue1}, 40%, 12%) 0%, #0D1222 55%, #060812 100%)`,
    cardBg: 'rgba(20, 22, 38, 0.78)',
    borderGlow: `hsla(${hue1}, 85%, 65%, 0.3)`,
    particleType: 'stars',
    particleColor: `hsl(${hue1}, 85%, 70%)`,
    description: `Dynamic cultural aura for ${destinationNameOrSlug}`,
    atmosphereName: `${destinationNameOrSlug} Luminescence`,
    atmosphereNameAr: `أطياف ${destinationNameOrSlug}`,
  };
}
