import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang, destination, apiKey, provider } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required for translation' }, { status: 400 });
    }

    const prompt = `Translate this text for a traveler in/going to ${destination || 'destination'}.\nSource Language: ${sourceLang || 'Auto'}\nTarget Language: ${targetLang || 'Local'}\nText to translate: "${text}"\nProvide literal vs natural local phrasing and cultural context in JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.translation,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.2,
    });

    if (aiRes.error) {
      return NextResponse.json({
        success: false,
        error: aiRes.error,
        translation: {
          literal: text,
          natural: text,
          contextEn: 'AI connection unavailable. Please check your API key in Settings.',
          contextAr: 'خدمة الترجمة الذكية غير متوفرة حالياً. يرجى التحقق من المفتاح في الإعدادات.',
        },
      });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      return NextResponse.json({ success: true, translation: parsed });
    } catch {
      return NextResponse.json({ error: 'Invalid response from translator' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 });
  }
}
