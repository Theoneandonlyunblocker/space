export declare interface FlatAndMultiplierAdjustment
{
  flat: number;
  additiveMultiplier: number;
  multiplicativeMultiplier: number;
}

const baseAdjustment =
{
  flat: 0,
  additiveMultiplier: 1,
  multiplicativeMultiplier: 1,
};

export function getBaseAdjustment(): FlatAndMultiplierAdjustment
{
  return {...baseAdjustment};
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
  ...allAdjustments: Partial<FlatAndMultiplierAdjustment>[],
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

  }, baseAdjustment);
}

type PartialAdjustmentsObject<T> = {[K in keyof T]: Partial<FlatAndMultiplierAdjustment>};

export function squashAdjustmentsObjects<T extends {[K in keyof T]: FlatAndMultiplierAdjustment}>(
  baseAdjustmentsObject: Required<T>,
  ...adjustmentObjectsToSquash: PartialAdjustmentsObject<T>[],
): Required<T>
{
  return <Required<T>>adjustmentObjectsToSquash.reduce((squashed, toSquash) =>
  {
    for (const key in toSquash)
    {
      const squashedAlreadyHasAdjustment = Boolean(squashed[key]);

      if (squashedAlreadyHasAdjustment)
      {
        squashed[key] = squashFlatAndMultiplierAdjustments(squashed[key], toSquash[key]);
      }
      else
      {
        squashed[key] = squashFlatAndMultiplierAdjustments(toSquash[key]);
      }
    }

    return squashed;
  }, baseAdjustmentsObject);
}
