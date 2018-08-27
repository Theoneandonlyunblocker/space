import BuildingUpgradeData from "../BuildingUpgradeData";
import {Fleet} from "../Fleet";
import Name from "../Name";
import Player from "../Player";
import Star from "../Star";
import Unit from "../Unit";

import AiTemplateConstructor from "./AITemplateConstructor";
import {BuildingTemplate} from "./BuildingTemplate";
import {DistributionData} from "./DistributionData";
import ItemTemplate from "./ItemTemplate";
import PortraitTemplate from "./PortraitTemplate";
import RaceTechnologyValue from "./RaceTechnologyValue";
import SubEmblemTemplate from "./SubEmblemTemplate";
import TemplateCollection from "./TemplateCollection";
import UnitTemplate from "./UnitTemplate";
import { Building } from "../Building";

export declare interface RaceTemplate
{
  type: string;
  displayName: Name;
  description: string;
  isNotPlayable?: boolean;
  distributionData: DistributionData;

  getBuildableUnits: () => UnitTemplate[];
  getBuildableItems: () => ItemTemplate[];
  getBuildableBuildings: () => BuildingTemplate[];
  getSpecialBuildingUpgrades?: (buildings: Building[], location: Star, player: Player) => BuildingUpgradeData[];

  // TODO 2016.10.19 | return Name instead
  getUnitName: (unitTemplate: UnitTemplate) => string;
  getUnitPortrait: (
    unitTemplate: UnitTemplate,
    allPortraitTemplates: TemplateCollection<PortraitTemplate>,
  ) => PortraitTemplate;

  generateIndependentPlayer: (
    allEmblemTemplates: TemplateCollection<SubEmblemTemplate>,
  ) => Player;
  generateIndependentFleets: (
    player: Player,
    location: Star,
    /**
     * strength of units compared to all other units
     */
    globalStrength: number,
    /**
     * strength of units compared to nearby units (same region etc.)
     */
    localStrength: number,
    maxUnitsPerSideInBattle: number,
  ) => Fleet[];

  technologies: RaceTechnologyValue[];
  getAiTemplateConstructor: (player: Player) => AiTemplateConstructor<any>;
}
