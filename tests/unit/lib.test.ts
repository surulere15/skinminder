import { describe, it, expect } from 'vitest';
import { checkIngredientConflicts, INGREDIENT_CONFLICTS } from '../../lib/ingredient-conflicts';
import { compareRoutines, generateChangelog, type RoutineComparison } from '../../lib/routine-versioning';
import { config, isMockMode, getMockDelay } from '../../lib/config';
import { rateLimit } from '../../lib/rate-limit';

describe('Ingredient Conflicts', () => {
  it('should detect retinol + AHA conflict', () => {
    const result = checkIngredientConflicts(['retinol', 'glycolic acid']);
    expect(result.safe).toBe(false);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].severity).toBe('high');
  });

  it('should detect vitamin C + retinol conflict', () => {
    const result = checkIngredientConflicts(['retinol', 'vitamin c']);
    expect(result.safe).toBe(false);
  });

  it('should pass safe ingredients', () => {
    const result = checkIngredientConflicts(['niacinamide', 'hyaluronic acid']);
    expect(result.safe).toBe(true);
    expect(result.conflicts).toHaveLength(0);
  });

  it('should handle case insensitive matching', () => {
    const result = checkIngredientConflicts(['RETINOL', 'AHA']);
    expect(result.safe).toBe(false);
  });

  it('should not flag niacinamide + vitamin C as high severity', () => {
    const result = checkIngredientConflicts(['niacinamide', 'vitamin c']);
    // The conflict exists but is low severity
    const highSeverity = result.conflicts.filter(c => c.severity === 'high');
    expect(highSeverity).toHaveLength(0);
  });

  it('should have all expected ingredients in database', () => {
    const ingredients = INGREDIENT_CONFLICTS.map(c => c.ingredient);
    expect(ingredients).toContain('retinol');
    expect(ingredients).toContain('benzoyl peroxide');
    expect(ingredients).toContain('vitamin c');
    expect(ingredients).toContain('aha');
  });
});

describe('Routine Versioning', () => {
  it('should detect changes between routines', () => {
    const oldRoutine = {
      morning: [{ stepNumber: 1, productType: 'Cleanser', action: 'apply', durationMinutes: 1 }],
      night: [{ stepNumber: 1, productType: 'Cleanser', action: 'apply', durationMinutes: 1 }]
    };
    const newRoutine = {
      morning: [
        { stepNumber: 1, productType: 'Cleanser', action: 'apply', durationMinutes: 1 },
        { stepNumber: 2, productType: 'Serum', action: 'apply', durationMinutes: 1 },
        { stepNumber: 3, productType: 'Moisturizer', action: 'apply', durationMinutes: 1 },
      ],
      night: [{ stepNumber: 1, productType: 'Cleanser', action: 'apply', durationMinutes: 1 }]
    };

    const comparison = compareRoutines(oldRoutine, newRoutine);
    expect(comparison.hasChanges).toBe(true);
  });

  it('should handle initial routine (no previous)', () => {
    const comparison = compareRoutines(null, { morning: [] });
    expect(comparison.hasChanges).toBe(true);
  });

  it('should generate changelog', () => {
    const comparison: RoutineComparison = {
      hasChanges: true,
      added: ['Serum', 'Eye cream'],
      removed: [],
      modified: [],
      summary: 'Updated routine'
    };
    const changelog = generateChangelog(comparison, ['acne', 'aging']);
    expect(changelog).toContain('acne');
    expect(changelog).toContain('aging');
  });
});

describe('Config', () => {
  it('should have correct mock config', () => {
    expect(config.mock).toBeDefined();
    expect(config.mock.delayMs).toBeGreaterThan(0);
  });

  it('should return mock delay', () => {
    const delay = getMockDelay();
    expect(typeof delay).toBe('number');
  });
});

describe('Rate Limiting', () => {
  it('should create a rate limiter', () => {
    const limiter = rateLimit({ maxRequests: 10, windowMs: 60000 });
    expect(limiter).toBeDefined();
  });
});