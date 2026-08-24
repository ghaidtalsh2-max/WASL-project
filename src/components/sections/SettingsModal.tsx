'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useJourney } from '@/lib/state/JourneyContext';
import {
  Settings,
  X,
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Type,
  Lock,
  Compass,
  Search,
  Globe,
  Check,
} from 'lucide-react';

interface ServiceTestStatus {
  status: 'idle' | 'testing' | 'connected' | 'error';
  latencyMs?: number;
  message?: string;
}

export default function SettingsModal() {
  const { t, isRtl, fontSize, setFontSize } = useLanguage();
  const { mode, setMode } = useTheme();
  const {
    settingsOpen,
    setSettingsOpen,
    aiProvider,
    setAiProvider,
    customApiKey,
    setCustomApiKey,
    customPlacesKey,
    setCustomPlacesKey,
    customSearchKey,
    setCustomSearchKey,
  } = useJourney();

  // 1. AI State
  const [provider, setProvider] = useState<string>(aiProvider);
  const [aiKey, setAiKey] = useState<string>(customApiKey);
  const [aiStatus, setAiStatus] = useState<ServiceTestStatus>({ status: 'idle' });

  // 2. Google Places State
  const [placesKey, setPlacesKey] = useState<string>(customPlacesKey);
  const [placesStatus, setPlacesStatus] = useState<ServiceTestStatus>({ status: 'idle' });

  // 3. Google Search State
  const [searchKey, setSearchKey] = useState<string>(customSearchKey);
  const [searchCx, setSearchCx] = useState<string>('017576662512468239146:omuauf_lfve');
  const [searchStatus, setSearchStatus] = useState<ServiceTestStatus>({ status: 'idle' });

  if (!settingsOpen) return null;

  // Test AI Connection
  const testAiConnection = async () => {
    setAiStatus({ status: 'testing' });
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'ai', provider, apiKey: aiKey }),
      });
      const data = await res.json();
      if (data.success) {
        setAiStatus({
          status: 'connected',
          latencyMs: data.latencyMs,
          message: `${data.provider} connected successfully`,
        });
      } else {
        setAiStatus({
          status: 'error',
          latencyMs: data.latencyMs,
          message: data.error || 'Connection failed',
        });
      }
    } catch (err: any) {
      setAiStatus({ status: 'error', message: err.message || 'Network error' });
    }
  };

  // Test Google Places Connection
  const testPlacesConnection = async () => {
    setPlacesStatus({ status: 'testing' });
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'places', apiKey: placesKey }),
      });
      const data = await res.json();
      if (data.success) {
        setPlacesStatus({
          status: 'connected',
          latencyMs: data.latencyMs,
          message: data.message || 'Google Places API verified & operational',
        });
      } else {
        setPlacesStatus({
          status: 'error',
          latencyMs: data.latencyMs,
          message: data.error || 'Places verification failed',
        });
      }
    } catch (err: any) {
      setPlacesStatus({ status: 'error', message: err.message || 'Network error' });
    }
  };

  // Test Google Search Connection
  const testSearchConnection = async () => {
    setSearchStatus({ status: 'testing' });
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'search', apiKey: searchKey, searchEngineId: searchCx }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchStatus({
          status: 'connected',
          latencyMs: data.latencyMs,
          message: data.message || 'Google Search API verified & operational',
        });
      } else {
        setSearchStatus({
          status: 'error',
          latencyMs: data.latencyMs,
          message: data.error || 'Search verification failed',
        });
      }
    } catch (err: any) {
      setSearchStatus({ status: 'error', message: err.message || 'Network error' });
    }
  };

  const handleSaveAll = () => {
    setAiProvider(provider);
    setCustomApiKey(aiKey);
    setCustomPlacesKey(placesKey);
    setCustomSearchKey(searchKey);
    setSettingsOpen(false);
  };

  const renderStatusBadge = (st: ServiceTestStatus) => {
    if (st.status === 'testing') {
      return (
        <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1.5 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>{isRtl ? 'جاري الفحص...' : 'Testing...'}</span>
        </span>
      );
    }
    if (st.status === 'connected') {
      return (
        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isRtl ? 'متصل' : 'Connected'} {st.latencyMs ? `(${st.latencyMs}ms)` : ''}
          </span>
        </span>
      );
    }
    if (st.status === 'error') {
      return (
        <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>{isRtl ? 'خطأ بالاتصال' : 'Error'}</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[11px] font-medium flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        <span>{isRtl ? 'غير متصل' : 'Disconnected'}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F1424]/95 border border-white/15 p-6 sm:p-8 shadow-2xl text-white my-auto space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <Settings className="w-5 h-5 text-pink-400" />
            <span>{isRtl ? 'إعدادات المنظومة وواجهات الـ API' : 'WASL System & API Configuration'}</span>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Services Requirement */}
        <div className="space-y-4">
          <div className="text-xs text-gray-400">
            {isRtl
              ? 'تعتمد المنظومة على 3 خدمات سحابية مترابطة. يمكنك ضبط المفاتيح وفحص اتصال كل خدمة بشكل مستقل:'
              : 'WASL connects to 3 unified services. You can configure and verify the live connection of each service independently:'}
          </div>

          {/* 1. AI / LLM Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    1. {isRtl ? 'مساعد الذكاء الاصطناعي ومولد الرحلات' : 'AI Assistant & Journey Generator'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {isRtl
                      ? 'يغذي التخطيط الذكي، الإرشاد الثقافي، والترجمة الفورية'
                      : 'Powers intelligent journey planning, cultural guidance, language coaching, and chat'}
                  </p>
                </div>
              </div>
              {renderStatusBadge(aiStatus)}
            </div>

            {/* Provider Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'anthropic', label: 'Anthropic' },
                { id: 'openrouter', label: 'OpenRouter' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                    provider === p.id
                      ? 'bg-pink-500/25 border-pink-500 text-pink-200'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* API Key Input */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute start-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  placeholder="AI Key (AIzaSy... / sk-...)"
                  className="w-full bg-white/5 border border-white/15 rounded-xl ps-9 pe-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Test Button & Result */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 truncate max-w-[280px]">
                {aiStatus.message || (isRtl ? 'يستخدم المفتاح الافتراضي في الخادم إن لم يُحدد' : 'Uses default server key if empty')}
              </span>
              <button
                type="button"
                onClick={testAiConnection}
                disabled={aiStatus.status === 'testing'}
                className="px-4 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                {aiStatus.status === 'testing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'فحص الاتصال' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {/* 2. Google Places API Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    2. {isRtl ? 'واجهة بيانات الأماكن (Google Places API)' : 'Google Places API (New)'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {isRtl
                      ? 'تغذي مستكشف الأماكن القريبة، التقييمات الحقيقية، والبحث الجغرافي'
                      : 'Powers live discovery, nearby radar, ratings, and location details'}
                  </p>
                </div>
              </div>
              {renderStatusBadge(placesStatus)}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute start-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={placesKey}
                  onChange={(e) => setPlacesKey(e.target.value)}
                  placeholder="Google Places API Key (AIzaSy...)"
                  className="w-full bg-white/5 border border-white/15 rounded-xl ps-9 pe-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 truncate max-w-[280px]">
                {placesStatus.message || (isRtl ? 'يستخدم المفتاح الافتراضي في الخادم إن وجد' : 'Uses server key if empty')}
              </span>
              <button
                type="button"
                onClick={testPlacesConnection}
                disabled={placesStatus.status === 'testing'}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                {placesStatus.status === 'testing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'فحص الاتصال' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {/* 3. Google Search API Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    3. {isRtl ? 'محرك البحث والمعلومات الحية (Google Search)' : 'Google Search & Live Engine'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {isRtl
                      ? 'يغذي البحث الحي، الفعاليات المحدثة، والتوصيات الموسمية الحالية'
                      : 'Powers live search, current events, seasonal info, and real-time facts'}
                  </p>
                </div>
              </div>
              {renderStatusBadge(searchStatus)}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute start-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder={isRtl ? 'مفتاح البحث (أو اتركه فارغاً للاعتماد التلقائي على مفتاح Google)' : 'Search API Key (or leave blank to auto-use Google key)'}
                  className="w-full bg-white/5 border border-white/15 rounded-xl ps-9 pe-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 truncate max-w-[280px]">
                {searchStatus.message || (isRtl ? 'محرك بحث مخصص للمعلومات الحية' : 'Verified Google Custom Search connection')}
              </span>
              <button
                type="button"
                onClick={testSearchConnection}
                disabled={searchStatus.status === 'testing'}
                className="px-4 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                {searchStatus.status === 'testing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'فحص الاتصال' : 'Test Connection'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance & Accessibility */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{t.themeMode}</span>
            </span>
            <div className="flex gap-1.5">
              {(['dark', 'light', 'system'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 text-xs rounded-lg border capitalize transition ${
                    mode === m
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-pink-400" />
              <span>{t.fontSize}</span>
            </span>
            <div className="flex gap-1.5">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-3 py-1 text-xs rounded-lg border uppercase transition ${
                    fontSize === s
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {s === 'sm' ? 'A-' : s === 'md' ? 'A' : 'A+'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
          <button
            onClick={() => setSettingsOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-semibold transition"
          >
            {t.backBtn}
          </button>
          <button
            onClick={handleSaveAll}
            className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isRtl ? 'حفظ كافة الإعدادات' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

