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
  Globe,
  Sun,
  Moon,
  Type,
  Lock,
} from 'lucide-react';

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
  } = useJourney();

  const [provider, setProvider] = useState<string>(aiProvider);
  const [apiKey, setApiKey] = useState<string>(customApiKey);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!settingsOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: `${t.connectionSuccess} (${data.provider})`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || t.connectionFailed,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || t.connectionFailed,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setAiProvider(provider);
    setCustomApiKey(apiKey);
    setSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0F1424]/95 border border-white/15 p-6 sm:p-8 shadow-2xl text-white my-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <Settings className="w-5 h-5 text-pink-400" />
            <span>{t.settingsTitle}</span>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Configuration Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
            <KeyRound className="w-4 h-4" />
            <span>{t.aiProviderConfig}</span>
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">{t.providerLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'anthropic', label: 'Anthropic' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                    provider === p.id
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom API Key */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">{t.apiKeyLabel}</label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... / sk-..."
                className="w-full bg-white/5 border border-white/15 rounded-xl ps-9 pe-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500 transition"
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              {isRtl
                ? 'إذا كان الخادم يحتوي بالفعل على LLM_API_KEY، فلن تحتاج لإدخاله هنا.'
                : 'If server already has LLM_API_KEY configured in environment, you can leave this blank.'}
            </p>
          </div>

          {/* Test Connection Button */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-gray-200 transition flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
                  <span>{t.testingConnection}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t.testConnectionBtn}</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                  testResult.success
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span className="truncate">{testResult.message}</span>
              </div>
            )}
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
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-500/25 transition"
          >
            {t.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
}
