export interface ScanQualityThresholds {
  minLighting: number;
  maxShadowGradient: number;
  minSharpness: number;
  maxTilt: number;
  minCoverage: number;
  maxOcclusion: number;
  maxBackgroundEntropy: number;
}

export interface QualityScore {
  overall: number;
  lighting: number;
  sharpness: number;
  angle: number;
  coverage: number;
  occlusion: number;
  background: number;
}

export function calculateOverallQuality(scores: QualityScore): number {
  const weights = {
    lighting: 0.25,
    sharpness: 0.30,
    angle: 0.15,
    coverage: 0.20,
    occlusion: 0.05,
    background: 0.05,
  };

  const weightedSum = 
    scores.lighting * weights.lighting +
    scores.sharpness * weights.sharpness +
    scores.angle * weights.angle +
    scores.coverage * weights.coverage +
    scores.occlusion * weights.occlusion +
    scores.background * weights.background;

  return Math.round(weightedSum * 100);
}

export function getQualityLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Acceptable";
  if (score >= 30) return "Poor";
  return "Reject";
}

export function getQualityRecommendation(score: number): string {
  if (score >= 85) return "Perfect scan. Analysis will be highly accurate.";
  if (score >= 70) return "Good scan. Analysis will be reliable.";
  if (score >= 50) return "Acceptable scan. Some variance expected in results.";
  if (score >= 30) return "Low quality. Results may be less accurate. Try again?";
  return "Scan rejected. Please follow the tips and try again.";
}

export interface QualityFeedback {
  issue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export function getQualityFeedback(scores: QualityScore): QualityFeedback[] {
  const feedback: QualityFeedback[] = [];

  if (scores.lighting < 0.5) {
    feedback.push({
      issue: "Lighting too dim or uneven",
      suggestion: "Move to a well-lit area with natural light. Avoid backlighting.",
      priority: "high",
    });
  }

  if (scores.sharpness < 0.3) {
    feedback.push({
      issue: "Image is blurry",
      suggestion: "Hold your phone steady and ensure the camera is focused on your face.",
      priority: "high",
    });
  }

  if (scores.angle > 15) {
    feedback.push({
      issue: "Face is tilted",
      suggestion: "Position your face straight, looking directly at the camera.",
      priority: "high",
    });
  }

  if (scores.coverage < 0.4) {
    feedback.push({
      issue: "Face not fully visible",
      suggestion: "Move closer or adjust the frame so your face fills the capture area.",
      priority: "high",
    });
  }

  if (scores.occlusion > 0.2) {
    feedback.push({
      issue: "Face partially hidden",
      suggestion: "Ensure your face is clear - move hair away from forehead and face.",
      priority: "medium",
    });
  }

  if (scores.background > 0.4) {
    feedback.push({
      issue: "Busy background detected",
      suggestion: "Move to a simpler background, ideally a plain wall or neutral surface.",
      priority: "low",
    });
  }

  return feedback.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}