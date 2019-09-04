import { Name } from "src/localization/Name";


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
  buildingCost: [];
  buildingTypeName: [];
  attackTarget_action: [];
  attackTargetTooltip: [{enemyName: Name; targetType: string}];
  coordinates: [string, string];
  terrainType: [string];
  incomeAmount: [number];

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
