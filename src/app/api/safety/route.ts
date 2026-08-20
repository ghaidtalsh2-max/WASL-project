import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { safeParseJSON } from '@/lib/ai/jsonHelper';

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

    const defaultAnalysis = {
      riskLevel: 'medium',
      riskScore: 45,
      threatType: 'Unverified Message / محتوى مشبوه',
      threatTypeAr: 'رسالة غير موثوقة',
      whyEn: ['Automated AI parsing returned unformatted output. Exercise caution with unfamiliar messages or links.'],
      whyAr: ['الرسالة تحتوي على صياغة غير رسمية أو روابط خارجية. توخى الحذر ولا تشارك بياناتك الشخصية.'],
      whatToDoEn: ['Never click unknown links', 'Do not provide credit card or password details'],
      whatToDoAr: ['لا تضغط على روابط مجهولة', 'لا تدخل بيانات بطاقتك أو كلمات المرور'],
    };

    if (aiRes.error) {
      return NextResponse.json({
        success: false,
        error: aiRes.error,
        analysis: defaultAnalysis,
      });
    }

    const parsed = safeParseJSON(aiRes.content);
    if (!parsed) {
      return NextResponse.json({ success: true, analysis: defaultAnalysis });
    }

    return NextResponse.json({ success: true, analysis: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Safety analysis failed' }, { status: 500 });
  }
}
