export interface FlatAndMultiplierAdjustment
{
  flat?: number; // -Infinity ... Infinity
  additiveMultiplier?: number; // -Infinity ... Infinity
  multiplicativeMultiplier?: number; // 0 ... Infinity
}

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
    additiveMultiplier: 1,
    multiplicativeMultiplier: 1,
  });
}

export function applyFlatAndMultiplierAdjustments(
  baseValue: number,
  ...adjustments: Partial<FlatAndMultiplierAdjustment>[]
): number
{
  const adjustment = squashFlatAndMultiplierAdjustments(...adjustments);

  return (baseValue + adjustment.flat) * adjustment.additiveMultiplier * adjustment.multiplicativeMultiplier;
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
  });
}

export function squashAdjustmentsObjects<T extends AdjustmentsObject<T>>(
  baseAdjustmentsObject: T,
  ...adjustmentObjectsToSquash: PartialAdjustmentsObject<T>[]
): T;
export function squashAdjustmentsObjects<T extends PartialAdjustmentsObject<T>>(
  ...adjustmentObjectsToSquash: T[]
): T;
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
        (squashed[key] as FlatAndMultiplierAdjustment) = squashFlatAndMultiplierAdjustments(squashed[key], toSquash[key]);
      }
      else
      {
        (squashed[key] as Partial<FlatAndMultiplierAdjustment>) = squashFlatAndMultiplierAdjustments(getBaseAdjustment(), toSquash[key]);
      }
    }

    return squashed;
  });
}
