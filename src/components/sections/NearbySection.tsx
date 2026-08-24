'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { PlaceItem } from '@/lib/data/defaultJourneys';
import {
  MapPin,
  Navigation,
  Loader2,
  ExternalLink,
  Star,
  Compass,
  Utensils,
  Moon,
  Landmark,
  Pill,
  Train,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface NearbyCategory {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: any;
  queryParam: string;
}

const CATEGORIES: NearbyCategory[] = [
  { id: 'halal', labelEn: 'Halal Dining', labelAr: 'مطاعم حلال', icon: Moon, queryParam: 'halal_restaurants' },
  { id: 'attractions', labelEn: 'Attractions', labelAr: 'معالم سياحية', icon: Landmark, queryParam: 'attractions' },
  { id: 'worship', labelEn: 'Mosques & Prayer', labelAr: 'مساجد ومصليات', icon: Compass, queryParam: 'worship' },
  { id: 'pharmacy', labelEn: 'Pharmacies', labelAr: 'صيدليات', icon: Pill, queryParam: 'pharmacies' },
  { id: 'transport', labelEn: 'Transit / Metro', labelAr: 'محطات ومواصلات', icon: Train, queryParam: 'transport' },
  { id: 'shopping', labelEn: 'Markets / Supermarkets', labelAr: 'أسواق ومتاجر', icon: ShoppingBag, queryParam: 'shopping' },
];

export default function NearbySection() {
  const { isRtl } = useLanguage();
  const { journey, customPlacesKey } = useJourney();

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(2000); // 2km default
  const [activeCategory, setActiveCategory] = useState<string>('halal');
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Request browser geolocation
  const requestLocation = () => {
    setLocating(true);
    setLocError(null);

    if (!navigator.geolocation) {
      setLocError(isRtl ? 'المتصفح لا يدعم تحديد الموقع الجغرافي' : 'Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocError(
          isRtl
            ? 'تعذر الوصول للموقع الحالي. سيتم البحث حول وجهة رحلتك.'
            : 'Location access denied or unavailable. Searching around trip destination instead.'
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fetch nearby places via Google Places API
  const fetchNearbyPlaces = async () => {
    setLoadingPlaces(true);
    setFetchError(null);

    try {
      const selectedCat = CATEGORIES.find((c) => c.id === activeCategory);
      const categoryParam = selectedCat ? selectedCat.queryParam : 'attractions';

      const payload: any = {
        category: categoryParam,
        destination: journey.destination.name,
        city: journey.destinationCity || journey.destination.capital,
        accommodationArea: journey.accommodationArea,
        language: isRtl ? 'ar' : 'en',
        placesKey: customPlacesKey,
      };

      if (coords) {
        payload.lat = coords.lat;
        payload.lng = coords.lng;
        payload.radius = radius;
      }

      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.places)) {
        setPlaces(data.places);
      } else {
        setFetchError(data.error || 'Could not load nearby places. Please check Google Places key.');
      }
    } catch (err: any) {
      setFetchError(err.message || 'Network error fetching nearby places.');
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    fetchNearbyPlaces();
  }, [coords, activeCategory, radius]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold">
              <Navigation className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مستكشف الأماكن القريبة' : 'Live Nearby Radar'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isRtl ? 'الأماكن والخدمات القريبة منك' : 'Explore Places Around You'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              {isRtl
                ? 'استكشف المطاعم الحلال، المساجد، المعالم السياحية، والصيدليات المحيطة بموقعك الفعلي أو مقر إقامتك مع إمكانية الملاحة المباشرة عبر خرائط Google.'
                : 'Discover Halal dining, mosques, landmarks, pharmacies, and transit hubs around your live GPS location or trip destination with one-tap navigation.'}
            </p>
          </div>

          {/* Location Trigger & Status */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {coords ? (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isRtl ? 'تم تحديد موقعك بدقة' : 'GPS Active'}: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={requestLocation}
                disabled={locating}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRtl ? 'جاري تحديد موقعك...' : 'Locating GPS...'}</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>{isRtl ? 'تحديد موقعي الحالي' : 'Use My Current Location'}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={fetchNearbyPlaces}
              disabled={loadingPlaces}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition flex items-center justify-center"
              title="Refresh nearby places"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPlaces ? 'animate-spin text-pink-400' : ''}`} />
            </button>
          </div>
        </div>

        {locError && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{locError}</span>
          </div>
        )}
      </div>

      {/* Filter Controls: Categories & Radius */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md shadow-pink-500/25 scale-[1.02]'
                    : 'bg-[#121728] border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-1.5 self-start md:self-auto p-1 rounded-2xl bg-[#121728] border border-white/10 text-xs font-semibold text-gray-400 shrink-0">
          <span className="px-2.5 text-[11px] uppercase tracking-wider">{isRtl ? 'النطاق:' : 'Radius:'}</span>
          {[
            { val: 1000, label: '1 km' },
            { val: 3000, label: '3 km' },
            { val: 5000, label: '5 km' },
            { val: 10000, label: '10 km' },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => setRadius(r.val)}
              className={`px-2.5 py-1 rounded-xl transition ${
                radius === r.val ? 'bg-pink-500 text-white font-bold' : 'hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Places Cards Grid */}
      {loadingPlaces ? (
        <div className="p-16 rounded-3xl bg-[#121728]/60 border border-white/10 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-xs text-gray-400 font-medium">
            {isRtl ? 'جاري البحث عن الأماكن القريبة والتحقق من التقييمات...' : 'Searching live Google Places & fetching authentic photos...'}
          </p>
        </div>
      ) : fetchError ? (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm space-y-2 text-center">
          <p className="font-bold">⚠️ {fetchError}</p>
          <p className="text-gray-400 text-xs">
            {isRtl ? 'يرجى التأكد من مفتاح Google Places في الإعدادات.' : 'Check your Google Places API Key in Settings ⚙️.'}
          </p>
        </div>
      ) : places.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#121728]/60 border border-white/10 text-center space-y-2">
          <p className="text-sm font-bold text-gray-300">
            {isRtl ? 'لم يتم العثور على نتائج قريبة في هذا النطاق' : 'No places found in this radius.'}
          </p>
          <p className="text-xs text-gray-400">
            {isRtl ? 'جرب زيادة نطاق المسافة أو تغيير التصنيف.' : 'Try expanding the search radius or selecting another category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden hover:border-pink-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Photo & Badge */}
              <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                {place.photoUrl ? (
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#182035] text-gray-500">
                    <Compass className="w-8 h-8 text-pink-400/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#121728] via-transparent to-black/30" />

                {/* Rating Badge */}
                <div className="absolute top-3 end-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{place.rating || 4.5}</span>
                  {place.reviewsCount ? (
                    <span className="text-[10px] text-gray-400">({place.reviewsCount})</span>
                  ) : null}
                </div>

                {/* Halal Badge if certified */}
                {place.halalVerificationStatus && (
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-xl bg-emerald-500/80 backdrop-blur-md text-white text-[11px] font-extrabold shadow-lg flex items-center gap-1">
                    <span>🌙</span>
                    <span>{isRtl ? 'حلال مؤكد' : 'Halal Verified'}</span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors leading-tight">
                    {isRtl ? place.nameAr || place.name : place.name}
                  </h4>
                  <p className="text-xs text-gray-400 flex items-start gap-1 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{place.address}</span>
                  </p>
                  {place.description && (
                    <p className="text-xs text-gray-300/80 line-clamp-2 pt-1">
                      {isRtl ? place.descriptionAr || place.description : place.description}
                    </p>
                  )}
                </div>

                {/* Navigation Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400">
                    {place.isOpenNow ? (
                      <span className="text-emerald-400 font-semibold">● {isRtl ? 'مفتوح الآن' : 'Open now'}</span>
                    ) : (
                      <span>● {isRtl ? 'خدمة متوفرة' : 'Available'}</span>
                    )}
                  </span>

                  <a
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-bold text-pink-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <span>{isRtl ? 'الاتجاهات والخريطة' : 'Directions'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
