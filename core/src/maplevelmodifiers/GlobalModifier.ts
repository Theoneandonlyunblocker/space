import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";

type GlobalModifierPropagations =
{
  stars?: StarModifier;
  units?: UnitModifier;
}
export interface GlobalModifier extends Modifier<GlobalModifierPropagations>
{

}
