'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryInfo, COUNTRIES } from '../data/countries';
import {
  JourneyStage,
  CultureGuidance,
  LocalLanguageData,
  ReligionContextData,
  generateDefaultStages,
  getDefaultCulture,
  getDefaultPhrases,
  getDefaultReligion,
} from '../data/defaultJourneys';

export type JourneyScreen = 'landing' | 'setup' | 'transition' | 'dashboard';
export type NavTab = 'journey' | 'discover' | 'culture' | 'language' | 'translate' | 'religion' | 'safety' | 'assistant';
export type JourneyPurpose = 'study' | 'work' | 'travel' | 'relocation' | 'visit' | 'business' | 'other';
export type JourneyDuration = 'days' | 'weeks' | 'months' | 'yearPlus';

export interface JourneyDetails {
  origin: CountryInfo;
  destination: CountryInfo;
  destinationCity: string;
  accommodationArea?: string;
  accommodationStatus?: 'booked' | 'not_booked' | 'unknown';
  dates?: string;
  travelStyle?: string;
  interests?: string[];
  preferences?: string;
  purpose: JourneyPurpose;
  duration: JourneyDuration;
  persona: string;
  additionalNeeds: string;
}

interface JourneyContextType {
  screen: JourneyScreen;
  setScreen: (screen: JourneyScreen) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  journey: JourneyDetails;
  updateJourney: (partial: Partial<JourneyDetails>) => void;
  stages: JourneyStage[];
  setStages: React.Dispatch<React.SetStateAction<JourneyStage[]>>;
  activeStageIndex: number;
  setActiveStageIndex: (idx: number) => void;
  toggleTaskCompletion: (stageId: string, taskId: string) => void;
  culture: CultureGuidance;
  setCulture: React.Dispatch<React.SetStateAction<CultureGuidance>>;
  languageData: LocalLanguageData;
  setLanguageData: React.Dispatch<React.SetStateAction<LocalLanguageData>>;
  religion: ReligionContextData;
  setReligion: React.Dispatch<React.SetStateAction<ReligionContextData>>;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  toggleAssistant: () => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  aiProvider: string;
  setAiProvider: (p: string) => void;
  customApiKey: string;
  setCustomApiKey: (k: string) => void;
  startNewJourney: () => void;
  commitJourney: (details: JourneyDetails) => Promise<void>;
  refreshCultureAI: () => Promise<void>;
  refreshLanguageAI: () => Promise<void>;
  refreshReligionAI: () => Promise<void>;
  refreshStagesAI: () => Promise<void>;
  isLoadingJourneyData: boolean;
  isAiRefreshing: boolean;
}

const defaultOrigin = COUNTRIES.find((c) => c.id === 'saudi-arabia') || COUNTRIES[0];
const defaultDestination = COUNTRIES.find((c) => c.id === 'japan') || COUNTRIES[1];

