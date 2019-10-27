import { Star } from "../map/Star";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";

type StarModifierPropagations =
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localUnits?: UnitModifier;
};
export interface StarModifier extends ModifierTemplate<StarModifierPropagations>
{
  filter?: (star: Star) => boolean;
  self?: PartialMapLevelModifier;

}
