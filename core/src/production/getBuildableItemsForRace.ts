import { RaceTemplate } from "../templateinterfaces/RaceTemplate";
import { ItemTemplate } from "../templateinterfaces/ItemTemplate";
import { activeModuleData } from "../app/activeModuleData";
import { getAlwaysAvailableBuildableThings } from "./getAlwaysAvailableBuildableThings";


export function getBuildableItemsForRace(race: RaceTemplate): ItemTemplate[]
{
  const alwaysBuildableItems = getAlwaysAvailableBuildableThings(activeModuleData.templates.items);
  const racialBuildableItems = race.getBuildableItems();

  return [...alwaysBuildableItems, ...racialBuildableItems];
}
