'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Loader2,
  Info,
} from 'lucide-react';

export default function TranslateSection() {
  const { t, isRtl } = useLanguage();
  const { journey } = useJourney();

  const [sourceLang, setSourceLang] = useState<string>('Arabic');
  const [targetLang, setTargetLang] = useState<string>(journey.destination.language);
  const [inputText, setInputText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleTranslate = async (textToUse?: string) => {
    const query = textToUse || inputText;
    if (!query.trim()) return;

    setIsTranslating(true);
    setCopied(false);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          sourceLang,
          targetLang,
          destination: journey.destination.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.translation) {
        setResult(data.translation);
      } else {
        setResult({
          literal: query,
          natural: query,
          contextEn: 'Direct translation performed. Check API Settings for advanced cultural nuance.',
          contextAr: 'تمت الترجمة المباشرة. لفتح التحليل الثقافي الكامل اضبط مفتاح API في الإعدادات.',
        });
      }
    } catch {
      setResult({
        literal: query,
        natural: query,
        contextEn: 'Translation service offline.',
        contextAr: 'خدمة الترجمة غير متصلة حالياً.',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = journey.destination.languageCode || 'ja-JP';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Languages className="w-6 h-6 text-pink-400" />
          <span>{t.translatorTitle}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">{t.translatorSubtitle}</p>
      </div>

      {/* Language Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121728]/90 border border-white/10 shadow-lg">
        <span className="text-xs sm:text-sm font-semibold text-white px-3">{sourceLang}</span>
        <button
          onClick={swapLanguages}
          className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-gray-400 transition"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
        <span className="text-xs sm:text-sm font-semibold text-pink-400 px-3">{targetLang}</span>
      </div>

      {/* Input Box */}
      <div className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.sourceTextPlaceholder}
          rows={3}
          className="w-full p-4 rounded-3xl bg-[#121728]/90 border border-white/10 focus:border-pink-500 text-white text-sm focus:outline-none leading-relaxed transition shadow-xl"
        />

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-gray-400">{isRtl ? 'عبارات سريعة:' : 'Quick samples:'}</span>
          {[
            'هل يوجد لديكم طعام حلال؟',
            'كم يستغرق الوصول إلى المحطة؟',
            'أعتذر، هل يمكنك مساعدتي؟',
            'أريد فتح حساب بنكي للدراسة',
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(sample);
                handleTranslate(sample);
              }}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Translate Action */}
        <div className="flex justify-end">
          <button
            onClick={() => handleTranslate()}
            disabled={isTranslating || !inputText.trim()}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'جاري الترجمة السياقية...' : 'Translating...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.translateAction}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Comparison (Literal vs Natural) */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Natural / Local Phrasing (Primary Card) */}
          <div className="rounded-3xl bg-[#121728]/95 border border-pink-500/30 p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
                <Sparkles className="w-4 h-4" />
                <span>{t.naturalTranslation}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudio(result.natural)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition"
                  title="Play pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(result.natural)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition"
                  title="Copy text"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {result.natural}
            </div>

            {/* Cultural Context Note */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
              <div className="flex items-center gap-1.5 text-pink-300 font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>{t.contextAndNuance}</span>
              </div>
              <p className="leading-relaxed">
                {isRtl ? result.contextAr : result.contextEn}
              </p>
            </div>
          </div>

          {/* Literal Translation Card */}
          <div className="rounded-3xl bg-[#121728]/70 border border-white/10 p-6 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.literalTranslation}
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-300 pt-3 leading-snug">
                {result.literal}
              </div>
            </div>

            <div className="text-xs text-gray-400 italic p-3 rounded-xl bg-white/5">
              {isRtl
                ? 'الترجمة الحرفية قد تبدو غير مألوفة أو جافة للمتحدث الأصلي؛ يُفضل دائماً استخدام الأسلوب الطبيعي المعتمد محلياً.'
                : 'Literal phrasing may sound unnatural or awkward to native speakers; prefer the natural cultural equivalent.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
