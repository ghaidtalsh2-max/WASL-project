'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  Scale,
  Building2,
  UtensilsCrossed,
  Calendar,
  Info,
  CheckCircle2,
  Sparkles,
  Compass,
  Moon,
  Volume2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export default function ReligionSection() {
  const { t, isRtl } = useLanguage();
  const { religion, journey, refreshReligionAI, isAiRefreshing } = useJourney();
  const [activeTab, setActiveTab] = useState<'landscape' | 'muslim_guide'>('landscape');

  const guide = religion.muslimTravelerGuide;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-pink-400" />
              <span>{isRtl ? 'السياق الديني ودليل المسافر المسلم' : 'Religious Landscape & Muslim Traveler Guide'}</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isRtl
              ? `المشهد الثقافي والروحي وإرشادات السفر في ${journey.destinationCity || journey.destination.name}`
              : `Objective spiritual landscape and traveler considerations in ${journey.destinationCity || journey.destination.name}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Refresh Button */}
          <button
            onClick={refreshReligionAI}
            disabled={isAiRefreshing}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition flex items-center gap-1.5 shadow-sm"
            title="Generate AI religious and Muslim guide analysis"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
            <span>{isAiRefreshing ? (isRtl ? 'جاري التوليد بالذكاء...' : 'Generating with AI...') : (isRtl ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI')}</span>
          </button>

          {/* Tab Switcher */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('landscape')}
              className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === 'landscape'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isRtl ? 'المشهد الروحي العام' : 'Religious Landscape'}</span>
            </button>
            <button
              onClick={() => setActiveTab('muslim_guide')}
              className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === 'muslim_guide'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دليل المسافر المسلم' : 'Muslim Traveler Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'landscape' ? (
        /* Landscape Overview */
        <div className="space-y-6">
          {/* Overview Card */}
          <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 sm:p-8 space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'نظرة عامة على المشهد الروحي' : 'Spiritual & Cultural Landscape'}</span>
            </div>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {isRtl ? religion.overviewAr : religion.overview}
            </p>
          </div>

          {/* Religious Traditions List */}
          {religion.religiousLandscape?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>{isRtl ? 'التقاليد والمعتقدات الشائعة' : 'Major Traditions in Destination'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {religion.religiousLandscape.map((rel, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">
                        {isRtl ? rel.traditionAr : rel.tradition}
                      </h4>
                      {rel.percentageEstimate && (
                        <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                          {rel.percentageEstimate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? rel.descriptionAr : rel.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Places of Worship & Visiting Etiquette */}
          {religion.placesOfWorship?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-pink-400" />
                <span>{isRtl ? 'دور العبادة وآداب الزيارة' : 'Places of Worship & Visitor Etiquette'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {religion.placesOfWorship.map((place, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 space-y-4 shadow-lg"
                  >
                    <div className="pb-2 border-b border-white/10">
                      <h4 className="text-base font-bold text-white">
                        {isRtl ? place.typeAr : place.type}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {isRtl ? place.guidanceAr : place.guidance}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-300 block">
                        {isRtl ? 'آداب وسلوكيات الزيارة:' : 'Visiting Etiquette:'}
                      </span>
                      <ul className="space-y-2 text-xs text-gray-300">
                        {(isRtl ? place.etiquetteAr || place.etiquette : place.etiquette).map((eti, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{eti}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dietary & Public Behavior Overview */}
          {religion.dietaryAndPublicBehavior && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>{isRtl ? 'النظام الغذائي والمكونات الشائعة' : 'Dietary Context & Common Ingredients'}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isRtl
                    ? religion.dietaryAndPublicBehavior.dietaryOverviewAr
                    : religion.dietaryAndPublicBehavior.dietaryOverview}
                </p>
              </div>

              <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isRtl ? 'الملابس والسلوك العام' : 'Dress Expectations & Public Etiquette'}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isRtl
                    ? religion.dietaryAndPublicBehavior.dressExpectationsAr
                    : religion.dietaryAndPublicBehavior.dressExpectations}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* DEDICATED: Muslim Traveler Guide */
        <div className="space-y-6">
          {/* Halal Overview Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-[#121728] to-[#121728] border border-emerald-500/30 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
              <UtensilsCrossed className="w-5 h-5" />
              <span>{isRtl ? 'المأكولات الحلال وخيارات الطعام' : 'Halal Food Availability & Verification'}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {isRtl ? guide?.halalOverviewAr : guide?.halalOverview}
            </p>

            {/* Halal Verification Tips */}
            {guide?.halalVerificationTips?.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  {isRtl ? 'إرشادات عملية للتأكد من الطعام محلياً:' : 'Actionable Local Verification Tips:'}
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {(isRtl ? guide.halalVerificationTipsAr || guide.halalVerificationTips : guide.halalVerificationTips).map(
                    (tip, idx) => (
                      <li key={idx} className="p-3 rounded-2xl bg-white/5 border border-emerald-500/15 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Mosques & Prayer Considerations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mosques & Prayer Spaces */}
            <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>{isRtl ? 'المساجد وأماكن الصلاة' : 'Mosques & Prayer Facilities'}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isRtl ? guide?.mosquesAndPrayerAr : guide?.mosquesAndPrayer}
              </p>
            </div>

            {/* Public Prayer Etiquette */}
            <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isRtl ? 'إرشادات أداء الصلاة في الأماكن العامة' : 'Public Prayer Etiquette & Sensitivity'}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isRtl ? guide?.publicPrayerEtiquetteAr : guide?.publicPrayerEtiquette}
              </p>
            </div>
          </div>

          {/* Local Inquiry Phrases for Muslim Travelers */}
          {guide?.localInquiryPhrases?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'عبارات مفيدة باللغة المحلية للسؤال عن الحلال والمصليات' : 'Key Local Phrases for Halal & Prayer'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {guide.localInquiryPhrases.map((phraseObj, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="text-base font-bold text-white">{phraseObj.phrase}</div>
                    <div className="text-xs font-mono text-pink-400">{phraseObj.pronunciation}</div>
                    <div className="text-xs text-gray-300 pt-1 border-t border-white/10">
                      {isRtl ? phraseObj.meaningAr : phraseObj.meaningEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ramadan Considerations */}
          {guide?.ramadanConsiderations && (
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>{isRtl ? 'شهر رمضان المبارك' : 'Ramadan Considerations'}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isRtl ? guide.ramadanConsiderationsAr : guide.ramadanConsiderations}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-gray-300">
        <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isRtl ? religion.disclaimerAr : religion.disclaimer}
        </p>
      </div>
    </div>
  );
}
