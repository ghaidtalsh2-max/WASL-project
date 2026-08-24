'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Compass,
  Landmark,
  Languages,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
  Users,
  Clock,
  Navigation,
  DollarSign,
  Activity,
  Building,
  HeartPulse,
  Bed,
  Hotel,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Phone,
} from 'lucide-react';

export default function JourneyTimelineView() {
  const { isRtl } = useLanguage();
  const {
    journey,
    stages,
    activeStageIndex,
    setActiveStageIndex,
    toggleTaskCompletion,
    setActiveTab,
    readinessPercentage,
    tourismOptions,
    selectedTourismOptionId,
    setSelectedTourismOptionId,
    isLoadingJourneyData,
    refreshStagesAI,
    isAiRefreshing,
  } = useJourney();

  const [mainViewTab, setMainViewTab] = useState<'itinerary' | 'checklist' | 'accommodation'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | 'all'>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const currentStage = stages[activeStageIndex] || stages[0];
  const selectedOption = tourismOptions.find((o) => o.id === selectedTourismOptionId) || tourismOptions[0];

  const getPartyLabel = (party?: string) => {
    switch (party) {
      case 'couple': return isRtl ? 'مع الشريك' : 'Couple';
      case 'family': return isRtl ? 'مع العائلة' : 'Family';
      case 'friends': return isRtl ? 'مع الأصدقاء' : 'Friends';
      case 'group': return isRtl ? 'مجموعة / أخرى' : 'Group';
      default: return isRtl ? 'سفر فردي' : 'Solo';
    }
  };

  const getPurposeLabel = (p?: string) => {
    switch (p) {
      case 'study': return isRtl ? 'دراسة وابتعاث' : 'Study & Education';
      case 'work': return isRtl ? 'عمل وانتداب' : 'Work & Career';
      case 'relocation': return isRtl ? 'استقرار وهجرة' : 'Relocation & Living';
      case 'medical':
      case 'recovery': return isRtl ? 'علاج واستشفاء' : 'Medical & Healthcare';
      default: return isRtl ? 'سياحة وزيارة' : 'Tourism & Leisure';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Info & Meta Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#121728]/90 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>{isRtl ? 'مسار رحلتك الشامل' : 'Your Unified Journey Hub'}</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold">
              {getPurposeLabel(journey.purpose)}
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{getPartyLabel(journey.travelParty)}</span>
            </span>
            {journey.durationText && (
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{journey.durationText}</span>
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>{journey.destinationCity || journey.destination.capital}, {isRtl ? journey.destination.nameAr : journey.destination.name}</span>
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 flex items-center gap-1">
              <span>{isRtl ? 'الجنسية / الانطلاق:' : 'Origin / Nationality:'}</span>
              <strong className="text-gray-200">{journey.origin.flag} {isRtl ? journey.origin.nameAr : journey.origin.name}</strong>
            </span>
          </p>
        </div>

        {/* Readiness Score Widget */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-pink-500 transition-all duration-700"
                strokeDasharray={`${readinessPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-white">
              {readinessPercentage}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {isRtl ? 'مؤشر الجاهزية والتحضير' : 'Readiness Indicator'}
            </span>
            <span className="text-xs text-pink-300 font-semibold">
              {readinessPercentage >= 80
                ? (isRtl ? 'جاهزية ممتازة للسفر' : 'Ready to travel')
                : readinessPercentage >= 40
                ? (isRtl ? 'قيد التحضير والتجهيز' : 'In preparation')
                : (isRtl ? 'تجهيزات أولية مطلوبة' : 'Action items pending')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three Main Tabs Switcher (Strict Order: 1. Checklist, 2. Accommodation, 3. Itinerary) */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-center gap-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMainViewTab('checklist')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              mainViewTab === 'checklist'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? '📋 دليل المراحل والمهام (Checklist)' : '📋 Checklist & Relocation'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewTab('accommodation')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              mainViewTab === 'accommodation'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>{isRtl ? '🏨 الفنادق والإقامة (Accommodation)' : '🏨 Accommodation'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewTab('itinerary')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              mainViewTab === 'itinerary'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isRtl ? '🗺️ خطة الرحلة والجدول (Itinerary)' : '🗺️ Itinerary & Schedule'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 📋 دليل المراحل والمهام (Checklist & Relocation) */}
      {/* ========================================================================= */}
      {mainViewTab === 'checklist' && (
        <div className="space-y-6">
          {/* Five Natural Journey Phases */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-pink-400" />
                <span>{isRtl ? 'المراحل الطبيعية للرحلة والمهام اللوجستية:' : 'Journey Phases & Logistics Roadmap:'}</span>
              </h3>
              <button
                onClick={refreshStagesAI}
                disabled={isAiRefreshing || isLoadingJourneyData}
                className="px-3 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-semibold text-pink-300 transition flex items-center gap-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin' : ''}`} />
                <span>{isAiRefreshing ? (isRtl ? 'جاري التحديث...' : 'Updating...') : (isRtl ? 'تحديث ذكي' : 'AI Refresh')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {stages.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                const completedCount = (stage.thingsToCheck || []).filter((t) => t.completed).length;
                const totalCount = (stage.thingsToCheck || []).length;
                const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <button
                    key={stage.id || idx}
                    type="button"
                    onClick={() => setActiveStageIndex(idx)}
                    className={`p-4 sm:p-5 rounded-3xl border text-start transition-all relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? 'bg-gradient-to-b from-pink-500/20 via-[#161B2E] to-[#121728] border-pink-500 shadow-xl shadow-pink-500/15 scale-[1.01]'
                        : 'bg-[#121728]/80 border-white/10 hover:border-white/20 hover:bg-[#14192B]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          0{stage.stageNumber || idx + 1}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">{progress}%</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {isRtl ? stage.titleAr : stage.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {isRtl ? stage.subtitleAr : stage.subtitle}
                      </p>
                    </div>

                    {/* Micro progress bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-pink-500 h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Phase Detail Card */}
          {currentStage && (
            <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      Phase 0{currentStage.stageNumber} • {isRtl ? 'تفاصيل المرحلة' : 'Stage Overview'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {isRtl ? currentStage.titleAr : currentStage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    {isRtl ? currentStage.subtitleAr : currentStage.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isRtl ? 'استكشاف الأماكن' : 'Explore Places'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('emergency')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isRtl ? 'أرقام الطوارئ' : 'Emergency'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Columns Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* 1. Things to Check */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    {isRtl ? 'المهام والتجهيزات المطلوبة' : 'Checklist & Milestones'}
                  </h4>
                  <div className="space-y-2.5">
                    {(currentStage.thingsToCheck || []).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(currentStage.id, task.id)}
                        className={`flex items-start gap-2.5 p-3.5 rounded-2xl cursor-pointer transition text-xs sm:text-sm border ${
                          task.completed
                            ? 'bg-pink-500/15 border-pink-500/30 text-gray-400 line-through'
                            : 'bg-white/5 border-white/10 hover:border-pink-500/40 text-gray-200 hover:bg-white/10'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5 hover:text-pink-400" />
                        )}
                        <span className="leading-snug">
                          {isRtl ? task.textAr : task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Official Resources */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {isRtl ? 'المصادر والروابط الرسمية' : 'Official Resources'}
                  </h4>
                  <div className="space-y-2.5">
                    {(currentStage.officialResources || []).map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-gray-200 transition group"
                      >
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-pink-300 transition truncate">
                            {isRtl ? res.nameAr : res.name}
                          </span>
                          <span className="text-[11px] text-gray-400 line-clamp-1">
                            {isRtl ? res.descriptionAr : res.description}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-400 shrink-0 mt-0.5 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* 3. Quick Tips */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {isRtl ? 'نصيحة المرحلة' : 'Quick Stage Tip'}
                  </h4>
                  {currentStage.quickTip && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <Lightbulb className="w-4 h-4 shrink-0" />
                        <span>{isRtl ? currentStage.quickTip.titleAr : currentStage.quickTip.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {isRtl ? currentStage.quickTip.textAr : currentStage.quickTip.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 🏨 الفنادق والإقامة (Accommodation - 4 to 6 Curated Options) */}
      {/* ========================================================================= */}
      {mainViewTab === 'accommodation' && (
        <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-1">
                <Hotel className="w-3.5 h-3.5" />
                <span>{isRtl ? 'ترشيحات السكن والإقامة' : 'Curated Accommodation Recommendations'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {isRtl ? `خيارات الإقامة الموصى بها في ${journey.destinationCity || journey.destination.name}` : `Recommended Stays in ${journey.destinationCity || journey.destination.name}`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {isRtl ? 'خيارات سكنية مختارة بعناية تتناسب مع ميزانيتك وغرض رحلتك مع روابط حجز مباشرة ومواقع جغرافية' : 'Handpicked hotels, apartments, and serviced residences with direct reservation links'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(journey.accommodationRecommendations && journey.accommodationRecommendations.length >= 4
              ? journey.accommodationRecommendations
              : [
                  {
                    name: `Grand Central ${journey.destinationCity || journey.destination.name} Hotel`,
                    nameAr: `فندق جراند سنترال ${journey.destinationCity || journey.destination.nameAr || journey.destination.name}`,
                    type: 'Luxury Hotel (5 Stars)',
                    rating: '4.9',
                    price: '$170 - $240 / night',
                    location: 'Downtown Center',
                    lat: (journey.destination.lat || 35.6762) + 0.005,
                    lng: (journey.destination.lng || 139.6503) + 0.004,
                    description: isRtl ? 'يبعد 3 دقائق مشياً عن محطة القطار المركزية ومركز الخدمات الرئيسي.' : '3-min walk to Central Metro and main services.',
                    directUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent((journey.destinationCity || journey.destination.name) + ' Grand Hotel')}`,
                  },
                  {
                    name: `Heritage Residence & Suites ${journey.destinationCity || journey.destination.name}`,
                    nameAr: `أجنحة هيريتيج ريزيدنس الفندقية`,
                    type: 'Serviced Apartment',
                    rating: '4.8',
                    price: '$120 - $165 / night',
                    location: 'Diplomatic / Cultural District',
                    lat: (journey.destination.lat || 35.6762) - 0.006,
                    lng: (journey.destination.lng || 139.6503) + 0.007,
                    description: isRtl ? 'شقق فندقية مجهزة بمطبخ متكامل وغسيل، مثالية للعائلات والإقامات الممتدة.' : 'Fully equipped serviced suites ideal for families and long stays.',
                    directUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent((journey.destinationCity || journey.destination.name) + ' Residence Suites')}`,
                  },
                  {
                    name: `Boutique Haven & Spa ${journey.destinationCity || journey.destination.name}`,
                    nameAr: `فندق بوتيك هافن الصحي`,
                    type: 'Boutique Stay & Wellness',
                    rating: '4.7',
                    price: '$95 - $135 / night',
                    location: 'Artisan & Garden Quarter',
                    lat: (journey.destination.lat || 35.6762) + 0.008,
                    lng: (journey.destination.lng || 139.6503) - 0.005,
                    description: isRtl ? 'إقامة هادئة بالقرب من المقاهي التراثية والحدائق العامة ومناطق الاسترخاء.' : 'Peaceful boutique stay surrounded by artisan cafes and parks.',
                    directUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent((journey.destinationCity || journey.destination.name) + ' Boutique Hotel')}`,
                  },
                  {
                    name: `Metropolitan Executive Suites`,
                    nameAr: `أجنحة متروبوليتان التنفيذية`,
                    type: 'Executive Apart-Hotel',
                    rating: '4.8',
                    price: '$140 - $190 / night',
                    location: 'Business & Health Hub',
                    lat: (journey.destination.lat || 35.6762) - 0.003,
                    lng: (journey.destination.lng || 139.6503) - 0.008,
                    description: isRtl ? 'موقع استراتيجي بجوار المراكز الطبية والمجمعات التجارية مع خدمة استقبال 24 ساعة.' : 'Strategic location adjacent to medical centers and commercial avenues.',
                    directUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent((journey.destinationCity || journey.destination.name) + ' Metropolitan Suites')}`,
                  },
                  {
                    name: `Urban Garden Hotel`,
                    nameAr: `فندق أوربان جاردن`,
                    type: 'Eco-Friendly Modern Hotel',
                    rating: '4.6',
                    price: '$80 - $115 / night',
                    location: 'Green District',
                    lat: (journey.destination.lat || 35.6762) + 0.012,
                    lng: (journey.destination.lng || 139.6503) + 0.002,
                    description: isRtl ? 'خيار اقتصادي راقٍ ومريح بالقرب من محطات النقل العام والمطاعم المتنوعة.' : 'Refined economy stay near rapid transit and diverse dining.',
                    directUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent((journey.destinationCity || journey.destination.name) + ' Garden Hotel')}`,
                  },
                ]
            ).map((hotel: any, hIdx: number) => {
              const destQuery = encodeURIComponent(`${hotel.name || 'hotel'} ${journey.destinationCity || journey.destination.name}`);
              const bookingLink = hotel.direct_booking_url || hotel.directUrl || hotel.bookingUrl || `https://www.booking.com/searchresults.html?ss=${destQuery}`;

              return (
                <div key={hIdx} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/40 transition flex flex-col justify-between space-y-5 shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        {hotel.type || 'Hotel / Residence'}
                      </span>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        ⭐ {hotel.rating || '4.8'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {isRtl ? hotel.nameAr || hotel.hotel_name_ar || hotel.name : hotel.name || hotel.hotel_name}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{hotel.location || hotel.neighborhood || (journey.destinationCity || journey.destination.name)}</span>
                      </p>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? hotel.descriptionAr || hotel.reason || hotel.description : hotel.description || hotel.reason}
                    </p>

                    {hotel.price && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-pink-300">{hotel.price}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <span>{isRtl ? 'حجز مباشر ومؤكد (Direct Booking)' : 'Direct Booking URL'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 🗺️ خطة الرحلة والجدول (Itinerary & Schedule - Split Screen Layout) */}
      {/* ========================================================================= */}
      {mainViewTab === 'itinerary' && selectedOption && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#121728]/90 border border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'جدول الأيام والشاشة المنقسمة' : 'Interactive Itinerary & Split Map'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {isRtl ? selectedOption.titleAr : selectedOption.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {isRtl ? selectedOption.descriptionAr : selectedOption.description}
              </p>
            </div>

            {/* Option A vs Option B Switcher */}
            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1 self-start sm:self-auto">
              {tourismOptions.map((opt) => {
                const isSelected = selectedTourismOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTourismOptionId(opt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{opt.style === 'balanced' ? '⚖️' : '🌿'}</span>
                    <span>{isRtl ? opt.titleAr : opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Week & Day Selectors */}
          <div className="p-5 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-4">
            {/* Week Selector */}
            {selectedOption.days.length > 7 && (
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{isRtl ? 'الأسبوع:' : 'Week:'}</span>
                <button
                  type="button"
                  onClick={() => setSelectedWeek(1)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedWeek === 1 ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'الأسبوع 1 (الأيام 1-7)' : 'Week 1 (Days 1-7)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWeek(2)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedWeek === 2 ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'الأسبوع 2 (الأيام 8-14)' : 'Week 2 (Days 8-14)'}
                </button>
              </div>
            )}

            {/* Day Buttons (D1, D2, D3...) */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-bold">{isRtl ? 'اختر اليوم:' : 'Select Day:'}</span>
              <button
                type="button"
                onClick={() => setSelectedDayIndex('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDayIndex === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {isRtl ? 'جميع الأيام' : 'All Days'}
              </button>
              {selectedOption.days.map((day, idx) => {
                const dayNum = day.dayNumber || idx + 1;
                const isSelected = selectedDayIndex === idx;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 scale-105'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>D{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SPLIT SCREEN LAYOUT: Day Schedule (Right) & Live Map Pins (Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Day Cards Column (7 or 8 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {(selectedOption.days || [])
                .filter((_, idx) => selectedDayIndex === 'all' || selectedDayIndex === idx)
                .map((day, dIdx) => {
                  const actualDayNumber = day.dayNumber || (selectedDayIndex === 'all' ? dIdx + 1 : (selectedDayIndex as number) + 1);

                  return (
                    <div
                      key={actualDayNumber}
                      className="p-6 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-5 hover:border-pink-500/30 transition shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 font-extrabold flex items-center justify-center text-sm border border-pink-500/30">
                            D{actualDayNumber}
                          </span>
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-white">
                              {isRtl ? (day.themeAr || day.titleAr || day.theme || day.title || `اليوم ${actualDayNumber}`) : (day.theme || day.title || `Day ${actualDayNumber}`)}
                            </h4>
                            {(day.neighborhood || day.city) && (
                              <span className="text-xs text-pink-400 font-medium">
                                📍 {day.neighborhood || day.city}
                              </span>
                            )}
                          </div>
                        </div>
                        {day.estimatedCost && (
                          <span className="text-xs text-gray-400 font-medium">
                            {isRtl ? `التكلفة التقديرية: ${day.estimatedCost}` : `Est: ${day.estimatedCost}`}
                          </span>
                        )}
                      </div>

                      {/* Time Slots Breakdown: Morning, Afternoon, Evening */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Morning */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                            <span>🌅</span>
                            <span>{isRtl ? 'الصباح' : 'Morning'}</span>
                          </span>
                          <p className="text-gray-200 leading-relaxed">
                            {isRtl ? (day.morningAr || day.morning) : (day.morning || day.morningAr)}
                          </p>
                        </div>

                        {/* Afternoon */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1">
                            <span>☀️</span>
                            <span>{isRtl ? 'بعد الظهر والغداء' : 'Lunch & Afternoon'}</span>
                          </span>
                          <p className="text-gray-200 leading-relaxed">
                            {isRtl ? (day.afternoonAr || day.afternoon) : (day.afternoon || day.afternoonAr)}
                          </p>
                        </div>

                        {/* Evening */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                            <span>🌙</span>
                            <span>{isRtl ? 'المساء والليل' : 'Evening'}</span>
                          </span>
                          <p className="text-gray-200 leading-relaxed">
                            {isRtl ? (day.eveningAr || day.evening) : (day.evening || day.eveningAr)}
                          </p>
                        </div>
                      </div>

                      {/* Highlights & Dining & Direct Maps Navigation */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(day.highlights || []).map((h, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[11px] font-medium">
                              ✦ {h}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {(day.diningRecommendation || day.diningRecommendationAr || day.diningTip || day.diningTipAr) && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((day.city || '') + ' ' + (day.diningRecommendation || day.diningRecommendationAr || 'restaurant'))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition text-xs flex items-center gap-1.5"
                            >
                              <span>🍽️</span>
                              <span className="truncate max-w-[180px]">
                                {isRtl ? (day.diningRecommendationAr || day.diningRecommendation || day.diningTipAr || day.diningTip) : (day.diningRecommendation || day.diningRecommendationAr || day.diningTip || day.diningTipAr)}
                              </span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                          )}

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((day.city || '') + ' ' + (day.highlights?.[0] || day.theme || 'Landmark'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <span>📍</span>
                            <span>{isRtl ? 'خرائط Google' : 'Google Maps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Left Split Screen Column: Interactive Live Map View & GEO JSON Pin Overlay */}
            <div className="lg:col-span-5 space-y-4">
              {(() => {
                const currentDay = typeof selectedDayIndex === 'number'
                  ? selectedOption.days[selectedDayIndex]
                  : selectedOption.days[0];

                const primaryAttraction = currentDay?.highlights?.[0] || currentDay?.theme || 'City Landmark';
                const diningSpot = currentDay?.diningRecommendation || currentDay?.diningRecommendationAr || 'Local Authentic Dining';
                const eveningSpot = currentDay?.neighborhood || currentDay?.city || 'Downtown District';

                const mapQuery = encodeURIComponent(`${primaryAttraction}, ${currentDay?.city || journey.destinationCity || journey.destination.name}`);
                const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&hl=${isRtl ? 'ar' : 'en'}&z=13&output=embed`;

                return (
                  <div className="p-6 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-5 sticky top-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-pink-400" />
                          <span>{isRtl ? 'خريطة Google Maps التفاعلية الحية' : 'Interactive Live Google Map'}</span>
                        </h4>
                      </div>
                      <span className="text-[10px] text-pink-300 font-mono px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                        Live Map View
                      </span>
                    </div>

                    {/* Interactive Google Map Embed Frame */}
                    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-[#0B0F1E]">
                      <iframe
                        src={mapEmbedUrl}
                        title="Live Destination Map"
                        className="w-full h-full border-0 filter contrast-105"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>

                    {/* Interactive GEO JSON Pinpoints */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {isRtl ? 'دبابيس اليوم النشط (Active Day Pins):' : 'Active Day Pins (GEO JSON):'}
                        </span>
                        <span className="text-[10px] text-pink-400 font-mono">3 Live Locations</span>
                      </div>

                      {/* Pin 1: Primary Attraction */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:border-amber-500/40 transition">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs shrink-0 border border-amber-500/30">
                            🏛️
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{primaryAttraction}</span>
                            <span className="text-[10px] text-amber-400/90 font-mono">
                              {journey.destination.lat?.toFixed(4)}, {journey.destination.lng?.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((currentDay?.city || '') + ' ' + primaryAttraction)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-[10px] font-bold shrink-0 transition flex items-center gap-1"
                        >
                          <span>{isRtl ? 'ملاحة' : 'Route'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Pin 2: Dining */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:border-orange-500/40 transition">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center text-xs shrink-0 border border-orange-500/30">
                            🍽️
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{diningSpot}</span>
                            <span className="text-[10px] text-orange-400/90 font-mono">
                              {(journey.destination.lat + 0.008)?.toFixed(4)}, {(journey.destination.lng + 0.006)?.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((currentDay?.city || '') + ' ' + diningSpot)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-orange-300 text-[10px] font-bold shrink-0 transition flex items-center gap-1"
                        >
                          <span>{isRtl ? 'الموقع' : 'View'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Pin 3: Evening Activity */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:border-pink-500/40 transition">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs shrink-0 border border-pink-500/30">
                            🌙
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{eveningSpot}</span>
                            <span className="text-[10px] text-pink-400/90 font-mono">
                              {(journey.destination.lat - 0.007)?.toFixed(4)}, {(journey.destination.lng - 0.005)?.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((currentDay?.city || '') + ' ' + eveningSpot)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-pink-300 text-[10px] font-bold shrink-0 transition flex items-center gap-1"
                        >
                          <span>{isRtl ? 'استكشاف' : 'Explore'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

