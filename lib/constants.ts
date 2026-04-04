export const APP_NAME = 'SkinMinder';
export const APP_TAGLINE = 'Track Your Skin Journey';
export const APP_DESCRIPTION = 'AI-powered skin tracking that shows you what\'s working. Monitor hydration, texture, and pigmentation over time.';

export const PRIMARY_PROMISE = 'Track your skin\'s progress with AI-powered scans that measure hydration, texture, and pigmentation — so you know what actually works.';

export const TARGET_AUDIENCE = {
  primary: 'Skin-focused individuals who want to understand what their skincare products and routines are actually doing',
  initialSegment: 'People who have tried multiple products but lack visibility into results',
  painPoint: 'Spending money on skincare without knowing if it\'s working',
};

export const WEDGE = {
  useCase: 'Track skin progress over time',
  outcome: 'See measurable improvement in skin metrics',
  frequency: 'Weekly scans to monitor changes',
};

export const ANALYSIS_TYPES = {
  analysis: 'Objective measurement of skin metrics (hydration, pigmentation, texture)',
  interpretation: 'AI explanation of what the metrics mean for your skin type',
  recommendation: 'Personalized routine suggestions based on your data',
  escalation: 'When to consult a dermatologist vs. when cosmetic products can help',
};

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive'] as const;
export const BODY_AREAS = ['face', 'neck', 'forehead', 'cheeks', 'chin', 'nose', 'hands', 'arms', 'legs', 'back', 'scalp', 'other'] as const;
export const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'] as const;

export const SKIN_CONCERNS = [
  'acne', 'aging', 'dark circles', 'dark spots', 'dehydration', 'dullness',
  'enlarged pores', 'fine lines', 'hyperpigmentation', 'oiliness', 'redness',
  'rosacea', 'sensitivity', 'texture', 'uneven tone', 'wrinkles',
] as const;

export const BEAUTY_GOALS = [
  'anti-aging', 'brightening', 'clear skin', 'even tone', 'firming',
  'glowing skin', 'hydration', 'minimizing pores', 'reducing redness',
  'scar healing', 'sun protection',
] as const;

export const PRODUCT_CATEGORIES = [
  'cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask',
  'exfoliant', 'eye cream', 'lip care', 'body lotion', 'oil', 'mist',
] as const;

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const DISCLAIMER_COSMETIC = 'This analysis is for cosmetic and wellness information only. It is not a medical diagnosis. Consult a dermatologist for medical skin concerns.';
export const DISCLAIMER_GLOW = 'AI simulation of possible cosmetic improvement. Individual results vary based on genetics, environment, and routine adherence.';
export const DISCLAIMER_NUTRITION = 'Nutritional suggestions are for general wellness support only and do not constitute medical or dietary advice.';
