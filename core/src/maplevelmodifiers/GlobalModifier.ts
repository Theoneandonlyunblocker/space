import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";
import { PlayerModifier } from "./PlayerModifier";

type GlobalModifierPropagations =
{
  stars?: StarModifier[];
  units?: UnitModifier[];
  players?: PlayerModifier[];
};
export interface GlobalModifier extends ModifierTemplate<GlobalModifierPropagations>
{

}
