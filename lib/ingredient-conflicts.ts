export interface IngredientConflict {
  ingredient: string;
  conflictsWith: string[];
  reason: string;
  severity: "high" | "medium" | "low";
}

export const INGREDIENT_CONFLICTS: IngredientConflict[] = [
  {
    ingredient: "retinol",
    conflictsWith: ["aha", "bha", "glycolic acid", "lactic acid", "salicylic acid", "benzoyl peroxide", "vitamin c"],
    reason: "Combined use can cause severe irritation, redness, and barrier damage",
    severity: "high"
  },
  {
    ingredient: "benzoyl peroxide",
    conflictsWith: ["retinol", "vitamin c", "aha", "bha"],
    reason: "Can oxidize and deactivate other active ingredients",
    severity: "medium"
  },
  {
    ingredient: "vitamin c",
    conflictsWith: ["retinol", "benzoyl peroxide", "aha", "bha"],
    reason: "Instable when mixed with other acids; use at different times of day",
    severity: "medium"
  },
  {
    ingredient: "aha",
    conflictsWith: ["retinol", "vitamin c", "benzoyl peroxide", "peptide"],
    reason: "Can break down peptides and cause irritation with other actives",
    severity: "medium"
  },
  {
    ingredient: "bha",
    conflictsWith: ["retinol", "vitamin c", "benzoyl peroxide"],
    reason: "Excessive exfoliation when combined",
    severity: "medium"
  },
  {
    ingredient: "niacinamide",
    conflictsWith: ["vitamin c"],
    reason: "Can cause flushing in some people when combined (cosmetic, not harmful)",
    severity: "low"
  },
  {
    ingredient: "peptide",
    conflictsWith: ["aha", "bha"],
    reason: "Acids can break down peptide bonds, reducing efficacy",
    severity: "medium"
  },
  {
    ingredient: "hydroquinone",
    conflictsWith: ["benzoyl peroxide"],
    reason: "Can cause temporary hyperpigmentation when combined",
    severity: "high"
  }
];

export function checkIngredientConflicts(ingredients: string[]): {
  conflicts: { ingredient: string; conflictsWith: string[]; reason: string; severity: string }[];
  safe: boolean;
} {
  const lowerIngredients = ingredients.map(i => i.toLowerCase());
  const foundConflicts: { ingredient: string; conflictsWith: string[]; reason: string; severity: string }[] = [];
  
  for (const conflict of INGREDIENT_CONFLICTS) {
    const hasIngredient = lowerIngredients.some(i => i.includes(conflict.ingredient));
    if (hasIngredient) {
      const conflictingWith = conflict.conflictsWith.filter(c => 
        lowerIngredients.some(i => i.includes(c))
      );
      
      if (conflictingWith.length > 0) {
        foundConflicts.push({
          ingredient: conflict.ingredient,
          conflictsWith: conflictingWith,
          reason: conflict.reason,
          severity: conflict.severity
        });
      }
    }
  }
  
  return {
    conflicts: foundConflicts,
    safe: foundConflicts.filter(c => c.severity === "high").length === 0
  };
}

export function getSafeRoutineOrder(ingredients: string[]): string[] {
  const conflictCheck = checkIngredientConflicts(ingredients);
  if (conflictCheck.safe) return ingredients;
  
  const order: string[] = [];
  const remaining = [...ingredients];
  
  const priorityOrder = ["cleanser", "toner", "serum", "moisturizer", "spf", "sunscreen", "oil", "mask"];
  
  for (const type of priorityOrder) {
    const idx = remaining.findIndex(i => i.toLowerCase().includes(type));
    if (idx !== -1) {
      order.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
  }
  
  return order.concat(remaining);
}