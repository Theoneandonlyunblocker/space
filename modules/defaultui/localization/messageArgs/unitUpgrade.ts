export type UnitUpgrade =
{
  unitUpgradeHeader: [{unitName: string; currentLevel: number; nextLevel: number}];
  upgradeAttribute: [{attribute: string; currentLevel: number; nextLevel: number}];
  upgradeAbilitiesHeader: [];
  newAbility: [];
  learnAbility: [];
  upgradeSpecificAbility: [string];
  upgradeStats: [];
  upgradeUnit: [];
  clickToLevelUp: [];
  clickToLearnNewAbility: [];
  EXPReadOut: [{currentEXP: number; EXPToNextLevel: number}];
};
