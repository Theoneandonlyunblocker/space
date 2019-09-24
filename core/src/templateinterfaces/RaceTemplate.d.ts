import {BuildingUpgradeData} from "../building/BuildingUpgradeData";
import {Fleet} from "../fleets/Fleet";
import {Name} from "../localization/Name";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {Unit} from "../unit/Unit";

import {AiTemplateConstructor} from "./AiTemplateConstructor";
import {BuildingTemplate} from "./BuildingTemplate";
import {DistributionData} from "./DistributionData";
import {ItemTemplate} from "./ItemTemplate";
import {PortraitTemplate} from "./PortraitTemplate";
import {RaceTechnologyValue} from "./RaceTechnologyValue";
import {SubEmblemTemplate} from "./SubEmblemTemplate";
import {TemplateCollection} from "./TemplateCollection";
import {UnitTemplate} from "./UnitTemplate";
import { Building } from "../building/Building";

export interface RaceTemplate
{
  type: string;
  displayName: Name;
  description: string;
  isNotPlayable?: boolean;
  distributionData: DistributionData;

  // these 4 are available
  //   globally to player of this race
  //   locally in any star with this race as the local race
  // if you want to limit something to only players of a certain race,
  // add a tech requirement only available to that race
  getBuildableUnits: () => UnitTemplate[];
  getBuildableItems: () => ItemTemplate[];
  getBuildableBuildings: () => BuildingTemplate[];
  getSpecialBuildingUpgrades?: (buildings: Building[], location: Star, player: Player) => BuildingUpgradeData[];

  getPlayerName: (player: Player) => Name;
  getFleetName: (fleet: Fleet) => Name;
  getUnitName: (unitTemplate: UnitTemplate) => Name;
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
