import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { Modifier } from "./Modifier";


export interface BuildingModifier extends Modifier
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localStar?: StarModifier;
}
