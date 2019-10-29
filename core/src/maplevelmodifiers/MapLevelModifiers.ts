import { FlatAndMultiplierAdjustment, getBaseAdjustment, squashAdjustmentsObjects } from "../generic/FlatAndMultiplierAdjustment";


export type MapLevelModifier =
{
  adjustments:
  {
    vision: FlatAndMultiplierAdjustment;
    detection: FlatAndMultiplierAdjustment;

    /**
     * amount of local resources extracted
     */
    mining: FlatAndMultiplierAdjustment;
    researchPoints: FlatAndMultiplierAdjustment;
  };
  income:
  {
    [resourceType: string]: FlatAndMultiplierAdjustment;
  };
  flags: Set<string>;
};

export type PartialMapLevelModifier =
{
  adjustments?:
  {
    [K in keyof MapLevelModifier["adjustments"]]?: Partial<MapLevelModifier["adjustments"][K]>;
  };
  income?:
  {
    [K in keyof MapLevelModifier["income"]]?: Partial<MapLevelModifier["income"][K]>;
  };
  flags?: Set<string>;
};

export function getBaseMapLevelModifier(): MapLevelModifier
{
  return {
    adjustments:
    {
      vision: getBaseAdjustment(),
      detection: getBaseAdjustment(),
      mining: getBaseAdjustment(),
      researchPoints: getBaseAdjustment(),
    },
    income: {},
    flags: new Set(),
  };
}

export function squashMapLevelModifiers(baseModifier: MapLevelModifier, ...modifiersToSquash: PartialMapLevelModifier[]): MapLevelModifier;
export function squashMapLevelModifiers(...modifiersToSquash: PartialMapLevelModifier[]): PartialMapLevelModifier;
export function squashMapLevelModifiers(...modifiersToSquash: PartialMapLevelModifier[]): PartialMapLevelModifier
{
  const modifiersWithAdjustments = modifiersToSquash.filter(modifier => modifier.adjustments);
  const allAdjustments = modifiersWithAdjustments.map(modifier => modifier.adjustments);
  const squashedAdjustments = allAdjustments.length > 0 ?
    squashAdjustmentsObjects(...allAdjustments) :
    {};

  const modifiersWithIncome = modifiersToSquash.filter(modifier =>modifier.income);
  const allIncome = modifiersWithIncome.map(modifier => modifier.income);
  const squashedIncome = allIncome.length > 0 ?
    squashAdjustmentsObjects(...allIncome) :
    {};

  const modifiersWithFlags = modifiersToSquash.filter(modifier =>modifier.flags);
  const allFlags = modifiersWithFlags.map(modifier => modifier.flags);
  const squashedFlags = allFlags.reduce((squashed, toSquash) =>
  {
    toSquash.forEach(flag => squashed.add(flag));

    return squashed;
  }, new Set());

  return {
    adjustments: squashedAdjustments,
    income: squashedIncome,
    flags: squashedFlags,
  };
}
