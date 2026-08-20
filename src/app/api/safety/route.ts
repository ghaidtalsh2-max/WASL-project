import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, destination, apiKey, provider } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required for safety analysis' }, { status: 400 });
    }

    const prompt = `Context: Traveler currently in/going to ${destination || 'foreign country'}.\nSuspicious Message Data:\n"""\n${message}\n"""\nAnalyze this message for scams, phishing, urgency manipulation, or malicious links in strict JSON.`;

    const aiRes = await callAI({
      systemPrompt: AI_SYSTEM_PROMPTS.digitalSafety,
      prompt,
      jsonMode: true,
      apiKey,
      provider,
      temperature: 0.1,
    });

    if (aiRes.error) {
      return NextResponse.json({
        success: false,
        error: aiRes.error,
        analysis: {
          riskLevel: 'medium',
          riskScore: 50,
          threatType: 'Verification Unavailable',
          threatTypeAr: 'تعذر التحقق الآلي',
          whyEn: ['AI service is currently unavailable. Please verify manually or configure your API key.'],
          whyAr: ['خدمة الذكاء الاصطناعي غير متصلة حالياً. يرجى التحقق اليدوي أو ضبط مفتاح API في الإعدادات.'],
          whatToDoEn: ['Never click unknown links', 'Do not provide credit card or password details'],
          whatToDoAr: ['لا تضغط على روابط مجهولة', 'لا تدخل بيانات بطاقتك أو كلمات المرور'],
        },
      });
    }

    try {
      const parsed = JSON.parse(aiRes.content);
      return NextResponse.json({ success: true, analysis: parsed });
    } catch {
      return NextResponse.json({ error: 'Failed to parse safety analysis' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Safety analysis failed' }, { status: 500 });
  }
}
