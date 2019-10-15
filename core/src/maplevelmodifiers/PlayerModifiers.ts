import { StarModifiers } from "./StarModifiers";
import { UnitModifiers } from "./UnitModifiers";


export type PlayerModifiers =
{
  ownedStars?: StarModifiers;
  ownedUnits?: UnitModifiers;
};
