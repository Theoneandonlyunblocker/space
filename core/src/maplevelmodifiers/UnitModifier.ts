import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { ModifierTemplate } from "./ModifierTemplate";


type UnitModifierPropagations =
{
  owningPlayer?: PlayerModifier[];
  global?: GlobalModifier[];
  localStar?: StarModifier[];
};
export interface UnitModifier extends ModifierTemplate<UnitModifierPropagations>
{
  filter?: (unit: Unit) => boolean;
  self?: PartialMapLevelModifier;
}
