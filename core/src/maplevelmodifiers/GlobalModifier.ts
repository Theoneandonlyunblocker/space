import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";


export interface GlobalModifier extends Modifier
{
  stars?: StarModifier;
  units?: UnitModifier;
}
