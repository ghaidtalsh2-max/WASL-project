'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function DigitalSafetySection() {
  const { t, isRtl } = useLanguage();
  const { journey } = useJourney();

  const [messageText, setMessageText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const sampleScams = [
    {
      title: 'Fake Immigration / Tax SMS (Japan)',
      titleAr: 'رسالة ضرائب أو جمارك مزيفة (اليابان)',
      text: '【重要・国税庁】未払い税金があります。本日中に下記リンクより支払手続きを完了してください。 https://nta-gov-jp-payment.xyz/tax',
    },
    {
      title: 'Fake Delivery Package WhatsApp',
      titleAr: 'رسالة طرد بريدي احتيالية (واتساب)',
      text: 'Your international parcel #JP99214 could not be delivered due to unpaid customs fee of ¥350. Pay immediately at http://yamato-express-customs.cc',
    },
    {
      title: 'Legitimate Hotel Confirmation',
      titleAr: 'تأكيد حجز فندقي رسمي (آمن)',
      text: 'Your reservation at Tokyo Grand Hotel is confirmed for Aug 25. Check-in starts at 15:00. No further payment required.',
    },
  ];

  const handleAnalyze = async (textToUse?: string) => {
    const query = textToUse || messageText;
    if (!query.trim()) return;

    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          destination: journey.destination.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch {
      setAnalysis({
        riskLevel: 'medium',
        riskScore: 50,
        threatType: 'Offline Analysis',
        threatTypeAr: 'تحليل أولي غير متصل',
        whyEn: ['Could not reach real-time AI. Be cautious of unknown links and requests for urgent payments.'],
        whyAr: ['تعذر الاتصال بخدمة الذكاء الاصطناعي. احذر من الروابط غير الموثوقة وطلبات الدفع العاجلة.'],
        whatToDoEn: ['Verify directly with the official company', 'Do not enter card credentials'],
        whatToDoAr: ['تحقق مباشرة عبر الموقع الرسمي للمؤسسة', 'لا تدخل بياناتك البنكية أو كلمات المرور'],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-rose-400 border-rose-500/40 bg-rose-500/15';
    if (level === 'medium') return 'text-amber-400 border-amber-500/40 bg-amber-500/15';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-pink-400" />
          <span>{t.safetyAnalyzerTitle}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">{t.safetyAnalyzerSubtitle}</p>
      </div>

      {/* Input Box */}
      <div className="space-y-3">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t.pasteMessagePlaceholder}
          rows={4}
          className="w-full p-4 rounded-3xl bg-[#121728]/90 border border-white/10 focus:border-pink-500 text-white text-sm focus:outline-none leading-relaxed transition shadow-xl font-mono"
        />

        {/* Quick Sample Chips */}
        <div className="space-y-1.5 text-xs">
          <span className="text-gray-400">{isRtl ? 'أمثلة لرسائل شائعة للتجربة:' : 'Try sample suspicious messages:'}</span>
          <div className="flex flex-wrap gap-2">
            {sampleScams.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setMessageText(sample.text);
                  handleAnalyze(sample.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition text-start"
              >
                {isRtl ? sample.titleAr : sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !messageText.trim()}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'جاري الفحص الأمني بالذكاء الاصطناعي...' : 'Analyzing Security Indicators...'}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{t.analyzeSafetyAction}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Card */}
      {analysis && (
        <div className="rounded-3xl bg-[#121728]/95 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.riskLevel}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-sm sm:text-base font-extrabold px-3.5 py-1 rounded-full border ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel === 'high' ? t.highRisk : analysis.riskLevel === 'medium' ? t.mediumRisk : t.lowRisk}
                </span>
                <span className="text-sm font-semibold text-white">
                  {isRtl ? analysis.threatTypeAr || analysis.threatType : analysis.threatType}
                </span>
              </div>
            </div>

            {analysis.riskScore !== undefined && (
              <div className="text-end">
                <span className="text-xs text-gray-400 block">{isRtl ? 'مؤشر التهديد' : 'Threat Score'}</span>
                <span className="text-2xl font-extrabold text-pink-400">{analysis.riskScore}/100</span>
              </div>
            )}
          </div>

          {/* 2-Column Details: Why? | What Should I Do? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Analysis */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{t.whyAnalysis}</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-200">
                {(isRtl ? analysis.whyAr || analysis.whyEn : analysis.whyEn).map((reason: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Checklist */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.whatToDoAction}</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-200">
                {(isRtl ? analysis.whatToDoAr || analysis.whatToDoEn : analysis.whatToDoEn).map((action: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
