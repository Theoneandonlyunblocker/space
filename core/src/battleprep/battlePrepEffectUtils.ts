import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { AdjustmentsMap } from "../generic/AdjustmentsMap";
import { MapLevelModifiersCollection } from "../maplevelmodifiers/MapLevelModifiersCollection";
import { ModifierTemplate } from "../maplevelmodifiers/ModifierTemplate";
import { Modifier } from "../maplevelmodifiers/Modifier";
import { flatten2dArray } from "../generic/utility";


interface BattlePrepEffectWithAdjustment<T>
{
  effect: T;
  adjustment: Partial<FlatAndMultiplierAdjustment>;
}

export function getBattlePrepEffectsFromModifiers<T extends object, M extends ModifierTemplate<any>>(
  modifiersCollection: MapLevelModifiersCollection<M>,
  fetchBattlePrepEffectsFromModifier: (modifier: Modifier<M>) => BattlePrepEffectWithAdjustment<T>[],
): AdjustmentsMap<T>
{
  const allBattlePrepEffects = modifiersCollection.getAllActiveModifiers().map(modifier =>
  {
    return fetchBattlePrepEffectsFromModifier(modifier);
  }).filter(effects =>
  {
    return Boolean(effects);
  });

  const battlePrepEffects = flatten2dArray(allBattlePrepEffects);

  return squashBattlePrepEffectsWithAdjustments(battlePrepEffects);
}

export function squashBattlePrepEffectsWithAdjustments<T extends object>(
  effectsWithAdjustments: BattlePrepEffectWithAdjustment<T>[],
): AdjustmentsMap<T>
{
  const squashed = new AdjustmentsMap<T>();

  effectsWithAdjustments.forEach(effectWithAdjustment =>
  {
    squashed.add(effectWithAdjustment.effect, effectWithAdjustment.adjustment);
  });

  return squashed;
}
