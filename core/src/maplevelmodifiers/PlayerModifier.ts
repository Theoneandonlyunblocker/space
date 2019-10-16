import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";


export interface PlayerModifier extends Modifier
{
  ownedStars?: StarModifier;
  ownedUnits?: UnitModifier;
}
