import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/provider';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, journeyContext, conversationHistory, apiKey, provider } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextParts: string[] = [];
    if (journeyContext) {
      if (journeyContext.destination?.name) {
        contextParts.push(`- Destination: ${journeyContext.destination.name} (City: ${journeyContext.destinationCity || journeyContext.destination.capital || 'Unspecified'})`);
      }
      if (journeyContext.origin?.name) {
        contextParts.push(`- Origin: ${journeyContext.origin.name}`);
      }
      if (journeyContext.duration) {
        contextParts.push(`- Trip Duration: ${journeyContext.duration}`);
      }
      if (journeyContext.purpose) {
        contextParts.push(`- Purpose: ${journeyContext.purpose}`);
      }
      if (journeyContext.accommodationArea) {
        contextParts.push(`- Accommodation Area: ${journeyContext.accommodationArea}`);
      }
      if (journeyContext.accommodationStatus) {
        contextParts.push(`- Accommodation Status: ${journeyContext.accommodationStatus === 'booked' ? 'Already booked' : 'Looking for recommendations'}`);
      }
      if (journeyContext.interests && journeyContext.interests.length > 0) {
        contextParts.push(`- Interests & Focus: ${Array.isArray(journeyContext.interests) ? journeyContext.interests.join(', ') : journeyContext.interests}`);
      }
      if (journeyContext.dates) {
        contextParts.push(`- Travel Dates/Season: ${journeyContext.dates}`);
      }
      if (journeyContext.travelStyle) {
        contextParts.push(`- Travel Style: ${journeyContext.travelStyle}`);
      }
      if (journeyContext.additionalNeeds) {
        contextParts.push(`- Plan Context / Notes: ${journeyContext.additionalNeeds}`);
      }
    }

    const contextStr = contextParts.length > 0
      ? `Active Traveler Journey Context:\n${contextParts.join('\n')}`
      : 'General travel, cultural intelligence, and relocation companion context.';

    const systemPrompt = `${AI_SYSTEM_PROMPTS.chatAssistant}\n\n${contextStr}`;

    const prompt = message;

    const aiRes = await callAI({
      systemPrompt,
      prompt,
      apiKey,
      provider,
      temperature: 0.35,
      maxTokens: 1024,
    });

    if (aiRes.error) {
      const destName = journeyContext?.destination?.nameAr || journeyContext?.destination?.name || 'وجهتك';
      const cityName = journeyContext?.destinationCity || journeyContext?.destination?.capital || destName;
      const msgLower = (message || '').toLowerCase();

      let reply = '';
      if (msgLower.includes('سلام') || msgLower.includes('مرحبا') || msgLower.includes('أهلا') || msgLower.includes('hello') || msgLower.includes('hi')) {
        reply = `أهلاً بك! أنا مساعد وصل لمرافقتك في رحلتك إلى ${destName} (${cityName}). كيف يمكنني مساعدتك اليوم بخصوص الإجراءات، الثقافة، أو المعيشة هناك؟`;
      } else if (msgLower.includes('منزل') || msgLower.includes('زيارة') || msgLower.includes('اداب') || msgLower.includes('آداب') || msgLower.includes('etiquette')) {
        reply = `عند زيارة منزل أو مناسبة في ${destName}، من أهم الآداب:\n1. خلع الحذاء عند المدخل وارتداء النعال المخصصة للضيوف.\n2. إحضار هدية رمزية بسيطة (Omiyage / هدية ضيافة مغلفة بعناية).\n3. استخدام كلتا اليدين عند تقديم أو استلام أي شيء كدليل على الاحترام.\n4. تجنب الحديث بصوت مرتفع أو مقاطعة المضيف.`;
      } else if (msgLower.includes('تاكسي') || msgLower.includes('taxi') || msgLower.includes('طوارئ') || msgLower.includes('مواصلات')) {
        reply = `لطلب تاكسي أو مواصلات في ${destName}:\n- في اليابان والوجهات المنظمة: تجنب فتح باب التاكسي الخلفي بيدك، حيث يفتح ويغلق أوتوماتيكياً بواسطة السائق.\n- يمكنك استخدام تطبيقات مثل GO أو Uber، أو التوجه لمواقف التاكسي الرسمية أمام محطات القطار.\n- جملة مفيدة: "Sumimasen, [اسم المكان] made onegai shimasu" (لو سمحت، إلى [المكان] من فضلك).`;
      } else if (msgLower.includes('بنك') || msgLower.includes('حساب') || msgLower.includes('bank') || msgLower.includes('فلوس')) {
        reply = `لفتح حساب بنكي كوافد جديد أو طالب في ${destName}:\n1. ستحتاج إلى بطاقة الإقامة الرسمية (Residence Card) وجواز السفر.\n2. عنوان سكن مسجل ورقم هاتف محلي مسجل باسمك.\n3. بنوك مثل Japan Post Bank (Yucho) أو البنوك الرقمية تعد الأسهل للطلاب والوافدين الجدد في البداية.`;
      } else {
        reply = `بخصوص استفسارك حول ${destName}: نحرص في منصة وصل على تزويدك بأدق الإرشادات الرسمية والثقافية. يمكنك استعراض تبويبات (المسار الزمني، الحس الثقافي، والسلامة) بالأعلى، أو إدخال مفتاح Gemini API في الإعدادات (⚙️) لتفعيل الاستجابات التوليدية الحية الفورية.`;
      }

      return NextResponse.json({
        success: true,
        reply,
      });
    }

    return NextResponse.json({
      success: true,
      reply: aiRes.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat assistant error' }, { status: 500 });
  }
}
