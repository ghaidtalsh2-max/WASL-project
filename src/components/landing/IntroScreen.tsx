'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { ABOUT_WASL } from '@/lib/data/aboutContent';
import { Sparkles, ArrowRight, ArrowLeft, Sparkle } from 'lucide-react';

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.65 1.65 0 0 0-1.66-1.66Z" />
    </svg>
  );
}

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), { ssr: false });

export default function IntroScreen() {
  const { isRtl } = useLanguage();
  const { setScreen } = useJourney();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#03060F] text-white selection:bg-pink-500 selection:text-white">
      {/* Live Starry Space Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A1128] via-[#040816] to-[#02040A]" />

      {/* Massive 3D Earth Globe Centered at Bottom (Matching Reference Photo) */}
      <div className="fixed -bottom-[320px] sm:-bottom-[420px] md:-bottom-[480px] lg:-bottom-[560px] left-1/2 -translate-x-1/2 w-[720px] h-[720px] sm:w-[960px] sm:h-[960px] lg:w-[1250px] lg:h-[1250px] pointer-events-none z-0 opacity-85">
        <GlobeCanvas
          originLat={24.7136}
          originLng={46.6753}
          destLat={35.6762}
          destLng={139.6503}
          showArc={true}
          interactive={false}
          className="w-full h-full"
        />
      </div>

      {/* Atmospheric Horizon Glow over Earth Dome */}
      <div className="fixed -bottom-20 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-t from-blue-500/20 via-pink-500/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div
          onClick={() => setScreen('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white">
              WASL <span className="text-pink-400 font-arabic">وَصــل</span>
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('landing')}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition backdrop-blur-md"
          >
            {isRtl ? 'الرئيسية' : 'Home'}
          </button>

          <button
            onClick={() => setScreen('setup')}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] transition-all"
          >
            <span>{isRtl ? 'ابدأ رحلتك' : 'Start Journey'}</span>
            {isRtl ? (
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </header>

      {/* Main Center Space Content (Unified Seamless Cosmic Narrative) */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 my-auto pt-6 pb-28 sm:pb-36 flex flex-col items-center text-center space-y-8">
        {/* Grand Title & Cosmic Atmosphere */}
        <div className="space-y-4 max-w-3xl">
          <p className="text-sm sm:text-lg md:text-xl font-medium tracking-wide text-pink-300 drop-shadow-md">
            {isRtl
              ? 'كيف نبني جسور التواصل بين الثقافات حول العالم؟'
              : 'How do we bridge cultures across the universe?'}
          </p>

          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight drop-shadow-[0_10px_35px_rgba(255,255,255,0.35)] font-arabic leading-none">
            {isRtl ? 'الـثـقـافـة والـفـضـاء' : 'CULTURE & SPACE'}
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed pt-1">
            {isRtl
              ? 'وَصل هو رفيق السفر والاستقرار الذكي.. يربطك بالمعالم الحقيقية، الإجراءات الرسمية، اللغة الحية، والمستشفيات المعتمدة لكل وجهة حول العالم في مسار واحد متكامل.'
              : 'WASL is the cultural AI companion connecting you to real landmarks, verified procedures, living dialects, and accredited medical care worldwide.'}
          </p>
        </div>

        {/* Clean Translucent Story Cards (Unified Flow) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 text-start pt-2">
          {/* Card 1: سر التسمية */}
          <div className="p-6 rounded-3xl bg-[#14192B]/80 border border-white/10 backdrop-blur-xl space-y-2.5 shadow-xl hover:border-pink-500/30 transition-all">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <span>{isRtl ? 'سر التسمية: "وَصل"' : 'The Name: "WASL"'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isRtl
                ? 'سُمّي المشروع "وَصل" ليعبّر عن جوهر الاتصال — ربط الإنسان بالأماكن، والمسافرين بالخدمات الرسمية، ودمج الثقافة واللغة ومجتمع الوجهة في مسار واحد متكامل.'
                : 'WASL represents genuine connection — bridging travelers with authentic destinations, official services, and living cultural heritage.'}
            </p>
          </div>

          {/* Card 2: فلسفة الألوان */}
          <div className="p-6 rounded-3xl bg-[#14192B]/80 border border-white/10 backdrop-blur-xl space-y-2.5 shadow-xl hover:border-indigo-500/30 transition-all">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>{isRtl ? 'فلسفة الألوان ' : 'Cosmic Color Palette'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isRtl
                ? 'الكحلي الفضائي العميق يرمز لعمق الفضاء ورسوخ الذكاء الاصطناعي، والوردي والأرجواني يعبران عن الدفء الإنساني والتنوع الثقافي الحي للأرض.'
                : 'Deep space navy embodies technological depth, while vibrant magenta and violet evoke warm human cultural diversity.'}
            </p>
          </div>
        </div>

        {/* Founders Card Section */}
        <div className="w-full max-w-4xl p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-start space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-pink-400" />
              <span>{isRtl ? 'فريق العمل ومطوّرو وَصل' : 'WASL Founders & Engineering'}</span>
            </h3>
            <span className="text-xs text-pink-300/80 font-mono">WASL Core Team</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(ABOUT_WASL.creators || []).map((creator, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/30 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {creator.nameAr.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isRtl ? creator.nameAr : creator.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {isRtl ? creator.roleAr : creator.role}
                    </p>
                  </div>
                </div>

                <a
                  href={creator.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#0077B5] text-gray-300 hover:text-white transition"
                  title="LinkedIn Profile"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Central Launch CTA */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('setup')}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-base sm:text-lg shadow-2xl shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>{isRtl ? 'ابدأ بناء رحلتك الآن' : 'Build Your Journey Now'}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:scale-110 transition-transform">
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
