'use client';

import React, { useState } from 'react';
import { useJourney } from '@/lib/state/JourneyContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import TopHeader from './TopHeader';
import SideNav from './SideNav';
import JourneyTimelineView from './JourneyTimelineView';
import DiscoverSection from '../sections/DiscoverSection';
import CultureSection from '../sections/CultureSection';
import LocalLanguageSection from '../sections/LocalLanguageSection';
import TranslateSection from '../sections/TranslateSection';
import ReligionSection from '../sections/ReligionSection';
import DigitalSafetySection from '../sections/DigitalSafetySection';
import AIAssistantDrawer from '../assistant/AIAssistantDrawer';
import SettingsModal from '../sections/SettingsModal';
import ThemeParticles from '../common/ThemeParticles';

export default function DashboardLayout() {
  const { activeTab } = useJourney();
  const { destinationTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#070A14] text-white selection:bg-pink-500 selection:text-white relative overflow-x-hidden transition-colors duration-500"
      style={{
        background: destinationTheme.bgGradient || 'radial-gradient(ellipse at 50% 10%, #17112E 0%, #0B0E17 60%, #06080F 100%)',
      }}
    >
      {/* Dynamic Ambient Background Theme Particles */}
      <ThemeParticles />

      {/* Top Header with Hamburger Button */}
      <TopHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Slide-out Drawer Navigation */}
      <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Hub */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 relative z-10">
        <main className="w-full">
          {activeTab === 'journey' && <JourneyTimelineView />}
          {activeTab === 'discover' && <DiscoverSection />}
          {activeTab === 'culture' && <CultureSection />}
          {activeTab === 'language' && <LocalLanguageSection />}
          {activeTab === 'translate' && <TranslateSection />}
          {activeTab === 'religion' && <ReligionSection />}
          {activeTab === 'safety' && <DigitalSafetySection />}
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Global Settings Modal */}
      <SettingsModal />
    </div>
  );
}
