import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { ModifierTemplate } from "./ModifierTemplate";
import { FlatAndMultiplierAdjustment, getBaseAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { activeModuleData } from "../app/activeModuleData";


type UnitModifierPropagations =
{
  owningPlayer?: PlayerModifier[];
  global?: GlobalModifier[];
  localStar?: StarModifier[];
};
// TODO 2020.02.10 | rename this & similar => CoreUnitModifierAdjustments
export type UnitModifierAdjustments =
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;
  researchPoints: FlatAndMultiplierAdjustment;
  // [customModifierKey: string]: FlatAndMultiplierAdjustment;
};

export interface UnitModifier extends ModifierTemplate<UnitModifierPropagations>
{
  filter?: (unit: Unit) => boolean;
  self?: PartialMapLevelModifier<UnitModifierAdjustments>;
}
export function getBaseUnitSelfModifier(): MapLevelModifier<UnitModifierAdjustments>
{
  return {
    adjustments:
    {
      vision: getBaseAdjustment(),
      detection: getBaseAdjustment(),
      researchPoints: getBaseAdjustment(),
      ...activeModuleData.mapLevelModifierAdjustments.getBaseAdjustmentsFor("unit"),
    },
    income: {},
    flags: new Set(),
  };
}
