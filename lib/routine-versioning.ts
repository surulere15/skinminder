import { z } from "zod";

export const RoutineStepSchema = z.object({
  stepNumber: z.number(),
  productType: z.string(),
  action: z.string(),
  durationMinutes: z.number(),
  notes: z.string().optional(),
  isOptional: z.boolean().optional(),
  frequency: z.string().optional(),
});

export const RoutinePlanSchema = z.object({
  morning: z.array(RoutineStepSchema).optional(),
  night: z.array(RoutineStepSchema).optional(),
  weekly: z.array(RoutineStepSchema).optional(),
  morningSteps: z.array(RoutineStepSchema).optional(),
  nightSteps: z.array(RoutineStepSchema).optional(),
  weeklySteps: z.array(RoutineStepSchema).optional(),
  difficultyLevel: z.string().optional(),
  difficulty: z.string().optional(),
  concernFocus: z.array(z.string()).optional(),
  summary: z.string().optional(),
  notes: z.string().optional(),
  version: z.string().optional(),
  generatedAt: z.string().optional(),
});

export interface RoutineVersion {
  id: string;
  userId: string;
  routine: z.infer<typeof RoutinePlanSchema>;
  version: number;
  concerns: string[];
  skinType?: string;
  createdAt: string;
  changelog?: string;
}

export interface RoutineComparison {
  hasChanges: boolean;
  added: string[];
  removed: string[];
  modified: string[];
  summary: string;
}

export function compareRoutines(
  oldRoutine: z.infer<typeof RoutinePlanSchema> | null,
  newRoutine: z.infer<typeof RoutinePlanSchema>
): RoutineComparison {
  if (!oldRoutine) {
    return {
      hasChanges: true,
      added: ["Initial routine created"],
      removed: [],
      modified: [],
      summary: "This is your first personalized routine."
    };
  }

  const getSteps = (routine: z.infer<typeof RoutinePlanSchema>) => {
    const morning = routine.morning || routine.morningSteps || [];
    const night = routine.night || routine.nightSteps || [];
    const weekly = routine.weekly || routine.weeklySteps || [];
    return [...morning, ...night, ...weekly].map(s => s.productType);
  };

  const oldSteps = getSteps(oldRoutine);
  const newSteps = getSteps(newRoutine);

  const added = newSteps.filter(s => !oldSteps.includes(s));
  const removed = oldSteps.filter(s => !newSteps.includes(s));
  
  // Check for difficulty changes
  const oldDifficulty = oldRoutine.difficultyLevel || oldRoutine.difficulty || "beginner";
  const newDifficulty = newRoutine.difficultyLevel || newRoutine.difficulty || "beginner";
  
  let modified: string[] = [];
  if (oldDifficulty !== newDifficulty) {
    modified.push(`Difficulty: ${oldDifficulty} → ${newDifficulty}`);
  }

  const hasChanges = added.length > 0 || removed.length > 0 || modified.length > 0;

  let summary = "";
  if (!hasChanges) {
    summary = "Your routine is optimized. No changes needed.";
  } else if (added.length === 0 && removed.length === 0) {
    summary = "Your routine has been refined based on your latest scan.";
  } else {
    const parts: string[] = [];
    if (added.length > 0) parts.push(`Added: ${added.join(", ")}`);
    if (removed.length > 0) parts.push(`Removed: ${removed.join(", ")}`);
    if (modified.length > 0) parts.push(modified.join(", "));
    summary = parts.join(". ");
  }

  return { hasChanges, added, removed, modified, summary };
}

export function generateChangelog(
  comparison: RoutineComparison,
  concerns: string[]
): string {
  const lines: string[] = [];
  
  if (comparison.added.length > 0 && !comparison.added[0].includes("Initial")) {
    lines.push(`Added ${comparison.added.length} step(s): ${comparison.added.join(", ")}`);
  }
  
  if (comparison.removed.length > 0) {
    lines.push(`Removed ${comparison.removed.length} step(s): ${comparison.removed.join(", ")}`);
  }
  
  for (const mod of comparison.modified) {
    lines.push(mod);
  }
  
  if (concerns.length > 0) {
    lines.push(`Optimized for: ${concerns.join(", ")}`);
  }
  
  return lines.length > 0 ? lines.join(" | ") : "Routine optimized based on your latest scan";
}