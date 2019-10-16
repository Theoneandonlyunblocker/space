import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { Modifier } from "./Modifier";


type UnitModifierPropagations =
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localStar?: StarModifier;
};
export interface UnitModifier extends Modifier<UnitModifierPropagations>
{
  filter?: (unit: Unit) => boolean;
  self?: PartialMapLevelModifier;
}
