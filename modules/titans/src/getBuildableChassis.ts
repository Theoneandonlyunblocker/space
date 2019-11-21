import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { RaceTemplate } from "core/src/templateinterfaces/RaceTemplate";
import { activeModuleData } from "core/src/app/activeModuleData";
import { getDefaultBuildableNonCoreThingsForRace } from "core/src/production/getDefaultBuildableNonCoreThingsForRace";
import { NonCoreModuleData } from "./nonCoreModuleData";
import { Manufactory } from "core/src/production/Manufactory";
import { getAlwaysAvailableBuildableThings } from "core/src/production/getAlwaysAvailableBuildableThings";
import { getUniqueArrayKeys } from "core/src/generic/utility";


export function getBuildableChassisForRace(race: RaceTemplate): TitanChassisTemplate[]
{
  const titansModuleData = (activeModuleData.nonCoreData.titans as NonCoreModuleData);

  if (titansModuleData.getBuildableTitanChassisForRace[race.type])
  {
    return titansModuleData.getBuildableTitanChassisForRace[race.type]();
  }
  else
  {
    return getDefaultBuildableNonCoreThingsForRace(titansModuleData.titanChassis, race);
  }
}
export function getBuildableChassis(manufactory: Manufactory): TitanChassisTemplate[]
{
  const alwaysAvailableChassis = getAlwaysAvailableBuildableThings((activeModuleData.nonCoreData.titans as NonCoreModuleData).titanChassis);
  const ownerChassis = getBuildableChassisForRace(manufactory.owner.race);
  const localChassis = getBuildableChassisForRace(manufactory.star.localRace);

  const allChassis = [
    ...alwaysAvailableChassis,
    ...ownerChassis,
    ...localChassis,
  ];
  const uniqueChassis = getUniqueArrayKeys(allChassis, chassis => chassis.type);

  const manufacturableChassis = uniqueChassis.filter(chassis =>
  {
    return !chassis.techRequirements ||
      manufactory.owner.meetsTechRequirements(chassis.techRequirements);
  });

  return manufacturableChassis;
}
