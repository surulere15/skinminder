/**
 * Interpretation Layer - V2.1 (Melanin-Aware)
 * 
 * Provides deterministic, rule-based interpretation of raw computer vision metrics.
 * Ensures SkinMinder's "intelligence" is grounded in objective data before LLM narration.
 * V2.1 includes melanin-aware logic for diverse skin tones.
 */

export type SkinToneCategory = "light" | "medium" | "melanin-rich";

export interface MetricInterpretation {
    label: string;
    severity: "optimal" | "stable" | "mild" | "moderate" | "severe";
    insight: string;
    melaninNote?: string; // Additional context for melanin-rich skin
}

export interface SkinContext {
    toneCategory: SkinToneCategory;
    sensitivityLevel: "low" | "moderate" | "high";
}

export class InterpretationLayer {
    /**
     * Interprets hydration metrics
     */
    interpretHydration(score: number, skinContext?: SkinContext): MetricInterpretation {
        if (score >= 65) return { 
            label: "Healthy Hydration", 
            severity: "optimal", 
            insight: "Moisture levels are well-maintained. Barrier function is effective." 
        };
        if (score >= 45) return { 
            label: "Mild Dehydration", 
            severity: "mild", 
            insight: "Subtle moisture loss detected. May benefit from increased humectants." 
        };
        
        const melaninNote = skinContext?.toneCategory === "melanin-rich" 
            ? "Dehydration can accentuate ashy or gray tones in melanin-rich skin. Focus on humectants + occlusives."
            : undefined;
            
        return { 
            label: "Dehydration Risk", 
            severity: "moderate", 
            insight: "Significant moisture deficit. Barrier may be compromised.",
            melaninNote
        };
    }

    /**
     * Interprets pigmentation metrics with melanin-aware thresholds
     * Melanin-rich skin requires adjusted thresholds as PIH is more common
     */
    interpretPigmentation(score: number, skinContext?: SkinContext): MetricInterpretation {
        const isMelaninRich = skinContext?.toneCategory === "melanin-rich";
        
        // Adjusted thresholds for melanin-rich skin (higher tolerance for normal variation)
        const optimalThreshold = isMelaninRich ? 55 : 60;
        const mildThreshold = isMelaninRich ? 35 : 40;
        
        if (score >= optimalThreshold) return { 
            label: "Balanced Tone", 
            severity: "optimal", 
            insight: "Melanin distribution is uniform. Minimal clustering detected." 
        };
        
        if (score >= mildThreshold) {
            const melaninNote = isMelaninRich 
                ? "Even mild variation can indicate early PIH. Monitor for dark marks after breakouts."
                : undefined;
            return { 
                label: "Mild Tone Variation", 
                severity: "mild", 
                insight: "Early signs of pigmentation clustering detected.",
                melaninNote
            };
        }
        
        const melaninNote = isMelaninRich
            ? "High risk of PIH. Prioritize SPF, avoid picking, and consider vitamin C/niacinamide to accelerate fade."
            : "Visible pigment clusters or UV-induced spots detected.";
            
        return { 
            label: "Uneven Pigmentation", 
            severity: "moderate", 
            insight: "Visible pigment clusters or spots detected.",
            melaninNote
        };
    }

    /**
     * Interprets texture metrics
     */
    interpretTexture(score: number, skinContext?: SkinContext): MetricInterpretation {
        if (score >= 70) return { 
            label: "Refined Texture", 
            severity: "optimal", 
            insight: "Surface is smooth with consistent cellular turnover." 
        };
        if (score >= 50) return { 
            label: "Moderate Smoothness", 
            severity: "stable", 
            insight: "Surface is generally even with minor texture variations." 
        };
        
        // Melanin-rich skin: rough texture may indicate early keloid or raised scarring tendency
        const melaninNote = skinContext?.toneCategory === "melanin-rich"
            ? "Texture changes can be more noticeable as raised areas. Avoid aggressive physical exfoliation."
            : undefined;
            
        return { 
            label: "Rough Texture", 
            severity: "mild", 
            insight: "Surface irregularities detected. Potential for fine-line formation.",
            melaninNote
        };
    }

    /**
     * Interprets oil balance metrics
     */
    interpretOilBalance(score: number, skinContext?: SkinContext): MetricInterpretation {
        if (score < 40) {
            const melaninNote = skinContext?.toneCategory === "melanin-rich"
                ? "Dryness may show as ashy/gray patches. Heavy creams may cause bumps—focus on lightweight humectants."
                : undefined;
            return { 
                label: "Dry Skin Tendency", 
                severity: "mild", 
                insight: "Low lipid production. Prone to tightness or flaking.",
                melaninNote
            };
        }
        if (score <= 60) return { 
            label: "Balanced Skin", 
            severity: "optimal", 
            insight: "Sebum production is regulated and stable." 
        };
        return { 
            label: "Oily Tendency", 
            severity: "mild", 
            insight: "Elevated lipid production. Potential for congestion or shine." 
        };
    }

    /**
     * Interprets irritation with melanin-aware detection
     * On darker skin, inflammation often presents as darkening/purple rather than red
     */
    interpretIrritation(score: number, skinContext?: SkinContext): MetricInterpretation {
        const isMelaninRich = skinContext?.toneCategory === "melanin-rich";
        
        if (score >= 80) return {
            label: "Calm Skin",
            severity: "optimal",
            insight: "No visible irritation or inflammation markers."
        };
        
        if (score >= 50) {
            const insight = isMelaninRich
                ? "Subtle tonal changes detected—may indicate early inflammation presenting as darkening rather than redness."
                : "Mild irritation detected. May appear as slight redness or sensitivity.";
            return {
                label: "Mild Irritation",
                severity: "mild",
                insight
            };
        }
        
        const melaninNote = isMelaninRich
            ? "Active inflammation may show as dark purple/brown patches—this is normal for your skin tone. Focus on anti-inflammatory ingredients (azelaic acid, centella)."
            : "Visible irritation present.";
            
        return {
            label: "Active Irritation",
            severity: "moderate",
            insight: "Significant irritation markers detected.",
            melaninNote
        };
    }

    /**
     * Returns barrier sensitivity recommendation based on skin context
     */
    getBarrierRecommendation(skinContext?: SkinContext): string {
        if (!skinContext) return "Focus on gentle, fragrance-free products.";
        
        if (skinContext.sensitivityLevel === "high" || skinContext.toneCategory === "melanin-rich") {
            return "Prioritize ceramides, centella asiatica, and oat extract. Avoid high-strength acids and physical scrubs.";
        }
        
        if (skinContext.sensitivityLevel === "moderate") {
            return "Balance gentle exfoliation with barrier support. Niacinamide and peptides work well.";
        }
        
        return "Your barrier is resilient. You can tolerate most active ingredients but still prioritize SPF.";
    }

    /**
     * Helper to get severity label from a score
     */
    getSeverityFromScore(score: number): "optimal" | "mild" | "moderate" {
        if (score >= 65) return "optimal";
        if (score >= 45) return "mild";
        return "moderate";
    }
}
