import { isMockMode, getMockDelay } from './config';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'medgemma:4b';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export async function callOllama(prompt: string, images?: string[]): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      images,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data: OllamaResponse = await response.json();
  return data.response;
}

export async function generateWithOllama(params: {
  systemPrompt: string;
  userPrompt: string;
  imageBase64?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const { systemPrompt, userPrompt, imageBase64, temperature = 0.7, maxTokens = 1024 } = params;

  let fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  let images: string[] | undefined;

  if (imageBase64) {
    images = [imageBase64];
  }

  return callOllama(fullPrompt, images);
}

export function isOllamaConfigured(): boolean {
  return !!process.env.OLLAMA_BASE_URL;
}

export function shouldUseOllama(): boolean {
  return isOllamaConfigured() && !process.env.ANTHROPIC_API_KEY;
}

export async function generateSkinAnalysisWithOllama(imageBase64: string, bodyArea: string): Promise<{
  hydration: number;
  pigmentation: number;
  texture: number;
  oilBalance: number;
  irritation: number;
  analysisNotes: string;
}> {
  const prompt = `You are a dermatology AI assistant. Analyze this skin image of the ${bodyArea} and provide a JSON response with the following structure:
{
  "hydration": 0.0-1.0,
  "pigmentation": 0.0-1.0,
  "texture": 0.0-1.0,
  "oilBalance": 0.0-1.0,
  "irritation": 0.0-1.0,
  "analysisNotes": "brief clinical observations"
}

Only respond with valid JSON.`;

  const response = await generateWithOllama({
    systemPrompt: 'You are a board-certified dermatologist analyzing skin images.',
    userPrompt: prompt,
    imageBase64,
  });

  try {
    return JSON.parse(response);
  } catch {
    return {
      hydration: 0.7,
      pigmentation: 0.7,
      texture: 0.6,
      oilBalance: 0.7,
      irritation: 0.1,
      analysisNotes: response.substring(0, 200),
    };
  }
}

export async function generateTextWithOllama(systemPrompt: string, userPrompt: string): Promise<string> {
  return generateWithOllama({ systemPrompt, userPrompt });
}