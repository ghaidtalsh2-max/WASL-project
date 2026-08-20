
# WASL — وصل

**An AI-powered cultural travel and relocation companion that helps people understand where they are going, communicate, navigate daily life, and stay safe.**

> **One world. Many cultures. One connection.**

## 🌍 About WASL

Traditional travel apps help people find places, hotels, transportation, and attractions. WASL focuses on what happens around those decisions: understanding a destination and adapting to daily life there.

WASL brings together artificial intelligence, cultural intelligence, local-language guidance, real-world place data, digital-safety awareness, and personalized travel or relocation guidance in one journey.

## ✨ Key Features

- **AI-powered journey setup** through a guided form or natural-language description.
- **Personalized journey planning** with destination, city, accommodation area, purpose, duration, and traveler needs.
- **Interactive journey transition** with a 3D globe and destination-to-destination visualization.
- **Dynamic destination themes** that adapt the visual experience to the selected destination.
- **Journey dashboard** with a six-stage timeline from preparation through daily life.
- **Culture Sense** for etiquette, communication, dining, dress, and practical do/avoid guidance.
- **Local Language** phrases with translation context, romanization, formality, and browser speech pronunciation.
- **Cultural Context Translator** for literal and natural phrasing.
- **Religion & Context** guidance that separates religion, culture, and individual practice, including dietary and worship context.
- **Discover** search for restaurants, hotels, attractions, shopping, healthcare, transport, and worship centers.
- **Digital Safety** analysis for suspicious messages and links, with risk levels, warning signs, and safer next steps.
- **AI Assistant** with journey-aware conversational guidance.
- **Arabic and English support**, including RTL/LTR layout, light/dark mode, and font-size controls.

## 🧠 AI + Cybersecurity

WASL combines AI with cybersecurity awareness through its **Digital Safety** feature.

Users can submit suspicious SMS messages, emails, WhatsApp messages, social media messages, or website text. The AI looks for potential signals such as phishing, social engineering, impersonation, urgency manipulation, suspicious links, and credential or payment requests.

The feature returns a risk level, explains why the message may be suspicious, and recommends safer actions. It provides informational guidance and does not guarantee scam detection.

> **AI + Cybersecurity + User Awareness**

User-submitted messages are passed to the safety analysis as data. They are not treated as instructions to execute.

## 🗺️ How WASL Works

1. **Start Your Journey** from the landing experience.
2. **Describe the journey naturally** or use guided setup.
3. **Review extracted details**, including origin, destination, city, purpose, duration, and needs.
4. **Confirm the journey** and continue through the globe transition.
5. **Enter a destination-specific experience** with a dynamic visual theme.
6. **Use the personalized dashboard** and its six-stage journey timeline.
7. **Explore Culture, Language, Discover, Religion & Context, and Digital Safety.**
8. **Open the AI Assistant** whenever additional journey-aware guidance is needed.

## 🛠️ Technology Stack

- **Next.js 16** with the App Router
- **React 19** and **TypeScript**
- **Tailwind CSS 4** with custom CSS variables and destination themes
- **Three.js** for the interactive globe experience
- **Lucide React** for interface icons
- **Canvas Confetti** and browser Web Speech Synthesis for interaction effects and pronunciation
- **Next.js server-side API routes** for AI, journey content, translation, safety analysis, and place discovery
- **AI provider adapter** supporting Google Gemini, OpenAI, Anthropic, and OpenRouter-compatible keys
- **Google Places API (New)** for live place discovery
- **Wikipedia thumbnails and curated Unsplash image pools** for place imagery and graceful visual content

## 🏗️ Architecture

```text
React / Next.js frontend
          |
          v
Next.js server-side API routes
       /        \
      v          v
AI provider   Google Places API
      \        /
       v      v
 Personalized journey response
```

AI and Google Places requests are initiated through server-side routes. API keys configured in the environment are therefore kept out of the client bundle. The settings screen also supports an optional user-supplied AI provider and key for the current browser session.

## 🔐 Security

- Store API keys in environment variables or the app's settings flow; never commit real secrets to GitHub.
- Keep `.env.local` out of version control.
- Route AI and Google Places requests through server-side API routes where applicable.
- Treat suspicious-message submissions as untrusted user data, not executable instructions.
- Do not rely on AI output as legal, medical, religious, government, or cybersecurity authority.
- Verify high-stakes travel, visa, safety, and emergency information with official sources.

## 🌐 Environment Variables

The server reads these variables when they are configured:

```env
LLM_PROVIDER=gemini
LLM_API_KEY=your_ai_provider_key
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

`LLM_PROVIDER` may be set to `gemini`, `openai`, or `anthropic`. OpenRouter-compatible keys are also detected by the server adapter. `GEMINI_MODEL` is optional; the adapter has Gemini model fallbacks when it is not set. The Google Places key is required for live place discovery.

Never include real API keys in this file or in source control.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or newer
- npm

### Installation

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

Create `.env.local` in the project root and add the environment variables described above. At minimum, configure `LLM_API_KEY` for AI features. Configure `GOOGLE_PLACES_API_KEY` to enable live Discover results.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

Useful project scripts:

```bash
npm run lint
npm run build
npm run start
```

## ☁️ Deployment

WASL can be deployed as a Next.js application on Vercel:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables in the project settings.
4. Deploy the application.
5. Open the public URL generated by Vercel.

Do not commit `.env.local` or real credentials during deployment.

## 📱 Responsive & Accessibility

The interface supports desktop, tablet, and mobile layouts, Arabic RTL and English LTR, responsive navigation, light/dark mode, and adjustable font sizes. Local-language pronunciation uses the browser's Web Speech Synthesis API when available.

## 🎯 Project Vision

WASL is designed to answer a question beyond:

> “Where should I go?”

It answers:

> **“Now that you're going there, what do you need to know to understand the place, communicate with its people, navigate daily life, and stay safe?”**

## 🏆 Project Highlights

- AI-powered personalization
- Cultural intelligence and context
- Real location data through Google Places
- Cybersecurity awareness for travelers
- Dynamic destination experiences
- Arabic and English accessibility
- A human-centered travel and relocation workflow

## ⚠️ Responsible AI

WASL aims to:

- Avoid cultural stereotypes and communicate uncertainty clearly.
- Avoid assuming a user's religion or personal practice.
- Distinguish religion from culture and individual behavior.
- Avoid fabricating places, official resources, or requirements.
- Encourage official sources for high-stakes information.
- Present AI output as guidance, not legal, medical, religious, or government authority.

## 👥 Team

- **Taleen Alqhatani**
- **Ghaidaa Alshareef**

Developed as part of an SDAIA learning/project experience with the [Saudi Data & AI Authority (SDAIA)](https://github.com/SDAIAAcademy).

## 📄 License

**License: Not specified.**
