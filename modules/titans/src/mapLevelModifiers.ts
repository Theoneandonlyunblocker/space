import { ModuleData } from "core/src/modules/ModuleData";
import { FlatAndMultiplierAdjustment, applyFlatAndMultiplierAdjustments } from "core/src/generic/FlatAndMultiplierAdjustment";
import { Star } from "core/src/map/Star";
import { PartialMapLevelModifier } from "core/src/maplevelmodifiers/MapLevelModifiers";
import { StarModifierAdjustments } from "core/src/maplevelmodifiers/StarModifier";
import { triggeredScripts } from "./triggeredScripts";


export type TitansStarModifierAdjustments =
{
  titanAssemblingCapacity: FlatAndMultiplierAdjustment;
};

function onTitanAssemblingCapacityChange(
  location: Star,
  changes: PartialMapLevelModifier<StarModifierAdjustments & TitansStarModifierAdjustments>,
): void
{
  triggeredScripts.call("onTitanAssemblingCapacityChange", location);
}

export function registerMapLevelModifiers(moduleData: ModuleData): void
{
  moduleData.mapLevelModifierAdjustments.add(
  {
    star:
    {
      titanAssemblingCapacity:
      {
        onChange: onTitanAssemblingCapacityChange,
      },
    },
  });
}
export function getTitanAssemblingCapacity(star: Star): number
{
  const baseValue = 0;
  const starEffect = (star.modifiers.getSelfModifiers().adjustments as StarModifierAdjustments & TitansStarModifierAdjustments).titanAssemblingCapacity;

  return applyFlatAndMultiplierAdjustments(baseValue, starEffect);
}
