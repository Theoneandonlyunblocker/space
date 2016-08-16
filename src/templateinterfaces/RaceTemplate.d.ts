import TechnologyTemplate from "./TechnologyTemplate";
import UnitTemplate from "./UnitTemplate";
import BuildingTemplate from "./BuildingTemplate";
import CultureTemplate from "./CultureTemplate";
import PortraitTemplate from "./PortraitTemplate";
import ItemTemplate from "./ItemTemplate";

import Player from "../Player";
import Star from "../Star";
import Unit from "../Unit";
import BuildingUpgradeData from "../BuildingUpgradeData";

declare interface RaceTemplate
{
  name: string;

  startingTechnologies:
  {
    tech: TechnologyTemplate;
    level: number;
  }[];
  maxTechnologies:
  {
    tech: TechnologyTemplate;
    maxLevel: number;
  }[];

  getBuildableShipTypes(player: Player): UnitTemplate[];
  getBuildableItemTypes(player: Player): ItemTemplate[];

  getBuildableBuildings(star: Star): BuildingTemplate[];
  getBuildingUpgrades(star: Star): BuildingUpgradeData[];

  getUnitCulture(unit: Unit): CultureTemplate;
  getUnitPortrait(unit: Unit): PortraitTemplate;
}
