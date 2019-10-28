import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";

type PlayerModifierPropagations =
{
  ownedStars?: StarModifier[];
  ownedUnits?: UnitModifier[];
};
export interface PlayerModifier extends ModifierTemplate<PlayerModifierPropagations>
{

}
