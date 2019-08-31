import {GuardCoverage} from "../../../../src/unit/GuardCoverage";


export const battle =
{
  preparing_statusText: "Preparing",
  preparing_tooltip: "Unit is preparing to use ability",
  guard_statusText: "Guard",
  guard_chanceToProtect: "{protChance}% chance to protect " +
    "{guardCoverage, select," +
      `${GuardCoverage.Row} {units in same row.}` +
      `${GuardCoverage.All} {all units.}` +
      "other {INVALID_VALUE guardCoverage {guardCoverage}}" +
    "}",
  reducedPhysicalDamage: "This unit takes {damageReduction}% reduced damage from physical attacks.",
  destroyed_statusText: "Destroyed",
  captured_statusText: "Captured",
  unitAnnihilated: "Unit annihilated",
  delay_tooltip: "Delay: {0}",
  turnsLeft_tooltip: "Turns left: {0}",
  battleFinish_victory: "You win",
  battleFinish_loss: "You lose",
  battleFinish_clickAnywhereToContinue: "Click anywhere to continue",

  simulateBattle: "Simulate battle",
  startBattle: "Start battle",
  autoFormation: "Auto formation",
  enemy: "Enemy",
  cantInspectEnemyFormationAsStarIsNotInDetectionRadius: "Can't inspect enemy formation as star is not in detection radius",
  ownFormation: "Own",
  attacking: "Attacking",
  defending: "Defending",

  notEnoughUnitsPlaced: "Must place at least {minUnits} " +
    "{minUnits, plural," +
      "  one {unit}" +
      "other {units}" +
    "}.",

  battlePrepValidityModifierEffect_minUnits: "Minimum units placed {minUnits, signedNumber}",

  battlePrepValidityModifierSource_offensiveBattle: "due to fighting offensive battle.",
  battlePrepValidityModifierSource_attackedInEnemyTerritory: "due to being attacked in hostile territory.",
  battlePrepValidityModifierSource_attackedInNeutralTerritory: "due to being attacked in neutral territory.",
  battlePrepValidityModifierSource_passiveAbility_unknown: "due to an unknown enemy ability.",
  battlePrepValidityModifierSource_passiveAbility_known: "due to ability {abilityName} on unit {unitName}.",
};
