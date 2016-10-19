// used as-is for independent races. extended by PlayerRaceTemplate for player races

import UnitTemplate from "./UnitTemplate";
import BuildingTemplate from "./BuildingTemplate";
import NameTemplate from "./NameTemplate";
import PortraitTemplate from "./PortraitTemplate";
import ItemTemplate from "./ItemTemplate";
import {DistributionData} from "./DistributionData";

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

  // getUnitName(unit: Unit): NameTemplate;
  getUnitPortrait(unit: Unit): PortraitTemplate;
}
