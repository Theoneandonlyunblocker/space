import { Name } from "core/src/localization/Name";


export type GalaxyMapUI =
{
  technology: [];
  diplomacy: [];
  economy: [];
  production: [];
  equip: [];
  turnCounter: [];
  income: [];
  endTurn: [];
  mapMode: [];
  constructBuilding: [];
  upgradeBuilding: [];
  attackTarget_action: [];
  attackTargetTooltip: [{enemyName: Name; targetType: string}];
  coordinates: [string, string];
  terrainType: [string];

  topMenuButtonActionExplanation: [];
  topMenuButtonTooltip_production: [];
  topMenuButtonTooltip_equip: [];
  topMenuButtonTooltip_economy: [];
  topMenuButtonTooltip_diplomacy: [];
  topMenuButtonTooltip_technology: [];
  topMenuButtonTooltip_load: [];
  topMenuButtonTooltip_save: [];
  topMenuButtonTooltip_options: [];
  topMenuButtonTooltip_openCondensedMenu: [];
};
