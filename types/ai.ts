// =============================================================================
// SkinMinder AI Types
// All interfaces used by the AI prompt templates and service layer.
// =============================================================================

/** Individual metric scores returned by the vision analysis model. */
export interface SkinMetricScores {
  hydration: number;       // 0-1
  pigmentation: number;    // 0-1
  texture: number;         // 0-1
  oilBalance: number;      // 0-1
  irritation: number;      // 0-1
  elasticity: number;      // 0-1
  acneTendency: number;    // 0-1
  bodyArea: string;
  analysisNotes?: string;
}

/** High-level scan result produced by the intelligence service. */
export interface SkinScanResult {
  skinScore: number;             // 0-100
  estimatedSkinAge: number;
  primaryConcerns: string[];
  summary: string;
}

/** Detailed skin vitality / age estimate. */
export interface SkinAgeEstimate {
  estimatedAge: number;
  confidence: 'low' | 'medium' | 'high';
  contributingFactors: string[];
  personalizedInsight: string;
}

/** A single step in a skincare routine. */
export interface RoutineStep {
  stepNumber: number;
  productType: string;
  action: string;
  durationMinutes: number;
  notes: string;
}

/** Full routine plan with morning, evening, and weekly cadences. */
export interface RoutinePlan {
  morningSteps: RoutineStep[];
  nightSteps: RoutineStep[];
  weeklySteps: RoutineStep[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes: string;
}

/** Per-ingredient breakdown returned by the ingredient analysis service. */
export interface IngredientDetail {
  name: string;
  function: string;
  benefits: string[];
  irritantRisk: 'low' | 'medium' | 'high';
  comedogenicRating: number;       // 0-5
  suitableSkinTypes: string[];
}

/** Full ingredient analysis result. */
export interface IngredientAnalysisResult {
  ingredients: IngredientDetail[];
  overallCompatibilityScore: number; // 0-100
  warnings: string[];
  recommendations: string[];
}

/** A food / herb / supplement item. */
export interface NutritionItem {
  name: string;
  benefit: string;
  usage: string;
}

/** Supplement with dosage info. */
export interface SupplementItem {
  name: string;
  benefit: string;
  dosageSuggestion: string;
}

/** Full nutrition support plan. */
export interface NutritionSupportPlan {
  foods: NutritionItem[];
  fruits: NutritionItem[];
  herbs: NutritionItem[];
  supplements: SupplementItem[];
  hydrationTips: string[];
  lifestyleTips: string[];
}

/** A single product recommendation. */
export interface ProductRecommendation {
  productName: string;
  brand: string;
  matchScore: number;  // 0-100
  reasons: string[];
  category: string;
  priceRange?: string;
}

/** Response from the beauty consultant chat. */
export interface BeautyConsultantResponse {
  reply: string;
  suggestedFollowUps: string[];
  referencedTopics: string[];
}

/** Skin Twin longitudinal profile. */
export interface SkinTwinProfile {
  userId: string;
  scanCount: number;
  averageScores: Partial<SkinMetricScores>;
  trends: SkinTrend[];
  skinType: string;
  predictiveInsights: string[];
  lastUpdated: string;
}

/** A single metric trend over time. */
export interface SkinTrend {
  metric: string;
  direction: 'improving' | 'stable' | 'declining';
  changePercent: number;
  period: string;
}

/** Projected scores for glow simulation. */
export interface GlowProjection {
  weekNumber: number;
  projectedScores: Partial<SkinMetricScores>;
  skinScore: number;
}

/** Full glow simulation result. */
export interface GlowSimulation {
  projections: GlowProjection[];
  routineSummary: string;
  improvementNarrative: string;
  disclaimer: string;
}

/** Full scan report returned by the orchestrator. */
export interface FullScanReport {
  scanId: string;
  userId: string;
  timestamp: string;
  bodyArea: string;
  metrics: SkinMetricScores;
  intelligence: SkinScanResult;
  skinAge: SkinAgeEstimate;
  routine: RoutinePlan;
  nutrition: NutritionSupportPlan;
  products: ProductRecommendation[];
  glowSimulation: GlowSimulation;
  skinTwinProfile: SkinTwinProfile;
}
