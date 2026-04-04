import Anthropic from '@anthropic-ai/sdk';
import { CONSULTANT_SYSTEM_PROMPT } from '@/prompts/consultant';
import { BeautyConsultantResponseSchema } from '@/schemas/consultant';
import { generateTextWithOllama, shouldUseOllama } from '@/lib/ollama-client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chatWithBeautyConsultant(messages: { role: 'user' | 'assistant', content: string }[], context?: any) {
  if (shouldUseOllama()) {
    console.log("Using Ollama (MedGemma) for consultant");
    try {
      const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = `You are a professional beauty consultant. Respond to the following conversation.\n\n${conversation}\n\nContext: ${JSON.stringify(context || {})}\n\nReturn JSON with: message, suggestedActions (array), followUpQuestions (array).`;

      const response = await generateTextWithOllama(
        CONSULTANT_SYSTEM_PROMPT,
        prompt
      );

      try {
        const parsed = JSON.parse(response);
        return {
          message: parsed.message || response,
          suggestedActions: parsed.suggestedActions || [],
          followUpQuestions: parsed.followUpQuestions || []
        };
      } catch {
        return { message: response, suggestedActions: [], followUpQuestions: [] };
      }
    } catch (error) {
      console.error("Ollama consultant failed:", error);
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock consultant response.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || "";
    return {
      message: `(Mock Mode) Hello! I see you asked: "${lastUserMessage}". Since I am running in development mode without an Anthropic API key, this is a simulated response. Once the key is provided, I will analyze your skin profile context correctly.`,
      recommendations: ["Mock Hydration Serum"],
      nextSteps: ["Apply sunscreen", "Drink water"]
    };
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: CONSULTANT_SYSTEM_PROMPT,
    messages: [
      ...messages,
      context ? { role: 'user', content: `Contextual Info: ${JSON.stringify(context)}` } : undefined
    ].filter(Boolean) as any,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return {
      message: rawJson.reply || rawJson.message || rawJson.text || content.text,
      suggestedActions: rawJson.suggestedActions || rawJson.recommendations || [],
      followUpQuestions: rawJson.suggestedFollowUps || rawJson.followUpQuestions || rawJson.suggestions || [],
      relatedConcerns: rawJson.referencedTopics || rawJson.relatedConcerns || [],
    };
  } catch (error) {
    return {
      message: content.text,
      suggestedActions: [],
      followUpQuestions: []
    };
  }
}