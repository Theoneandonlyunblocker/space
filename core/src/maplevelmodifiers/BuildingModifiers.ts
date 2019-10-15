import { PlayerModifiers } from "./PlayerModifiers";
import { GlobalModifiers } from "./GlobalModifiers";
import { StarModifiers } from "./StarModifiers";


export type BuildingModifiers =
{
  owningPlayer?: PlayerModifiers;
  global?: GlobalModifiers;
  localStar?: StarModifiers;
};
