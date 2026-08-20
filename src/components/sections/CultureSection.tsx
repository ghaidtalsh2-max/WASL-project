'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  Landmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  MessageCircle,
  Utensils,
  Shirt,
  Sparkles,
  Info,
  Bot,
  BookOpen,
  Calendar,
  HeartHandshake,
  Clock,
  Compass,
  History,
  Building,
} from 'lucide-react';

export default function CultureSection() {
  const { t, isRtl } = useLanguage();
  const { culture, journey, toggleAssistant, refreshCultureAI, isAiRefreshing } = useJourney();
  const [activeSection, setActiveSection] = useState<'both' | 'know' | 'behave'>('both');

  const knowTheCultureItems = [
    { key: 'history', label: isRtl ? 'التاريخ والتراث' : 'History & Heritage', icon: History, data: culture.knowTheCulture?.history },
    { key: 'clothing', label: isRtl ? 'الملابس والمظهر' : 'Traditional & Modern Attire', icon: Shirt, data: culture.knowTheCulture?.clothing },
    { key: 'foodCulture', label: isRtl ? 'ثقافة الطعام والمائدة' : 'Food & Culinary Culture', icon: Utensils, data: culture.knowTheCulture?.foodCulture },
    { key: 'familySocial', label: isRtl ? 'الأسرة والمجتمع' : 'Family & Social Structure', icon: Users, data: culture.knowTheCulture?.familySocial },
    { key: 'dailyLifestyle', label: isRtl ? 'إيقاع الحياة اليومية' : 'Daily Lifestyle & Pace', icon: Clock, data: culture.knowTheCulture?.dailyLifestyle },
    { key: 'greetings', label: isRtl ? 'التحية ولغة الجسد' : 'Greetings & Body Language', icon: HeartHandshake, data: culture.knowTheCulture?.greetings },
    { key: 'communication', label: isRtl ? 'أسلوب الحوار واللباقة' : 'Communication Style', icon: MessageCircle, data: culture.knowTheCulture?.communication },
    { key: 'traditions', label: isRtl ? 'التقاليد الأصيلة' : 'Important Traditions', icon: Landmark, data: culture.knowTheCulture?.traditions },
    { key: 'celebrations', label: isRtl ? 'الأعياد والاحتفالات' : 'Major Festivals & Holidays', icon: Calendar, data: culture.knowTheCulture?.celebrations },
    { key: 'socialValues', label: isRtl ? 'القيم الاجتماعية' : 'Core Social Values', icon: Sparkles, data: culture.knowTheCulture?.socialValues },
    { key: 'modernVsTraditional', label: isRtl ? 'المعاصرة والأصالة' : 'Modernity vs Heritage', icon: Building, data: culture.knowTheCulture?.modernVsTraditional },
  ].filter((item) => item.data);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Landmark className="w-6 h-6 text-pink-400" />
              <span>{isRtl ? 'فهم ثقافة الوجهة' : 'Culture & Social Dynamics'}</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-semibold">
              {journey.destination.flag} {journey.destinationCity || journey.destination.name}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isRtl
              ? `تعرف على الجذور الاجتماعية والسلوكيات المتبعة في ${journey.destinationCity || journey.destination.name}`
              : `Deep cultural foundations and practical etiquette for ${journey.destinationCity || journey.destination.name}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Refresh Button */}
          <button
            onClick={refreshCultureAI}
            disabled={isAiRefreshing}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-xs font-semibold text-pink-300 transition flex items-center gap-1.5 shadow-sm"
            title="Generate personalized AI cultural analysis"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin text-pink-400' : 'text-pink-400'}`} />
            <span>{isAiRefreshing ? (isRtl ? 'جاري التوليد بالذكاء...' : 'Generating with AI...') : (isRtl ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI')}</span>
          </button>
          {/* Quick Filter */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSection('both')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                activeSection === 'both' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isRtl ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveSection('know')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                activeSection === 'know' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isRtl ? 'اعرف الثقافة' : 'Know Culture'}
            </button>
            <button
              onClick={() => setActiveSection('behave')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                activeSection === 'behave' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isRtl ? 'كيف تتصرف' : 'How to Behave'}
            </button>
          </div>

          <button
            onClick={toggleAssistant}
            className="hidden sm:flex px-4 py-2 rounded-2xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-semibold text-pink-300 transition items-center gap-2"
          >
            <Bot className="w-4 h-4 text-pink-400" />
            <span>{isRtl ? 'اسأل المساعد' : 'Ask AI'}</span>
          </button>
        </div>
      </div>

      {/* SECTION A: "Know the Culture" */}
      {(activeSection === 'both' || activeSection === 'know') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {isRtl ? 'أ. تعرّف على ثقافة الوجهة' : 'A. Know the Culture'}
            </h3>
            <span className="text-xs text-gray-400">
              ({knowTheCultureItems.length} {isRtl ? 'محاور اجتماعية وتاريخية' : 'Dimensions'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {knowTheCultureItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-3xl bg-[#121728]/90 border border-white/10 hover:border-indigo-500/30 p-5 space-y-3 shadow-lg transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-indigo-300 font-bold text-sm">
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{isRtl ? item.data?.titleAr || item.label : item.data?.title || item.label}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? item.data?.contentAr : item.data?.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION B: "How to Behave" (DO, DON'T, GOOD TO KNOW) */}
      {(activeSection === 'both' || activeSection === 'behave') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Compass className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {isRtl ? 'ب. كيف تتصرف (آداب وسلوكيات)' : 'B. How to Behave'}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. DO Card */}
            <div className="rounded-3xl bg-[#121728]/90 border border-emerald-500/25 p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-emerald-300 tracking-wide">
                  {isRtl ? 'تصرّف بهذه الطريقة (افعل)' : 'DO (Recommended)'}
                </h4>
              </div>
              <div className="space-y-3 pt-1">
                {culture.howToBehave?.dos?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/15 space-y-1">
                    <div className="text-xs font-bold text-emerald-300">
                      {isRtl ? item.titleAr : item.title}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? item.descAr : item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DON'T Card */}
            <div className="rounded-3xl bg-[#121728]/90 border border-rose-500/25 p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                  <XCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-rose-300 tracking-wide">
                  {isRtl ? 'تجنب هذا السلوك (لا تفعل)' : "DON'T (Avoid)"}
                </h4>
              </div>
              <div className="space-y-3 pt-1">
                {culture.howToBehave?.donts?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-rose-500/15 space-y-1">
                    <div className="text-xs font-bold text-rose-300">
                      {isRtl ? item.titleAr : item.title}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? item.descAr : item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. GOOD TO KNOW Card */}
            <div className="rounded-3xl bg-[#121728]/90 border border-amber-500/25 p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-amber-300 tracking-wide">
                  {isRtl ? 'من المفيد أن تعرف' : 'GOOD TO KNOW'}
                </h4>
              </div>
              <div className="space-y-3 pt-1">
                {culture.howToBehave?.goodToKnow?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/15 space-y-1">
                    <div className="text-xs font-bold text-amber-300">
                      {isRtl ? item.titleAr : item.title}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isRtl ? item.descAr : item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Variation Note / Disclaimer */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-gray-300">
        <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{isRtl ? 'تنويه ثقافي مهم:' : 'Cultural Note:'}</strong>{' '}
          {isRtl ? culture.disclaimerAr : culture.disclaimer}
        </p>
      </div>
    </div>
  );
}
