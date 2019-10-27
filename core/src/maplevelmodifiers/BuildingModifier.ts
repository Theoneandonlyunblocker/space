import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { StarModifier } from "./StarModifier";
import { ModifierTemplate } from "./ModifierTemplate";

type BuildingModifierPropagations =
{
  owningPlayer?: PlayerModifier;
  global?: GlobalModifier;
  localStar?: StarModifier;
};

export interface BuildingModifier extends ModifierTemplate<BuildingModifierPropagations>
{

}

