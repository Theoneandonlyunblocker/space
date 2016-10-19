// used as-is for independent races. extended by PlayerRaceTemplate for player races

import UnitTemplate from "./UnitTemplate";
import BuildingTemplate from "./BuildingTemplate";
import PortraitTemplate from "./PortraitTemplate";
import ItemTemplate from "./ItemTemplate";
import {DistributionData} from "./DistributionData";
import TemplateCollection from "./TemplateCollection";

import Player from "../Player";
import Star from "../Star";
import Unit from "../Unit";
import BuildingUpgradeData from "../BuildingUpgradeData";

export declare interface RaceTemplate
{
  type: string;
  displayName: string;
  description: string;
  isNotPlayable?: boolean;
  distributionData: DistributionData;

  // TODO 11.10.2016 | implement this stuff
  getBuildableUnitTypes(player: Player): UnitTemplate[];
  // getBuildableItemTypes(player: Player): ItemTemplate[];

  // getBuildableBuildings(star: Star): BuildingTemplate[];
  // getBuildingUpgrades(star: Star): BuildingUpgradeData[];

  // TODO 19.10.2016 | return Name instead
  getUnitName(unitTemplate: UnitTemplate): string;
  getUnitPortrait(
    unitTemplate: UnitTemplate,
    allPortraitTemplates: TemplateCollection<PortraitTemplate>
  ): PortraitTemplate;
}
