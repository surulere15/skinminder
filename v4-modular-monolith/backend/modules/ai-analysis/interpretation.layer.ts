/**
 * Interpretation Layer - V2.0
 * 
 * Provides deterministic, rule-based interpretation of raw computer vision metrics.
 * Ensures SkinMinder's "intelligence" is grounded in objective data before LLM narration.
 */

export interface MetricInterpretation {
    label: string;
    severity: "optimal" | "stable" | "mild" | "moderate" | "severe";
    insight: string;
}

export class InterpretationLayer {
    /**
     * Interprets hydration metrics
     */
    interpretHydration(score: number): MetricInterpretation {
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
        return { 
            label: "Dehydration Risk", 
            severity: "moderate", 
            insight: "Significant moisture deficit. Barrier may be compromised." 
        };
    }

    /**
     * Interprets pigmentation metrics
     */
    interpretPigmentation(score: number): MetricInterpretation {
        if (score >= 60) return { 
            label: "Balanced Tone", 
            severity: "optimal", 
            insight: "Melanin distribution is uniform. Minimal clustering detected." 
        };
        if (score >= 40) return { 
            label: "Mild Tone Variation", 
            severity: "mild", 
            insight: "Early signs of pigmentation clustering detected." 
        };
        return { 
            label: "Uneven Pigmentation", 
            severity: "moderate", 
            insight: "Visible pigment clusters or UV-induced spots detected." 
        };
    }

    /**
     * Interprets texture metrics
     */
    interpretTexture(score: number): MetricInterpretation {
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
        return { 
            label: "Rough Texture", 
            severity: "mild", 
            insight: "Surface irregularities detected. Potential for fine-line formation." 
        };
    }

    /**
     * Interprets oil balance metrics
     */
    interpretOilBalance(score: number): MetricInterpretation {
        if (score < 40) return { 
            label: "Dry Skin Tendency", 
            severity: "mild", 
            insight: "Low lipid production. Prone to tightness or flaking." 
        };
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
     * Helper to get severity label from a score
     */
    getSeverityFromScore(score: number): any {
        if (score >= 65) return "optimal";
        if (score >= 45) return "mild";
        return "moderate";
    }
}
