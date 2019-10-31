import { Star } from "../map/Star";
import { PartialMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";
import { FlatAndMultiplierAdjustment, getBaseAdjustment } from "../generic/FlatAndMultiplierAdjustment";


type StarModifierPropagations =
{
  owningPlayer?: PlayerModifier[];
  global?: GlobalModifier[];
  localUnits?: UnitModifier[];
};
export type StarModifierAdjustments =
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;
  mining: FlatAndMultiplierAdjustment;
  researchPoints: FlatAndMultiplierAdjustment;
};
export interface StarModifier extends ModifierTemplate<StarModifierPropagations>
{
  filter?: (star: Star) => boolean;
  self?: PartialMapLevelModifier<StarModifierAdjustments>;
}
export function getBaseStarSelfModifier(): MapLevelModifier<StarModifierAdjustments>
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
