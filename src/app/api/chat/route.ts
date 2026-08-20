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
      return NextResponse.json({
        success: false,
        error: aiRes.error,
        errorCode: aiRes.errorCode || 'AI_PROVIDER_ERROR',
        provider: aiRes.provider,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      provider: aiRes.provider,
      modelUsed: aiRes.modelUsed,
      latencyMs: aiRes.latencyMs,
      reply: aiRes.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat assistant error', errorCode: 'AI_PROVIDER_ERROR' }, { status: 500 });
  }
}
