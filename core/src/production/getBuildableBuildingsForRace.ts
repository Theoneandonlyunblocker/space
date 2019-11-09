import { RaceTemplate } from "../templateinterfaces/RaceTemplate";
import { BuildingTemplate } from "../templateinterfaces/BuildingTemplate";
import { activeModuleData } from "../app/activeModuleData";
import { getAlwaysAvailableBuildableThings } from "./getAlwaysAvailableBuildableThings";


export function getBuildableBuildingsForRace(race: RaceTemplate): BuildingTemplate[]
{
  const alwaysBuildableBuildings = getAlwaysAvailableBuildableThings(activeModuleData.templates.Buildings);
  const racialBuildableBuildings = race.getBuildableBuildings();

  return [...alwaysBuildableBuildings, ...racialBuildableBuildings];
}
