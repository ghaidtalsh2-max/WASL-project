'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  ShieldAlert,
  Phone,
  PhoneCall,
  Flame,
  Building,
  Volume2,
  AlertTriangle,
  HeartPulse,
  ExternalLink,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Copy,
} from 'lucide-react';

export default function EmergencySection() {
  const { isRtl } = useLanguage();
  const { journey, emergencyData } = useJourney();
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const playAudio = (text: string, phraseId: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate speech language
    const destId = journey.destination.id;
    if (destId === 'japan') utterance.lang = 'ja-JP';
    else if (destId === 'china') utterance.lang = 'zh-CN';
    else if (destId === 'turkey') utterance.lang = 'tr-TR';
    else if (destId === 'germany' || destId === 'switzerland') utterance.lang = 'de-DE';
    else if (destId === 'france' || destId === 'mauritius') utterance.lang = 'fr-FR';
    else if (destId === 'thailand') utterance.lang = 'th-TH';
    else if (['saudi-arabia', 'kuwait', 'uae', 'qatar', 'egypt'].includes(destId)) utterance.lang = 'ar-SA';
    else utterance.lang = 'en-US';

    setPlayingPhraseId(phraseId);
    utterance.onend = () => setPlayingPhraseId(null);
    utterance.onerror = () => setPlayingPhraseId(null);
    window.speechSynthesis.speak(utterance);
  };

  const quickContacts = [
    {
      id: 'police',
      labelEn: 'Police Emergency',
      labelAr: 'الشرطة والأمن',
      number: emergencyData.police,
      icon: ShieldAlert,
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-500/15 border-blue-500/30',
    },
    {
      id: 'ambulance',
      labelEn: 'Ambulance & Medical',
      labelAr: 'الإسعاف والطوارئ الطبية',
      number: emergencyData.ambulance,
      icon: HeartPulse,
      color: 'from-rose-600 to-red-700',
      textColor: 'text-rose-300',
      bgColor: 'bg-rose-500/15 border-rose-500/30',
    },
    {
      id: 'fire',
      labelEn: 'Fire Department',
      labelAr: 'الدفاع المدني والإطفاء',
      number: emergencyData.fire,
      icon: Flame,
      color: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-300',
      bgColor: 'bg-amber-500/15 border-amber-500/30',
    },
    {
      id: 'helpline',
      labelEn: 'Tourist & General Helpline',
      labelAr: 'الخط الساخن للسياح والطوارئ',
      number: emergencyData.touristHelpline,
      icon: PhoneCall,
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-300',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Alert Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/80 via-[#181124] to-[#121728] border border-rose-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{isRtl ? 'مركز الطوارئ والسلامة المباشر' : 'Emergency & Safety Hub'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isRtl ? `طوارئ ${journey.destination.nameAr}` : `Emergency Services in ${journey.destination.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              {isRtl
                ? 'أرقام الطوارئ المعتمدة، جهات الاتصال الدبلوماسية لسفارتك، جمل النجدة الصوتية، ومرافق الطوارئ المتاحة على مدار 24 ساعة.'
                : 'Verified national emergency numbers, embassy hotline for your nationality, audio emergency phrases, and 24/7 hospital access.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1 text-center shrink-0">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              {isRtl ? 'البلد المتواجد به' : 'Current Country'}
            </span>
            <span className="font-extrabold text-white text-base flex items-center justify-center gap-1.5">
              <span>{journey.destination.flag}</span>
              <span>{isRtl ? journey.destination.nameAr : journey.destination.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Quick One-Touch Emergency Call Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-400" />
          <span>{isRtl ? 'أرقام الاتصال السريع المباشرة:' : 'One-Touch Direct Emergency Numbers:'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div
                key={contact.id}
                className={`p-5 rounded-3xl border ${contact.bgColor} flex flex-col justify-between space-y-4 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contact.number)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs transition"
                    title="Copy number"
                  >
                    {copiedNumber === contact.number ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-300 block">
                    {isRtl ? contact.labelAr : contact.labelEn}
                  </span>
                  <span className="text-3xl font-black text-white tracking-wider font-mono">
                    {contact.number}
                  </span>
                </div>

                <a
                  href={`tel:${contact.number}`}
                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${contact.color} hover:brightness-110 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isRtl ? 'اتصال فوري' : 'Call Now'}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Embassy & Diplomatic Contacts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isRtl
                  ? `سفارة ${journey.origin.nameAr} في ${journey.destination.nameAr}`
                  : `${journey.origin.name} Embassy in ${journey.destination.name}`}
              </h3>
              <p className="text-xs text-gray-400">
                {isRtl ? 'خدمات شؤون المواطنين ورعاية الرعايا بالخارج على مدار الساعة' : 'Citizen affairs & 24/7 emergency consular services'}
              </p>
            </div>
          </div>
          <span className="text-2xl">{journey.origin.flag}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Embassy Phone */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {isRtl ? 'هاتف السفارة المباشر' : 'Embassy Main Line'}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{emergencyData.embassyPhone}</span>
              <a
                href={`tel:${emergencyData.embassyPhone}`}
                className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold transition flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{isRtl ? 'اتصال' : 'Call'}</span>
              </a>
            </div>
          </div>

          {/* 24/7 Emergency Line */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
              {isRtl ? 'طوارئ شؤون المواطنين (24/7)' : '24/7 Citizen Emergency'}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{emergencyData.embassyEmergencyLine}</span>
              <a
                href={`tel:${emergencyData.embassyEmergencyLine}`}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-rose-500/30"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{isRtl ? 'طوارئ' : 'Hotline'}</span>
              </a>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {isRtl ? 'الموقع وساعات العمل' : 'Location & Office Hours'}
            </span>
            <p className="text-xs text-gray-200 line-clamp-1">{emergencyData.embassyAddress}</p>
            <span className="text-[11px] text-gray-400 block">{emergencyData.embassyHours}</span>
          </div>
        </div>
      </div>

      {/* 3. Emergency Audio Phrases with Speech Synthesis */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121728]/90 border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-pink-400" />
              <span>{isRtl ? 'عبارات النجدة والطوارئ الصوتية' : 'Emergency Audio Phrasebook'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isRtl ? 'اضغط على زر الصوت لنطق العبارة باللغة المحلية لأفراد الأمن أو المارة فوراً' : 'Tap the audio button to play the localized phrase loudly for police, doctors, or locals'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyData.emergencyPhrases.map((phrase, idx) => {
            const isPlaying = playingPhraseId === `phrase-${idx}`;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{isRtl ? phrase.textAr : phrase.textEn}</span>
                  </div>
                  <div className="text-sm font-extrabold text-pink-300 font-sans tracking-wide">
                    {phrase.native}
                  </div>
                  <div className="text-[11px] text-gray-400 italic">
                    {phrase.phonetic}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => playAudio(phrase.native, `phrase-${idx}`)}
                  className={`p-3.5 rounded-2xl transition flex items-center justify-center shrink-0 ${
                    isPlaying
                      ? 'bg-pink-500 text-white animate-pulse shadow-lg shadow-pink-500/40'
                      : 'bg-white/10 hover:bg-pink-500 hover:text-white text-gray-300'
                  }`}
                  title="Play native audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
