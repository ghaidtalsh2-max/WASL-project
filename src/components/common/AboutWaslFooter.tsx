'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Sparkles, Globe, Compass, Heart, ExternalLink } from 'lucide-react';

function LinkedInIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.65 1.65 0 0 0-1.66-1.66Z" />
    </svg>
  );
}

export default function AboutWaslFooter() {
  const { language, isRtl } = useLanguage();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#080B16]/90 backdrop-blur-xl text-gray-400 py-12 px-4 sm:px-8 mt-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header & Philosophy */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'عن المنظومة والرؤية' : 'About the Platform'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRtl ? 'وَصل — لأن كل رحلة تبدأ باتصال.' : 'WASL — Because Every Journey Begins with Connection.'}
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {isRtl
              ? 'وَصل هو رفيق السفر والاستقرار الذكي المدعوم بالذكاء الاصطناعي، يربط المسافرين والمبتعثين بالمعلومات الحقيقية، الأماكن، الخدمات الحكومية، والسياق الثقافي الذي يحتاجونه طوال مسار رحلتهم — من التخطيط وحتى الوصول والعيش اليومي.'
              : 'WASL is an AI-powered travel and relocation companion that connects people with the information, places, services and cultural context they need throughout their journey — from planning to arrival and daily life.'}
          </p>
        </div>

        {/* 3 Core Pillars & Brand Name Meaning */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-pink-500/30 transition">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isRtl ? 'ربط الإنسان بالوجهة' : 'Connecting People with Destinations'}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {isRtl
                ? 'فهم عميق لكل وجهة عالمية دون قوالب مسبقة، مع مراعاة خصوصية وهوية كل مسافر.'
                : 'A deep, individualized understanding of global destinations without generic assumptions.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-pink-500/30 transition">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isRtl ? 'ربط المعلومة بالإجراء' : 'Connecting Information with Action'}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {isRtl
                ? 'تحويل الإرشادات إلى خطوات إجرائية مباشرة وروابط حقيقية للبوابات الرسمية والتأشيرات.'
                : 'Translating knowledge into direct actionable checklist tasks and official portal links.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-pink-500/30 transition">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isRtl ? 'ربط المسافر بالثقافة والخدمات' : 'Connecting with Culture & Services'}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {isRtl
                ? 'إتيكيت السلوك، اللغة المنطوقة، الأمان الرقمي، خيارات الحلال، وخدمات الطوارئ 24/7.'
                : 'Living cultural nuance, native audio phrases, digital safety, and 24/7 emergency care.'}
            </p>
          </div>
        </div>

        {/* Visual Identity Explanations */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900/40 via-purple-950/20 to-pink-950/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-300">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">
              {isRtl ? 'الهوية البصرية واللغة الكونية' : 'Visual Identity & Cosmic Design'}
            </span>
            <p className="leading-relaxed">
              {isRtl ? (
                <>
                  <strong className="text-white">الكحلي العميق:</strong> يمثل الفضاء والعمق والتقنية الموثوقة.{' '}
                  <strong className="text-pink-300">الوردي والبنفسجي:</strong> يمثلان الاتصال الإنساني والدفء والتنوع الثقافي.{' '}
                  <strong className="text-white">المسارات المضيئة والكرة الأرضية:</strong> تعبر عن عالم متصل ورحلة الإنسان بين الأماكن.
                </>
              ) : (
                <>
                  <strong className="text-white">Deep Navy:</strong> Represents space, depth, trust, and advanced technology.{' '}
                  <strong className="text-pink-300">Rose Pink & Mauve:</strong> Symbolizes human connection, warmth, and cultural diversity.{' '}
                  <strong className="text-white">Cosmic Routes & 3D Globe:</strong> Represents a seamlessly connected world and human journeys across continents.
                </>
              )}
            </p>
          </div>

          {/* TEAM CREDITS (Section 27) */}
          <div className="shrink-0 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-center sm:text-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
              {isRtl ? 'فريق العمل والتطوير' : 'Created By'}
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <a
                href="https://www.linkedin.com/in/ghaidaa-alshareef"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-200 text-xs font-semibold transition group"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-pink-400 group-hover:text-white" />
                <span>Ghaidaa Alshareef</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-pink-300" />
              </a>

              <a
                href="https://www.linkedin.com/in/taleen-alqahtani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-200 text-xs font-semibold transition group"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-purple-400 group-hover:text-white" />
                <span>Taleen Alqahtani</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/5">
          <p>© {new Date().getFullYear()} WASL (وصل). {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>

      </div>
    </footer>
  );
}
