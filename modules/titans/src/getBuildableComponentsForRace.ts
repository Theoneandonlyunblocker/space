import { TitanComponent } from "./TitanComponent";
import { RaceTemplate } from "core/src/templateinterfaces/RaceTemplate";
import { activeModuleData } from "core/src/app/activeModuleData";
import { getDefaultBuildableNonCoreThingsForRace } from "core/src/production/getDefaultBuildableNonCoreThingsForRace";
import { NonCoreModuleData } from "./nonCoreModuleData";


export function getBuildableComponentsForRace(race: RaceTemplate): TitanComponent[]
{
  const titansModuleData = (activeModuleData.nonCoreData.titans as NonCoreModuleData);

  if (titansModuleData.getBuildableTitanComponentsForRace[race.type])
  {
    return titansModuleData.getBuildableTitanComponentsForRace[race.type]();
  }
  else
  {
    return getDefaultBuildableNonCoreThingsForRace(titansModuleData.titanComponents, race);
  }
}
