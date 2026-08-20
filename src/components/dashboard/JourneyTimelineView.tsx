'use client';

import React from 'react';
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
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

export default function JourneyTimelineView() {
  const { t, isRtl } = useLanguage();
  const {
    journey,
    stages,
    activeStageIndex,
    setActiveStageIndex,
    toggleTaskCompletion,
    setActiveTab,
    isLoadingJourneyData,
    refreshStagesAI,
    isAiRefreshing,
  } = useJourney();

  const currentStage = stages[activeStageIndex] || stages[0];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>{isRtl ? 'مسار رحلتك المخصص' : 'Your Journey Timeline'}</span>
            </h2>
            {(isLoadingJourneyData || isAiRefreshing) && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{isRtl ? 'جاري تخصيص البيانات...' : 'Personalizing AI...'}</span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span>
              {isRtl ? 'الإقامة في:' : 'Staying in:'}{' '}
              <strong className="text-white">
                {journey.destinationCity || journey.destination.name}
              </strong>
              {journey.accommodationArea && ` (${journey.accommodationArea})`},{' '}
              {isRtl ? journey.destination.nameAr : journey.destination.name} •{' '}
              <span className="capitalize">{journey.purpose}</span>
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Refresh Button */}
          <button
            onClick={refreshStagesAI}
            disabled={isAiRefreshing || isLoadingJourneyData}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-xs font-semibold text-pink-300 transition flex items-center gap-1.5 shadow-sm"
            title="Generate personalized AI journey stages"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin text-pink-400' : 'text-pink-400'}`} />
            <span>{isAiRefreshing ? (isRtl ? 'جاري التوليد بالذكاء...' : 'Generating...') : (isRtl ? 'توليد مراحل مخصصة بالذكاء' : 'Generate with AI')}</span>
          </button>

          {/* Quick Route Pill */}
          <div className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2">
            <span>{journey.origin.flag} {isRtl ? journey.origin.nameAr : journey.origin.name}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5 text-pink-400" /> : <ArrowRight className="w-3.5 h-3.5 text-pink-400" />}
            <span className="text-pink-300">{journey.destination.flag} {journey.destinationCity || journey.destination.name}</span>
          </div>
        </div>
      </div>

      {/* 1. Horizontal Timeline Stages (Clean Interactive Pills) */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {stages.map((stage, idx) => {
          const isActive = idx === activeStageIndex;
          const isPassed = idx < activeStageIndex;
          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => setActiveStageIndex(idx)}
                className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 border text-start ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/20 border-pink-500 text-pink-200 shadow-lg shadow-pink-500/20 scale-[1.02]'
                    : isPassed
                    ? 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                      : isPassed
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {stage.stageNumber}
                </span>
                <span className="truncate">{isRtl ? stage.titleAr : stage.title}</span>
              </button>

              {idx < stages.length - 1 && (
                <div className="text-gray-600 shrink-0">
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Stage Detail Card (3 Columns: Things to Check | Official Resources | Quick Tips) */}
      <div className="rounded-3xl bg-[#121728]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Stage Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Stage {currentStage.stageNumber}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">
              {isRtl ? currentStage.titleAr : currentStage.title}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {isRtl ? currentStage.subtitleAr : currentStage.subtitle}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 1. Things to Check */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              {isRtl ? 'المهام والتجهيزات المطلوبة' : 'Things to Check'}
            </h4>
            <div className="space-y-2.5">
              {currentStage.thingsToCheck.map((task) => (
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
              {currentStage.officialResources.map((res, i) => (
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
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>{isRtl ? currentStage.quickTip.titleAr : currentStage.quickTip.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {isRtl ? currentStage.quickTip.textAr : currentStage.quickTip.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
