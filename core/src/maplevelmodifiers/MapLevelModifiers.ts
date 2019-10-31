import { FlatAndMultiplierAdjustment, squashAdjustmentsObjects } from "../generic/FlatAndMultiplierAdjustment";


export type MapLevelModifier<T extends {[key: string]: FlatAndMultiplierAdjustment}> =
{
  adjustments: T;
  income:
  {
    [resourceType: string]: FlatAndMultiplierAdjustment;
  };
  flags: Set<string>;
};

export type PartialMapLevelModifier<T extends {[key: string]: FlatAndMultiplierAdjustment}> =
{
  adjustments?:
  {
    [K in keyof MapLevelModifier<T>["adjustments"]]?: Partial<MapLevelModifier<T>["adjustments"][K]>;
  };
  income?:
  {
    [K in keyof MapLevelModifier<T>["income"]]?: Partial<MapLevelModifier<T>["income"][K]>;
  };
  flags?: Set<string>;
};

export function squashMapLevelModifiers<T extends {[key: string]: FlatAndMultiplierAdjustment}>(baseModifier: MapLevelModifier<T>, ...modifiersToSquash: PartialMapLevelModifier<T>[]): MapLevelModifier<T>;
export function squashMapLevelModifiers<T extends {[key: string]: FlatAndMultiplierAdjustment}>(...modifiersToSquash: PartialMapLevelModifier<T>[]): PartialMapLevelModifier<T>;
export function squashMapLevelModifiers<T extends {[key: string]: FlatAndMultiplierAdjustment}>(...modifiersToSquash: PartialMapLevelModifier<T>[]): PartialMapLevelModifier<T>
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
