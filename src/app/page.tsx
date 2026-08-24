'use client';

import React from 'react';
import { useJourney } from '@/lib/state/JourneyContext';
import LandingHero from '@/components/landing/LandingHero';
import IntroScreen from '@/components/landing/IntroScreen';
import JourneySetupModal from '@/components/setup/JourneySetupModal';
import DestinationTransition from '@/components/transition/DestinationTransition';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SettingsModal from '@/components/sections/SettingsModal';
import LiveAmbientBackground from '@/components/common/LiveAmbientBackground';

export default function Home() {
  const { screen } = useJourney();

  return (
    <>
      {/* Live Animated Ambient Background across entire app */}
      <LiveAmbientBackground />

      {screen === 'dashboard' ? (
        <DashboardLayout />
      ) : screen === 'transition' ? (
        <DestinationTransition />
      ) : screen === 'intro' ? (
        <>
          <IntroScreen />
          <SettingsModal />
        </>
      ) : (
        <>
          <LandingHero />
          {screen === 'setup' && <JourneySetupModal />}
          <SettingsModal />
        </>
      )}
    </>
  );
}
