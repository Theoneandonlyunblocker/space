
export interface FlatAndMultiplierAdjustment
{
  flat: number;
  additiveMultiplier: number;
  multiplicativeMultiplier: number;
}

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
