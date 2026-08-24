/**
 * WASL (وصل) - Centralized About & Brand Content Configuration
 * 
 * All editable introduction text, philosophy, color identity explanations,
 * and creator/team profiles are maintained in this single file.
 */

export interface CreatorProfile {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  linkedinUrl: string;
}

export interface AboutWaslContent {
  projectName: string;
  projectTaglineEn: string;
  projectTaglineAr: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  nameMeaningEn: string;
  nameMeaningAr: string;
  cosmicThemeMeaningEn: string;
  cosmicThemeMeaningAr: string;
  colorMeanings: {
    navyEn: string;
    navyAr: string;
    pinkPurpleEn: string;
    pinkPurpleAr: string;
  };
  creators: CreatorProfile[];
}

export const ABOUT_WASL: AboutWaslContent = {
  projectName: 'WASL (وصل)',
  projectTaglineEn: 'One world. Many cultures. One connection.',
  projectTaglineAr: 'عالم واحد. ثقافات متعددة. اتصال واحد.',

  shortDescriptionEn:
    'WASL is an AI-powered cultural travel and relocation companion that understands your natural journey, extracts key context, and prepares you with practical knowledge, living language, and real services before and throughout your travels.',
  shortDescriptionAr:
    'وَصل هو رفيق السفر والاستقرار الثقافي المدعوم بالذكاء الاصطناعي، يفهم رحلتك بلغتك الطبيعية، ويستخلص احتياجاتك ليصمم لك مساراً متكاملاً يجمع بين الإجراءات العملية، اللغة الحية، والسياق الثقافي الحقيقي.',

  nameMeaningEn:
    'The name "WASL" (وصل) signifies connection — linking travelers with authentic destinations, official services, real-time knowledge, and cultural understanding across the globe.',
  nameMeaningAr:
    'سُمّي المشروع "وَصل" ليعبّر عن جوهر الاتصال — ربط الإنسان بالأماكن، والمعلومات بالخدمات الرسمية، والمسافر بالثقافة واللغة ومجتمع الوجهة.',

  cosmicThemeMeaningEn:
    'Our visual identity is inspired by the cosmos and space, reflecting how humanity connects across one shared globe beneath the stars.',
  cosmicThemeMeaningAr:
    'استُوحيَت الهوية البصرية من الفضاء والأجرام الكونية لترمز إلى ترابط البشر في عالم واحد مشترك تحت سماء لا حدود لها.',

  colorMeanings: {
    navyEn: 'Deep Navy represents the depth of space, institutional trust, stability, and advanced intelligence.',
    navyAr: 'الكحلي العميق يرمز إلى فضاء الكون، والثقة، والاستقرار، والذكاء التقني الرصين.',
    pinkPurpleEn: 'Rose Pink & Purple represent human connection, cultural diversity, empathy, and warmth.',
    pinkPurpleAr: 'الوردي والبنفسجي يمثلان الدفء الإنساني، والتواصل الثقافي، والتنوع الحضاري النابض.',
  },

  creators: [
    {
      name: 'Ghaidaa Alshareef',
      nameAr: 'غيداء الشريف',
      role: 'Computer Science',
      roleAr: 'علوم حاسب',
      linkedinUrl: 'https://www.linkedin.com/in/ghaidaa-alshareef-83741940a',
    },
    {
      name: 'Taleen Alqahtani',
      nameAr: 'تالين القحطاني',
      role: 'Information Technology',
      roleAr: 'تقنية معلومات',
      linkedinUrl: 'https://www.linkedin.com/in/taleen-alqhatani-220205358',
    },
  ],
};
