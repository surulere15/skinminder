import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateClimateAdvice } from "@/services/ai/climate-advice";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

const MOCK_CLIMATES = [
  { temp: "85°F", humidity: "88%", uvIndex: 8, description: "Hot & Humid", location: "Miami" },
  { temp: "32°F", humidity: "20%", uvIndex: 2, description: "Dry Cold", location: "Chicago" },
  { temp: "72°F", humidity: "45%", uvIndex: 6, description: "Mild & Breezy", location: "Los Angeles" },
  { temp: "95°F", humidity: "15%", uvIndex: 10, description: "Arid Heat", location: "Phoenix" }
];

async function handleClimate() {
  const rateLimitResponse = await apiRateLimit(new Request('http://localhost'));
  if (rateLimitResponse) return rateLimitResponse;

  let skinDna = {
     skinType: "Normal",
     sensitivityLevel: "Moderate",
     notes: "No DNA mapped."
  };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("skin_dna")
        .eq("id", user.id)
        .single();

      if (profile?.skin_dna) {
        skinDna = profile.skin_dna;
      }
    }
  } catch (authError) {
    console.warn("Supabase auth skipped in Climate API:", authError);
  }

  const today = new Date().getDay();
  const weatherData = MOCK_CLIMATES[today % MOCK_CLIMATES.length];
  const advice = await generateClimateAdvice(weatherData, skinDna);

  return NextResponse.json({
     weather: weatherData,
     advice: advice
  });
}

export const GET = errorBoundary(handleClimate);
