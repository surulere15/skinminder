import { z } from 'zod';

// =============================================================================
// AI Inference Schemas - V2.0 (Hardened)
// =============================================================================

export const climateAdviceSchema = z.object({
  condition: z.string(),
  adviceText: z.string(),
  warningLevel: z.enum(["none", "low", "medium", "high"]),
  routineAdjustments: z.array(z.string())
});

export const ingredientAnalysisSchema = z.object({
  status: z.enum(["success", "error"]),
  compatibilityScore: z.number().min(0).max(100),
  summary: z.string(),
  ingredients: z.array(z.object({
    name: z.string(),
    verdict: z.enum(["beneficial", "neutral", "caution", "avoid"]),
    reason: z.string()
  }))
});

// =============================================================================
// Skin Intelligence Prompt - V2.0 (Audit Hardened)
// Interprets structured reasoning into a professional, clinician-grade result.
// =============================================================================

export const SKIN_INTELLIGENCE_SYSTEM_PROMPT = `You are a Senior Cosmetic Intelligence Analyst for SkinMinder. 
Your role is to ACT AS A NARRATOR AND EDUCATOR for the structured measurement data provided.

STRICT MEDICAL GUARDRAILS (NON-NEGOTIABLE):
1. NEVER use diagnostic language. (e.g., Avoid "You have...", "You suffer from...", "We diagnosed...").
2. ALWAYS Use associative language. (e.g., "This pattern is commonly associated with...", "Your scan suggests...", "We observe characteristics of...").
3. DO NOT prescribe medication or medical treatments. Focus on cosmetic wellness, barrier support, and topical ingredients.
4. CLAIM NO MEDICAL AUTHORITY. Explicitly frame results as AI-assisted cosmetic analysis.

NARRATION GUIDELINES:
- PRIORITY: The "Interpretation Layer" and "Climate Data" in the input are deterministic truths. Your job is to explain WHY they matter.
- REGIONALITY: Address specific facial regions if provided (forehead, cheeks, etc.).
- SEVERITY: Respect the severity tiers (mild, moderate, severe) produced by the rule engine.
- TONE: Professional, precise, and empowering.

JSON OUTPUT STRUCTURE:
{
  "skinScore": 0-100,
  "estimatedSkinAge": integer,
  "actualAgeDelta": integer (AI Age - Actual Age),
  "skinTwinPercentage": integer (1-10%),
  "confidenceScore": "High" | "Medium" | "Low",
  "primaryConcerns": string[],
  "summary": " CLINICIAN-LEVEL NARRATIVE: explain local patterns and environmental impact.",
  "regionalInsights": {
    "forehead": "...",
    "cheeks": "...",
    "periorbital": "..."
  }
}
`;

/**
 * Builds the user prompt with structured reasoning from Layer 2.
 */
export function buildSkinIntelligenceUserPrompt(
  visionData: any,
  userProfile: any,
  interpretation: any
): string {
  return `You are analyzing a skin scan for a user based on the following input:

USER PROFILE:
- Age: ${userProfile?.age || 'Not provided'}
- Skin Type: ${userProfile?.skin_type || 'Unknown'}
- Concerns: ${userProfile?.concerns?.join(', ') || 'General wellness'}

DETERMINISTIC REASONING (MEASUREMENT + INTERPRETATION):
${JSON.stringify(interpretation, null, 2)}

VISION RAW DATA:
${JSON.stringify(visionData, null, 2)}

INSTRUCTIONS:
1. Explain the "Climate Context" and how it affects their "Archetype".
2. Use the "Severity" tiers to provide a precise narrative.
3. Calculate "actualAgeDelta" using Actual Age: ${userProfile?.age || 25}.
4. Provide regional insights if mapping data is present.
`;
}
