import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { RaceTemplate } from "core/src/templateinterfaces/RaceTemplate";
import { activeModuleData } from "core/src/app/activeModuleData";
import { getDefaultBuildableNonCoreThingsForRace } from "core/src/production/getDefaultBuildableNonCoreThingsForRace";
import { NonCoreModuleData } from "./nonCoreModuleData";


export function getBuildableComponentsForRace(race: RaceTemplate): TitanComponentTemplate[]
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
