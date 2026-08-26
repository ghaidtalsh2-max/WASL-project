'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseSpeechToTextOptions {
  lang?: string;
  continuous?: boolean;
  onTranscript?: (transcript: string) => void;
}

export function useSpeechToText(options?: UseSpeechToTextOptions) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  // Stop listening safely
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignored if already stopped
      }
    }
    setIsListening(false);
  }, []);

  // Start listening with proactive mic permission check
  const startListening = useCallback(
    async (lang?: string, onResultCallback?: (text: string) => void) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setPermissionError('متصفحك لا يدعم التعرف الصوتي. يرجى تجربة متصفح Safari أو Google Chrome.');
        return;
      }

      setPermissionError(null);
      if (onResultCallback) {
        onResultCallbackRef.current = onResultCallback;
      }

      // 1. Cancel any active speech synthesis output to prevent audio engine lock
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        } catch (e) {}
      }

      // 2. Request mic permission explicitly if available
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (micErr: any) {
        console.warn('Microphone permission request rejected:', micErr);
        setPermissionError('يرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح للبدء بالتحدث.');
        setIsListening(false);
        return;
      }

      // 3. Stop any existing recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      try {
        const recognition = new SpeechRecognition();
        const targetLang = lang || options?.lang || 'ar-SA';
        recognition.lang = targetLang;
        recognition.continuous = options?.continuous ?? false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          isListeningRef.current = true;
          setIsListening(true);
          setPermissionError(null);
        };

        recognition.onresult = (event: any) => {
          let fullText = '';
          let interimText = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              fullText += result[0].transcript;
            } else {
              interimText += result[0].transcript;
            }
          }

          const currentText = fullText || interimText;
          if (currentText && currentText.trim()) {
            setTranscript(currentText);
            if (onResultCallbackRef.current) {
              onResultCallbackRef.current(currentText);
            } else if (options?.onTranscript) {
              options.onTranscript(currentText);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition Event Error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setPermissionError('تم رفض إذن الميكروفون. الرجاء السماح بالوصول للميكروفون من إعدادات المتصفح.');
          } else if (event.error === 'no-speech') {
            // benign - no voice detected in timeframe
          } else if (event.error === 'audio-capture') {
            setPermissionError('تعذر التقاط الصوت. تأكد من توصيل الميكروفون بشكل صحيح.');
          }
          isListeningRef.current = false;
          setIsListening(false);
        };

        recognition.onend = () => {
          isListeningRef.current = false;
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to initialize speech recognition:', err);
        setPermissionError('تعذر تفعيل الميكروفون. يرجى التأكد من صلاحيات الصوت بالمتصفح.');
        isListeningRef.current = false;
        setIsListening(false);
      }
    },
    [options]
  );

  // Toggle listening
  const toggleListening = useCallback(
    (lang?: string, onResultCallback?: (text: string) => void) => {
      if (isListeningRef.current) {
        stopListening();
      } else {
        startListening(lang, onResultCallback);
      }
    },
    [startListening, stopListening]
  );

  // Text-To-Speech (TTS Engine)
  const speakText = useCallback((text: string, lang: string = 'ar-SA', messageId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Strip markdown symbols for natural clean audio output
      const cleanText = text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/---/g, '')
        .replace(/[•-]\s+/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const isArabic = lang.startsWith('ar');
      const preferredVoice = voices.find((v) =>
        isArabic ? v.lang.startsWith('ar') : v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    permissionError,
    setPermissionError,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
    isSpeaking,
    speakingMessageId,
  };
}