const initialJourney: JourneyDetails = {
  origin: defaultOrigin,
  destination: defaultDestination,
  destinationCity: 'Tokyo',
  accommodationArea: '',
  purpose: 'study',
  duration: 'yearPlus',
  persona: 'Student',
  additionalNeeds: '',
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<JourneyScreen>('landing');
  const [activeTab, setActiveTab] = useState<NavTab>('journey');
  const [journey, setJourney] = useState<JourneyDetails>(initialJourney);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [aiProvider, setAiProviderState] = useState<string>('gemini');
  const [customApiKey, setCustomApiKeyState] = useState<string>('');
  const [isLoadingJourneyData, setIsLoadingJourneyData] = useState<boolean>(false);
  const [isAiRefreshing, setIsAiRefreshing] = useState<boolean>(false);

  const [stages, setStages] = useState<JourneyStage[]>(() =>
    generateDefaultStages(
      initialJourney.origin.name,
      initialJourney.destination.name,
      initialJourney.purpose,
      initialJourney.destinationCity
    )
  );
  const [culture, setCulture] = useState<CultureGuidance>(() =>
    getDefaultCulture(initialJourney.destination.name, initialJourney.destinationCity)
  );
  const [languageData, setLanguageData] = useState<LocalLanguageData>(() =>
    getDefaultPhrases(initialJourney.destination.name, initialJourney.destinationCity)
  );
  const [religion, setReligion] = useState<ReligionContextData>(() =>
    getDefaultReligion(initialJourney.destination.name, initialJourney.destinationCity)
  );

  useEffect(() => {
    const savedProvider = localStorage.getItem('wasl_ai_provider');
    if (savedProvider) setAiProviderState(savedProvider);
    const savedKey = localStorage.getItem('wasl_custom_api_key');
    if (savedKey) setCustomApiKeyState(savedKey);
  }, []);

  const setAiProvider = (p: string) => {
    setAiProviderState(p);
    localStorage.setItem('wasl_ai_provider', p);
  };

  const setCustomApiKey = (k: string) => {
    setCustomApiKeyState(k);
    localStorage.setItem('wasl_custom_api_key', k);
  };

  const updateJourney = (partial: Partial<JourneyDetails>) => {
    setJourney((prev) => ({ ...prev, ...partial }));
  };

  const toggleAssistant = () => setAssistantOpen((prev) => !prev);

  const toggleTaskCompletion = (stageId: string, taskId: string) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          thingsToCheck: stage.thingsToCheck.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, completed: !task.completed };
          }),
        };
      })
    );
  };

  const startNewJourney = () => {
    setScreen('setup');
  };

  const getPayload = (details = journey) => ({
    origin: details.origin.name,
    destination: details.destination.name,
    destinationCity: details.destinationCity || details.destination.capital,
    accommodationArea: details.accommodationArea,
    purpose: details.purpose,
    duration: details.duration,
    persona: details.persona,
    additionalNeeds: details.additionalNeeds,
    apiKey: customApiKey || undefined,
    provider: aiProvider,
  });

  const refreshCultureAI = async () => {
    setIsAiRefreshing(true);
    try {
      const res = await fetch('/api/culture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload()),
      });
      const data = await res.json();
      if (data.success && data.culture) {
        setCulture(data.culture);
      }
    } catch (e) {
      console.warn('Culture AI refresh failed:', e);
    } finally {
      setIsAiRefreshing(false);
    }
  };

  const refreshLanguageAI = async () => {
    setIsAiRefreshing(true);
    try {
      const res = await fetch('/api/local-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload()),
      });
      const data = await res.json();
      if (data.success && data.languageData) {
        setLanguageData(data.languageData);
      }
    } catch (e) {
      console.warn('Language AI refresh failed:', e);
    } finally {
      setIsAiRefreshing(false);
    }
  };

  const refreshReligionAI = async () => {
    setIsAiRefreshing(true);
    try {
      const res = await fetch('/api/religion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload()),
      });
      const data = await res.json();
      if (data.success && data.religion) {
        setReligion(data.religion);
      }
    } catch (e) {
      console.warn('Religion AI refresh failed:', e);
    } finally {
      setIsAiRefreshing(false);
    }
  };

  const refreshStagesAI = async () => {
    setIsAiRefreshing(true);
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload()),
      });
      const data = await res.json();
      if (data.success && data.stages) {
        setStages(data.stages);
      }
    } catch (e) {
      console.warn('Stages AI refresh failed:', e);
    } finally {
      setIsAiRefreshing(false);
    }
  };

  const commitJourney = async (details: JourneyDetails) => {
    setJourney(details);
    setActiveStageIndex(0);
    setScreen('transition');

    const destName = details.destination.name;
    const cityName = details.destinationCity || details.destination.capital;

    // Set immediate defaults for instant rendering
    setStages(generateDefaultStages(details.origin.name, destName, details.purpose, cityName));
    setCulture(getDefaultCulture(destName, cityName));
    setLanguageData(getDefaultPhrases(destName, cityName));
    setReligion(getDefaultReligion(destName, cityName));

    // Staggered parallel AI calls with our multi-model cascade
    setIsLoadingJourneyData(true);
    try {
      const payload = getPayload(details);

      // Trigger AI calls
      fetch('/api/culture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.culture) setCulture(data.culture);
        })
        .catch(console.warn);

      fetch('/api/local-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.languageData) setLanguageData(data.languageData);
        })
        .catch(console.warn);

      fetch('/api/religion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.religion) setReligion(data.religion);
        })
        .catch(console.warn);

      fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.stages) setStages(data.stages);
        })
        .catch(console.warn);
    } catch (err) {
      console.warn('Dynamic AI refresh background error:', err);
    } finally {
      setIsLoadingJourneyData(false);
    }
  };

  return (
    <JourneyContext.Provider
      value={{
        screen,
        setScreen,
        activeTab,
        setActiveTab,
        journey,
        updateJourney,
        stages,
        setStages,
        activeStageIndex,
        setActiveStageIndex,
        toggleTaskCompletion,
        culture,
        setCulture,
        languageData,
        setLanguageData,
        religion,
        setReligion,
        assistantOpen,
        setAssistantOpen,
        toggleAssistant,
        settingsOpen,
        setSettingsOpen,
        aiProvider,
        setAiProvider,
        customApiKey,
        setCustomApiKey,
        startNewJourney,
        commitJourney,
        refreshCultureAI,
        refreshLanguageAI,
        refreshReligionAI,
        refreshStagesAI,
        isLoadingJourneyData,
        isAiRefreshing,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
