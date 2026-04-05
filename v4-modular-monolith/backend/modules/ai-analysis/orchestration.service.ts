export class OrchestrationService {
  async analyze(_params: any): Promise<any> {
    return {
      data: {
        vision: {
          hydration: 0, pigmentation: 0, texture: 0, oilBalance: 0,
          irritation: 0, acneCount: 0, analysisNotes: "",
          confidenceScores: { hydration: 0, pigmentation: 0, texture: 0, oilBalance: 0, irritation: 0 },
        },
        intelligence: { archetype: "", vulnerabilities: [], skinScore: 0 },
        interpretation: { archetype: "", summary: "", main: "", insights: [], regions: {} },
        routine: { morning: [], evening: [] },
        nutrition: { foods: [], avoid: [] },
        glow: { score: 0, tips: [] },
        age: { estimatedAge: 0, confidence: 0 },
        recommendations: { recommendations: [], routine_note: "" },
        comparison: { changes: [] },
      },
      quality: {
        faceHash: null, lightingScore: null, sharpnessScore: null,
        tiltAngle: null, faceCoverage: null,
      },
      error: null,
    };
  }
}
