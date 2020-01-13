import { RaceTemplate } from "../templateinterfaces/RaceTemplate";
import { UnitTemplate } from "../templateinterfaces/UnitTemplate";
import { activeModuleData } from "../app/activeModuleData";
import { getAlwaysAvailableBuildableThings } from "./getAlwaysAvailableBuildableThings";


export function getBuildableUnitsForRace(race: RaceTemplate): UnitTemplate[]
{
  const alwaysBuildableUnits = getAlwaysAvailableBuildableThings(activeModuleData.templates.units);
  const racialBuildableUnits = race.getBuildableUnits();

  return [...alwaysBuildableUnits, ...racialBuildableUnits];
}
