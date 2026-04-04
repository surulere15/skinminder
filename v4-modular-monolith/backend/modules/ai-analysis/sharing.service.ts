/**
 * Growth Sharing Service
 * 
 * Generates metadata and image payloads for social sharing.
 */

import { ArchetypeTraits } from './archetypes.service';

export function generateSharePayload(archetype: ArchetypeTraits, scanId: string) {
    return {
        title: `I am a ${archetype.label}`,
        description: archetype.description,
        url: `https://skinminder.ai/reports/${scanId}`,
        imageOptions: {
            theme: "cinematic-dark",
            highlightMetric: archetype.label === "PIH Prone" ? "Pigment Sensitivity" : "Hydration Level"
        },
        socialMeta: {
            hashtag: "#SkinIntelligence",
            tagline: "Unlocking my biological blueprint with SkinMinder AI."
        }
    };
}
