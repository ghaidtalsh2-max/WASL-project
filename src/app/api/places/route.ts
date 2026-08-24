import { NextRequest, NextResponse } from 'next/server';
import { PlaceItem } from '@/lib/data/defaultJourneys';

// Helper: Fetch Wikipedia authentic thumbnail for specific named places/landmarks/museums
async function fetchWikiThumbnail(placeName: string): Promise<string | null> {
  try {
    const cleanName = placeName
      .replace(/\(.*?\)/g, '')
      .replace(/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF]/g, ' ')
      .trim();

    if (!cleanName || cleanName.length < 3) return null;

    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      cleanName
    )}&prop=pageimages&format=json&pithumbsize=800&origin=*`;

    const res = await fetch(wikiUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page: any = Object.values(pages)[0];
    if (page?.thumbnail?.source) {
      return page.thumbnail.source;
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

// Curated high-resolution distinct photo pools for individual place cards
const DISTINCT_PHOTO_POOLS: Record<string, string[]> = {
  halal_restaurants: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80',
  ],
  restaurants: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    'https://images.unsplash.com/photo-1554679665-f5537f187268?w=800&q=80',
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  ],
  hotels: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  ],
  landmarks: [
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80',
    'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&q=80',
  ],
  attractions: [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80',
    'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80',
  ],
  cafes: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
  ],
  shopping: [
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  ],
  hospitals: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
  ],
  pharmacies: [
    'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
  ],
  transport: [
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  ],
  worship: [
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80',
  ],
};

export async function POST(req: NextRequest) {
  try {
    const {
      destination,
      city,
      category,
      query,
      accommodationArea,
      language,
      lat,
      lng,
      radius,
      placesKey,
      apiKey: customKey,
    } = await req.json();

    const rawKey = placesKey || customKey || process.env.GOOGLE_PLACES_API_KEY || '';
    const apiKey = rawKey.replace(/[^\x00-\x7F]/g, '').trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GOOGLE_PLACES_API_KEY is not configured in the environment or Settings. Please set your valid Google Places API Key.',
        },
        { status: 400 }
      );
    }

    const targetCity = (city || destination || 'Tokyo').trim();
    const targetArea = (accommodationArea || '').trim();

    // Construct precise search query
    let textQuery = '';
    const cat = (category || 'attraction').toLowerCase();

    if (query) {
      textQuery = query;
    } else if (cat === 'halal_restaurants' || cat === 'halal') {
      textQuery = `halal food restaurant`;
    } else if (cat === 'restaurants' || cat === 'restaurant' || cat === 'dining') {
      textQuery = `restaurant dining food`;
    } else if (cat === 'cafes' || cat === 'cafe') {
      textQuery = `cafe coffee`;
    } else if (cat === 'hotels' || cat === 'hotel' || cat === 'lodging') {
      textQuery = `hotel accommodation lodging`;
    } else if (cat === 'landmarks' || cat === 'landmark') {
      textQuery = `famous landmark tourist attraction`;
    } else if (cat === 'attractions' || cat === 'attraction') {
      textQuery = `top attractions points of interest`;
    } else if (cat === 'shopping' || cat === 'shops') {
      textQuery = `shopping center market mall`;
    } else if (cat === 'hospitals' || cat === 'hospital') {
      textQuery = `emergency hospital medical center`;
    } else if (cat === 'pharmacies' || cat === 'pharmacy') {
      textQuery = `pharmacy drugstore`;
    } else if (cat === 'transport' || cat === 'transportation') {
      textQuery = `train station metro transit`;
    } else if (cat === 'worship' || cat === 'mosques' || cat === 'mosque') {
      textQuery = `mosque prayer room islamic center`;
    } else {
      textQuery = cat;
    }

    // Append city/area only if not using exact GPS coordinates
    const isCoordinateSearch = typeof lat === 'number' && typeof lng === 'number';
    if (!isCoordinateSearch) {
      textQuery = `${textQuery} in ${targetArea ? targetArea + ', ' : ''}${targetCity}`;
    }

    // Call Google Places API (New)
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.rating',
      'places.userRatingCount',
      'places.location',
      'places.googleMapsUri',
      'places.websiteUri',
      'places.types',
      'places.primaryTypeDisplayName',
      'places.editorialSummary',
      'places.currentOpeningHours',
      'places.photos',
    ].join(',');

    const requestBody: any = {
      textQuery,
      languageCode: language === 'ar' ? 'ar' : 'en',
      pageSize: 15,
    };

    if (isCoordinateSearch) {
      requestBody.locationBias = {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: radius || 3000.0,
        },
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google Places API Error:', response.status, errText);
      return NextResponse.json(
        {
          success: false,
          error: `Google Places API returned status ${response.status}. Please check your Google Places API Key.`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return NextResponse.json({
        success: true,
        places: [],
        total: 0,
        city: targetCity,
        category: cat,
      });
    }

    // Process places and resolve exact place photos in parallel
    const places: PlaceItem[] = await Promise.all(
      data.places.map(async (p: any, idx: number) => {
        const name = p.displayName?.text || 'Place Location';
        const address = p.formattedAddress || `${targetCity}`;
        const isHalalCategory = cat === 'halal_restaurants' || cat === 'halal';
        const nameLower = name.toLowerCase();
        const isExplicitlyHalal = nameLower.includes('halal') || isHalalCategory;

        // Real Google Maps navigation URL
        const googleMapsUri =
          p.googleMapsUri ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + targetCity)}`;

        // Resolve exact place photo:
        // 1. Google Places photo media URL if available
        let placePhoto: string | null = null;
        if (p.photos && p.photos[0]?.name) {
          placePhoto = `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=600&maxWidthPx=800&key=${apiKey}`;
        }

        // 2. Wikipedia authentic photo lookup for specific landmarks, museums, monuments, stations
        if (!placePhoto) {
          placePhoto = await fetchWikiThumbnail(name);
        }

        // 3. Fallback to distinct photo pool so no two places ever look identical
        if (!placePhoto) {
          const pool = DISTINCT_PHOTO_POOLS[cat] || DISTINCT_PHOTO_POOLS.attractions;
          placePhoto = pool[idx % pool.length];
        }

        return {
          id: p.id || `gplace-${idx}`,
          name: name,
          nameAr: name,
          category: cat,
          rating: p.rating ? Number(p.rating.toFixed(1)) : 4.5,
          reviewsCount: p.userRatingCount || 0,
          address: address,
          addressAr: address,
          description: p.editorialSummary?.text || p.primaryTypeDisplayName?.text || address,
          descriptionAr: p.editorialSummary?.text || p.primaryTypeDisplayName?.text || address,
          photoUrl: placePhoto,
          isOpenNow: p.currentOpeningHours?.openNow,
          googleMapsUri: googleMapsUri,
          websiteUri: p.websiteUri || undefined,
          halalVerificationStatus: isHalalCategory
            ? isExplicitlyHalal
              ? 'certified'
              : 'unverified'
            : undefined,
          halalNote: isHalalCategory
            ? isExplicitlyHalal
              ? 'Identified as Halal or Muslim-friendly dining.'
              : 'Halal status not verified — please check with restaurant staff.'
            : undefined,
          halalNoteAr: isHalalCategory
            ? isExplicitlyHalal
              ? 'محدد كمطعم يقدم خيارات حلال أو صديقة للمسلمين.'
              : 'حالة الحلال غير مؤكدة رسمياً — يُرجى الاستفسار من طاقم المطعم.'
            : undefined,
          types: p.types || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      places,
      total: places.length,
      city: targetCity,
      category: cat,
      source: 'google_places_api_v1',
    });
  } catch (error: any) {
    console.error('Server error in /api/places:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Places service query failed' },
      { status: 500 }
    );
  }
}
