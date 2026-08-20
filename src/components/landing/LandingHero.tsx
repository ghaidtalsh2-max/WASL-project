'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { Globe, Moon, Sun, ArrowRight, ArrowLeft, Settings, Sparkles, ChevronDown } from 'lucide-react';

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), { ssr: false });

export default function LandingHero() {
  const { t, isRtl, toggleLanguage, language, fontSize, cycleFontSize } = useLanguage();
  const { isDark, toggleMode } = useTheme();
  const { setScreen, setSettingsOpen } = useJourney();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#070A14] text-white selection:bg-pink-500 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-wider text-white font-sans">
              WASL <span className="font-arabic font-normal text-pink-400">وصل</span>
            </span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-inner">
          {/* Font Size Scaling */}
          <button
            onClick={cycleFontSize}
            className="px-2.5 py-1 text-xs font-semibold rounded-full hover:bg-white/10 transition text-gray-300 hover:text-white flex items-center gap-1"
            title="Adjust text size"
          >
            <span className={fontSize === 'sm' ? 'text-pink-400 font-bold' : ''}>A-</span>
            <span>/</span>
            <span className={fontSize === 'md' ? 'text-pink-400 font-bold' : ''}>A</span>
            <span>/</span>
            <span className={fontSize === 'lg' ? 'text-pink-400 font-bold' : ''}>A+</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20" />

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium hover:text-pink-400 transition text-gray-200"
          >
            <Globe className="w-4 h-4 text-pink-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20" />

          {/* Theme Toggle */}
          <button
            onClick={toggleMode}
            className="p-1.5 text-gray-300 hover:text-yellow-400 transition rounded-full hover:bg-white/10"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="h-4 w-[1px] bg-white/20" />

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 text-gray-300 hover:text-pink-400 transition rounded-full hover:bg-white/10"
            title="AI & API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 py-8">
        {/* Left Side: Brand Statement & CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start text-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>{isRtl ? 'الجيل الجديد من رفيق السفر المعرفي' : 'Next-Gen Cultural Relocation AI'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            WASL <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">وصل</span>
          </h1>

          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-medium text-gray-200 tracking-wide">
              {isRtl ? 'عالم واحد. ثقافات متعددة. اتصال واحد.' : 'One world. Many cultures. One connection.'}
            </p>
            <p className="text-sm sm:text-base text-gray-400 max-w-lg leading-relaxed">
              {isRtl
                ? 'افهم وجهتك بعمق قبل أن تصل إليها — تعرّف على آداب السلوك، واللغة الحية، والسياق الديني، والأمان الرقمي.'
                : 'Understand where you’re going before you arrive. Live, communicate, stay safe, and seamlessly transition into new cultures.'}
            </p>
          </div>

          {/* Primary CTA Button (matches reference design pink pill with circle arrow) */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => setScreen('setup')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-base sm:text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>{t.startJourney}</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:scale-110 transition-transform">
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Glowing Earth Globe */}
        <div className="lg:col-span-6 relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
          {/* Glowing Aura Ring behind globe */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-500/20 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
          
          <GlobeCanvas
            originLat={24.7136}
            originLng={46.6753}
            destLat={35.6762}
            destLng={139.6503}
            showArc={true}
            interactive={true}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>
      </main>

      {/* Bottom Scroll Indicator */}
      <footer className="relative z-10 w-full py-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 transition">
        <button
          onClick={() => setScreen('setup')}
          className="flex flex-col items-center gap-1.5 text-xs uppercase tracking-widest animate-bounce"
        >
          <ChevronDown className="w-4 h-4 text-pink-400" />
          <span>{t.scrollExplore}</span>
        </button>
      </footer>
    </div>
  );
}
