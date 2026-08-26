'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useJourney, JourneyPurpose, JourneyDuration, JourneyDetails } from '@/lib/state/JourneyContext';
import { COUNTRIES, CountryInfo, findCountry, createDynamicCountry, getCountryFlagEmoji } from '@/lib/data/countries';
import { parseDurationToDays } from '@/lib/data/defaultJourneys';
import { useSpeechToText } from '@/lib/hooks/useSpeechToText';
import NetworkTransitMesh from './NetworkTransitMesh';
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
  Plane,
  Mic,
  MicOff,
} from 'lucide-react';

interface MissingQuestion {
  id: 'travel_party' | 'duration' | 'destination_status' | 'accommodation' | 'budget';
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

  // Canvas starfield particle background for live ambient modal
  const modalCanvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = modalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const stars = Array.from({ length: 48 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.6 + 0.25,
      pulse: Math.random() * Math.PI * 2,
    }));

    let tVal = 0;
    const draw = () => {
      tVal += 0.02;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((s) => {
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const currentOpacity = s.opacity + Math.sin(tVal + s.pulse) * 0.25;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(0.9, currentOpacity));
        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Soft indigo halo
        ctx.globalAlpha = Math.max(0.05, Math.min(0.4, currentOpacity * 0.5));
        ctx.fillStyle = '#818CF8';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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

  // Travel Party & Budget
  const [travelParty, setTravelParty] = useState<'solo' | 'couple' | 'family' | 'friends' | 'group'>(
    journey.travelParty || 'solo'
  );
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>(journey.budget || 'moderate');

  // Options: Purpose, Duration, Travel Dates / Season, Travel Style, Interests
  const [purpose, setPurpose] = useState<JourneyPurpose>(journey.purpose || 'tourism');
  const [duration, setDuration] = useState<JourneyDuration>(journey.duration || 'weeks');
  const [datesOrSeason, setDatesOrSeason] = useState<string>('');
  const [travelStyle, setTravelStyle] = useState<string>('cultural');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['culture', 'food']);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Purpose specific details
  const [studyField, setStudyField] = useState<string>('');
  const [workRole, setWorkRole] = useState<string>('');
  const [relocationType, setRelocationType] = useState<string>('individual');
  const [medicalSpecialty, setMedicalSpecialty] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [medicalPurpose, setMedicalPurpose] = useState<string>('consultation');
  const [companionCount, setCompanionCount] = useState<number>(1);
  const [customDurationDays, setCustomDurationDays] = useState<number>(14);
  const [durationPreset, setDurationPreset] = useState<string>('2_weeks');

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

  // Requirement 2: Dynamic "No Plan" 2-Question Diagnostic Filter State
  const [noPlanHasCity, setNoPlanHasCity] = useState<'yes' | 'no' | null>(null);
  const [noPlanCityText, setNoPlanCityText] = useState<string>('');
  const [noPlanPreferredVibe, setNoPlanPreferredVibe] = useState<string>('nature');

  // Requirement 4: Global Custom Hook for Speech Recognition (Safari & Web Speech API)
  const {
    isListening: isListeningManual,
    toggleListening: toggleManualSpeechHook,
  } = useSpeechToText({
    lang: isRtl ? 'ar-SA' : 'en-US',
  });

  const toggleManualSpeechRecognition = () => {
    toggleManualSpeechHook(isRtl ? 'ar-SA' : 'en-US', (text) => {
      if (text) {
        setManualText((prev) => {
          // If the text starts fresh or appends
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${text}` : text;
        });
      }
    });
  };

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

  // Generate 2 suggested plans dynamically when user has no destination in mind
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
          durationPreset,
          customDurationDays,
          dates: datesOrSeason,
          travelParty,
          budget,
          travelStyle,
          purpose,
          preferredVibe: noPlanPreferredVibe,
          targetCities: noPlanHasCity === 'yes' ? noPlanCityText : '',
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
        setApiError(data.error || (isRtl ? 'تعذر تصميم الخطط بالذكاء. يرجى المحاولة مرة أخرى.' : 'Could not generate plans. Please try again.'));
      }
    } catch (err: any) {
      setApiError(err.message || 'Connection error while creating plans.');
    } finally {
      setIsGeneratingPlans(false);
    }
  };

  // Launch journey with adopted plan - Single Source of Truth for Country, City, and Flag
  const handleAdoptPlan = (plan: any) => {
    const countryQuery = plan.destinationCountry || plan.destinationCountryAr || '';
    let matchedDest =
      findCountry(countryQuery) ||
      findCountry(plan.destinationCountry) ||
      findCountry(plan.destinationCountryAr) ||
      findCountry(plan.destinationCity) ||
      findCountry(plan.isoCode) ||
      createDynamicCountry(plan.destinationCountry || 'Destination', plan.destinationCountryAr, plan.destinationCity);

    // Guaranteed matching flag
    const verifiedFlag = plan.flag && plan.flag !== '🌐'
      ? plan.flag
      : getCountryFlagEmoji(plan.destinationCountry || plan.isoCode || matchedDest.name);

    matchedDest = {
      ...matchedDest,
      flag: verifiedFlag,
      name: plan.destinationCountry || matchedDest.name,
      nameAr: plan.destinationCountryAr || matchedDest.nameAr,
      capital: plan.destinationCity || matchedDest.capital,
      capitalAr: plan.destinationCityAr || matchedDest.capitalAr,
    };

    const targetCity = plan.destinationCity || matchedDest.capital;

    commitJourney({
      origin: origin || COUNTRIES[0],
      destination: matchedDest,
      destinationCity: targetCity,
      accommodationArea: '',
      accommodationStatus,
      travelParty,
      budget,
      dates: datesOrSeason || '2026-09-01',
      travelStyle,
      interests: selectedInterests,
      purpose: purpose || 'tourism',
      duration: duration || 'weeks',
      persona: purpose === 'study' ? 'Student' : travelParty === 'family' ? 'Family' : 'Traveler',
      additionalNeeds: `${plan.title} - ${plan.tagline}`,
      activePlan: plan,
    });
  };

  // Submit choice-based journey
  const handleChoicesSubmit = async () => {
    if (destinationChoice === 'plan_for_me') {
      await handleGenerateSuggestedPlans();
      return;
    }

    // [A] Mandatory Departure Date Validation for ALL categories
    if (!datesOrSeason.trim()) {
      setApiError(
        isRtl
          ? '⚠️ تاريخ المغادرة إلزامي لجميع أغراض السفر لمطابقة المواسم والتوقيتات التشغيلية والمواعيد الرسمية.'
          : '⚠️ Departure date is strictly mandatory across all travel categories.'
      );
      return;
    }

    // [B] Mandatory City Validation for Study, Work, and Relocation
    if ((purpose === 'study' || purpose === 'work' || purpose === 'relocation') && !destinationCity.trim()) {
      setApiError(
        isRtl
          ? '⚠️ تحديد مدينة الوجهة إلزامي لرحلات الدراسة والعمل والاستقرار لتجهيز السكن والخدمات المعيشية.'
          : '⚠️ Destination city is strictly mandatory for Study, Work, and Relocation.'
      );
      return;
    }

    setApiError(null);

    const finalOrigin = origin || COUNTRIES[0];
    const finalDest = destination || COUNTRIES[1];
    const finalCity = destinationCity.trim() || finalDest.capital || 'Capital';

    let finalDays = customDurationDays || 14;
    if (duration === 'weeks') {
      finalDays = durationPreset === '1_week' ? 7 : durationPreset === '2_weeks' ? 14 : durationPreset === '3_weeks' ? 21 : durationPreset === '4_weeks' ? 28 : (customDurationDays || 14);
    } else if (duration === 'months') {
      finalDays = 30;
    } else if (duration === 'yearPlus') {
      finalDays = 30;
    } else if (duration === 'days') {
      finalDays = customDurationDays || 5;
    }
    const durationText = `${finalDays} days`;

    commitJourney({
      origin: finalOrigin,
      destination: finalDest,
      destinationCity: finalCity,
      accommodationArea: accommodationArea.trim(),
      accommodationStatus,
      travelParty,
      budget,
      dates: datesOrSeason,
      travelStyle,
      interests: selectedInterests,
      purpose,
      duration,
      durationText,
      medicalDetails: (purpose === 'medical' || (purpose as any) === 'recovery') ? {
        specialty: medicalSpecialty || 'General Medicine & Recovery',
        patientAge: patientAge || undefined,
        purpose: medicalPurpose || 'SURGERY_SPECIALIZED',
        medicalSubCategory: (medicalPurpose === 'wellness' || medicalPurpose === 'RECOVERY_WELLNESS' || medicalPurpose === 'rehabilitation') ? 'RECOVERY_WELLNESS' : 'SURGERY_SPECIALIZED',
        companionCount: companionCount || 1,
      } : undefined,
      persona: purpose === 'study' ? 'Student' : purpose === 'work' ? 'Professional' : (purpose === 'medical' || (purpose as any) === 'recovery') ? 'Patient / Health Traveler' : 'Traveler',
      additionalNeeds: [
        medicalSpecialty ? `Medical Specialty: ${medicalSpecialty}` : '',
        patientAge ? `Patient Age: ${patientAge}` : '',
        studyField ? `Study Field: ${studyField}` : '',
        workRole ? `Work Role: ${workRole}` : '',
        relocationType ? `Relocation: ${relocationType}` : '',
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
        if (ext.travelParty) setTravelParty(ext.travelParty);
        if (ext.budget) setBudget(ext.budget);
        if (ext.duration) setDuration(ext.duration);
        if (ext.durationDays) setCustomDurationDays(ext.durationDays);
        if (ext.accommodationStatus && ext.accommodationStatus !== 'unknown') {
          setAccommodationStatus(ext.accommodationStatus);
        }
        if (ext.interests && ext.interests.length > 0) setSelectedInterests(ext.interests);
        if (ext.dates) setDatesOrSeason(ext.dates);
        if (ext.travelStyle) setTravelStyle(ext.travelStyle);
        if (ext.purpose) setPurpose(ext.purpose);
        if (ext.medicalDetails) {
          if (ext.medicalDetails.specialty) setMedicalSpecialty(ext.medicalDetails.specialty);
          if (ext.medicalDetails.patientAge) setPatientAge(String(ext.medicalDetails.patientAge));
          if (ext.medicalDetails.purpose) setMedicalPurpose(ext.medicalDetails.purpose);
        }

        setRecognizedSummary(ext);

        // Check if there are missing questions
        if (data.missingQuestions && data.missingQuestions.length > 0) {
          setMissingQuestions(data.missingQuestions);
          setSetupStep('follow_up');
        } else {
          // All items recognized! Confirm immediately
          const finalOrigin = ext.origin || origin || COUNTRIES[0];
          const finalDest = ext.destination || destination || COUNTRIES[1];
          const finalCity = ext.destinationCity || finalDest.capital || 'Capital';

          commitJourney({
            origin: finalOrigin,
            destination: finalDest,
            destinationCity: finalCity,
            accommodationArea: ext.accommodationArea || '',
            accommodationStatus: ext.accommodationStatus || 'unknown',
            travelParty: ext.travelParty || travelParty || 'solo',
            budget: ext.budget || budget || 'moderate',
            dates: ext.dates || '',
            travelStyle: ext.travelStyle || '',
            interests: ext.interests || [],
            purpose: ext.purpose || 'tourism',
            duration: ext.duration || 'weeks',
            durationText: `${ext.durationDays || parseDurationToDays(ext.durationText || manualText || '14 days')} days`,
            medicalDetails: ext.medicalDetails || undefined,
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

  // Helper to guarantee rich choices for any question
  const getChoicesForQuestion = (q: MissingQuestion) => {
    if (Array.isArray(q.choices) && q.choices.length >= 2) {
      return q.choices;
    }
    const qText = `${q.id || ''} ${q.questionAr || ''} ${q.questionEn || ''}`.toLowerCase();

    if (qText.includes('purpose') || qText.includes('غرض') || qText.includes('سبب') || qText.includes('هدف') || qText.includes('نوع الرحلة')) {
      return [
        { value: 'tourism', labelEn: 'Tourism & Exploration', labelAr: 'سياحة وزيارة واستكشاف' },
        { value: 'medical', labelEn: 'Medical & Recovery Care', labelAr: 'علاج واستشفاء صحي وفحوصات' },
        { value: 'study', labelEn: 'Study & University', labelAr: 'دراسة وابتعاث جامعي' },
        { value: 'work', labelEn: 'Work & Career', labelAr: 'عمل وانتداب مهني' },
        { value: 'relocation', labelEn: 'Relocation & Living', labelAr: 'استقرار وهجرة ومعيشة' },
      ];
    }
    if (qText.includes('duration') || qText.includes('stay') || qText.includes('مدة') || qText.includes('وقت') || qText.includes('ايام') || qText.includes('أيام') || qText.includes('شهر') || qText.includes('اسبوع') || qText.includes('أسبوع') || qText.includes('للبقاء')) {
      return [
        { value: '3_5_days', labelEn: '3 – 5 Days (Short Break)', labelAr: '3 – 5 أيام (عطلة قصيرة)' },
        { value: '1_week', labelEn: '1 Week (7 Days)', labelAr: 'أسبوع واحد (7 أيام)' },
        { value: '2_weeks', labelEn: '2 Weeks (14 Days)', labelAr: 'أسبوعين (14 يوماً)' },
        { value: '1_month', labelEn: '1 Month (30 Days)', labelAr: 'شهر واحد (30 يوماً)' },
        { value: 'yearPlus', labelEn: '1+ Year', labelAr: 'سنة أو أكثر' },
      ];
    }
    if (qText.includes('medical') || qText.includes('treatment') || qText.includes('علاج') || qText.includes('صحي') || qText.includes('فحوصات') || qText.includes('عملية') || qText.includes('تخصص')) {
      return [
        { value: 'cardiology', labelEn: 'Cardiology & Heart Care', labelAr: 'أمراض وجراحة القلب والأوعية' },
        { value: 'orthopedics', labelEn: 'Orthopedics & Joint Care', labelAr: 'العظام والمفاصل والعلاج الطبيعي' },
        { value: 'wellness', labelEn: 'Health Checkup & Wellness', labelAr: 'فحوصات شاملة ونقاهة واستجمام' },
        { value: 'cosmetics', labelEn: 'Aesthetic & Dental Procedures', labelAr: 'تجميل وزراعة الشعر والأسنان' },
        { value: 'general', labelEn: 'General / Other Specialties', labelAr: 'تخصصات طبية وعلاجية أخرى' },
      ];
    }
    if (qText.includes('party') || qText.includes('مرافق') || qText.includes('معك') || qText.includes('companion') || qText.includes('يسافر')) {
      return [
        { value: 'solo', labelEn: 'Solo (Just me)', labelAr: 'بمفردي (سفر فردي)' },
        { value: 'couple', labelEn: 'Couple / Partner', labelAr: 'مع شريك الحياة (زوجين)' },
        { value: 'family', labelEn: 'Family (with children)', labelAr: 'مع العائلة والأطفال' },
        { value: 'friends', labelEn: 'Friends', labelAr: 'مع الأصدقاء' },
      ];
    }
    if (qText.includes('accommodation') || qText.includes('سكن') || qText.includes('فندق') || qText.includes('إقامة') || qText.includes('اقامة') || qText.includes('حجز')) {
      return [
        { value: 'booked', labelEn: 'Yes, already booked', labelAr: 'نعم، قمت بالحجز مسبقاً' },
        { value: 'not_booked', labelEn: 'No, looking for lodging', labelAr: 'لا، لم أحجز (أبحث عن توصيات وروابط مباشرة)' },
        { value: 'not_sure', labelEn: 'Not sure yet', labelAr: 'لست متأكداً حتى الآن' },
      ];
    }
    if (qText.includes('budget') || qText.includes('ميزانية') || qText.includes('تكلفة') || qText.includes('مستوى')) {
      return [
        { value: 'moderate', labelEn: 'Balanced / Moderate', labelAr: 'متوسطة متوازنة' },
        { value: 'budget', labelEn: 'Economy / Budget', labelAr: 'ميزانية اقتصادية موفرة' },
        { value: 'luxury', labelEn: 'Luxury & Premium', labelAr: 'فاخرة ومميزة' },
      ];
    }
    if (qText.includes('city') || qText.includes('مدينة') || qText.includes('منطقة') || qText.includes('وجهة') || qText.includes('خطة')) {
      return [
        { value: 'capital', labelEn: 'Main Capital & Cultural Hub', labelAr: 'العاصمة والمركز الثقافي الرئيسي' },
        { value: 'nature', labelEn: 'Scenic Coast & Nature Districts', labelAr: 'السياحة الساحلية والمناطق الطبيعية' },
        { value: 'multi_city', labelEn: 'Multi-City Highlights Tour', labelAr: 'مسار متكامل يغطي عدة مدن' },
      ];
    }
    return [
      { value: 'option_1', labelEn: 'Explore Recommended Options', labelAr: 'استكشاف الخيارات المقترحة' },
      { value: 'option_2', labelEn: 'Customize My Own Plan', labelAr: 'تخصيص الخطة بنفسي' },
    ];
  };

  // Handle answering missing questions in follow_up step
  const handleFollowUpAnswer = (questionId: string, value: string) => {
    setPendingAnswers((prev) => ({ ...prev, [questionId]: value }));

    const id = questionId.toLowerCase();
    if (id.includes('purpose') || id.includes('غرض') || id.includes('سبب')) {
      setPurpose(value as any);
    } else if (id.includes('travel_party') || id.includes('party') || id.includes('مرافق')) {
      setTravelParty(value as any);
    } else if (id.includes('duration') || id.includes('stay') || id.includes('مدة') || id.includes('وقت')) {
      if (value === '3_5_days') {
        setDuration('days');
        setCustomDurationDays(5);
      } else if (value === '1_week') {
        setDuration('weeks');
        setCustomDurationDays(7);
      } else if (value === '2_weeks') {
        setDuration('weeks');
        setCustomDurationDays(14);
      } else if (value === '1_month') {
        setDuration('months');
        setCustomDurationDays(30);
      } else if (value === 'yearPlus') {
        setDuration('yearPlus');
        setCustomDurationDays(365);
      } else {
        setDuration(value as JourneyDuration);
      }
    } else if (id.includes('destination_status')) {
      if (value === 'no_plan') {
        setDestinationChoice('plan_for_me');
      } else {
        setDestinationChoice('specific');
      }
    } else if (id.includes('accommodation') || id.includes('سكن') || id.includes('فندق')) {
      setAccommodationStatus(value === 'booked' ? 'booked' : 'not_booked');
    } else if (id.includes('budget') || id.includes('ميزانية')) {
      setBudget(value as any);
    } else if (id.includes('medical') || id.includes('specialty')) {
      setMedicalSpecialty(value);
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

    // Apply any pending follow up selections
    let finalPurpose = purpose;
    if (pendingAnswers['purpose']) finalPurpose = pendingAnswers['purpose'] as any;

    let finalParty = travelParty;
    if (pendingAnswers['travel_party']) finalParty = pendingAnswers['travel_party'] as any;

    let finalBudget = budget;
    if (pendingAnswers['budget']) finalBudget = pendingAnswers['budget'] as any;

    let finalAccommodation = accommodationStatus;
    if (pendingAnswers['accommodation']) {
      finalAccommodation = pendingAnswers['accommodation'] === 'booked' ? 'booked' : 'not_booked';
    }

    let finalDuration = duration;
    let finalDurationDays = customDurationDays || 14;
    if (pendingAnswers['duration']) {
      const durVal = pendingAnswers['duration'];
      if (durVal === '3_5_days') {
        finalDuration = 'days';
        finalDurationDays = 5;
      } else if (durVal === '1_week') {
        finalDuration = 'weeks';
        finalDurationDays = 7;
      } else if (durVal === '2_weeks') {
        finalDuration = 'weeks';
        finalDurationDays = 14;
      } else if (durVal === '1_month') {
        finalDuration = 'months';
        finalDurationDays = 30;
      } else if (durVal === 'yearPlus') {
        finalDuration = 'yearPlus';
        finalDurationDays = 365;
      }
    }

    commitJourney({
      origin: finalOrigin,
      destination: finalDest,
      destinationCity: finalCity,
      accommodationArea: accommodationArea.trim(),
      accommodationStatus: finalAccommodation,
      travelParty: finalParty,
      budget: finalBudget,
      dates: datesOrSeason,
      travelStyle,
      interests: selectedInterests,
      purpose: finalPurpose,
      duration: finalDuration,
      durationText: `${finalDurationDays} days`,
      medicalDetails: finalPurpose === 'medical' ? {
        specialty: medicalSpecialty || pendingAnswers['medical_specialty'] || 'General Care',
        patientAge: patientAge ? parseInt(patientAge) : undefined,
        purpose: medicalPurpose || 'Consultation & Treatment',
        companionCount: companionCount || 0,
      } : undefined,
      persona: finalPurpose === 'study' ? 'Student' : finalPurpose === 'work' ? 'Professional' : 'Traveler',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#040816]/85 backdrop-blur-2xl overflow-y-auto">
      {/* Live Starfield Canvas in Modal Backdrop */}
      <canvas
        ref={modalCanvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
      />

      {/* Radiant Cosmic Ambient Orbs */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 rounded-full bg-pink-500/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#0F1424]/90 border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl shadow-pink-500/15 text-white my-auto max-h-[95vh] overflow-y-auto backdrop-blur-xl">
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
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${inputMode === 'choices'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isRtl ? 'خيارات الرحلة (الأساسي)' : 'Choice-Based Setup (Primary)'}</span>
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${inputMode === 'manual'
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
                  {recognizedSummary.accommodationStatus === 'booked' && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      🏨 {isRtl ? 'تم حجز الإقامة مسبقاً' : 'Accommodation booked'}
                    </span>
                  )}
                  {recognizedSummary.accommodationStatus === 'not_booked' && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🏨 {isRtl ? 'لم يتم الحجز (مطلوب توصيات)' : 'Need accommodation recommendations'}
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
                      {getChoicesForQuestion(q).map((choice) => {
                        const isSelected = currentAnswer === choice.value;
                        return (
                          <button
                            key={choice.value}
                            type="button"
                            onClick={() => handleFollowUpAnswer(q.id, choice.value)}
                            className={`p-3.5 rounded-xl border text-start text-xs sm:text-sm font-medium transition ${isSelected
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
                    className={`rounded-3xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 relative ${isSelected
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
                      className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${isSelected
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
                  className={`p-4 rounded-2xl border text-start transition-all ${destinationChoice === 'specific'
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
                  className={`p-4 rounded-2xl border text-start transition-all ${destinationChoice === 'plan_for_me'
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

              {/* Requirement 2: Dynamic "No Plan" 2-Question Diagnostic Filter */}
              {destinationChoice === 'plan_for_me' && (
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-pink-500/5 to-transparent border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">
                      {isRtl ? 'استبيان التوجيه الذكي المخصص (خطوات سريعة):' : 'Smart Autonomous Routing Diagnostic:'}
                    </span>
                  </div>

                  {/* Q1: Do you have specific cities/countries in mind? */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-purple-300">
                      {isRtl ? 'السؤال 1: هل لديك مدن أو دول محددة تود الذهاب إليها؟' : 'Q1: Do you have specific cities or countries in mind?'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNoPlanHasCity('yes')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition ${noPlanHasCity === 'yes'
                          ? 'bg-purple-500/30 border-purple-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                      >
                        {isRtl ? 'نعم (أود تحديدها)' : 'Yes (I have preferences)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNoPlanHasCity('no');
                          setNoPlanCityText('');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition ${noPlanHasCity === 'no'
                          ? 'bg-purple-500/30 border-purple-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                      >
                        {isRtl ? 'لا (اقترح لي ذكياً بالكامل)' : 'No (AI Autonomous Routing)'}
                      </button>
                    </div>

                    {noPlanHasCity === 'yes' && (
                      <input
                        type="text"
                        value={noPlanCityText}
                        onChange={(e) => setNoPlanCityText(e.target.value)}
                        placeholder={isRtl ? 'مثال: سويسرا، إيطاليا، طوكيو، فلوريدا...' : 'e.g. Switzerland, Tokyo, Tuscany, Florida...'}
                        className="w-full mt-2 bg-white/5 border border-purple-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    )}
                  </div>

                  {/* Q2: Preferred Atmosphere */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="block text-xs font-semibold text-purple-300">
                      {isRtl ? 'السؤال 2: ما هي الأجواء وتجربة السفر المفضلة لديك؟' : 'Q2: What is your preferred atmosphere & travel vibe?'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'nature', icon: '🌿', labelAr: 'هدوء وطبيعة', labelEn: 'Nature & Serenity' },
                        { id: 'history', icon: '🏛️', labelAr: 'تاريخ وثقافة', labelEn: 'History & Culture' },
                        { id: 'entertainment', icon: '🎢', labelAr: 'ألعاب ومدن', labelEn: 'Fun & City Life' },
                        { id: 'beach', icon: '🏖️', labelAr: 'شواطئ ونقاهة', labelEn: 'Beaches & Recovery' },
                      ].map((vibe) => (
                        <button
                          key={vibe.id}
                          type="button"
                          onClick={() => setNoPlanPreferredVibe(vibe.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${noPlanPreferredVibe === vibe.id
                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-pink-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                          <span className="text-base">{vibe.icon}</span>
                          <span>{isRtl ? vibe.labelAr : vibe.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* If Specific Destination Chosen: Render Origin & Destination Selectors */}
            {destinationChoice === 'specific' && (
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                {/* Live Multi-Hub Transit Network Mesh & Traffic Corridor */}
                <NetworkTransitMesh
                  origin={origin}
                  destination={destination}
                  destinationCity={destinationCity}
                  isRtl={isRtl}
                />

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

            {/* Purpose & Travel Party Selector */}
            <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              {/* Purpose Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  {isRtl ? 'الغرض من السفر / الإقامة:' : 'Purpose of Travel / Stay:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'tourism', labelEn: 'Tourism', labelAr: 'سياحة', icon: '✈️' },
                    { id: 'study', labelEn: 'Study', labelAr: 'دراسة', icon: '🎓' },
                    { id: 'work', labelEn: 'Work', labelAr: 'عمل', icon: '💼' },
                    { id: 'relocation', labelEn: 'Relocation', labelAr: 'استقرار', icon: '🏡' },
                    { id: 'medical', labelEn: 'Medical', labelAr: 'علاج واستشفاء', icon: '🏥' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPurpose(item.id as JourneyPurpose)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${purpose === item.id
                        ? 'bg-pink-500/25 border-pink-500 text-white shadow-md shadow-pink-500/20'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      <span>{item.icon}</span>
                      <span>{isRtl ? item.labelAr : item.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Party Question */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  {isRtl ? 'من يسافر معك؟ (المجموعة المرافقة):' : 'Who are you traveling with?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'solo', labelEn: 'Solo', labelAr: 'بمفردي', icon: '👤' },
                    { id: 'couple', labelEn: 'Couple', labelAr: 'مع الشريك', icon: '👫' },
                    { id: 'family', labelEn: 'Family', labelAr: 'عائلة وأطفال', icon: '👨‍👩‍👧‍👦' },
                    { id: 'friends', labelEn: 'Friends', labelAr: 'مع الأصدقاء', icon: '👥' },
                    { id: 'group', labelEn: 'Group', labelAr: 'مجموعة / أخرى', icon: '🚐' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTravelParty(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${travelParty === item.id
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-pink-500 text-white shadow-md shadow-pink-500/25'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      <span>{item.icon}</span>
                      <span>{isRtl ? item.labelAr : item.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose-Adaptive Questions: Medical / Study / Work / Relocation */}
              {(purpose === 'medical' || (purpose as any) === 'recovery') && (
                <div className="pt-3 border-t border-white/10 space-y-3 bg-pink-500/5 p-3 rounded-xl border border-pink-500/20">
                  <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                    <span>🏥</span>
                    <span>{isRtl ? 'تفاصيل الرحلة العلاجية والاستشفاء:' : 'Medical & Healthcare Travel Details:'}</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        {isRtl ? 'التخصص الطبي / الحالة:' : 'Medical Specialty / Condition:'}
                      </label>
                      <input
                        type="text"
                        value={medicalSpecialty}
                        onChange={(e) => setMedicalSpecialty(e.target.value)}
                        placeholder={isRtl ? 'مثال: جراحة قلب، فحوصات عامة، تأهيل طبيعي' : 'e.g. Cardiology, Oncology, Orthopedics, Wellness'}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        {isRtl ? 'عمر المريض (اختياري):' : 'Patient Age (Optional):'}
                      </label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder={isRtl ? 'مثال: 45' : 'e.g. 45'}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        {isRtl ? 'الهدف من الرحلة:' : 'Purpose of Treatment:'}
                      </label>
                      <select
                        value={medicalPurpose}
                        onChange={(e) => setMedicalPurpose(e.target.value)}
                        className="w-full bg-[#14192B] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      >
                        <option value="SURGERY_SPECIALIZED">{isRtl ? '🏥 جراحة وعلاج متخصص ومستشفيات معتمدة (Specialized Surgery)' : '🏥 Specialized Surgery & Academic Medical Centers'}</option>
                        <option value="RECOVERY_WELLNESS">{isRtl ? '🌿 استشفاء ونقاهة ومصحات المياه المعدنية (Sanatoriums & Wellness)' : '🌿 Spa Sanatoriums & Wellness Recovery'}</option>
                        <option value="consultation">{isRtl ? '🩺 استشارة تخصصية وفحوصات دقيقة (Second Opinion)' : '🩺 Specialist Consultation & Diagnostics'}</option>
                        <option value="rehabilitation">{isRtl ? '🏊 علاج طبيعي وتأهيل حركي (Rehabilitation)' : '🏊 Physical Therapy & Motor Rehab'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        {isRtl ? 'عدد المرافقين:' : 'Companions Count:'}
                      </label>
                      <select
                        value={companionCount}
                        onChange={(e) => setCompanionCount(parseInt(e.target.value, 10))}
                        className="w-full bg-[#14192B] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      >
                        <option value="0">{isRtl ? 'بدون مرافقين' : 'None (Traveling alone)'}</option>
                        <option value="1">{isRtl ? 'مرافق واحد' : '1 Companion'}</option>
                        <option value="2">{isRtl ? 'مرافقان' : '2 Companions'}</option>
                        <option value="3">{isRtl ? '3 مرافقين أو أكثر' : '3+ Companions (Family)'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {purpose === 'study' && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-pink-300 block">
                    {isRtl ? '🎓 تفاصيل الدراسة والابتعاث:' : '🎓 Academic & Study Context:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={studyField}
                      onChange={(e) => setStudyField(e.target.value)}
                      placeholder={isRtl ? 'التخصص أو اسم الجامعة (مثال: علوم حاسب)' : 'Field of study / University name'}
                      className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                    <select
                      className="bg-[#14192B] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      onChange={(e) => setAdditionalNotes((prev) => `${prev} | Funding: ${e.target.value}`)}
                    >
                      <option value="scholarship">{isRtl ? 'ابتعاث حكومي / منحة كاملة' : 'Government Scholarship'}</option>
                      <option value="self_funded">{isRtl ? 'دراسة على الحساب الخاص' : 'Self-funded student'}</option>
                    </select>
                  </div>
                </div>
              )}

              {purpose === 'work' && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-pink-300 block">
                    {isRtl ? '💼 تفاصيل العمل والمهنة:' : '💼 Work & Professional Context:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={workRole}
                      onChange={(e) => setWorkRole(e.target.value)}
                      placeholder={isRtl ? 'المسمى الوظيفي أو القطاع (مثال: تقنية معلومات)' : 'Job role or industry sector'}
                      className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                    <select
                      className="bg-[#14192B] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      onChange={(e) => setAdditionalNotes((prev) => `${prev} | Visa: ${e.target.value}`)}
                    >
                      <option value="sponsored">{isRtl ? 'إقامة عمل مكفولة من الشركة' : 'Company Sponsored Visa'}</option>
                      <option value="business_trip">{isRtl ? 'انتداب عمل قصير الأجل' : 'Short Business Mission'}</option>
                      <option value="digital_nomad">{isRtl ? 'عمل عن بعد / رحالة رقمي' : 'Digital Nomad / Remote'}</option>
                    </select>
                  </div>
                </div>
              )}

              {purpose === 'relocation' && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-pink-300 block">
                    {isRtl ? '🏡 نوع الانتقال والاستقرار:' : '🏡 Relocation Household:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRelocationType('individual')}
                      className={`p-2 rounded-xl border text-xs ${relocationType === 'individual' ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {isRtl ? 'انتقال فردي' : 'Individual Relocation'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRelocationType('family')}
                      className={`p-2 rounded-xl border text-xs ${relocationType === 'family' ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {isRtl ? 'انتقال عائلي شامل' : 'Family Relocation with Dependents'}
                    </button>
                  </div>
                </div>
              )}

              {/* Budget Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  {isRtl ? 'الميزانية التقديرية:' : 'Estimated Budget Level:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', labelEn: 'Budget / Economy', labelAr: 'اقتصادية' },
                    { id: 'moderate', labelEn: 'Moderate / Balanced', labelAr: 'متوسطة متوازنة' },
                    { id: 'luxury', labelEn: 'Luxury / Premium', labelAr: 'فاخرة ومميزة' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBudget(item.id as any)}
                      className={`p-2 rounded-xl border text-xs font-medium transition ${budget === item.id
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      {isRtl ? item.labelAr : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Granular Duration Options & Travel Dates */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span>{isRtl ? 'مدة الرحلة الدقيقة:' : 'Exact Duration:'}</span>
                </label>
                <span className="text-xs text-pink-300 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  {duration === 'days'
                    ? `${customDurationDays} ${isRtl ? 'أيام' : 'Days'}`
                    : duration === 'weeks'
                      ? `${Math.round(customDurationDays / 7) || 2} ${isRtl ? 'أسابيع' : 'Weeks'} (${customDurationDays} days)`
                      : duration === 'months'
                        ? `${Math.round(customDurationDays / 30) || 1} ${isRtl ? 'أشهر' : 'Months'}`
                        : isRtl ? 'سنة أو أكثر' : '1+ Year'}
                </span>
              </div>

              {/* Main Duration Tabs */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'days', labelEn: 'Days', labelAr: 'أيام' },
                  { id: 'weeks', labelEn: 'Weeks', labelAr: 'أسابيع' },
                  { id: 'months', labelEn: 'Months', labelAr: 'أشهر' },
                  { id: 'yearPlus', labelEn: '1+ Year', labelAr: 'سنة+' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDuration(item.id as JourneyDuration);
                      if (item.id === 'days' && customDurationDays > 10) setCustomDurationDays(5);
                      if (item.id === 'weeks' && customDurationDays < 7) setCustomDurationDays(14);
                      if (item.id === 'months') setCustomDurationDays(30);
                    }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border ${duration === item.id
                      ? 'bg-pink-500/25 border-pink-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    {isRtl ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>

              {/* Sub-duration Presets */}
              {duration === 'days' && (
                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {[3, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCustomDurationDays(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${customDurationDays === d
                        ? 'bg-pink-500/30 border-pink-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {d} {isRtl ? 'أيام' : 'Days'}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-gray-400">{isRtl ? 'أو حدد عدد الأيام:' : 'Custom days:'}</span>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={customDurationDays}
                      onChange={(e) => setCustomDurationDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-16 bg-white/5 border border-white/20 rounded-lg px-2 py-1 text-xs text-center text-white"
                    />
                  </div>
                </div>
              )}

              {duration === 'weeks' && (
                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {[
                    { key: '1_week', days: 7, labelEn: '1 Week (7d)', labelAr: 'أسبوع (7 أيام)' },
                    { key: '2_weeks', days: 14, labelEn: '2 Weeks (14d)', labelAr: 'أسبوعين (14 يوماً)' },
                    { key: '3_weeks', days: 21, labelEn: '3 Weeks (21d)', labelAr: '3 أسابيع (21 يوماً)' },
                    { key: '4_weeks', days: 28, labelEn: '4 Weeks (28d)', labelAr: '4 أسابيع (28 يوماً)' },
                  ].map((w) => (
                    <button
                      key={w.key}
                      type="button"
                      onClick={() => {
                        setDurationPreset(w.key);
                        setCustomDurationDays(w.days);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${customDurationDays === w.days
                        ? 'bg-pink-500/30 border-pink-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {isRtl ? w.labelAr : w.labelEn}
                    </button>
                  ))}
                </div>
              )}

              {duration === 'months' && (
                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {[
                    { key: '1_month', days: 30, labelEn: '1 Month', labelAr: 'شهر واحد' },
                    { key: '2_months', days: 60, labelEn: '2 Months', labelAr: 'شهران' },
                    { key: '3_months', days: 90, labelEn: '3 Months', labelAr: '3 أشهر' },
                    { key: '6_months', days: 180, labelEn: '6 Months', labelAr: '6 أشهر' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => {
                        setDurationPreset(m.key);
                        setCustomDurationDays(m.days);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${durationPreset === m.key
                        ? 'bg-pink-500/30 border-pink-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {isRtl ? m.labelAr : m.labelEn}
                    </button>
                  ))}
                </div>
              )}

              {duration === 'yearPlus' && (
                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {[
                    { key: '1_year', days: 365, labelEn: '1 Year', labelAr: 'سنة واحدة' },
                    { key: '2_years', days: 730, labelEn: '2 Years', labelAr: 'سنتان (ماجستير)' },
                    { key: '3_years', days: 1095, labelEn: '3 Years', labelAr: '3 سنوات' },
                    { key: '4_years', days: 1460, labelEn: '4 Years (Bachelor)', labelAr: '4 سنوات (بكالوريوس)' },
                  ].map((yr) => (
                    <button
                      key={yr.key}
                      type="button"
                      onClick={() => {
                        setDurationPreset(yr.key);
                        setCustomDurationDays(yr.days);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${durationPreset === yr.key
                        ? 'bg-pink-500/30 border-pink-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                    >
                      {isRtl ? yr.labelAr : yr.labelEn}
                    </button>
                  ))}
                </div>
              )}

              {/* Dates / Season Input */}
              <div className="pt-2">
                <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-pink-400" />
                  <span className={purpose === 'study' || purpose === 'work' || purpose === 'relocation' ? 'text-pink-300 font-bold' : ''}>
                    {purpose === 'study' || purpose === 'work' || purpose === 'relocation'
                      ? (isRtl ? 'تاريخ الذهاب (مطلوب) *' : 'Departure Date (Required) *')
                      : (isRtl ? 'توقيت السفر أو الموسم (اختياري)' : 'Travel Timing / Season (Optional)')}
                  </span>
                </label>
                <input
                  type="text"
                  value={datesOrSeason}
                  onChange={(e) => setDatesOrSeason(e.target.value)}
                  placeholder={
                    purpose === 'study' || purpose === 'work' || purpose === 'relocation'
                      ? (isRtl ? 'مثال: 2026-09-01 أو 15 سبتمبر' : 'e.g. 2026-09-01, Sept 15')
                      : (isRtl ? 'مثال: أكتوبر القادم، موسم الخريف' : 'e.g. Next month, Autumn, Summer vacation')
                  }
                  className={`w-full bg-white/5 border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition ${purpose === 'study' || purpose === 'work' || purpose === 'relocation'
                    ? 'border-pink-500/40 focus:border-pink-500'
                    : 'border-white/15 focus:border-pink-500'
                    }`}
                />
              </div>
            </div>

            {/* Accommodation Status */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-pink-400" />
                <span>{isRtl ? 'حالة السكن والإقامة:' : 'Accommodation Status:'}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccommodationStatus('booked')}
                  className={`p-3 rounded-xl border text-start text-xs font-medium transition ${accommodationStatus === 'booked'
                    ? 'bg-pink-500/20 border-pink-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  <span className="font-bold block text-sm mb-0.5">{isRtl ? '✓ حجزت مكان الإقامة' : '✓ Already booked'}</span>
                  <span className="text-[11px] text-gray-400 block">{isRtl ? 'لدي فندق أو شقة محددة' : 'I have a hotel/apartment confirmed'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccommodationStatus('not_booked')}
                  className={`p-3 rounded-xl border text-start text-xs font-medium transition ${accommodationStatus === 'not_booked'
                    ? 'bg-pink-500/20 border-pink-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  <span className="font-bold block text-sm mb-0.5">{isRtl ? '🔍 أبحث عن توصيات سكن' : '🔍 Need recommendations'}</span>
                  <span className="text-[11px] text-gray-400 block">{isRtl ? 'اقترح علي أفضل الخيارات بروابط حجز مباشرة' : 'Provide curated lodging with direct booking links'}</span>
                </button>
              </div>

              {accommodationStatus === 'booked' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-gray-400 mb-1">
                    {isRtl ? 'الحي / منطقة السكن المحجوز:' : 'Booked Hotel / Neighborhood Area:'}
                  </label>
                  <input
                    type="text"
                    value={accommodationArea}
                    onChange={(e) => setAccommodationArea(e.target.value)}
                    placeholder={isRtl ? 'مثال: شينجوكو، الفاتح، بورت لويس' : 'e.g. Shinjuku, Mitte, Grand Baie'}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${isChecked
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-300">
                  {isRtl ? 'الوصف الحر لرحلتك:' : 'Free Trip Description:'}
                </label>
                <button
                  type="button"
                  onClick={toggleManualSpeechRecognition}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${isListeningManual
                    ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                    : 'bg-white/5 hover:bg-white/10 text-pink-300 border-pink-500/30'
                    }`}
                >
                  {isListeningManual ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListeningManual ? (isRtl ? 'جاري الاستماع...' : 'Listening...') : (isRtl ? 'إدخال صوتي 🎙️' : 'Voice Input 🎙️')}</span>
                </button>
              </div>

              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={isListeningManual ? (isRtl ? 'تحدث الآن، جاري تحويل صوتك إلى نص...' : 'Speak now, converting voice to text...') : t.naturalLanguagePlaceholder}
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
