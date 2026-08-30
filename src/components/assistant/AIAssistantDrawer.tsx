'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
import { useSpeechToText } from '@/lib/hooks/useSpeechToText';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  RefreshCw,
  User,
  HelpCircle,
  Minimize2,
  ShieldAlert,
  Navigation,
  PhoneCall,
  MapPin,
  ChevronUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AIAssistantDrawer() {
  const { t, isRtl } = useLanguage();
  const {
    assistantOpen,
    setAssistantOpen,
    toggleAssistant,
    journey,
    setActiveTab,
  } = useJourney();

  const getInitialGreeting = () => ({
    id: 'm1',
    sender: 'assistant' as const,
    text: isRtl
      ? `مرحباً بك! أنا مساعد وصل الذكي، جاهز للإجابة عن أي استفسار يخص رحلتك من ${journey.origin.nameAr || journey.origin.name} إلى ${journey.destination.nameAr || journey.destination.name} (${journey.destinationCity || journey.destination.capital}). كيف يمكنني مساعدتك اليوم؟`
      : `Hello! I’m WASL AI Companion, ready to assist with your trip from ${journey.origin.name} to ${journey.destination.name} (${journey.destinationCity || journey.destination.capital}). How can I help you today?`,
    timestamp: 'Now',
  });

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialGreeting()]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync greeting when language changes if only the initial greeting is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'm1') {
        return [getInitialGreeting()];
      }
      return prev;
    });
  }, [isRtl, journey.destination.name, journey.destinationCity]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (assistantOpen) {
      scrollToBottom();
    }
  }, [messages, assistantOpen]);

  const suggestedQuestions = isRtl
    ? [
        `ما هي أفضل الأماكن للتسوق في ${journey.destinationCity || journey.destination.nameAr}؟`,
        `أقترح لي مطاعم عربية وحلال مميزة في ${journey.destinationCity || journey.destination.nameAr}`,
        `ما هي أفضل الفنادق ومناطق السكن في ${journey.destinationCity || journey.destination.nameAr}؟`,
        `عطني اقتراح جدول مميز لليوم في ${journey.destinationCity || journey.destination.nameAr}`,
      ]
    : [
        `What are the top shopping spots in ${journey.destinationCity || journey.destination.name}?`,
        `Suggest top authentic Arabic & Halal dining in ${journey.destinationCity || journey.destination.name}`,
        `What are the best hotels and areas to stay in ${journey.destinationCity || journey.destination.name}?`,
        `Give me a curated daily highlights itinerary for ${journey.destinationCity || journey.destination.name}`,
      ];

  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);

  // Requirement 4: Global Custom Hook for Speech Recognition & Text-to-Speech
  const {
    isListening,
    toggleListening: toggleSpeechHook,
    speakText,
    stopSpeaking,
    isSpeaking,
    speakingMessageId,
    permissionError,
    setPermissionError,
  } = useSpeechToText({
    lang: isRtl ? 'ar-SA' : 'en-US',
  });

  const toggleSpeechRecognition = () => {
    toggleSpeechHook(isRtl ? 'ar-SA' : 'en-US', (text) => {
      if (text) {
        setInputMessage((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${text}` : text;
        });
      }
    });
  };

  // Requirement 8: Clean message formatting (strip raw markdown artifacts)
  const formatMessageText = (text: string) => {
    return text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/---/g, '')
      .trim();
  };

  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          journeyContext: journey,
          locale: isRtl ? 'ar' : 'en',
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantId = `msg-ai-${Date.now()}`;
        const assistantMsg: ChatMessage = {
          id: assistantId,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // If auto-speak enabled, speak reply automatically
        if (autoSpeak) {
          speakText(data.reply, isRtl ? 'ar-SA' : 'en-US', assistantId);
        }
      } else {
        setErrorMsg(data.error || t.aiUnavailableMsg);
      }
    } catch (err: any) {
      setErrorMsg(t.aiUnavailableMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: 'chat' | 'voice' | 'emergency' | 'nearby') => {
    setMenuOpen(false);
    if (option === 'chat') {
      setAssistantOpen(true);
    } else if (option === 'voice') {
      setAssistantOpen(true);
      setTimeout(() => {
        toggleSpeechRecognition();
      }, 300);
    } else if (option === 'emergency') {
      setActiveTab('emergency');
    } else if (option === 'nearby') {
      setActiveTab('nearby');
    }
  };

  return (
    <>
      {/* Floating Action Menu Trigger (Requirement 21: accessible options) */}
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 flex flex-col items-end gap-3`}>
        {/* Expanded Mini Menu */}
        {menuOpen && (
          <div
            className={`flex flex-col gap-2 p-2 rounded-2xl bg-[#0F1424]/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-pink-500/20 animate-in fade-in slide-in-from-bottom-3 duration-200 mb-1 w-56 sm:w-60 text-xs`}
          >
            {/* 1. Voice AI Assistant */}
            <button
              type="button"
              onClick={() => handleSelectOption('voice')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-pink-500/20 text-gray-200 hover:text-pink-300 transition text-start group"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>{isRtl ? 'المساعد الصوتي' : 'Voice Assistant'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'تحدث واستمع فوراً' : 'Talk & Listen Live'}</span>
              </div>
            </button>

            {/* 2. Text AI Chat */}
            <button
              type="button"
              onClick={() => handleSelectOption('chat')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-purple-500/20 text-gray-200 hover:text-purple-300 transition text-start group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{isRtl ? 'محادثة المساعد الذكي' : 'AI Text Chat'}</span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'تخطيط واستفسارات الرحلة' : 'Trip Context & Plan'}</span>
              </div>
            </button>

            {/* 3. Emergency Mode */}
            <button
              type="button"
              onClick={() => handleSelectOption('emergency')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/20 text-gray-200 hover:text-rose-300 transition text-start group"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{isRtl ? 'مركز الطوارئ' : 'Emergency Hub'}</span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'الشرطة، الإسعاف، السفارة' : 'Police, Embassy, Audio'}</span>
              </div>
            </button>

            {/* 4. Near Me Radar */}
            <button
              type="button"
              onClick={() => handleSelectOption('nearby')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-cyan-500/20 text-gray-200 hover:text-cyan-300 transition text-start group"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{isRtl ? 'الأماكن القريبة' : 'Near Me Radar'}</span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'بناءً على موقعك الجغرافي' : 'GPS Location & Places'}</span>
              </div>
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/30 hover:scale-105 transition-all flex items-center justify-center border border-pink-400/30"
          aria-label="Assistant & Quick Actions"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </button>
      </div>

      {assistantOpen && (
        <div
          className={`fixed bottom-20 ${
            isRtl ? 'left-6' : 'right-6'
          } z-50 w-[92vw] sm:w-[420px] h-[580px] bg-[#121728]/95 backdrop-blur-xl border border-pink-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{isRtl ? 'مساعد وصل الصوتي والذكي' : 'WASL Voice AI Companion'}</span>
                </h3>
                <span className="text-[10px] text-gray-400 block">
                  {journey.destinationCity || journey.destination.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Auto Speak Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak) {
                    stopSpeaking();
                    setAutoSpeak(false);
                  } else {
                    setAutoSpeak(true);
                  }
                }}
                className={`p-1.5 rounded-xl transition ${
                  autoSpeak
                    ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40'
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title={autoSpeak ? 'Auto Voice Readout: ON' : 'Auto Voice Readout: OFF'}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  setMessages([
                    {
                      id: 'm1',
                      sender: 'assistant',
                      text: isRtl
                        ? `مرحباً بك! أنا مساعد وصل الذكي، جاهز للإجابة عن أي استفسار يخص رحلتك من ${journey.origin.nameAr} إلى ${journey.destination.nameAr} (${journey.destinationCity}). كيف يمكنني مساعدتك اليوم؟`
                        : `Hello! I’m WASL AI Assistant, ready to help with your journey from ${journey.origin.name} to ${journey.destination.name} (${journey.destinationCity}). What would you like to know?`,
                      timestamp: 'Now',
                    },
                  ]);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
                title="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setAssistantOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isThisMsgSpeaking = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/10 text-pink-400 border border-pink-500/30'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed space-y-2 ${
                      isUser
                        ? 'bg-pink-500 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{formatMessageText(msg.text)}</p>
                    
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px]">
                      <span className="text-gray-400">
                        {msg.timestamp}
                      </span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isThisMsgSpeaking) {
                              stopSpeaking();
                            } else {
                              speakText(msg.text, isRtl ? 'ar-SA' : 'en-US', msg.id);
                            }
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition ${
                            isThisMsgSpeaking
                              ? 'bg-pink-500 text-white animate-pulse'
                              : 'bg-white/5 hover:bg-white/10 text-pink-300'
                          }`}
                          title="استمع للرد الصوتي"
                        >
                          {isThisMsgSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{isThisMsgSpeaking ? (isRtl ? 'إيقاف' : 'Stop') : (isRtl ? 'استماع' : 'Listen')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-pink-400 p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.thinking}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}
            {permissionError && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                <p className="font-semibold">⚠️ {permissionError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setPermissionError(null);
                    toggleSpeechRecognition();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-gray-950 font-bold text-[10px] hover:bg-amber-400 transition"
                >
                  {isRtl ? 'إعادة المحاولة' : 'Try Again'}
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Live Voice Recording Wave Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-500/15 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold">{isRtl ? 'جاري الاستماع لصوتك... تحدث الآن' : 'Listening... Speak now'}</span>
              </div>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold"
              >
                {isRtl ? 'إنهاء التحدث' : 'Done'}
              </button>
            </div>
          )}

          {/* Quick Suggested Questions */}
          {messages.length < 4 && (
            <div className="p-2.5 bg-white/5 border-t border-white/10 overflow-x-auto scrollbar-none flex gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-[11px] text-gray-300 border border-white/10 whitespace-nowrap transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-[#0B0F1C] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? (isRtl ? 'جاري تحويل صوتك لنص...' : 'Transcribing voice...') : t.askAnything}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
              className={`p-2.5 rounded-2xl transition border ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse border-rose-400 scale-105 shadow-lg shadow-rose-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-pink-400" />}
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white shadow-md transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
