import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifiers } from "./PlayerModifiers";
import { GlobalModifiers } from "./GlobalModifiers";
import { StarModifiers } from "./StarModifiers";


export type UnitModifiers =
{
  filter?: (unit: Unit) => boolean;
  self?: PartialMapLevelModifier;
  owningPlayer?: PlayerModifiers;
  global?: GlobalModifiers;
  localStar?: StarModifiers;
};
