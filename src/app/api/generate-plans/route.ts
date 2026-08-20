import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { findCountry, COUNTRIES } from '@/lib/data/countries';

export async function POST(req: NextRequest) {
  try {
    const {
      interests,
      duration,
      dates,
      travelStyle,
      preferences,
      purpose,
      origin,
      freeText,
      apiKey,
      provider,
    } = await req.json();

    const prompt = `User profile for custom trip plan generation:
- Interests: ${Array.isArray(interests) && interests.length > 0 ? interests.join(', ') : 'Cultural sights, local cuisine, landmarks, exploration'}
- Duration: ${duration || '1-2 weeks'}
- Travel dates / Time of year: ${dates || 'Upcoming season'}
- Travel style: ${travelStyle || 'Curious cultural traveler'}
- Special preferences / dietary: ${preferences || 'Halal-friendly, authentic experiences'}
- Purpose: ${purpose || 'travel'}
- Origin: ${origin || 'Any'}
- Free-text description: "${freeText || ''}"

Generate exactly 2 diverse, authentic, exciting suggested trip plans considering seasonal availability, attractions, museums, and local activities in strictly valid JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.planGeneration,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.4,
    });

    if (aiRes.error) {
      // Fallback 2 diverse plans
      const fallbackPlans = [
        {
          id: 'plan-1',
          destinationCountry: 'Japan',
          destinationCountryAr: 'اليابان',
          destinationCity: 'Tokyo & Kyoto',
          destinationCityAr: 'طوكيو وكيوتو',
          title: 'Cultural Wonders & Modern Marvels',
          titleAr: 'عجائب الثقافة والحضارة المعاصرة',
          tagline: 'Historic temples, neon skylines, and world-class culinary art',
          taglineAr: 'معابد تاريخية عريقة، أفق مدني مذهل، وفنون طهي استثنائية',
          duration: duration === 'days' ? '5-7 Days' : duration === 'weeks' ? '2 Weeks' : '1 Month',
          seasonalVibe: 'Mild exploration season & vibrant community life',
          seasonalVibeAr: 'اعتدال الطقس وحيوية الفعاليات المجتمعية',
          touristAttractions: ['Senso-ji Temple', 'Shibuya Sky', 'Fushimi Inari-taisha'],
          museums: ['Tokyo National Museum', 'Mori Art Museum', 'Kyoto National Museum'],
          eventsAndActivities: ['Traditional Tea Ceremony', 'Shinkansen Bullet Train', 'Gion Evening Walk'],
          whyRecommended: 'Ideal for combining heritage, modern technology, and curated dining experiences.',
          whyRecommendedAr: 'الخيار الأمثل للجمع بين الأصالة التراثية والتطور التقني والمطاعم الراقية.',
        },
        {
          id: 'plan-2',
          destinationCountry: 'Turkey',
          destinationCountryAr: 'تركيا',
          destinationCity: 'Istanbul',
          destinationCityAr: 'إسطنبول',
          title: 'The Crossroad of Continents & Heritage',
          titleAr: 'ملتقى القارات وسحر التاريخ العريق',
          tagline: 'Bosphorus breezes, Grand Bazaar treasures, and Ottoman splendor',
          taglineAr: 'نسائم البوسفور، روائع البازار الكبير، وعراقة العمارة العثمانية',
          duration: duration === 'days' ? '4-5 Days' : duration === 'weeks' ? '10-14 Days' : '3 Weeks',
          seasonalVibe: 'Enchanting coastal air & lively cafe culture',
          seasonalVibeAr: 'أجواء بحرية ساحرة ومقاهٍ نابضة بالحياة',
          touristAttractions: ['Hagia Sophia', 'Topkapi Palace', 'Galata Tower'],
          museums: ['Istanbul Archaeology Museums', 'Pera Museum', 'Turkish & Islamic Arts Museum'],
          eventsAndActivities: ['Bosphorus Sunset Cruise', 'Historic Spice Market Tasting', 'Kadikoy Cultural Stroll'],
          whyRecommended: 'Perfect for vibrant history, rich architecture, and abundant Halal food variety.',
          whyRecommendedAr: 'وجهة استثنائية لعشاق التاريخ والفنون وتنوع المأكولات الحلال.',
        },
      ];
      return NextResponse.json({ success: true, suggestedPlans: fallbackPlans, warning: aiRes.error });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      if (parsed.suggestedPlans && Array.isArray(parsed.suggestedPlans)) {
        return NextResponse.json({ success: true, suggestedPlans: parsed.suggestedPlans });
      }
      throw new Error('Invalid suggestedPlans format');
    } catch {
      return NextResponse.json({
        success: true,
        suggestedPlans: [
          {
            id: 'plan-1',
            destinationCountry: 'Japan',
            destinationCountryAr: 'اليابان',
            destinationCity: 'Tokyo',
            destinationCityAr: 'طوكيو',
            title: 'Tokyo Cultural Journey',
            titleAr: 'رحلة استكشاف طوكيو الثقافية',
            tagline: 'Blend of futuristic energy and timeless traditions',
            taglineAr: 'مزيج من الطاقة المستقبلية والتقاليد الخالدة',
            duration: '10 Days',
            seasonalVibe: 'Pleasant city walking atmosphere',
            seasonalVibeAr: 'أجواء ممتعة ومثالية للتنقل والاستكشاف',
            touristAttractions: ['Tokyo Tower', 'Senso-ji', 'Meiji Jingu'],
            museums: ['Tokyo National Museum', 'Edo-Tokyo Museum'],
            eventsAndActivities: ['Asakusa Street Food', 'Shinjuku Gyoen Walk', 'Akihabara Tech'],
            whyRecommended: 'Rich in cultural insights and modern safety.',
            whyRecommendedAr: 'رحلة ثرية بالمعرفة والأمان العالي.',
          },
          {
            id: 'plan-2',
            destinationCountry: 'Turkey',
            destinationCountryAr: 'تركيا',
            destinationCity: 'Istanbul',
            destinationCityAr: 'إسطنبول',
            title: 'Istanbul Heritage & Scenery',
            titleAr: 'تراث إسطنبول وسحر البوسفور',
            tagline: 'Where East meets West with warmth and history',
            taglineAr: 'حيث يلتقي الشرق والغرب بكرم الضيافة وعمق التاريخ',
            duration: '7 Days',
            seasonalVibe: 'Bosphorus breezes and lively bazaars',
            seasonalVibeAr: 'نسائم البحر وأسواق التراث النابضة',
            touristAttractions: ['Hagia Sophia', 'Blue Mosque', 'Bosphorus Bridge'],
            museums: ['Topkapi Palace', 'Istanbul Modern'],
            eventsAndActivities: ['Bosphorus Cruise', 'Grand Bazaar Tour', 'Turkish Coffee Experience'],
            whyRecommended: 'Rich culinary culture and historic monuments.',
            whyRecommendedAr: 'تنوع حضاري فريد ومأكولات غنية ومميزة.',
          },
        ],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Plan generation failed' }, { status: 500 });
  }
}
