'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { Plane, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

const GlobeCanvas = dynamic(() => import('../landing/GlobeCanvas'), { ssr: false });

export default function DestinationTransition() {
  const { isRtl } = useLanguage();
  const { journey, setScreen } = useJourney();
  const { setDestinationThemeByName, destinationTheme } = useTheme();

  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // 1. Activate destination theme in background immediately
    setDestinationThemeByName(journey.destination.name);

    // Sequence timer:
    // Phase 1: Origin focus (0 - 1.8s)
    // Phase 2: Flight arc flight (1.8s - 3.8s)
    // Phase 3: Arrival aura & celebration (3.8s - 5.5s)
    const t1 = setTimeout(() => setPhase(2), 1800);
    const t2 = setTimeout(() => {
      setPhase(3);
      // Trigger subtle celebratory theme confetti particles
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: [destinationTheme.primary, destinationTheme.secondary, destinationTheme.accent],
        });
      } catch {}
    }, 3800);

    const t3 = setTimeout(() => {
      setScreen('dashboard');
    }, 5600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [journey.destination.name, destinationTheme, setDestinationThemeByName, setScreen]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#070A14] text-white p-6 overflow-hidden">
      {/* Top Transition Progress Bar (Matches Reference Image Step 3) */}
      <div className="w-full max-w-4xl mx-auto pt-6 flex flex-col items-center gap-4 z-20">
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-semibold text-gray-300">
          <div className={`flex items-center gap-2 transition-all ${phase >= 1 ? 'text-amber-400 scale-105' : 'opacity-40'}`}>
            <span className="text-xl">{journey.origin.flag}</span>
            <span>{isRtl ? journey.origin.nameAr : journey.origin.name}</span>
          </div>

          <div className="w-16 sm:w-32 h-[2px] bg-gradient-to-r from-amber-400 via-pink-500 to-rose-400 relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-white animate-pulse" />
          </div>

          <div className={`flex items-center gap-2 transition-all ${phase === 3 ? 'text-pink-400 scale-110 font-bold' : 'text-gray-400'}`}>
            <span className="text-xl">{journey.destination.flag}</span>
            <span>{isRtl ? journey.destination.nameAr : journey.destination.name}</span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium backdrop-blur-md">
          {phase === 1 && (
            <>
              <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{isRtl ? `تجهيز المغادرة من ${journey.origin.nameAr}...` : `Preparing departure from ${journey.origin.name}...`}</span>
            </>
          )}
          {phase === 2 && (
            <>
              <Plane className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>{isRtl ? `عبور القارات باتجاه ${journey.destination.nameAr}...` : `Transiting towards ${journey.destination.name}...`}</span>
            </>
          )}
          {phase === 3 && (
            <>
              <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
              <span>{isRtl ? `مرحباً بك في ${journey.destination.nameAr}!` : `Welcome to ${journey.destination.name}!`}</span>
            </>
          )}
        </div>
      </div>

      {/* Main 3D Transition Globe */}
      <div className="relative w-full max-w-4xl h-[450px] sm:h-[550px] flex items-center justify-center z-10">
        {/* Glow bursts */}
        <div
          className="absolute inset-0 rounded-full blur-[140px] transition-all duration-1000 pointer-events-none"
          style={{
            background: phase === 3
              ? `radial-gradient(circle, ${destinationTheme.primary}40 0%, ${destinationTheme.secondary}20 60%, transparent 80%)`
              : 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          }}
        />

        <GlobeCanvas
          originLat={journey.origin.lat}
          originLng={journey.origin.lng}
          destLat={journey.destination.lat}
          destLng={journey.destination.lng}
          showArc={true}
          interactive={false}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Skip / Enter Button */}
      <div className="w-full max-w-md mx-auto pb-8 text-center z-20">
        <button
          onClick={() => setScreen('dashboard')}
          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm text-gray-300 hover:text-white transition flex items-center gap-2 mx-auto"
        >
          <span>{isRtl ? 'الانتقال المباشر للوحة الرحلة' : 'Enter Journey Hub'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
