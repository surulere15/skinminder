import { NextResponse } from "next/server";
import { shouldUseOllama, isOllamaConfigured } from "@/lib/ollama-client";

export const dynamic = 'force-dynamic';

export async function GET() {
  const isUsingOllama = shouldUseOllama();
  const ollamaConfigured = isOllamaConfigured();
  
  const checks = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime?.() || 0,
    region: process.env.VERCEL_REGION || "local",
    aiModel: isUsingOllama ? process.env.OLLAMA_MODEL || "gemma:2b" : "claude-3.5-sonnet",
  };

  const services = {
    api: "operational",
    database: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    ai: isUsingOllama 
      ? (ollamaConfigured ? "ollama-connected" : "ollama-missing")
      : (process.env.ANTHROPIC_API_KEY ? "anthropic-configured" : "anthropic-missing"),
    ollama: ollamaConfigured ? "configured" : "not-configured",
    storage: process.env.CLOUDINARY_URL ? "configured" : "missing",
  };

  const criticalMissing: string[] = [];
  if (!isUsingOllama && !process.env.ANTHROPIC_API_KEY) {
    criticalMissing.push("ANTHROPIC_API_KEY or OLLAMA_BASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    criticalMissing.push("SUPABASE_URL");
  }

  const isHealthy = criticalMissing.length === 0;

  return NextResponse.json({
    status: isHealthy ? "healthy" : "degraded",
    ...checks,
    services,
    criticalServices: criticalMissing.length > 0 ? criticalMissing : undefined,
  }, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'X-Health-Check': 'skinminder',
    },
  });
}