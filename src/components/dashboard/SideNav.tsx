'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useJourney, NavTab } from '@/lib/state/JourneyContext';
import {
  Luggage,
  Compass,
  Navigation,
  Landmark,
  Languages,
  LanguagesIcon,
  Scale,
  ShieldAlert,
  PhoneCall,
  Bot,
  Sun,
  Moon,
  Globe,
  Settings,
  X,
  Sparkles,
  Type,
} from 'lucide-react';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const { t, isRtl, toggleLanguage, language, fontSize, cycleFontSize } = useLanguage();
  const { isDark, toggleMode } = useTheme();
  const { activeTab, setActiveTab, toggleAssistant, setSettingsOpen, journey } = useJourney();

  const navItems: { id: NavTab; label: string; icon: any }[] = [
    { id: 'journey', label: isRtl ? 'خريطة ومراحل الرحلة (Journey)' : 'Journey Timeline', icon: Luggage },
    { id: 'discover', label: isRtl ? 'استكشاف الأماكن (Discover)' : 'Discover Places', icon: Compass },
    { id: 'nearby', label: isRtl ? 'الأماكن القريبة (Nearby Radar)' : 'Nearby Radar', icon: Navigation },
    { id: 'culture', label: isRtl ? 'الثقافة والإتيكيت (Culture)' : 'Culture & Etiquette', icon: Landmark },
    { id: 'language', label: isRtl ? 'اللغة والتعبيرات (Local Language)' : 'Local Language', icon: Languages },
    { id: 'translate', label: isRtl ? 'المترجم الفوري (Translate)' : 'Translator', icon: LanguagesIcon },
    { id: 'religion', label: isRtl ? 'السياق الديني والحلال (Religion)' : 'Religion & Context', icon: Scale },
    { id: 'safety', label: isRtl ? 'الأمان الرقمي (Digital Safety)' : 'Digital Safety', icon: ShieldAlert },
    { id: 'emergency', label: isRtl ? 'أرقام الطوارئ (Emergency)' : 'Emergency Contacts', icon: PhoneCall },
  ];

  const handleNavClick = (id: NavTab) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay (Closes drawer on outside click) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 bottom-0 ${
          isRtl ? 'right-0' : 'left-0'
        } z-50 w-72 sm:w-80 bg-[#0B0F1E]/95 backdrop-blur-2xl border-${
          isRtl ? 'l' : 'r'
        } border-white/15 shadow-2xl flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out text-white ${
          isOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-wider">
                WASL <span className="font-arabic font-normal text-pink-400">وصل</span>
              </span>
              <span className="text-[10px] text-gray-400">
                {journey.destination.flag} {journey.destinationCity || journey.destination.capital}
              </span>
            </div>
          </div>

          {/* Close hamburger/X button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 text-start ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/25 to-rose-500/15 text-pink-300 border border-pink-500/40 shadow-lg shadow-pink-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-pink-400' : 'text-gray-400'
                  }`}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm shadow-pink-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Items */}
        <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs">
          {/* Appearance Toggle */}
          <button
            onClick={toggleMode}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
              <span>{t.navAppearance || 'Appearance'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-pink-400" />
              <span>{t.navLangSwitch || 'Language'}</span>
            </div>
            <span className="text-[11px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-md">
              {language === 'ar' ? 'العربية' : 'English'}
            </span>
          </button>

          {/* Font Size Scaler */}
          <button
            onClick={cycleFontSize}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-indigo-400" />
              <span>{isRtl ? 'حجم الخط' : 'Font Size'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <span className={fontSize === 'sm' ? 'text-pink-400' : ''}>A-</span>
              <span>/</span>
              <span className={fontSize === 'md' ? 'text-pink-400' : ''}>A</span>
              <span>/</span>
              <span className={fontSize === 'lg' ? 'text-pink-400' : ''}>A+</span>
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setSettingsOpen(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>{t.navSettings || 'Settings'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
