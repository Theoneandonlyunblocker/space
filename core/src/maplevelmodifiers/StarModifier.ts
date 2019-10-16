import { Star } from "../map/Star";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";

type StarModifierPropagations =
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localUnits?: UnitModifier;
};
export interface StarModifier extends Modifier<StarModifierPropagations>
{
  filter?: (star: Star) => boolean;
  self?: PartialMapLevelModifier;

}
