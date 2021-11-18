import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { RaceTemplate } from "core/src/templateinterfaces/RaceTemplate";
import { activeModuleData } from "core/src/app/activeModuleData";
import { getDefaultBuildableNonCoreThingsForRace } from "core/src/production/getDefaultBuildableNonCoreThingsForRace";
import { NonCoreModuleData } from "./nonCoreModuleData";
import { Manufactory } from "core/src/production/Manufactory";
import { getAlwaysAvailableBuildableThings } from "core/src/production/getAlwaysAvailableBuildableThings";
import { getUniqueArrayKeys } from "core/src/generic/utility";


export function getBuildableComponentsForRace(race: RaceTemplate): TitanComponentTemplate[]
{
  const titansModuleData = (activeModuleData.nonCoreData.titans as NonCoreModuleData);

  if (titansModuleData.getBuildableTitanComponentsForRace[race.key])
  {
    return titansModuleData.getBuildableTitanComponentsForRace[race.key]();
  }
  else
  {
    return getDefaultBuildableNonCoreThingsForRace(titansModuleData.titanComponents, race);
  }
}
export function getBuildableComponents(manufactory: Manufactory): TitanComponentTemplate[]
{
  const alwaysAvailableComponents = getAlwaysAvailableBuildableThings((activeModuleData.nonCoreData.titans as NonCoreModuleData).titanComponents);
  const ownerComponents = getBuildableComponentsForRace(manufactory.owner.race);
  const localComponents = getBuildableComponentsForRace(manufactory.star.localRace);

  const allComponents = [
    ...alwaysAvailableComponents,
    ...ownerComponents,
    ...localComponents,
  ];
  const uniqueComponents = getUniqueArrayKeys(allComponents, component => component.key);

  const manufacturableComponents = uniqueComponents.filter(component =>
  {
    return !component.techRequirements ||
      manufactory.owner.meetsTechRequirements(component.techRequirements);
  });

  return manufacturableComponents;
}
