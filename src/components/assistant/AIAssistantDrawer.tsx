'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney } from '@/lib/state/JourneyContext';
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

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: isRtl
        ? `مرحباً بك! أنا مساعد وصل الذكي، جاهز للإجابة عن أي استفسار يخص رحلتك من ${journey.origin.nameAr} إلى ${journey.destination.nameAr} (${journey.destinationCity}). كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I’m WASL AI Assistant, ready to help with your journey from ${journey.origin.name} to ${journey.destination.name} (${journey.destinationCity}). What would you like to know?`,
      timestamp: 'Now',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        `كيف أطلب تاكسي باللغة المحلية في حالة الطوارئ؟`,
        `ما هي العادات الاجتماعية المهمة التي يجب معرفتها في ${journey.destination.nameAr}؟`,
        `هل تتوفر مطاعم حلال قريبة في ${journey.destinationCity}؟`,
      ]
    : [
        `What are the top shopping spots in ${journey.destinationCity || journey.destination.name}?`,
        `How do I hail an emergency taxi in the local language?`,
        `What key cultural etiquette should I know in ${journey.destination.name}?`,
        `Where can I find halal food in ${journey.destinationCity}?`,
      ];

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
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setErrorMsg(data.error || t.aiUnavailableMsg);
      }
    } catch (err: any) {
      setErrorMsg(t.aiUnavailableMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: 'chat' | 'emergency' | 'nearby') => {
    setMenuOpen(false);
    if (option === 'chat') {
      setAssistantOpen(true);
    } else if (option === 'emergency') {
      setActiveTab('emergency');
    } else if (option === 'nearby') {
      setActiveTab('nearby');
    }
  };

  return (
    <>
      {/* Floating Action Menu Trigger (Requirement 21: 3 accessible options) */}
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 flex flex-col items-end gap-3`}>
        {/* Expanded 3-Option Mini Menu */}
        {menuOpen && (
          <div
            className={`flex flex-col gap-2 p-2 rounded-2xl bg-[#0F1424]/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-pink-500/20 animate-in fade-in slide-in-from-bottom-3 duration-200 mb-1 w-52 sm:w-56 text-xs`}
          >
            {/* 1. AI Assistant */}
            <button
              type="button"
              onClick={() => handleSelectOption('chat')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-pink-500/20 text-gray-200 hover:text-pink-300 transition text-start group"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{isRtl ? 'المساعد الذكي' : 'AI Assistant'}</span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'محادثة وتخطيط فوري' : 'Chat & Smart Companion'}</span>
              </div>
            </button>

            {/* 2. Emergency Mode */}
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

            {/* 3. Near Me Radar */}
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
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`p-4 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 text-white shadow-2xl shadow-pink-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center relative`}
          title={isRtl ? 'المساعد الذكي والطوارئ' : 'WASL Assistant & Quick Tools'}
        >
          {menuOpen ? (
            <X className="w-6 h-6 rotate-90 group-hover:rotate-0 transition-transform" />
          ) : (
            <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          )}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B0F1C]" />
        </button>
      </div>

      {/* Floating Drawer / Sliding Panel */}
      {assistantOpen && (
        <div
          className={`fixed bottom-20 ${
            isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          } z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[80vh] rounded-3xl bg-[#0F1424]/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-pink-500/15 flex flex-col justify-between overflow-hidden text-white`}
        >
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{isRtl ? 'مساعد وصل الذكي' : 'WASL AI Companion'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-[10px] text-gray-400">
                  {journey.origin.flag} {journey.origin.name} → {journey.destination.flag} {journey.destination.name} ({journey.destinationCity})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setAssistantOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
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
                    className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                      isUser
                        ? 'bg-pink-500 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] text-gray-400 block mt-1 text-end">
                      {msg.timestamp}
                    </span>
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

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions Bar */}
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
              placeholder={t.askAnything}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition"
            />
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
