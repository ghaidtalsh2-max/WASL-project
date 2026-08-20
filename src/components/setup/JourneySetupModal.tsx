'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney, JourneyPurpose, JourneyDuration, JourneyDetails } from '@/lib/state/JourneyContext';
import { COUNTRIES, CountryInfo, findCountry } from '@/lib/data/countries';
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Search,
  X,
  Loader2,
  MapPin,
  Compass,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Building,
  Clock,
} from 'lucide-react';

interface MissingQuestion {
  id: 'duration' | 'destination_status' | 'accommodation';
  questionEn: string;
  questionAr: string;
  type: 'choice';
  choices: Array<{
    value: string;
    labelEn: string;
    labelAr: string;
  }>;
}

export default function JourneySetupModal() {
  const { t, isRtl } = useLanguage();
  const { journey, commitJourney, setScreen, setSettingsOpen } = useJourney();

  // Mode: choice-based (primary) vs manual text (secondary)
  const [inputMode, setInputMode] = useState<'choices' | 'manual'>('choices');

  // Step state: 'form' | 'follow_up' | 'plans'
  const [setupStep, setSetupStep] = useState<'form' | 'follow_up' | 'plans'>('form');

  // Destination Choice: "I have a destination in mind" vs "I don't have a plan - create one for me"
  const [destinationChoice, setDestinationChoice] = useState<'specific' | 'plan_for_me'>('specific');

  // Locations
  const [origin, setOrigin] = useState<CountryInfo | null>(journey.origin || null);
  const [destination, setDestination] = useState<CountryInfo | null>(journey.destination || null);
  const [destinationCity, setDestinationCity] = useState<string>(journey.destinationCity || '');
  const [accommodationArea, setAccommodationArea] = useState<string>(journey.accommodationArea || '');
  const [accommodationStatus, setAccommodationStatus] = useState<'booked' | 'not_booked' | 'unknown'>('unknown');

  // Options: Purpose, Duration, Travel Dates / Season, Travel Style, Interests
  const [purpose, setPurpose] = useState<JourneyPurpose>(journey.purpose || 'travel');
  const [duration, setDuration] = useState<JourneyDuration>(journey.duration || 'weeks');
  const [datesOrSeason, setDatesOrSeason] = useState<string>('');
  const [travelStyle, setTravelStyle] = useState<string>('cultural');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['culture', 'food']);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Dropdown states
  const [searchOrigin, setSearchOrigin] = useState<string>('');
  const [searchDest, setSearchDest] = useState<string>('');
  const [originOpen, setOriginOpen] = useState<boolean>(false);
  const [destOpen, setDestOpen] = useState<boolean>(false);

  // Manual / Free-text mode state
  const [manualText, setManualText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Conversational missing questions state
  const [missingQuestions, setMissingQuestions] = useState<MissingQuestion[]>([]);
  const [recognizedSummary, setRecognizedSummary] = useState<any>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, string>>({});

  // AI Generated Trip Plans state (When user chooses "I don't have a plan - create one for me")
  const [isGeneratingPlans, setIsGeneratingPlans] = useState<boolean>(false);
  const [suggestedPlans, setSuggestedPlans] = useState<any[] | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    if (temp) setDestinationCity(temp.capital);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Generate 2 suggested plans when user has no destination in mind
  const handleGenerateSuggestedPlans = async () => {
    setIsGeneratingPlans(true);
    setApiError(null);

    try {
      const res = await fetch('/api/generate-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: selectedInterests,
          duration,
          dates: datesOrSeason,
          travelStyle,
          purpose,
          origin: origin?.name || 'Any',
          freeText: manualText || additionalNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.suggestedPlans?.length > 0) {
        setSuggestedPlans(data.suggestedPlans);
        setSelectedPlanId(data.suggestedPlans[0].id);
        setSetupStep('plans');
      } else {
        setApiError(data.error || 'Could not generate plans. Please check settings or select a destination directly.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Connection error while creating plans.');
    } finally {
      setIsGeneratingPlans(false);
    }
  };

  // Launch journey with adopted plan
  const handleAdoptPlan = (plan: any) => {
    const matchedDest =
      findCountry(plan.destinationCountry) ||
      COUNTRIES.find((c) => c.name.toLowerCase().includes(plan.destinationCountry.toLowerCase())) ||
      destination ||
      COUNTRIES[1];

    commitJourney({
      origin: origin || COUNTRIES[0],
      destination: matchedDest,
      destinationCity: plan.destinationCity || matchedDest.capital,
      accommodationArea: '',
      accommodationStatus,
      dates: datesOrSeason,
      travelStyle,
      interests: selectedInterests,
      purpose: purpose || 'travel',
      duration: duration || 'weeks',
      persona: purpose === 'study' ? 'Student' : travelStyle === 'family' ? 'Family' : 'Traveler',
      additionalNeeds: `${plan.title} - ${plan.tagline}`,
    });
  };

  // Submit choice-based journey
  const handleChoicesSubmit = async () => {
    if (destinationChoice === 'plan_for_me') {
      await handleGenerateSuggestedPlans();
      return;
    }

    const finalOrigin = origin || COUNTRIES[0];
    const finalDest = destination || COUNTRIES[1];
    const finalCity = destinationCity.trim() || finalDest.capital || 'Capital';

    commitJourney({
      origin: finalOrigin,
      destination: finalDest,
      destinationCity: finalCity,
      accommodationArea: accommodationArea.trim(),
      accommodationStatus,
      dates: datesOrSeason,
      travelStyle,
      interests: selectedInterests,
      purpose,
      duration,
      persona: purpose === 'study' ? 'Student' : purpose === 'work' ? 'Professional' : 'Traveler',
      additionalNeeds: [
        datesOrSeason ? `Dates/Season: ${datesOrSeason}` : '',
        travelStyle ? `Style: ${travelStyle}` : '',
        selectedInterests.length > 0 ? `Interests: ${selectedInterests.join(', ')}` : '',
        additionalNotes,
      ]
        .filter(Boolean)
        .join(' | '),
    });
  };

  // Analyze manual text via AI flow
  const handleManualAnalyzeAndLaunch = async () => {
    if (!manualText.trim()) return;
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: manualText }),
      });

      const data = await res.json();
      if (data.success && data.extracted) {
        const ext = data.extracted;
        
        // Update state with extracted knowns
        if (ext.origin) setOrigin(ext.origin);
        if (ext.destination) setDestination(ext.destination);
        if (ext.destinationCity) setDestinationCity(ext.destinationCity);
        if (ext.duration) setDuration(ext.duration);
        if (ext.accommodationStatus && ext.accommodationStatus !== 'unknown') {
          setAccommodationStatus(ext.accommodationStatus);
        }
        if (ext.interests && ext.interests.length > 0) setSelectedInterests(ext.interests);
        if (ext.dates) setDatesOrSeason(ext.dates);
        if (ext.travelStyle) setTravelStyle(ext.travelStyle);
        if (ext.purpose) setPurpose(ext.purpose);

        setRecognizedSummary(ext);

        // Check if there are missing questions
        if (data.missingQuestions && data.missingQuestions.length > 0) {
          setMissingQuestions(data.missingQuestions);
          setSetupStep('follow_up');
        } else {
          // All 3 items are recognized! Confirm immediately
          const finalOrigin = ext.origin || origin || COUNTRIES[0];
          const finalDest = ext.destination || destination || COUNTRIES[1];
          const finalCity = ext.destinationCity || finalDest.capital || 'Capital';

          commitJourney({
            origin: finalOrigin,
            destination: finalDest,
            destinationCity: finalCity,
            accommodationArea: ext.accommodationArea || '',
            accommodationStatus: ext.accommodationStatus || 'unknown',
            dates: ext.dates || '',
            travelStyle: ext.travelStyle || '',
            interests: ext.interests || [],
            purpose: ext.purpose || 'travel',
            duration: ext.duration || 'weeks',
            persona: ext.persona || 'Traveler',
            additionalNeeds: manualText,
          });
        }
      } else {
        setApiError(data.error || 'AI analysis failed. You can use guided options directly.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle answering missing questions in follow_up step
  const handleFollowUpAnswer = (questionId: string, value: string) => {
    setPendingAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (questionId === 'duration') {
      setDuration(value as JourneyDuration);
    } else if (questionId === 'destination_status') {
      if (value === 'no_plan') {
        setDestinationChoice('plan_for_me');
      } else {
        setDestinationChoice('specific');
      }
    } else if (questionId === 'accommodation') {
      setAccommodationStatus(value === 'booked' ? 'booked' : 'not_booked');
    }
  };

  // Finish answering follow up questions and launch
  const handleFinishFollowUp = async () => {
    if (destinationChoice === 'plan_for_me' || pendingAnswers['destination_status'] === 'no_plan') {
      await handleGenerateSuggestedPlans();
      return;
    }

    const finalOrigin = origin || COUNTRIES[0];
    const finalDest = destination || COUNTRIES[1];
    const finalCity = destinationCity.trim() || finalDest.capital || 'Capital';

    commitJourney({
      origin: finalOrigin,
      destination: finalDest,
      destinationCity: finalCity,
      accommodationArea: accommodationArea.trim(),
      accommodationStatus,
      dates: datesOrSeason,
      travelStyle,
      interests: selectedInterests,
      purpose,
      duration,
      persona: purpose === 'study' ? 'Student' : purpose === 'work' ? 'Professional' : 'Traveler',
      additionalNeeds: manualText,
    });
  };

  const filteredOrigin = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchOrigin.toLowerCase()) ||
      c.nameAr.includes(searchOrigin) ||
      c.code.toLowerCase().includes(searchOrigin.toLowerCase())
  );

  const filteredDest = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchDest.toLowerCase()) ||
      c.nameAr.includes(searchDest) ||
      c.famousCities.some(
        (city) =>
          city.name.toLowerCase().includes(searchDest.toLowerCase()) ||
          city.nameAr.includes(searchDest)
      )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0F1424]/95 border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl shadow-pink-500/10 text-white my-auto max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setScreen('landing')}
          className="absolute top-6 end-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Primary Choice-Based vs Secondary Manual Free-Text Switcher (Form step only) */}
        {setupStep === 'form' && (
          <div className="flex items-center justify-center mb-6">
            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1 text-xs">
              <button
                onClick={() => setInputMode('choices')}
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                  inputMode === 'choices'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isRtl ? 'خيارات الرحلة (الأساسي)' : 'Choice-Based Setup (Primary)'}</span>
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                  inputMode === 'manual'
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>{isRtl ? 'وصف حر مخصص (يدوي)' : 'Write Trip Description'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Conversational Follow-up Missing Questions */}
        {setupStep === 'follow_up' ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'محادثة الذكاء الاصطناعي لاستكمال رحلتك' : 'AI Companion Trip Discovery'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isRtl ? 'استكمال تفاصيل الرحلة الذكية' : 'A Few Quick Details to Perfect Your Trip'}
              </h2>
            </div>

            {/* Recognized Summary Card */}
            {recognizedSummary && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  {isRtl ? '✓ ما فهمه الذكاء من وصفك:' : '✓ Extracted from your description:'}
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {recognizedSummary.destination && (
                    <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      📍 {recognizedSummary.destinationCity || recognizedSummary.destination.name}
                    </span>
                  )}
                  {recognizedSummary.hasDuration && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ⏱ {recognizedSummary.duration}
                    </span>
                  )}
                  {recognizedSummary.hasAccommodation && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      🏨 {isRtl ? 'تم حجز الإقامة' : 'Accommodation booked'}
                    </span>
                  )}
                  {recognizedSummary.dates && (
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      📅 {recognizedSummary.dates}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Conversational Questions List */}
            <div className="space-y-4">
              {missingQuestions.map((q) => {
                const currentAnswer = pendingAnswers[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-[#14192B] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-pink-400 shrink-0" />
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {isRtl ? q.questionAr : q.questionEn}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.choices.map((choice) => {
                        const isSelected = currentAnswer === choice.value;
                        return (
                          <button
                            key={choice.value}
                            type="button"
                            onClick={() => handleFollowUpAnswer(q.id, choice.value)}
                            className={`p-3 rounded-xl border text-start text-xs sm:text-sm font-medium transition ${
                              isSelected
                                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/25'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{isRtl ? choice.labelAr : choice.labelEn}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setSetupStep('form')}
                className="text-xs text-gray-400 hover:text-white"
              >
                {isRtl ? 'العودة لتعديل الوصف' : 'Back to description'}
              </button>

              <button
                type="button"
                disabled={isGeneratingPlans}
                onClick={handleFinishFollowUp}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-semibold shadow-lg shadow-pink-500/30 transition flex items-center gap-2"
              >
                {isGeneratingPlans ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRtl ? 'جاري إنشاء الخطط بالذكاء...' : 'Generating Plans...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isRtl ? 'متابعة وبناء الرحلة' : 'Continue & Build Journey'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : setupStep === 'plans' && suggestedPlans && suggestedPlans.length > 0 ? (
          /* STEP 3: Suggested Plans Showcase */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تم تصميم خطتين مقترحتين خصيصاً لك' : '2 Tailored Trip Plans Generated for You'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isRtl ? 'اختر الخطة الأنسب لرحلتك' : 'Select Your Ideal Plan'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {suggestedPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-3xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-pink-500/15 via-[#161B2E] to-[#121728] border-pink-500 shadow-xl shadow-pink-500/15 scale-[1.02]'
                        : 'bg-[#121728]/90 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {isRtl ? plan.destinationCityAr : plan.destinationCity}, {isRtl ? plan.destinationCountryAr : plan.destinationCountry}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{plan.duration}</span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {isRtl ? plan.titleAr : plan.title}
                        </h3>
                        <p className="text-xs text-pink-300/90 mt-1 leading-relaxed">
                          {isRtl ? plan.taglineAr : plan.tagline}
                        </p>
                      </div>

                      {/* Seasonal Vibe */}
                      <div className="p-2.5 rounded-xl bg-white/5 text-xs text-gray-300 space-y-0.5">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                          {isRtl ? 'أجواء الموسم:' : 'Seasonal Vibe:'}
                        </span>
                        <span>{isRtl ? plan.seasonalVibeAr : plan.seasonalVibe}</span>
                      </div>

                      {/* Key Highlights: Attractions & Museums */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                          {isRtl ? 'أبرز المعالم والأنشطة:' : 'Key Highlights & Museums:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[...(plan.touristAttractions || []), ...(plan.museums || [])].slice(0, 4).map((att, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300">
                              {att}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdoptPlan(plan);
                      }}
                      className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200'
                      }`}
                    >
                      <span>{isRtl ? 'اعتماد هذه الخطة وبدء الرحلة' : 'Adopt Plan & Launch Journey'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setSetupStep('form')}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                {isRtl ? 'تعديل المعايير والعودة' : 'Modify preferences & try again'}
              </button>
            </div>
          </div>
        ) : inputMode === 'choices' ? (
          /* PRIMARY: Choice-Based Setup Form */
          <div className="space-y-6">
            {/* Header Titles */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.whereAreYouGoing}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">{t.letsBuildJourney}</p>
            </div>

            {/* REQUIREMENT 2: Destination Question (2 Prominent Choices) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider text-center sm:text-start">
                {isRtl ? 'تحديد وجهة الرحلة:' : 'Destination Planning Choice:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationChoice('specific')}
                  className={`p-4 rounded-2xl border text-start transition-all ${
                    destinationChoice === 'specific'
                      ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/15'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-bold text-sm text-pink-300">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{isRtl ? 'لدي وجهة / مدينة محددة' : 'I have a destination / city in mind'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isRtl ? 'اختر الدولة والمدينة التي تنوي زيارتها' : 'Specify the country & city you are heading to'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationChoice('plan_for_me')}
                  className={`p-4 rounded-2xl border text-start transition-all ${
                    destinationChoice === 'plan_for_me'
                      ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/15'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-bold text-sm text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{isRtl ? 'ليس لدي خطة — صمم لي خطة متكاملة' : 'I don’t have a plan — create one for me'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isRtl ? 'سيقوم الذكاء باقتراح خطتين رائعتين تناسبان اهتماماتك وموسمك' : 'AI will generate 2 tailored trip plans based on your interests & season'}
                  </p>
                </button>
              </div>
            </div>

            {/* If Specific Destination Chosen: Render Origin & Destination Selectors */}
            {destinationChoice === 'specific' && (
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                  {/* Origin Dropdown (Optional) */}
                  <div className="sm:col-span-5 relative">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      {t.from} <span className="text-[10px] text-gray-500">({isRtl ? 'اختياري' : 'Optional'})</span>
                    </label>
                    <div
                      onClick={() => {
                        setOriginOpen(!originOpen);
                        setDestOpen(false);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 cursor-pointer transition shadow-inner"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{origin?.flag || '🌐'}</span>
                        <span className="font-semibold text-white text-sm sm:text-base truncate">
                          {origin ? (isRtl ? origin.nameAr : origin.name) : (isRtl ? 'غير محدد' : 'Unspecified')}
                        </span>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>

                    {originOpen && (
                      <div className="absolute top-full start-0 end-0 mt-2 z-30 bg-[#161B2E] border border-white/15 rounded-2xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                        <div className="relative mb-2">
                          <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchOrigin}
                            onChange={(e) => setSearchOrigin(e.target.value)}
                            placeholder={t.searchCountryOrCity}
                            className="w-full bg-white/5 border border-white/10 rounded-xl ps-9 pe-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            autoFocus
                          />
                        </div>
                        {filteredOrigin.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setOrigin(c);
                              setOriginOpen(false);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-pink-500/20 cursor-pointer transition text-sm"
                          >
                            <span>{c.flag}</span>
                            <span className="text-white">{isRtl ? c.nameAr : c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-5">
                    <button
                      type="button"
                      onClick={swapLocations}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-pink-500/20 hover:text-pink-400 border border-white/10 transition active:scale-95"
                      title="Swap locations"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination Dropdown (Optional) */}
                  <div className="sm:col-span-5 relative">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      {t.to} <span className="text-[10px] text-gray-500">({isRtl ? 'اختياري' : 'Optional'})</span>
                    </label>
                    <div
                      onClick={() => {
                        setDestOpen(!destOpen);
                        setOriginOpen(false);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 cursor-pointer transition shadow-inner"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{destination?.flag || '📍'}</span>
                        <div className="flex flex-col text-start">
                          <span className="font-semibold text-white text-sm sm:text-base truncate">
                            {destination ? (isRtl ? destination.nameAr : destination.name) : (isRtl ? 'اختر وجهة' : 'Choose Destination')}
                          </span>
                          {destination && (
                            <span className="text-xs text-pink-400">
                              {isRtl ? destination.capitalAr : destination.capital}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>

                    {destOpen && (
                      <div className="absolute top-full start-0 end-0 mt-2 z-30 bg-[#161B2E] border border-white/15 rounded-2xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                        <div className="relative mb-2">
                          <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchDest}
                            onChange={(e) => setSearchDest(e.target.value)}
                            placeholder={t.searchCountryOrCity}
                            className="w-full bg-white/5 border border-white/10 rounded-xl ps-9 pe-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            autoFocus
                          />
                        </div>
                        {filteredDest.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setDestination(c);
                              setDestinationCity(c.capital);
                              setDestOpen(false);
                            }}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-pink-500/20 cursor-pointer transition text-sm"
                          >
                            <div className="flex items-center gap-2.5">
                              <span>{c.flag}</span>
                              <span className="text-white font-medium">{isRtl ? c.nameAr : c.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">{isRtl ? c.capitalAr : c.capital}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* City & Area Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {isRtl ? 'المدينة (اختياري / يُوصى به)' : 'City (Optional / Recommended)'}
                    </label>
                    <input
                      type="text"
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      placeholder={isRtl ? 'مثال: طوكيو، الرياض، إسطنبول' : 'e.g. Tokyo, Riyadh, Istanbul'}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {isRtl ? 'الحي / المنطقة (اختياري)' : 'Neighborhood / Area (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={accommodationArea}
                      onChange={(e) => setAccommodationArea(e.target.value)}
                      placeholder={isRtl ? 'مثال: شينجوكو، الفاتح' : 'e.g. Shinjuku, Shibuya'}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Travel Dates / Time of Year & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dates / Season */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{isRtl ? 'توقيت السفر / الموسم' : 'Travel Dates / Season'}</span>
                </label>
                <input
                  type="text"
                  value={datesOrSeason}
                  onChange={(e) => setDatesOrSeason(e.target.value)}
                  placeholder={isRtl ? 'مثال: أكتوبر، الربيع، الصيف القادم' : 'e.g. Next month, Autumn, Spring'}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              {/* Duration Chips */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  {t.durationTitle}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'days', label: t.days },
                    { id: 'weeks', label: t.weeks },
                    { id: 'months', label: t.months },
                    { id: 'yearPlus', label: t.yearPlus },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDuration(item.id as JourneyDuration)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
                        duration === item.id
                          ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Accommodation Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-pink-400" />
                <span>{isRtl ? 'حالة السكن والإقامة:' : 'Accommodation Status:'}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccommodationStatus('booked')}
                  className={`p-3 rounded-xl border text-start text-xs sm:text-sm font-medium transition ${
                    accommodationStatus === 'booked'
                      ? 'bg-pink-500/20 border-pink-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {isRtl ? '✓ حجزت مكان الإقامة' : '✓ Already booked'}
                </button>
                <button
                  type="button"
                  onClick={() => setAccommodationStatus('not_booked')}
                  className={`p-3 rounded-xl border text-start text-xs sm:text-sm font-medium transition ${
                    accommodationStatus === 'not_booked'
                      ? 'bg-pink-500/20 border-pink-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {isRtl ? '🔍 أبحث عن توصيات سكن' : '🔍 Looking for options'}
                </button>
              </div>
            </div>

            {/* Interests & Travel Style */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {isRtl ? 'الاهتمامات والأنشطة المفضلة' : 'Interests & Activities'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'culture', label: isRtl ? 'الثقافة والتراث' : 'Culture & Heritage' },
                  { id: 'food', label: isRtl ? 'المأكولات والمطاعم' : 'Food & Dining' },
                  { id: 'museums', label: isRtl ? 'المتاحف والمعارض' : 'Museums & Arts' },
                  { id: 'nature', label: isRtl ? 'الطبيعة والحدائق' : 'Nature & Parks' },
                  { id: 'shopping', label: isRtl ? 'التسوق والأسواق' : 'Shopping' },
                  { id: 'history', label: isRtl ? 'المعالم التاريخية' : 'Historic Landmarks' },
                  { id: 'events', label: isRtl ? 'الفعاليات والمهرجانات' : 'Events & Festivals' },
                  { id: 'relaxation', label: isRtl ? 'الاسترخاء والهدوء' : 'Relaxation' },
                ].map((item) => {
                  const isChecked = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        isChecked
                          ? 'bg-pink-500/25 border-pink-500 text-pink-200'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Free-text additions (Combining structured choices + free text) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                {isRtl ? 'ملاحظات وتفضيلات إضافية (اختياري)' : 'Additional Notes / Preferences (Optional)'}
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={isRtl ? 'مثال: أفضل الأماكن القريبة من محطات القطار، خيارات حلال...' : 'e.g. Prefer quiet areas, Halal food options...'}
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            {apiError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {apiError}
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className="text-xs sm:text-sm font-medium text-gray-400 hover:text-pink-400 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{t.preferToTellUs}</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPlans}
                onClick={handleChoicesSubmit}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                {isGeneratingPlans ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRtl ? 'جاري تصميم الخطتين بالذكاء...' : 'Designing 2 Plans...'}</span>
                  </>
                ) : (
                  <>
                    <span>{destinationChoice === 'plan_for_me' ? (isRtl ? 'تصميم خطتين بالذكاء الاصطناعي' : 'Generate 2 Trip Plans') : t.continueBtn}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* SECONDARY: Manual / Free-Text Description Form */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-pink-200 leading-relaxed">
                {isRtl
                  ? 'اكتب تفاصيل رحلتك، اهتماماتك، المدة، أو الميزانية بحرية. سيقوم الذكاء الاصطناعي بتحليل المعطيات واستخلاص ما تم ذكره وسؤالك فقط عما ينقص.'
                  : 'Write your trip description freely. WASL AI will analyze what is already known and only ask for remaining missing details.'}
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={t.naturalLanguagePlaceholder}
                rows={5}
                className="w-full p-4 rounded-3xl bg-white/5 border border-white/15 focus:border-pink-500 text-white text-sm focus:outline-none leading-relaxed transition"
              />

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {t.naturalLanguageExamples}
                </span>
                {[
                  'I’m going to Paris for 7 days and I already booked a hotel.',
                  'Solo cultural trip for 2 weeks in Autumn interested in historic temples and local cuisine',
                  'Planning a vacation next month looking for museums and parks, no destination yet',
                ].map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setManualText(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold">⚠️</span>
                  <p className="leading-relaxed">{apiError}</p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleManualAnalyzeAndLaunch}
                    className="px-4 py-2 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 text-white font-semibold text-xs transition"
                  >
                    {isRtl ? 'إعادة المحاولة' : 'Retry AI Analysis'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <span>{isRtl ? 'ضبط مفتاح الـ API في الإعدادات ⚙️' : 'Configure API Key ⚙️'}</span>
                  </button>
                </div>
              </div>
            )}


            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setInputMode('choices')}
                className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition"
              >
                {t.preferGuided}
              </button>

              <button
                type="button"
                disabled={isAnalyzing || !manualText.trim()}
                onClick={handleManualAnalyzeAndLaunch}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-40 text-white font-semibold shadow-lg transition flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingJourney}</span>
                  </>
                ) : (
                  <>
                    <span>{t.confirmJourneyBtn}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
