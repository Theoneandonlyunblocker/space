import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { Modifier } from "./Modifier";

type PlayerModifierPropagations =
{
  ownedStars?: StarModifier;
  ownedUnits?: UnitModifier;
};
export interface PlayerModifier extends Modifier<PlayerModifierPropagations>
{

}
