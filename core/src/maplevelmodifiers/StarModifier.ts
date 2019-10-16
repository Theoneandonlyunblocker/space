import { Star } from "../map/Star";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";


export interface StarModifier extends Modifier
{
  filter?: (star: Star) => boolean;
  self?: PartialMapLevelModifier;
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localUnits?: UnitModifier;
}
