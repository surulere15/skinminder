/**
 * Skin Archetype System
 * 
 * Generates identity labels based on analysis metrics.
 * These labels are the core of the Viral Growth Engine.
 */

export type Archetype = 
    | "Barrier Sensitive"
    | "PIH Prone"
    | "Sebum Reactive"
    | "Melanin Resilient"
    | "Texture Fragile"
    | "Balanced Skin";

export interface ArchetypeTraits {
    label: Archetype;
    description: string;
    sensitivityIndex: "Low" | "Moderate" | "High";
    growthHook: string;
}

export function determineArchetype(metrics: {
    pigmentation: number;
    hydration: number;
    oiliness: number;
    redness: number;
    texture: number;
}): ArchetypeTraits {
    const { pigmentation, hydration, oiliness, redness, texture } = metrics;

    // 1. Barrier Sensitive (Dehydration + Redness)
    if (hydration < 50 && redness > 20) {
        return {
            label: "Barrier Sensitive",
            description: "Skin barrier is struggling with both moisture retention and reactivity.",
            sensitivityIndex: "High",
            growthHook: "Focus on ceramides and soothing actives to restore stability."
        };
    }

    // 2. PIH Prone (Pigmentation clustering risk)
    if (pigmentation < 45) {
        return {
            label: "PIH Prone",
            description: "High sensitivity to melanin-triggering events (UV, acne, friction).",
            sensitivityIndex: "Moderate",
            growthHook: "Your skin responds rapidly to sun; daily SPF is your #1 data-protector."
        };
    }

    // 3. Sebum Reactive (High oil balance)
    if (oiliness > 65) {
        return {
            label: "Sebum Reactive",
            description: "Naturally high lipid production with potential for congestion.",
            sensitivityIndex: "Low",
            growthHook: "Niacinamide is your core stabilizer for lipid regulation."
        };
    }

    // 4. Melanin Resilient (High tone stability)
    if (pigmentation > 75) {
        return {
            label: "Melanin Resilient",
            description: "Robust tone stability with naturally strong melanocyte regulation.",
            sensitivityIndex: "Low",
            growthHook: "Excellent candidate for proactive antioxidant routines."
        };
    }

    // 5. Texture Fragile (Rough texture patterns)
    if (texture < 55) {
        return {
            label: "Texture Fragile",
            description: "Surface patterns show potential for fine-line formation or dullness.",
            sensitivityIndex: "Moderate",
            growthHook: "Gentle PHA exfoliation will likely yield high-impact results."
        };
    }

    // 6. Balanced Skin
    return {
        label: "Balanced Skin",
        description: "Metrics reflect high stability across hydration, oil, and tone.",
        sensitivityIndex: "Low",
        growthHook: "Focus on preventative maintenance to sustain your current high scores."
    };
}
