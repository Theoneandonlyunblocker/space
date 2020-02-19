export interface FlatAndMultiplierAdjustment
{
  flat: number;
  additiveMultiplier: number;
  multiplicativeMultiplier: number;
}

// TODO 2020.02.12 | move adjustments objects into separate module?
export type AdjustmentsObject<T> =
{
  [K in keyof T]: FlatAndMultiplierAdjustment;
};

export type PartialAdjustmentsObject<T> =
{
  [K in keyof T]?: Partial<FlatAndMultiplierAdjustment>;
};

export function getBaseAdjustment(): FlatAndMultiplierAdjustment
{
  return(
  {
    flat: 0,
    additiveMultiplier: 0,
    multiplicativeMultiplier: 1,
  });
}

export function squashFlatAndMultiplierAdjustments(
  ...allAdjustments: Partial<FlatAndMultiplierAdjustment>[]
): FlatAndMultiplierAdjustment
{
  return allAdjustments.reduce((squashed: FlatAndMultiplierAdjustment, toSquash) =>
  {
    if (toSquash.flat)
    {
      squashed.flat += toSquash.flat;
    }
    if (toSquash.additiveMultiplier)
    {
      squashed.additiveMultiplier += toSquash.additiveMultiplier;
    }
    if (isFinite(toSquash.multiplicativeMultiplier))
    {
      squashed.multiplicativeMultiplier *= toSquash.multiplicativeMultiplier;
    }

    return squashed;
  }, getBaseAdjustment());
}

export function applyFlatAndMultiplierAdjustments(
  baseValue: number,
  ...adjustments: Partial<FlatAndMultiplierAdjustment>[]
): number
{
  const adjustment = squashFlatAndMultiplierAdjustments(...adjustments);

  return (baseValue + adjustment.flat) * (1 + adjustment.additiveMultiplier) * adjustment.multiplicativeMultiplier;
}

export function squashAdjustmentsObjects<T extends AdjustmentsObject<T>>(
  baseAdjustmentsObject: T,
  ...adjustmentObjectsToSquash: PartialAdjustmentsObject<T>[]
): T;
export function squashAdjustmentsObjects<T extends PartialAdjustmentsObject<T>>(
  ...adjustmentObjectsToSquash: T[]
): {[K in keyof T]: FlatAndMultiplierAdjustment};
export function squashAdjustmentsObjects<T extends PartialAdjustmentsObject<T>>(
  ...adjustmentObjectsToSquash: T[]
): T
{
  return adjustmentObjectsToSquash.reduce((squashed, toSquash) =>
  {
    for (const key in toSquash)
    {
      const squashedAlreadyHasAdjustment = Boolean(squashed[key]);

      // not sure the type assertions here are right
      if (squashedAlreadyHasAdjustment)
      {
        (squashed[key] as FlatAndMultiplierAdjustment) = squashFlatAndMultiplierAdjustments((squashed[key] as FlatAndMultiplierAdjustment), toSquash[key]);
      }
      else
      {
        (squashed[key] as FlatAndMultiplierAdjustment) = squashFlatAndMultiplierAdjustments(toSquash[key]);
      }
    }

    return squashed;
  });
}
export function applyAdjustmentsObjects<T extends {[key: string]: number}>(
  baseValues: Partial<T>,
  ...adjustmentsObjects: PartialAdjustmentsObject<T>[]
): Partial<T>
{
  if (adjustmentsObjects.length === 0)
  {
    return baseValues;
  }

  const squashedAdjustments = squashAdjustmentsObjects(...adjustmentsObjects);

  const allKeys = <(keyof T)[]>Object.keys({...baseValues, ...squashedAdjustments});

  return allKeys.reduce((finalValuesByKey, key) =>
  {
    const baseValue = baseValues[key] || 0;
    const adjustment = squashedAdjustments[key] || getBaseAdjustment();

    // why is the type assertion necessary?
    finalValuesByKey[key] = <T[keyof T]>applyFlatAndMultiplierAdjustments(baseValue, adjustment);

    return finalValuesByKey;
  }, <Partial<T>>{});
}
