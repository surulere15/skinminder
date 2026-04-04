import { shouldUseOllama } from './ollama-client';

export type AIModel = 'anthropic' | 'ollama';

export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  imageBase64?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIVisionRequest extends AIRequest {
  bodyArea: string;
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

async function callAnthropic(request: AIRequest): Promise<string> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const anthropic = new Anthropic({ apiKey: anthropicApiKey });

  const messages: any[] = [{ role: 'user', content: request.userPrompt }];
  
  if (request.imageBase64) {
    messages[0].content = [
      { type: 'text', text: request.userPrompt },
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: request.imageBase64 } }
    ];
  }

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: request.maxTokens || 1024,
    system: request.systemPrompt,
    messages,
    temperature: request.temperature,
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}

async function callOllamaInternal(request: AIRequest): Promise<string> {
  const { generateTextWithOllama } = await import('./ollama-client');
  return generateTextWithOllama(request.systemPrompt, request.userPrompt);
}

export async function generateAI(request: AIRequest): Promise<string> {
  if (shouldUseOllama()) {
    return callOllamaInternal(request);
  }
  return callAnthropic(request);
}

export function getCurrentModel(): AIModel {
  return shouldUseOllama() ? 'ollama' : 'anthropic';
}

export function isAIConfigured(): boolean {
  return !!anthropicApiKey || shouldUseOllama();
}