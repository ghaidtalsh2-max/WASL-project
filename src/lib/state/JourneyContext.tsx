'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryInfo, COUNTRIES } from '../data/countries';
import {
  JourneyStage,
  CultureGuidance,
  LocalLanguageData,
  ReligionContextData,
  TourismItineraryOption,
  EmergencyContactInfo,
  AccommodationRecommendation,
  MedicalGuidance,
  generateDefaultStages,
  getDefaultCulture,
  getDefaultPhrases,
  getDefaultReligion,
  getDefaultTourismOptions,
  getDefaultAccommodation,
  getDefaultMedicalGuidance,
  getEmergencyData,
} from '../data/defaultJourneys';

export type JourneyScreen = 'landing' | 'intro' | 'setup' | 'transition' | 'dashboard';
export type NavTab =
  | 'journey'
  | 'discover'
  | 'nearby'
  | 'culture'
  | 'language'
  | 'translate'
  | 'religion'
  | 'safety'
  | 'emergency'
  | 'assistant';

export type JourneyPurpose = 'tourism' | 'study' | 'work' | 'relocation' | 'medical' | 'recovery' | 'visit' | 'business' | 'other';
export type JourneyDuration = 'days' | 'weeks' | 'months' | 'yearPlus';
export type TravelParty = 'solo' | 'couple' | 'family' | 'friends' | 'group';
export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export interface JourneyDetails {
  origin: CountryInfo;
  destination: CountryInfo;
  destinationCity: string;
  travelParty: TravelParty;
  budget: BudgetLevel;
  accommodationArea?: string;
  accommodationStatus?: 'booked' | 'not_booked' | 'unknown';
  accommodationRecommendations?: any[];
  medicalGuidance?: any;
  medicalDetails?: {
    specialty?: string;
    patientAge?: number | string;
    purpose?: string;
    medicalSubCategory?: 'RECOVERY_WELLNESS' | 'SURGERY_SPECIALIZED' | string;
    companionCount?: number;
  };
  durationText?: string;
  dates?: string;
  travelStyle?: string;
  interests?: string[];
  preferences?: string;
  purpose: JourneyPurpose;
  duration: JourneyDuration;
  persona: string;
  additionalNeeds: string;
  tourismOptions?: TourismItineraryOption[];
  selectedTourismOptionId?: string;
  activePlan?: any;
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
  readinessPercentage: number;
  tourismOptions: TourismItineraryOption[];
  selectedTourismOptionId: string;
  setSelectedTourismOptionId: (id: string) => void;
  emergencyData: EmergencyContactInfo;
  setEmergencyData: React.Dispatch<React.SetStateAction<EmergencyContactInfo>>;
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
  customPlacesKey: string;
  setCustomPlacesKey: (k: string) => void;
  customSearchKey: string;
  setCustomSearchKey: (k: string) => void;
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
  travelParty: 'solo',
  budget: 'moderate',
  accommodationArea: '',
  purpose: 'tourism',
  duration: 'weeks',
  persona: 'Traveler',
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
  
  // API Keys state
  const [aiProvider, setAiProviderState] = useState<string>('gemini');
  const [customApiKey, setCustomApiKeyState] = useState<string>('');
  const [customPlacesKey, setCustomPlacesKeyState] = useState<string>('');
  const [customSearchKey, setCustomSearchKeyState] = useState<string>('');

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

  const [tourismOptions, setTourismOptions] = useState<TourismItineraryOption[]>(() =>
    getDefaultTourismOptions(
      initialJourney.destination.name,
      initialJourney.destinationCity,
      initialJourney.duration,
      initialJourney.interests,
      initialJourney.travelParty
    )
  );

  const [selectedTourismOptionId, setSelectedTourismOptionId] = useState<string>(() =>
    tourismOptions[0]?.id || 'option-a'
  );

  const [emergencyData, setEmergencyData] = useState<EmergencyContactInfo>(() =>
    getEmergencyData(
      initialJourney.destination.name,
      initialJourney.origin.name
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
    const savedPlaces = localStorage.getItem('wasl_places_key');
    if (savedPlaces) setCustomPlacesKeyState(savedPlaces);
    const savedSearch = localStorage.getItem('wasl_search_key');
    if (savedSearch) setCustomSearchKeyState(savedSearch);
  }, []);

  const setAiProvider = (p: string) => {
    setAiProviderState(p);
    localStorage.setItem('wasl_ai_provider', p);
  };

  const setCustomApiKey = (k: string) => {
    setCustomApiKeyState(k);
    localStorage.setItem('wasl_custom_api_key', k);
  };

  const setCustomPlacesKey = (k: string) => {
    setCustomPlacesKeyState(k);
    localStorage.setItem('wasl_places_key', k);
  };

  const setCustomSearchKey = (k: string) => {
    setCustomSearchKeyState(k);
    localStorage.setItem('wasl_search_key', k);
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

  // Calculate overall readiness percentage
  const allTasks = stages.flatMap((s) => s.thingsToCheck);
  const completedTasks = allTasks.filter((t) => t.completed);
  const readinessPercentage =
    allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  const startNewJourney = () => {
    setScreen('setup');
  };

  const getPayload = (details = journey) => ({
    origin: details.origin.name,
    originCountry: details.origin,
    destination: details.destination.name,
    destinationCountry: details.destination,
    destinationCity: details.destinationCity || details.destination.capital,
    accommodationArea: details.accommodationArea,
    travelParty: details.travelParty,
    budget: details.budget,
    purpose: details.purpose,
    duration: details.duration,
    persona: details.persona,
    additionalNeeds: details.additionalNeeds,
    interests: details.interests,
    apiKey: customApiKey || undefined,
    placesKey: customPlacesKey || undefined,
    searchKey: customSearchKey || undefined,
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
    const destName = details.destination.name;
    const originName = details.origin.name;
    const cityName = details.destinationCity || details.destination.capital;

    // Attach accommodation recommendations if not already booked
    if (details.accommodationStatus !== 'booked' && !details.accommodationRecommendations) {
      details.accommodationRecommendations = getDefaultAccommodation(
        destName,
        cityName,
        details.durationText || details.duration,
        details.purpose,
        details.budget,
        details.travelParty
      );
    }

    // Attach medical guidance if purpose is medical/recovery
    if ((details.purpose === 'medical' || details.purpose === 'recovery') && !details.medicalGuidance) {
      details.medicalGuidance = getDefaultMedicalGuidance(
        destName,
        cityName,
        details.medicalDetails?.specialty || 'General Medicine & Recovery',
        details.medicalDetails?.purpose || 'Consultation & Treatment',
        details.medicalDetails?.patientAge
      );
    }

    setJourney(details);
    setActiveStageIndex(0);
    setScreen('transition');

    // Instant local default rendering
    const defaultStgs = generateDefaultStages(originName, destName, details.purpose, cityName);
    const defaultOpts = getDefaultTourismOptions(
      destName,
      cityName,
      details.durationText || details.duration,
      details.interests,
      details.travelParty
    );
    const defaultEmerg = getEmergencyData(destName, originName);

    setStages(defaultStgs);
    setTourismOptions(defaultOpts);
    setSelectedTourismOptionId(defaultOpts[0]?.id || 'plan-a-balanced');
    setEmergencyData(defaultEmerg);
    setCulture(getDefaultCulture(destName, cityName));
    setLanguageData(getDefaultPhrases(destName, cityName));
    setReligion(getDefaultReligion(destName, cityName));

    // Async AI enhancements
    setIsLoadingJourneyData(true);
    try {
      const payload = getPayload(details);

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
          if (data.success && data.tourismOptions && data.tourismOptions.length > 0) {
            setTourismOptions(data.tourismOptions);
            setSelectedTourismOptionId(data.tourismOptions[0].id);
          }
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
        readinessPercentage,
        tourismOptions,
        selectedTourismOptionId,
        setSelectedTourismOptionId,
        emergencyData,
        setEmergencyData,
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
        customPlacesKey,
        setCustomPlacesKey,
        customSearchKey,
        setCustomSearchKey,
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
