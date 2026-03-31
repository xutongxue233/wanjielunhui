export interface CultivationSpeedInput {
  baseSpeed: number;
  spiritualRootBonus?: number;
  techniqueBonus?: number;
  pillBonus?: number;
  environmentBonus?: number;
}

export function computeCultivationSpeed(input: CultivationSpeedInput): number {
  const multiplier =
    1 +
    (input.spiritualRootBonus ?? 0) +
    (input.techniqueBonus ?? 0) +
    (input.pillBonus ?? 0) +
    (input.environmentBonus ?? 0);

  return Number((input.baseSpeed * multiplier).toFixed(2));
}

export interface BreakthroughRateInput {
  baseRate: number;
  comprehension: number;
  luck: number;
  externalBonus?: number;
  cap?: number;
}

export function computeBreakthroughRate(input: BreakthroughRateInput): number {
  const cap = input.cap ?? 0.95;
  const rate =
    input.baseRate +
    input.comprehension * 0.005 +
    input.luck * 0.003 +
    (input.externalBonus ?? 0);

  return Math.min(cap, Number(rate.toFixed(4)));
}

export interface AttributeGrowthInput {
  baseMultiplier: number;
  majorBreakthrough: boolean;
}

export function computeAttributeGrowth(input: AttributeGrowthInput) {
  return input.majorBreakthrough
    ? {
        maxHp: Math.round(50 * input.baseMultiplier),
        maxMp: Math.round(30 * input.baseMultiplier),
        attack: Math.round(8 * input.baseMultiplier),
        defense: Math.round(5 * input.baseMultiplier),
        speed: Math.round(3 * input.baseMultiplier),
      }
    : {
        maxHp: Math.round(20 * input.baseMultiplier),
        maxMp: Math.round(12 * input.baseMultiplier),
        attack: Math.round(3 * input.baseMultiplier),
        defense: Math.round(2 * input.baseMultiplier),
        speed: Math.round(1 * input.baseMultiplier),
      };
}

export interface StoryConditionContext {
  flags: Record<string, boolean>;
  values?: Record<string, string | number | boolean>;
}

export interface StoryCondition {
  key: string;
  equals?: string | number | boolean;
  min?: number;
  max?: number;
}

export function evaluateStoryConditions(
  conditions: StoryCondition[] | undefined,
  context: StoryConditionContext,
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition) => {
    const rawValue = context.values?.[condition.key] ?? context.flags[condition.key];

    if (condition.equals !== undefined) {
      return rawValue === condition.equals;
    }

    if (typeof rawValue !== 'number') {
      return false;
    }

    if (condition.min !== undefined && rawValue < condition.min) {
      return false;
    }

    if (condition.max !== undefined && rawValue > condition.max) {
      return false;
    }

    return true;
  });
}

export interface DropRollEntry {
  id: string;
  weight: number;
}

export function resolveDropRoll(entries: DropRollEntry[], rng: () => number = Math.random): string | null {
  if (entries.length === 0) return null;

  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = rng() * totalWeight;

  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      return entry.id;
    }
  }

  return entries[entries.length - 1]?.id ?? null;
}

export interface PvpRatingInput {
  playerRating: number;
  opponentRating: number;
  won: boolean;
  kFactor?: number;
}

export function resolvePvpRatingDelta(input: PvpRatingInput): number {
  const kFactor = input.kFactor ?? 32;
  const expected = 1 / (1 + 10 ** ((input.opponentRating - input.playerRating) / 400));
  const actual = input.won ? 1 : 0;
  return Math.round(kFactor * (actual - expected));
}
