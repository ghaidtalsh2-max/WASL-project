'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { Menu, Globe, Sun, Moon, Settings, ArrowRight, ArrowLeft, Sparkles, MapPin } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export default function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const { t, isRtl, toggleLanguage, language, fontSize, cycleFontSize } = useLanguage();
  const { isDark, toggleMode } = useTheme();
  const { journey, setScreen, setSettingsOpen } = useJourney();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F1C]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
      {/* Left: Sidebar Hamburger + WASL Logo */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Clean Hamburger Menu Button (Three Horizontal Lines) */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 text-gray-200 transition-all flex items-center gap-2 group"
          title="Open Navigation"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-gray-200 group-hover:text-pink-300 transition-colors" />
          <span className="hidden sm:inline text-xs font-semibold text-gray-300 group-hover:text-white">
            {isRtl ? 'القائمة' : 'Menu'}
          </span>
        </button>

        <div
          onClick={() => setScreen('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            WASL <span className="font-arabic font-normal text-pink-400">وصل</span>
          </span>
        </div>
      </div>

      {/* Center: Journey Route Badge */}
      <div
        onClick={() => setScreen('setup')}
        className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 cursor-pointer transition shadow-inner"
        title="Click to edit destination or city"
      >
        <span className="text-base">{journey.origin.flag}</span>
        <span className="text-xs font-semibold text-gray-300 hidden md:inline">
          {isRtl ? journey.origin.nameAr : journey.origin.name}
        </span>
        {isRtl ? (
          <ArrowLeft className="w-3.5 h-3.5 text-pink-400" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
        )}
        <span className="text-base">{journey.destination.flag}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-pink-400">
            {journey.destinationCity || (isRtl ? journey.destination.nameAr : journey.destination.name)}
          </span>
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            ({isRtl ? journey.destination.nameAr : journey.destination.name})
          </span>
        </div>
      </div>

      {/* Right Controls: Font Scaling, Language, Theme, Settings */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Font Size A- / A / A+ */}
        <button
          onClick={cycleFontSize}
          className="hidden sm:flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition"
          title="Change Font Size"
        >
          <span className={fontSize === 'sm' ? 'text-pink-400 font-bold' : ''}>A-</span>
          <span>/</span>
          <span className={fontSize === 'md' ? 'text-pink-400 font-bold' : ''}>A</span>
          <span>/</span>
          <span className={fontSize === 'lg' ? 'text-pink-400 font-bold' : ''}>A+</span>
        </button>

        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-gray-200 transition"
        >
          <Globe className="w-3.5 h-3.5 text-pink-400" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleMode}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-yellow-400 transition"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-pink-400 transition"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
