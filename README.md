# WASL — وصل
### AI-Powered Cultural Travel & Relocation Companion
**One world. Many cultures. One connection.**  
**عالم واحد. ثقافات متعددة. اتصال واحد.**

---

## 1. What is WASL (وصل)?
**WASL (وصل)** is an intelligent global travel and relocation companion designed to help travelers, international students, and expats understand not just *where* they are going, but *how to live, communicate, behave, stay safe, and navigate* their destination with deep cultural nuance.

Instead of a generic chatbot or static tourism brochure, WASL delivers an interactive, visual journey transition with dynamic destination theming, 3D WebGL Earth navigation, verified government resources, and provider-agnostic AI intelligence.

---

## 2. Key Features

- 🌌 **Cinematic 3D Glowing Earth Globe**: Interactive WebGL globe showing origin-to-destination flight trajectories, city lights, and atmospheric aura.
- 🎨 **Dynamic Destination Atmosphere**: The website dynamically changes its color palette, gradients, and particle physics (e.g., Sakura blossoms for Japan, desert gold for Saudi Arabia, Anatolian terracotta for Turkey) based on the destination.
- 🧭 **Structured & Natural Language Journey Setup**: Guided form or natural language prompt (e.g. *"I'm a Saudi CS student moving to Tokyo for 1 year"*) with AI entity extraction and adaptive follow-up questions.
- 🧳 **6-Stage Interactive Timeline**:
  1. `01 Before You Go`
  2. `02 Documents`
  3. `03 Departure`
  4. `04 First Days`
  5. `05 Settling In`
  6. `06 Daily Life`
  Each stage includes checklist tasks, verified official resources (e.g., Absher, Visit Japan Web, MOFA, Immigration), and quick tips.
- 🏛️ **Culture Sense**: Respectful, non-stereotypical guidance on social etiquette, communication styles, dining customs, dress codes, and visual **DO** & **AVOID** comparisons.
- 💬 **Local Language & Audio**: Situational phrases categorized by context (Greetings, Courtesy, Dining, Transport, Emergency) with romanization, formality indicators, and **🔊 Web Speech API Voice Pronunciation**.
- 🌐 **Cultural Context Translator**: Differentiates between *literal translation* and *natural colloquial phrasing* used by locals.
- ⚖️ **Religion & Social Context**: Objective guidance distinguishing religion, culture, and individual practice, with temple/mosque/church etiquette and dietary labels (Halal/Pork/Alcohol).
- 🛡️ **Digital Safety & Anti-Scam Analyzer**: Analyzes suspicious foreign SMS, WhatsApp messages, emails, or fake payment links using AI to detect scams, rate risk (Low, Medium, High), explain red flags, and provide safe action steps.
- 🤖 **Context-Aware AI Assistant**: Non-intrusive floating companion with journey memory and structured advice.
- 🌐 **Bilingual (Arabic RTL / English LTR)** & **Accessibility** controls (Font size scaling A-/A/A+, Light/Dark mode).

---

## 3. Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + CSS Variables (dynamic destination theme engine)
- **3D Graphics**: Three.js (WebGL Earth with glowing shaders & flight curves)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti + Web Speech Synthesis API
- **AI Abstraction**: Provider-agnostic server-side adapter supporting **Google Gemini**, **OpenAI**, and **Anthropic**

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18.17+ (or Node 20+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd wasl_lastv

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Environment Variables Configuration

Create a `.env.local` file with the following variables:

```env
# AI Provider (gemini | openai | anthropic)
LLM_PROVIDER=gemini
LLM_API_KEY=your_gemini_api_key_here

# Google Places API (Optional - verified dataset fallback included)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Search API (Optional)
SEARCH_API_KEY=

# Public Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!NOTE]
> You can also test and configure custom API keys directly in the app session via the **Settings (⚙️)** modal.

---

## 6. Supported AI Providers

1. **Google Gemini (Default)**
   - Provider: `gemini`
   - Model: `gemini-1.5-flash`
   - API Key: Get from [Google AI Studio](https://aistudio.google.com/)
2. **OpenAI**
   - Provider: `openai`
   - Model: `gpt-4o-mini`
   - API Key: Get from [OpenAI Platform](https://platform.openai.com/)
3. **Anthropic**
   - Provider: `anthropic`
   - Model: `claude-3-5-sonnet-20241022`
   - API Key: Get from [Anthropic Console](https://console.anthropic.com/)

---

## 7. Public Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `LLM_PROVIDER` = `gemini`
   - `LLM_API_KEY` = your API key
   - `GOOGLE_PLACES_API_KEY` = your Places key (optional)
5. Click **Deploy**. Your live URL will be ready at `https://wasl-xxxxx.vercel.app`.

---

## 8. Responsible AI & Security Considerations

- **No Hardcoded Keys**: API keys are never bundled in frontend code or visible in client HTML.
- **Data Privacy**: Messages pasted into the Digital Safety analyzer are processed strictly as data, never executed as instructions.
- **Objective Guidance**: The application avoids stereotypes, treats culture and religion with neutral respect, and provides direct links to verified government portals for legal or visa requirements.

---

© 2026 WASL — وصل. All rights reserved.
