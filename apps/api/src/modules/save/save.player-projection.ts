type UnknownRecord = Record<string, unknown>;

const REALM_STAGE_MAP: Record<string, string> = {
  early: '初期',
  middle: '中期',
  late: '后期',
  peak: '圆满',
};

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as UnknownRecord;
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function asBigIntValue(value: unknown): bigint | undefined {
  if (typeof value === 'bigint') {
    return value;
  }
  const num = asFiniteNumber(value);
  if (num === undefined) {
    return undefined;
  }
  return BigInt(Math.trunc(num));
}

function toPositiveInt(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  return Math.max(0, Math.trunc(value));
}

function normalizeRealmStage(rawStage: string | undefined): string | undefined {
  if (!rawStage) return undefined;
  const mapped = REALM_STAGE_MAP[rawStage.toLowerCase()];
  return mapped ?? rawStage;
}

function estimateCombatPower(
  player: UnknownRecord | null,
  attributes: UnknownRecord | null,
  cultivation: bigint | undefined,
): bigint | undefined {
  const explicitCombatPower = asBigIntValue(player?.combatPower);
  if (explicitCombatPower !== undefined && explicitCombatPower >= 0n) {
    return explicitCombatPower;
  }

  const maxHp = asFiniteNumber(attributes?.maxHp);
  const attack = asFiniteNumber(attributes?.attack);
  const defense = asFiniteNumber(attributes?.defense);
  const speed = asFiniteNumber(attributes?.speed);
  const critRate = asFiniteNumber(attributes?.critRate);
  const critDamage = asFiniteNumber(attributes?.critDamage);

  if (
    maxHp === undefined &&
    attack === undefined &&
    defense === undefined &&
    speed === undefined &&
    critRate === undefined &&
    critDamage === undefined &&
    cultivation === undefined
  ) {
    return undefined;
  }

  const score =
    (maxHp ?? 0) * 2 +
    (attack ?? 0) * 18 +
    (defense ?? 0) * 14 +
    (speed ?? 0) * 12 +
    (critRate ?? 0) * 2000 +
    ((critDamage ?? 1) - 1) * 1000 +
    Number(cultivation ?? 0n) / 5;

  return BigInt(Math.max(0, Math.trunc(score)));
}

export interface PlayerProjectionSnapshot {
  name?: string;
  realm?: string;
  realmStage?: string;
  spiritualRoot?: string;
  cultivation?: bigint;
  health?: number;
  maxHealth?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  critRate?: number;
  critDamage?: number;
  combatPower?: bigint;
  reincarnations?: number;
  destinyPoints?: number;
}

export function buildPlayerProjectionFromSaveData(
  playerData: unknown,
  roguelikeData: unknown,
): PlayerProjectionSnapshot {
  const playerRoot = asRecord(playerData);
  const player = asRecord(playerRoot?.player);
  const attributes = asRecord(player?.attributes);
  const realm = asRecord(player?.realm);
  const spiritualRoot = asRecord(player?.spiritualRoot);
  const roguelikeRoot = asRecord(roguelikeData);
  const roguelikeState = asRecord(roguelikeRoot?.roguelikeState);

  const cultivation = asBigIntValue(attributes?.cultivation);

  return {
    name: asString(player?.name),
    realm: asString(realm?.displayName) ?? asString(realm?.name),
    realmStage: normalizeRealmStage(asString(realm?.stage)),
    spiritualRoot:
      asString(spiritualRoot?.special) ??
      asString(spiritualRoot?.type) ??
      asString(spiritualRoot?.quality),
    cultivation,
    health: toPositiveInt(asFiniteNumber(attributes?.hp)),
    maxHealth: toPositiveInt(asFiniteNumber(attributes?.maxHp)),
    attack: toPositiveInt(asFiniteNumber(attributes?.attack)),
    defense: toPositiveInt(asFiniteNumber(attributes?.defense)),
    speed: toPositiveInt(asFiniteNumber(attributes?.speed)),
    critRate: asFiniteNumber(attributes?.critRate),
    critDamage: asFiniteNumber(attributes?.critDamage),
    combatPower: estimateCombatPower(player, attributes, cultivation),
    reincarnations: toPositiveInt(asFiniteNumber(roguelikeState?.reincarnationCount)),
    destinyPoints: toPositiveInt(asFiniteNumber(roguelikeState?.destinyPoints)),
  };
}

