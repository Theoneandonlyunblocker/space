import { Star } from "../map/Star";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifiers } from "./PlayerModifiers";
import { GlobalModifiers } from "./GlobalModifiers";
import { UnitModifiers } from "./UnitModifiers";


export type StarModifiers =
{
  filter?: (star: Star) => boolean;
  self?: PartialMapLevelModifier;
  owningPlayer?: PlayerModifiers;
  global?: GlobalModifiers;
  localUnits?: UnitModifiers;
};
