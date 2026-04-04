export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  skin_type: string | null;
  concerns: string[];
  created_at: string;
  updated_at: string;
}

export interface SkinScan {
  id: string;
  user_id: string;
  image_url: string;
  hydration_score: number;
  texture_score: number;
  pigment_score: number;
  pore_score: number;
  sensitivity_score: number;
  firmness_score: number;
  overall_score: number;
  archetype: string | null;
  vulnerabilities: string[];
  created_at: string;
  metadata: Record<string, any>;
}

export interface Routine {
  id: string;
  user_id: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  version: number;
  is_active: boolean;
  created_at: string;
  climate_adjusted: boolean;
}

export interface RoutineStep {
  order: number;
  product_id: string | null;
  product_name: string;
  step_type: string;
  instructions: string;
  duration_seconds: number;
}

export interface SkinDna {
  id: string;
  user_id: string;
  archetype: string;
  vulnerabilities: string[];
  hydration_trend: number[];
  texture_trend: number[];
  pigment_trend: number[];
  generated_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  ingredients: string[];
  ai_match_score: number;
  price: number;
  currency: string;
}

export interface ShareCard {
  id: string;
  user_id: string;
  scan_id: string;
  image_url: string;
  share_count: number;
  created_at: string;
}
