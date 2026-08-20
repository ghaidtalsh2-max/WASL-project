'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { PlaceItem } from '@/lib/data/defaultJourneys';
import {
  Compass,
  Search,
  Star,
  MapPin,
  ExternalLink,
  Navigation,
  Landmark,
  Utensils,
  Coffee,
  Hospital,
  Building2,
  Bus,
  ShoppingBag,
  Hotel,
  Pill,
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function DiscoverSection() {
  const { t, isRtl, language } = useLanguage();
  const { journey } = useJourney();

  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isRtl ? 'جميع الأماكن' : 'All Places', icon: Compass },
    { id: 'halal_restaurants', label: isRtl ? 'مطاعم حلال وصديقة' : 'Halal & Muslim-Friendly', icon: Sparkles, highlight: true },
    { id: 'restaurants', label: isRtl ? 'المطاعم' : 'Restaurants', icon: Utensils },
    { id: 'hotels', label: isRtl ? 'الفنادق والإقامة' : 'Hotels & Lodging', icon: Hotel },
    { id: 'landmarks', label: isRtl ? 'المعالم البارزة' : 'Landmarks', icon: Landmark },
    { id: 'attractions', label: isRtl ? 'الأنشطة والترفيه' : 'Attractions', icon: Compass },
    { id: 'cafes', label: isRtl ? 'المقاهي' : 'Cafes', icon: Coffee },
    { id: 'shopping', label: isRtl ? 'التسوق والأسواق' : 'Shopping & Markets', icon: ShoppingBag },
    { id: 'hospitals', label: isRtl ? 'المستشفيات والطوارئ' : 'Hospitals & Medical', icon: Hospital },
    { id: 'pharmacies', label: isRtl ? 'الصيدليات' : 'Pharmacies', icon: Pill },
    { id: 'transport', label: isRtl ? 'المواصلات والمحطات' : 'Transportation', icon: Bus },
    { id: 'worship', label: isRtl ? 'المساجد ودور العبادة' : 'Mosques & Worship', icon: Building2 },
  ];

  const fetchPlaces = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: journey.destination.name,
          city: journey.destinationCity || journey.destination.capital,
          accommodationArea: journey.accommodationArea || '',
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          query: searchQuery || undefined,
          language: language,
        }),
      });

      const data = await res.json();
      if (data.success && data.places) {
        setPlaces(data.places);
      } else {
        setErrorMsg(data.error || (isRtl ? 'تعذر جلب الأماكن عبر Google Places API' : 'Google Places service temporarily unavailable'));
      }
    } catch (err: any) {
      setErrorMsg(isRtl ? 'تعذر الاتصال بالخادم. يرجى المحاولة مجدداً.' : 'Connection error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory, journey.destination.name, journey.destinationCity, language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-pink-400" />
              <span>{isRtl ? 'استكشاف الأماكن والخدمات' : 'Discover Places & Services'}</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              Live Google Places
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isRtl ? 'بيانات حقيقية ومحدثة لمدينة' : 'Real-time verified places in'}{' '}
            <strong className="text-white">
              {journey.destinationCity || journey.destination.capital}
            </strong>
            {journey.accommodationArea && ` (${journey.accommodationArea})`},{' '}
            {isRtl ? journey.destination.nameAr : journey.destination.name}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute start-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث عن مكان، مطعم، صيدلية...' : 'Search place, cuisine, station...'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl ps-10 pe-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition shadow-inner"
          />
        </form>
      </div>

      {/* Category Pills (Includes Dedicated Halal Filter) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? cat.highlight
                    ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-pink-500/25 border-pink-500 text-pink-300 shadow-md shadow-pink-500/20'
                  : cat.highlight
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${cat.highlight ? 'text-emerald-400' : ''}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Halal Assistant Advice Banner (When Halal category selected) */}
      {selectedCategory === 'halal_restaurants' && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs sm:text-sm text-emerald-200">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-300">
              {isRtl ? 'دليل التحقق من المأكولات الحلال' : 'Halal & Muslim-Friendly Guidance'}
            </p>
            <p className="text-gray-300 text-xs leading-relaxed">
              {isRtl
                ? 'يتم عرض المطاعم المحددة في بيانات Google Places كأماكن تقدم خيارات حلال. إذا كانت الشهادة غير واضحة، اسأل النادل: "هل يحتوي الطبق على كحول الطبخ أو لحم الخنزير؟".'
                : 'Places listed are identified through Google Places data as offering Halal or Muslim-friendly meals. If uncertified, always confirm ingredients with staff before ordering.'}
            </p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          <p className="text-sm">
            {isRtl ? 'جاري الاتصال بـ Google Places وجلب الأماكن الحقيقية...' : 'Fetching live Google Places data...'}
          </p>
        </div>
      ) : errorMsg ? (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'تعذر تحميل الأماكن' : 'Unable to Load Places'}
            </h4>
            <p className="text-xs text-rose-300 leading-relaxed">{errorMsg}</p>
          </div>
          <button
            onClick={fetchPlaces}
            className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-2 mx-auto shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      ) : places.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center text-gray-400 space-y-3">
          <Compass className="w-10 h-10 text-gray-500 mx-auto" />
          <p className="text-sm">
            {isRtl
              ? `لم يتم العثور على أماكن في ${journey.destinationCity || journey.destination.name} بهذا التصنيف.`
              : `No places found in ${journey.destinationCity || journey.destination.name} for this category.`}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-pink-400 hover:underline"
          >
            {isRtl ? 'عرض كافة الأماكن' : 'View all places'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-3xl bg-[#121728]/90 border border-white/10 hover:border-pink-500/30 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                <img
                  src={place.photoUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121728] via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{place.rating.toFixed(1)}</span>
                  {place.reviewsCount > 0 && (
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({place.reviewsCount.toLocaleString()})
                    </span>
                  )}
                </div>

                {/* Halal Verification Badge */}
                {place.halalVerificationStatus && (
                  <div
                    className={`absolute top-3 end-3 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold shadow-sm flex items-center gap-1 ${
                      place.halalVerificationStatus === 'certified'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-black'
                    }`}
                  >
                    {place.halalVerificationStatus === 'certified' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isRtl ? 'حلال معتمد' : 'Halal'}</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3 h-3" />
                        <span>{isRtl ? 'تحقق من المطعم' : 'Verify locally'}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                    {place.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                  <div className="flex items-start gap-1.5 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>

                  {/* Halal Note */}
                  {place.halalNote && (
                    <div className="p-2 rounded-xl bg-white/5 text-[11px] text-emerald-300">
                      {isRtl ? place.halalNoteAr || place.halalNote : place.halalNote}
                    </div>
                  )}
                </div>

                {/* Actions with Working Google Maps Navigation Link */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <a
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 hover:border-pink-500/30 text-xs font-semibold text-gray-200 transition flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isRtl ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
                  </a>

                  {place.websiteUri && (
                    <a
                      href={place.websiteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition"
                      title={isRtl ? 'الموقع الرسمي' : 'Official Website'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
