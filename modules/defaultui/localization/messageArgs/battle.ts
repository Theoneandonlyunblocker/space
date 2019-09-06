import {GuardCoverage} from "core/unit/GuardCoverage";


export type Battle =
{
  preparing_statusText: [];
  preparing_tooltip: [];
  guard_statusText: [];
  guard_chanceToProtect: [{protChance: number; guardCoverage: GuardCoverage}];
  reducedPhysicalDamage: [{damageReduction: number}];
  destroyed_statusText: [];
  captured_statusText: [];
  unitAnnihilated: [];
  delay_tooltip: [number];
  turnsLeft_tooltip: [number];
  battleFinish_victory: [];
  battleFinish_loss: [];
  battleFinish_clickAnywhereToContinue: [];

  simulateBattle: [];
  startBattle: [];
  autoFormation: [];
  enemy: [];
  cantInspectEnemyFormationAsStarIsNotInDetectionRadius: [];
  ownFormation: [];
  attacking: [];
  defending: [];

  notEnoughUnitsPlaced: [{minUnits: number}];

  battlePrepValidityModifierEffect_minUnits: [{minUnits: number}];

  battlePrepValidityModifierSource_offensiveBattle: [];
  battlePrepValidityModifierSource_attackedInEnemyTerritory: [];
  battlePrepValidityModifierSource_attackedInNeutralTerritory: [];
  battlePrepValidityModifierSource_passiveAbility_unknown: [];
  battlePrepValidityModifierSource_passiveAbility_known: [{abilityName: string; unitName: string}];
};
