import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";

type GlobalModifierPropagations =
{
  stars?: StarModifier[];
  units?: UnitModifier[];
};
export interface GlobalModifier extends ModifierTemplate<GlobalModifierPropagations>
{

}
