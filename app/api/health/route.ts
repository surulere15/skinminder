import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime?.() || 0,
    region: process.env.VERCEL_REGION || "local",
  };

  const services = {
    api: "operational",
    database: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    ai: process.env.ANTHROPIC_API_KEY ? "configured" : "missing",
    storage: process.env.CLOUDINARY_URL ? "configured" : "missing",
  };

  const criticalMissing = [];
  if (!process.env.ANTHROPIC_API_KEY) criticalMissing.push("ANTHROPIC_API_KEY");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) criticalMissing.push("SUPABASE_URL");

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
