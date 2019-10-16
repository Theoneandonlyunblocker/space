import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { Modifier } from "./Modifier";


export interface UnitModifier extends Modifier
{
  filter?: (unit: Unit) => boolean;
  self?: PartialMapLevelModifier;
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localStar?: StarModifier;
}
