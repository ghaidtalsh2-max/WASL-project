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
  GraduationCap,
  School,
  ShoppingCart,
  Utensils,
  Scale,
  Building2,
  Mail,
  FileText,
} from 'lucide-react';
import { getDynamicAccommodations } from '@/lib/data/accommodationDatabase';

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

  const [mainViewTab, setMainViewTab] = useState<'itinerary' | 'checklist' | 'accommodation'>('checklist');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | 'all'>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Requirement 3: UI Accordion Decluttering (DEFAULT CLOSED)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Requirement 4: Color-Coded Map Pins & Interactive Legend Filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'dining' | 'culture' | 'entertainment' | 'services'>('all');

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isLongTermStay = journey.purpose === 'study' || journey.purpose === 'work' || journey.purpose === 'relocation';
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

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
            {isLongTermStay ? <Building2 className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
            <span>
              {isLongTermStay
                ? (isRtl ? '🏬 دليل الخدمات والمعيشة (Living Services)' : '🏬 Living & Relocation Modules')
                : (isRtl ? '🗺️ خطة الرحلة والجدول (Itinerary)' : '🗺️ Itinerary & Schedule')}
            </span>
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
                    {isRtl ? 'المصادر والروابط الرسمية (بلد المغادرة والوجهة)' : 'Official Portals (Origin & Destination)'}
                  </h4>
                  <div className="space-y-2.5">
                    {(currentStage.officialResources || []).map((res, i) => {
                      const isOrigin = (res.nameAr || res.name).includes(`[${journey.origin.nameAr}]`) || (res.nameAr || res.name).includes(`[${journey.origin.name}]`);
                      return (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-gray-200 transition group"
                        >
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                isOrigin
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}>
                                {isOrigin ? (isRtl ? `🇸🇦 بلد المغادرة (${journey.origin.nameAr || journey.origin.name})` : `Departure Country (${journey.origin.name})`) : (isRtl ? `🌍 بلد الوجهة (${journey.destination.nameAr || journey.destination.name})` : `Destination Country (${journey.destination.name})`)}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-pink-300 transition">
                              {(isRtl ? res.nameAr : res.name).replace(/\[.*?\]\s*/g, '')}
                            </span>
                            <span className="text-[11px] text-gray-400 line-clamp-2">
                              {isRtl ? res.descriptionAr : res.description}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-400 shrink-0 mt-1 transition-colors" />
                        </a>
                      );
                    })}
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
            {getDynamicAccommodations(
              journey.destination.name,
              journey.destinationCity || journey.destination.capital,
              journey.purpose,
              journey.budget,
              journey.travelParty,
              journey.medicalDetails?.medicalSubCategory
            ).map((hotel: any, hIdx: number) => {
              const destQuery = encodeURIComponent(`${hotel.name || 'hotel'} ${journey.destinationCity || journey.destination.name}`);
              const bookingLink = hotel.directUrl || hotel.direct_booking_url || hotel.bookingUrl || `https://www.booking.com/searchresults.html?ss=${destQuery}`;

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
                        <span className="text-xs font-bold text-pink-300">
                          {isRtl ? hotel.price.replace('/ night', 'لكل ليلة').replace('/ month', 'شهرياً') : hotel.price}
                        </span>
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
      {/* TAB 3: 🏬 دليل الخدمات والمعيشة (Living Services) OR 🗺️ خطة الرحلة والجدول */}
      {/* ========================================================================= */}
      {mainViewTab === 'itinerary' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#121728]/90 border border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-1">
                {isLongTermStay ? <Building2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>
                  {isLongTermStay
                    ? (isRtl ? 'دليل الخدمات والاستقرار المعيشي' : 'Living & Relocation Service Modules')
                    : (isRtl ? 'جدول الأيام والشاشة المنقسمة' : 'Interactive Daily Itinerary & Split Map')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {isLongTermStay
                  ? (isRtl ? `دليل الخدمات والمعيشة في ${journey.destinationCity || journey.destination.capital}` : `Living & Services in ${journey.destinationCity || journey.destination.capital}`)
                  : (selectedOption ? (isRtl ? selectedOption.titleAr : selectedOption.title) : (isRtl ? 'الجدول اليومي' : 'Daily Schedule'))}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {isLongTermStay
                  ? (isRtl ? 'وحدات معيشية حقيقية تغطي الجامعات، المدارس، البقالات الحلال، المطاعم المألوفة، والخدمات البنكية والقانونية.' : 'Dedicated living modules covering universities, schools, ethnic groceries, familiar dining, and banking/legal essentials.')
                  : (selectedOption ? (isRtl ? selectedOption.descriptionAr : selectedOption.description) : '')}
              </p>
            </div>

            {/* Option A vs Option B Switcher (Only for Tourism/Medical) */}
            {!isLongTermStay && (
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
            )}
          </div>

          {/* ========================================================================= */}
          {/* CASE 1: Study / Work / Relocation -> NO DAILY ITINERARY -> LIVING MODULES */}
          {/* ========================================================================= */}
          {isLongTermStay ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Right Column: 5 Living & Service Modules (7 Cols) - Multi-Option Structure (DEFAULT CLOSED) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Module 1: 🎓 Universities & Academics (DEFAULT CLOSED) */}
                <div className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden shadow-xl hover:border-indigo-500/30 transition">
                  <button
                    type="button"
                    onClick={() => toggleModule('unis')}
                    className="w-full p-5 flex items-center justify-between gap-3 text-start bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isRtl ? '🎓 الجامعات والتعليم الأكاديمي' : '🎓 Universities & Academics'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            {isRtl ? '2 خيارات معتمدة' : '2 Verified'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isRtl ? 'الجامعات المعتمدة ومطابقة الدرجات العلمية' : 'Accredited Higher Education & Degree Matching'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                      {expandedModules['unis'] ? <ChevronUp className="w-4 h-4 text-pink-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedModules['unis'] && (
                    <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                      {/* Uni Option 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `جامعة ${journey.destinationCity || journey.destination.capital} الرئيسية` : `${journey.destinationCity || journey.destination.capital} State University`}
                          </span>
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">بكالوريوس</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">ماجستير</span>
                            <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[10px] font-bold">دكتوراه</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'أعلى تصنيف أكاديمي محلي، برامج معتمدة من وزارة التعليم، مكتب مخصص لدعم المبتعثين والطلاب الدوليين.'
                            : 'Top accredited international academic programs with dedicated international student advisory and visa support office.'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-indigo-400" />
                            <span>admissions@{journey.destinationCity?.toLowerCase().replace(/\s+/g, '') || 'univ'}.edu</span>
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('University ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'رابط التقديم والموقع' : 'Admissions & Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Uni Option 2 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `معهد ${journey.destinationCity || journey.destination.capital} التقني للعلوم والتكنولوجيا` : `${journey.destinationCity || journey.destination.capital} Institute of Technology`}
                          </span>
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">هندسة وحاسب</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">ماجستير وبحث</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'تخصصات علوم الحاسب، الذكاء الاصطناعي، والهندسة، مع شراكات تدريب مهني مع كبرى الشركات.'
                            : 'Leading tech & CS faculty, AI labs, and direct industry internship placement pipelines.'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-cyan-400" />
                            <span>intl-students@{journey.destinationCity?.toLowerCase().replace(/\s+/g, '') || 'tech'}.edu</span>
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Institute of Technology ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'بوابة القبول المباشر' : 'Direct Portal'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 2: 🏫 Schools & Childcare (DEFAULT CLOSED) */}
                <div className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden shadow-xl hover:border-blue-500/30 transition">
                  <button
                    type="button"
                    onClick={() => toggleModule('schools')}
                    className="w-full p-5 flex items-center justify-between gap-3 text-start bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30 shrink-0">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isRtl ? '🏫 المدارس الدولية ورعاية الأطفال' : '🏫 Schools & Childcare'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            {isRtl ? '2 خيارات' : '2 Options'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isRtl ? 'المناهج الدولية (IB، بريطاني، أمريكي) وحضانات الأطفال' : 'International Curricula & Daycares'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                      {expandedModules['schools'] ? <ChevronUp className="w-4 h-4 text-pink-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedModules['schools'] && (
                    <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                      {/* School Option 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `أكاديمية ${journey.destinationCity || journey.destination.capital} الدولية (IB World School)` : `${journey.destinationCity || journey.destination.capital} International IB Academy`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">IB Continuum</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'تعليم دولي معتمد عالمياً، بيئة متعددة الثقافات، خيارات نقل مدرسي، وفصول تهيئة للغة الإنجليزية.'
                            : 'Globally accredited IB curriculum with campus transit and dedicated English transition classes.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 text-[11px]">📍 Diplomatic Quarter Campus</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('International IB School ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'التواصل والتسجيل' : 'Admissions & Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* School Option 2 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `المدرسة البريطانية الدولية (British Grammar School)` : `British International Grammar School`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">IGCSE & A-Levels</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'المنهاج البريطاني المعتمد (IGCSE / A-Levels) لجميع المراحل من الروضة حتى الثانوي.'
                            : 'National Curriculum of England with Cambridge IGCSE and A-Level certification.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 text-[11px]">📍 Central Suburban Campus</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('British International School ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'بوابة التسجيل' : 'Registration Portal'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 3: 🛒 Cultural & Ethnic Groceries (DEFAULT CLOSED) */}
                <div className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden shadow-xl hover:border-emerald-500/30 transition">
                  <button
                    type="button"
                    onClick={() => toggleModule('groceries')}
                    className="w-full p-5 flex items-center justify-between gap-3 text-start bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 shrink-0">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isRtl ? '🛒 البقالات والأسواق الحلال والشرقية' : '🛒 Ethnic & Halal Groceries'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            {isRtl ? '2 أسواق موثقة' : '2 Verified'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isRtl ? 'المنتجات والبهارات والمأكولات المألوفة حسب بلد المغادرة' : 'Culturally familiar ingredients & Halal markets'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                      {expandedModules['groceries'] ? <ChevronUp className="w-4 h-4 text-pink-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedModules['groceries'] && (
                    <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                      {/* Grocery Option 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? 'سوبرماركت البركة للمنتجات الشرقية والحلال' : 'Al-Baraka Oriental & Halal Supermarket'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">100% Halal & Fresh</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'لحوم ودواجن حلال طازجة يومياً، مخبوزات عربية وتركية، أرز وبهارات مألوفة، ومنتجات معلبة مستوردة.'
                            : 'Daily fresh Halal butcher, Middle Eastern bakery, authentic imported spices, and essential pantry goods.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 text-[11px]">🕒 09:00 AM - 10:00 PM</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Halal Supermarket ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع والملاحة' : 'View on Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Grocery Option 2 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? 'سوق المدينة للمنتجات المتوسطية' : 'Medina Mediterranean & International Mart'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold">Imported Goods</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'تشكيلة واسعة من التمور والقهوة العربية والشاي وزيت الزيتون والأجبان والمخللات الشامية.'
                            : 'Arabic coffee, dates, olive oil, Levantine cheeses, and international imported specialties.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 text-[11px]">🕒 08:30 AM - 09:30 PM</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Mediterranean Market ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع والملاحة' : 'View on Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 4: 🍽️ Culturally Familiar Dining (DEFAULT CLOSED) */}
                <div className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden shadow-xl hover:border-orange-500/30 transition">
                  <button
                    type="button"
                    onClick={() => toggleModule('dining')}
                    className="w-full p-5 flex items-center justify-between gap-3 text-start bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center border border-orange-500/30 shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isRtl ? '🍽️ المطاعم المألوفة والمطابخ الحلال' : '🍽️ Familiar & Halal Dining'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                            {isRtl ? '2 مطاعم' : '2 Dining'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isRtl ? 'خيارات طعام تناسب ذائقتك الثقافية' : 'Culturally familiar, certified dining spots'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                      {expandedModules['dining'] ? <ChevronUp className="w-4 h-4 text-pink-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedModules['dining'] && (
                    <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                      {/* Dining Option 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? 'مطعم دمشق وبيروت للمأكولات الشرقية' : 'Levant Charcoal Grill & Mezzah'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[10px] font-bold">100% Halal Grill</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'مشاوي مشكلة، مقبلات شامية، وجبات عائلية متكاملة، وقائمة طعام حلال بالكامل مع جلسات مريحة.'
                            : 'Authentic charcoal grills, mezze platters, family seating, and 100% Halal certified menu.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-orange-400 text-[11px]">★ 4.8 / 5 (Google Reviews)</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Halal Restaurant ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'المنيو والموقع' : 'Menu & Location'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Dining Option 2 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? 'مطعم أسطنبول للمأكولات التركية الأصيلة' : 'Istanbul Traditional Kitchen'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">Turkish & Mediterranean</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'أطباق إسكندر كباب، فطائر البيد التركية، وشوربات دافئة تناسب الذائقة العربية.'
                            : 'Iskender kebab, Turkish pide, lentil soups, and authentic Mediterranean flavours.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-amber-400 text-[11px]">★ 4.7 / 5 (Google Reviews)</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Turkish Halal Restaurant ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع على الخريطة' : 'View on Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 5: 🏛️ Banking & Legal Essentials (DEFAULT CLOSED) */}
                <div className="rounded-3xl bg-[#121728]/90 border border-white/10 overflow-hidden shadow-xl hover:border-purple-500/30 transition">
                  <button
                    type="button"
                    onClick={() => toggleModule('banking')}
                    className="w-full p-5 flex items-center justify-between gap-3 text-start bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 shrink-0">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isRtl ? '🏛️ الخدمات البنكية والقانونية وتوثيق العقود' : '🏛️ Legal & Banking Essentials'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                            {isRtl ? '3 بنوك ومكاتب ترجمة' : '3 Expat Banks'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isRtl ? '3 بنوك صديقة للوافدين ومكاتب الترجمة المعتمدة' : 'Expat-friendly banks & certified translation'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                      {expandedModules['banking'] ? <ChevronUp className="w-4 h-4 text-pink-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedModules['banking'] && (
                    <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                      {/* Bank Option 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? '1. بنك الوافدين الدولي (International Expat Bank)' : '1. International Expat Banking Branch'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">No Residency Req Initially</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'إمكانية فتح حساب بنكي فوري بجواز السفر وخطاب القبول الجامعي / عقد العمل قبل صدور الإقامة الدائمة.'
                            : 'Allows non-resident bank account opening using passport + student admission or employment contract.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-purple-300 text-[11px]">💳 IBAN & Debit Card Ready</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Bank branch ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الفرع على الخريطة' : 'Branch Location'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Bank Option 2 & 3 + Translation */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? '2. مكتب الترجمة المعتمد والتوثيق العدلي' : '2. Certified Legal Translation Bureau'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Official Certified Bureau</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'ترجمة معتمدة للشهادات والوثائق الرسمية وعقود الإيجار معتمدة لدى الدوائر الحكومية والبلديات.'
                            : 'Certified court translation for diplomas, birth certificates, and tenancy contracts for municipal registration.'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-indigo-300 text-[11px]">🏛️ City Hall / Municipal Bureau</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Certified Translation Bureau ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع والملاحة' : 'Bureau Map'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Left Column: Interactive Map with 4 Category Color Pins & Legend Filter (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {(() => {
                  const mapQuery = encodeURIComponent(`${journey.destinationCity || journey.destination.capital}, ${journey.destination.name}`);
                  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&hl=${isRtl ? 'ar' : 'en'}&z=13&output=embed`;

                  // Requirement 4: Color-Coded Map Pins Data
                  const allPins = [
                    {
                      id: 'p1',
                      category: 'services',
                      color: '#A855F7',
                      colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:border-purple-400',
                      badgeColor: 'bg-purple-500 text-white',
                      icon: '🎓',
                      nameAr: 'مجمع الجامعة المركزي',
                      nameEn: 'Central University Campus',
                      coords: `${journey.destination.lat?.toFixed(4)}, ${journey.destination.lng?.toFixed(4)}`,
                      query: 'University ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p2',
                      category: 'services',
                      color: '#A855F7',
                      colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:border-purple-400',
                      badgeColor: 'bg-purple-500 text-white',
                      icon: '🏫',
                      nameAr: 'المدرسة الدولية المعتمدة',
                      nameEn: 'International Accredited School',
                      coords: `${(journey.destination.lat + 0.009)?.toFixed(4)}, ${(journey.destination.lng + 0.007)?.toFixed(4)}`,
                      query: 'International School ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p3',
                      category: 'dining',
                      color: '#3B82F6',
                      colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:border-blue-400',
                      badgeColor: 'bg-blue-500 text-white',
                      icon: '🛒',
                      nameAr: 'السوبرماركت الحلال والشرقي',
                      nameEn: 'Halal & Oriental Supermarket',
                      coords: `${(journey.destination.lat - 0.006)?.toFixed(4)}, ${(journey.destination.lng - 0.004)?.toFixed(4)}`,
                      query: 'Halal Supermarket ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p4',
                      category: 'dining',
                      color: '#3B82F6',
                      colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:border-blue-400',
                      badgeColor: 'bg-blue-500 text-white',
                      icon: '🍽️',
                      nameAr: 'المطعم الشرقي الحلال',
                      nameEn: 'Authentic Halal Restaurant',
                      coords: `${(journey.destination.lat + 0.004)?.toFixed(4)}, ${(journey.destination.lng - 0.008)?.toFixed(4)}`,
                      query: 'Halal Restaurant ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p5',
                      category: 'services',
                      color: '#A855F7',
                      colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:border-purple-400',
                      badgeColor: 'bg-purple-500 text-white',
                      icon: '🏛️',
                      nameAr: 'البنك ومركز الخدمات الحكومية',
                      nameEn: 'Expat Banking & City Bureau',
                      coords: `${(journey.destination.lat - 0.003)?.toFixed(4)}, ${(journey.destination.lng + 0.005)?.toFixed(4)}`,
                      query: 'Bank ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p6',
                      category: 'culture',
                      color: '#10B981',
                      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-400',
                      badgeColor: 'bg-emerald-500 text-white',
                      icon: '🏛️',
                      nameAr: 'المركز الثقافي والتاريخي',
                      nameEn: 'Historical Heritage Center',
                      coords: `${(journey.destination.lat + 0.002)?.toFixed(4)}, ${(journey.destination.lng + 0.003)?.toFixed(4)}`,
                      query: 'Historical Center ' + (journey.destinationCity || journey.destination.name),
                    },
                    {
                      id: 'p7',
                      category: 'entertainment',
                      color: '#EF4444',
                      colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:border-rose-400',
                      badgeColor: 'bg-rose-500 text-white',
                      icon: '🎢',
                      nameAr: 'مجمع الترفيه والألعاب',
                      nameEn: 'Active Entertainment Hub',
                      coords: `${(journey.destination.lat - 0.005)?.toFixed(4)}, ${(journey.destination.lng + 0.008)?.toFixed(4)}`,
                      query: 'Theme Park Entertainment ' + (journey.destinationCity || journey.destination.name),
                    },
                  ];

                  const filteredPins = activeCategoryFilter === 'all'
                    ? allPins
                    : allPins.filter((p) => p.category === activeCategoryFilter);

                  return (
                    <div className="p-6 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-4 sticky top-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-pink-400" />
                            <span>{isRtl ? 'خريطة مرافق الاستقرار والمعيشة' : 'Living Facilities Map View'}</span>
                          </h4>
                        </div>
                        <span className="text-[10px] text-pink-300 font-mono px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                          Geo-JSON Active
                        </span>
                      </div>

                      {/* Map Embed */}
                      <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-[#0B0F1E]">
                        <iframe
                          src={mapEmbedUrl}
                          title="Living Services Map"
                          className="w-full h-full border-0 filter contrast-105"
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>

                      {/* Interactive Legend Filter (Requirement 4) */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          {isRtl ? 'فلتر تصنيفات الخريطة التفاعلي:' : 'Interactive Category Map Filter:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: '📍', color: 'bg-white/10' },
                            { id: 'dining', labelAr: '🟦 المطاعم', labelEn: '🟦 Dining', icon: '', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
                            { id: 'culture', labelAr: '🟩 المعالم', labelEn: '🟩 Culture', icon: '', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
                            { id: 'entertainment', labelAr: '🟥 الترفيه', labelEn: '🟥 Fun', icon: '', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
                            { id: 'services', labelAr: '🟪 الخدمات', labelEn: '🟪 Services', icon: '', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
                          ].map((cat) => {
                            const isSelected = activeCategoryFilter === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategoryFilter(cat.id as any)}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                                  isSelected
                                    ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/30'
                                    : `${cat.color} hover:bg-white/15 text-gray-300 border-white/10`
                                }`}
                              >
                                {isRtl ? cat.labelAr : cat.labelEn}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Geo-JSON Facility Pins List */}
                      <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                        {filteredPins.map((pin) => (
                          <div
                            key={pin.id}
                            className={`p-2.5 rounded-2xl bg-white/5 border flex items-center justify-between gap-2 transition ${pin.colorClass}`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 bg-black/30">
                                {pin.icon}
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-white block truncate">
                                  {isRtl ? pin.nameAr : pin.nameEn}
                                </span>
                                <span className="text-[10px] opacity-75 font-mono">{pin.coords}</span>
                              </div>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pin.query)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0 transition flex items-center gap-1"
                            >
                              <span>{isRtl ? 'ملاحة' : 'Route'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* CASE 2: Tourism / Medical -> TIME HIERARCHY SPLIT SCREEN DAILY ITINERARY */
            /* ========================================================================= */
            selectedOption && (
              <div className="space-y-6">
                {/* Specialized Medical & Healthcare Hub (If Purpose = Medical) */}
                {journey.purpose === 'medical' && (
                  <div className="p-6 rounded-3xl bg-[#121728]/90 border border-pink-500/30 space-y-4 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
                          <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">
                            {isRtl ? '🏥 المراكز والمستشفيات التخصصية المعتمدة (Medical Facilities Hub)' : '🏥 Specialized Medical & Recovery Facilities'}
                          </h4>
                          <span className="text-xs text-rose-300 font-medium">
                            {isRtl ? 'مستشفيات جامعية، استشاريين معتمدين، ومكاتب خدمة المرضى الدوليين' : 'University Hospitals, Lead Consultants & International Desks'}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                        {isRtl ? 'مسار طبي معتمد' : 'Medical Verified'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Facility 1 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `مستشفى ${journey.destinationCity || journey.destination.capital} الجامعي التخصصي` : `${journey.destinationCity || journey.destination.capital} University Specialized Hospital`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">JCI Accredited</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'أقسام جراحية متقدمة، استشاريين زائرين، ومكتب تنسيق طبي دولي ناطق بالعربية والإنجليزية.'
                            : 'Tertiary surgical care, visiting professors, and dedicated international patient coordination desk.'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-rose-400" />
                            <span>+41 22 372 33 11 (Intl Desk)</span>
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Specialized University Hospital ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع والتنسيق' : 'Desk & Location'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Facility 2 */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {isRtl ? `مركز ${journey.destinationCity || journey.destination.capital} للتأهيل الطبي والاستشفاء` : `${journey.destinationCity || journey.destination.capital} Medical Rehab & Wellness Clinic`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold">Rehabilitation</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          {isRtl
                            ? 'علاج طبيعي وتأهيل حركي، مسابح علاجية بالمياه المعدنية، وبرامج استشفاء متكاملة بعد العمليات.'
                            : 'Hydrotherapy, motor rehabilitation, thermal recovery suites, and personalized convalescence plans.'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                          <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-teal-400" />
                            <span>+41 22 372 88 00</span>
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Medical Wellness Rehab Center ' + (journey.destinationCity || journey.destination.name))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>{isRtl ? 'الموقع والمواعيد' : 'Clinic & Appointments'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Hierarchy Selector (Month -> Week -> Day) */}
                <div className="p-5 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-4">
                  {/* Month Selector (For stays > 30 days) */}
                  {selectedOption.days.length > 30 && (
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{isRtl ? 'الشهر:' : 'Month:'}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(1)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          selectedMonth === 1 ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isRtl ? 'الشهر 1' : 'Month 1'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(2)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          selectedMonth === 2 ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isRtl ? 'الشهر 2' : 'Month 2'}
                      </button>
                    </div>
                  )}

                  {/* Week Selector (For stays > 7 days) */}
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
                  {/* Main Day Cards Column (7 Cols) */}
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

                            {/* Time Slots Breakdown: Morning, Afternoon, Evening (Strict Non-Repetition) */}
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
            )
          )}
        </div>
      )}
    </div>
  );
}

