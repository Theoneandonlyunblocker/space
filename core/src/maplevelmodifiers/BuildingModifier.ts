import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { Modifier } from "./Modifier";

type BuildingModifierPropagations =
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localStar?: StarModifier;
};

export interface BuildingModifier extends Modifier<BuildingModifierPropagations>
{

}

