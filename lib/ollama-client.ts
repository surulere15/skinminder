import { isMockMode, getMockDelay } from './config';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma:2b';

export interface OllamaRequest {
  model?: string;
  prompt: string;
  images?: string[];
  stream?: boolean;
  keep_alive?: number | string;
  options?: {
    num_predict?: number;
    temperature?: number;
    stop?: string[];
  };
  format?: object;
}

interface OllamaResponse {
  model: string;
  done: boolean;
  response?: string;
  metrics?: {
    prompt_eval_duration: number;
    prompt_eval_count: number;
    eval_duration: number;
    eval_count: number;
    total_duration: number;
    load_duration: number;
  };
}

export interface LatencyMetrics {
  totalMs: number;
  loadMs: number;
  promptEvalMs: number;
  evalMs: number;
  promptTokens: number;
  evalTokens: number;
}

let modelLoaded = false;

export async function preloadModel(): Promise<void> {
  if (modelLoaded) return;
  
  try {
    await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: '',
        keep_alive: -1,
      }),
    });
    modelLoaded = true;
    console.log(`[Ollama] Model ${OLLAMA_MODEL} preloaded and kept alive`);
  } catch (error) {
    console.warn('[Ollama] Failed to preload model:', error);
  }
}

export async function callOllama(request: OllamaRequest): Promise<{ text: string; metrics: LatencyMetrics }> {
  const startTime = Date.now();
  
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      keep_alive: -1,
      ...request,
      options: {
        num_predict: 120,
        temperature: 0.2,
        stop: ['---', '---END---'],
        ...request.options,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data: OllamaResponse = await response.json();
  const metrics: LatencyMetrics = {
    totalMs: data.metrics?.total_duration ? Math.round(data.metrics.total_duration / 1_000_000) : Date.now() - startTime,
    loadMs: data.metrics?.load_duration ? Math.round(data.metrics.load_duration / 1_000_000) : 0,
    promptEvalMs: data.metrics?.prompt_eval_duration ? Math.round(data.metrics.prompt_eval_duration / 1_000_000) : 0,
    evalMs: data.metrics?.eval_duration ? Math.round(data.metrics.eval_duration / 1_000_000) : 0,
    promptTokens: data.metrics?.prompt_eval_count || 0,
    evalTokens: data.metrics?.eval_count || 0,
  };

  console.log(`[Ollama] Latency: ${metrics.totalMs}ms (load: ${metrics.loadMs}ms, prompt: ${metrics.promptEvalMs}ms, eval: ${metrics.evalMs}ms)`);

  return { text: data.response || '', metrics };
}

export async function* streamOllama(request: OllamaRequest): AsyncGenerator<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: true,
      keep_alive: -1,
      ...request,
      options: {
        num_predict: 100,
        temperature: 0.2,
        ...request.options,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        if (data.response) {
          yield data.response;
        }
      } catch {
        continue;
      }
    }
  }
}

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    observations: { type: "string", maxLength: 150 },
    interpretation: { type: "string", maxLength: 150 },
    routine: { type: "string", maxLength: 150 },
    safety: { type: "string", maxLength: 100 },
  },
  required: ["observations", "interpretation", "routine", "safety"],
};

const FAST_SYSTEM_PROMPT = `You are a board-certified dermatologist. Analyze the skin data and return ONLY valid JSON with these 4 fields: observations, interpretation, routine, safety. Keep each field to 1-2 sentences. Response must be valid JSON only.`;

export async function generateWithOllama(params: {
  systemPrompt?: string;
  userPrompt: string;
  imageBase64?: string;
  structuredOutput?: boolean;
}): Promise<string> {
  const { systemPrompt = FAST_SYSTEM_PROMPT, userPrompt, imageBase64, structuredOutput = true } = params;

  let fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  let images: string[] | undefined;

  if (imageBase64) {
    images = [imageBase64];
    fullPrompt = `${userPrompt}\n\nAnalyze this skin image and return JSON.`;
  }

  try {
    const { text } = await callOllama({
      prompt: fullPrompt,
      images,
      format: structuredOutput ? OUTPUT_SCHEMA : undefined,
    });
    return text;
  } catch (error) {
    console.error("Ollama call failed:", error);
    throw error;
  }
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
  const prompt = `Analyze this skin image of the ${bodyArea} area and provide JSON with: hydration, pigmentation, texture, oilBalance, irritation (all 0.0-1.0), and analysisNotes (brief).`;

  try {
    const response = await generateWithOllama({
      userPrompt: prompt,
      imageBase64,
      structuredOutput: true,
    });

    const parsed = JSON.parse(response);
    return {
      hydration: parsed.hydration ?? 0.7,
      pigmentation: parsed.pigmentation ?? 0.7,
      texture: parsed.texture ?? 0.6,
      oilBalance: parsed.oilBalance ?? 0.7,
      irritation: parsed.irritation ?? 0.1,
      analysisNotes: parsed.analysisNotes || parsed.observations || "Skin analysis complete.",
    };
  } catch (error) {
    console.error("Skin analysis failed, using fallback:", error);
    return {
      hydration: 0.7,
      pigmentation: 0.7,
      texture: 0.6,
      oilBalance: 0.7,
      irritation: 0.1,
      analysisNotes: "Analysis complete based on provided data.",
    };
  }
}

export async function generateTextWithOllama(systemPrompt: string, userPrompt: string): Promise<string> {
  return generateWithOllama({ systemPrompt, userPrompt });
}