import RaceTechnologyValue from "./RaceTechnologyValue";
import UnitTemplate from "./UnitTemplate";
import BuildingTemplate from "./BuildingTemplate";
import CultureTemplate from "./CultureTemplate";
import PortraitTemplate from "./PortraitTemplate";
import ItemTemplate from "./ItemTemplate";
import AITemplateConstructor from "./AITemplateConstructor";

import Player from "../Player";
import Star from "../Star";
import Unit from "../Unit";
import BuildingUpgradeData from "../BuildingUpgradeData";

declare interface RaceTemplate
{
  key: string;
  displayName: string;
  description: string;

  technologies: RaceTechnologyValue[];

  // getBuildableShipTypes(player: Player): UnitTemplate[];
  // getBuildableItemTypes(player: Player): ItemTemplate[];

  // getBuildableBuildings(star: Star): BuildingTemplate[];
  // getBuildingUpgrades(star: Star): BuildingUpgradeData[];

  // getUnitCulture(unit: Unit): CultureTemplate;
  // getUnitPortrait(unit: Unit): PortraitTemplate;
  getAITemplateConstructor(player: Player): AITemplateConstructor<any>;
}

export default RaceTemplate;
