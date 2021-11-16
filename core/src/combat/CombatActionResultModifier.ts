import { CombatActionResults } from "./CombatActionResults";
import { OrderedGraph } from "../generic/OrderedGraph";


export interface CombatActionResultModifier<T>
{
  key: string;
  flags?: Set<string>;
  modifyResult: (result: CombatActionResults, value: T) => void;
  flagsThatShouldBeExecutedBefore?: string[];
}
export type CombatActionResultModifierWithValue<T> =
{
  modifier: CombatActionResultModifier<T>;
  value: T;
};

export function getOrderedResultModifiers(
  modifiersAndValues: CombatActionResultModifierWithValue<any>[],
): CombatActionResultModifierWithValue<any>[]
{
  const modifierIdsByFlags:
  {
    [flag: string]: string[];
  } = {};

  const orderedGraph = new OrderedGraph<CombatActionResultModifierWithValue<any>>();

  // add & index
  modifiersAndValues.forEach((modifierAndValue, i) =>
  {
    const id = modifierAndValue.modifier.key + "_" + i;
    const modifier = modifierAndValue.modifier;

    orderedGraph.addNode(id, modifierAndValue);

    if (modifier.flags)
    {
      modifier.flags.forEach(flag =>
      {
        if (!modifierIdsByFlags[flag])
        {
          modifierIdsByFlags[flag] = [];
        }
        modifierIdsByFlags[flag].push(id);
      });
    }
  });

  // order
  modifiersAndValues.forEach((modifierAndValue, i) =>
  {
    const ownId = modifierAndValue.modifier.key + "_" + i;
    const modifier = modifierAndValue.modifier;

    if (modifier.flagsThatShouldBeExecutedBefore)
    {
      modifier.flagsThatShouldBeExecutedBefore.forEach(flagWithPriority =>
      {
        const idsWithPriority = modifierIdsByFlags[flagWithPriority];

        if (idsWithPriority)
        {
          idsWithPriority.forEach(otherId => orderedGraph.addOrdering(otherId, ownId));
        }
      });
    }
  });

  return orderedGraph.getOrderedNodes();
}
