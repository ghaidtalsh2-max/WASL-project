'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  Languages,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  MessageSquare,
} from 'lucide-react';

export default function LocalLanguageSection() {
  const { t, isRtl } = useLanguage();
  const { languageData, journey, refreshLanguageAI, isAiRefreshing } = useJourney();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isRtl ? 'جميع العبارات' : 'All Phrases' },
    { id: 'mostUsed', label: isRtl ? 'الأكثر استخداماً' : 'Most Used' },
    { id: 'greetings', label: isRtl ? 'الترحيب واللقاء' : 'Greetings' },
    { id: 'courtesy', label: isRtl ? 'اللباقة والشكر' : 'Courtesy' },
    { id: 'dining', label: isRtl ? 'المطاعم والطعام' : 'Food & Dining' },
    { id: 'transport', label: isRtl ? 'المواصلات والاتجاهات' : 'Transportation' },
    { id: 'shopping', label: isRtl ? 'التسوق والدفع' : 'Shopping' },
    { id: 'emergency', label: isRtl ? 'الطوارئ والمساعدة' : 'Emergency' },
    { id: 'social', label: isRtl ? 'المواقف الاجتماعية' : 'Social Situations' },
    { id: 'slang', label: isRtl ? 'تعبيرات دارجة' : 'Slang & Casual' },
  ];

  const filteredPhrases =
    activeCategory === 'all'
      ? languageData?.phrases || []
      : (languageData?.phrases || []).filter((p) => p.category === activeCategory);

  // Web Speech API Voice synthesis
  const handlePlayAudio = (phraseText: string, phraseId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech audio is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseText);
    utterance.lang = languageData?.languageCode || journey.destination.languageCode || 'en-US';
    utterance.rate = 0.85;

    utterance.onstart = () => setPlayingId(phraseId);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const getFormalityColor = (formality: string) => {
    switch (formality?.toLowerCase()) {
      case 'casual':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'polite':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'formal':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'honorific':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Languages className="w-6 h-6 text-pink-400" />
              <span>{isRtl ? 'لغة البلد الحية' : 'Living Local Language'}</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
              {languageData?.languageName || journey.destination.language}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isRtl
              ? `عبارات الاستخدام اليومي والتعبيرات المحببة لدى السكان في ${journey.destinationCity || journey.destination.name}`
              : `Everyday situational phrases & local favorite idioms in ${journey.destinationCity || journey.destination.name}`}
          </p>
        </div>

        {/* AI Refresh Button */}
        <button
          onClick={refreshLanguageAI}
          disabled={isAiRefreshing}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-xs font-semibold text-pink-300 transition flex items-center gap-1.5 shadow-sm"
          title="Generate fresh AI phrases for this city"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin text-pink-400' : 'text-pink-400'}`} />
          <span>{isAiRefreshing ? (isRtl ? 'جاري توليد العبارات...' : 'Generating Phrases...') : (isRtl ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI')}</span>
        </button>
      </div>

      {/* "Local Favorites" Showcase Banner */}
      {languageData?.localFavorites?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-pink-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{isRtl ? 'التعبيرات المحلية المميزة (Local Favorites)' : 'Local Favorites & Cultural Idioms'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languageData.localFavorites.map((fav, i) => (
              <div
                key={i}
                className="rounded-3xl bg-gradient-to-br from-pink-500/10 via-[#121728] to-[#121728] border border-pink-500/25 p-5 space-y-2.5 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white">
                      {fav.phrase}
                    </div>
                    <div className="text-xs font-mono font-semibold text-pink-400 mt-0.5">
                      {fav.transliteration}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlayAudio(fav.phrase, `fav-${i}`)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 border border-white/10 transition"
                    title={t.listenAudio}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-gray-200">
                    {isRtl ? fav.meaningAr : fav.meaningEn}
                  </div>
                  <div className="text-gray-400 leading-relaxed">
                    💡 {isRtl ? fav.whySpecialAr : fav.whySpecialEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-pink-500/25 border-pink-500 text-pink-300 shadow-md shadow-pink-500/20'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPhrases.map((phrase) => {
          const isPlaying = playingId === phrase.id;
          return (
            <div
              key={phrase.id}
              className="rounded-3xl bg-[#121728]/90 border border-white/10 hover:border-pink-500/30 p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Top Banner: Native script + Pronunciation + Audio */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-sans">
                    {phrase.phrase}
                  </div>
                  <div className="text-sm font-semibold text-pink-400 font-mono tracking-wider">
                    {phrase.transliteration}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${getFormalityColor(
                      phrase.formality
                    )}`}
                  >
                    {phrase.formality || 'polite'}
                  </span>

                  {/* Audio Playback Button */}
                  <button
                    onClick={() => handlePlayAudio(phrase.phrase, phrase.id)}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      isPlaying
                        ? 'bg-pink-500 text-white animate-pulse border-pink-400'
                        : 'bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 border-white/10'
                    }`}
                    title={t.listenAudio}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-1 py-1">
                <div className="text-sm sm:text-base font-bold text-gray-100">
                  {isRtl ? phrase.meaningAr : phrase.meaningEn}
                </div>
                <div className="text-xs text-gray-400">
                  {isRtl ? phrase.meaningEn : phrase.meaningAr}
                </div>
              </div>

              {/* Context Nuance Boxes */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                {/* When to use */}
                <div className="flex items-start gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    <strong>{isRtl ? 'الاستخدام الأمثل:' : 'When to use:'}</strong>{' '}
                    {isRtl ? phrase.whenToUseAr : phrase.whenToUse}
                  </span>
                </div>

                {/* When to avoid */}
                {phrase.whenToAvoid && phrase.whenToAvoid !== 'None.' && (
                  <div className="flex items-start gap-2 text-rose-300">
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                    <span>
                      <strong>{isRtl ? 'تجنب:' : 'Avoid:'}</strong>{' '}
                      {isRtl ? phrase.whenToAvoidAr : phrase.whenToAvoid}
                    </span>
                  </div>
                )}

                {/* Cultural note */}
                {phrase.culturalNote && (
                  <div className="p-2.5 rounded-xl bg-white/5 text-gray-300 text-[11px] leading-relaxed">
                    💡 {isRtl ? phrase.culturalNoteAr : phrase.culturalNote}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
