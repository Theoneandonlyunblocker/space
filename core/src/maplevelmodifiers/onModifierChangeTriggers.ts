import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { Player } from "../player/Player";
import { activeModuleData } from "../app/activeModuleData";


type MapPresentModifierAdjustments =
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;
};
export function onMapPresentModifierChange<T extends MapPresentModifierAdjustments>(
  changes: PartialMapLevelModifier<T>,
  player: Player,
): void
{
  const didModifyVision = changes.adjustments.vision || changes.adjustments.detection;
  if (didModifyVision)
  {
    player.updateVisibleStars();
  }
}

// TODO 2019.10.31 | would be nice to discriminate modifier.income as well.
// here and in modifier templates. disallow for buildings / global modifiers
type IncomeModifierAdjustments =
{
  researchPoints: FlatAndMultiplierAdjustment;
};
export function onIncomeModifierChange<T extends IncomeModifierAdjustments>(
  changes: PartialMapLevelModifier<T>,
  player: Player,
): void
{
  if (changes.income)
  {
    activeModuleData.scripts.call("onPlayerIncomeChange", player);
  }
  if (changes.adjustments.researchPoints)
  {
    activeModuleData.scripts.call("onPlayerResearchSpeedChange", player);
  }
}
