import GuardCoverage from "../../src/GuardCoverage";

export const battle =
{
  preparing_statusText: "Preparing",
  preparing_toolTip: "Unit is preparing to use ability",
  guard_statusText: "Guard",
  guard_chanceToProtect: `{protChance}% chance to protect ` +
    `{guardCoverage, select,` +
      `${GuardCoverage.Row} {units in same row.}` +
      `${GuardCoverage.All} {all units.}` +
    `}`,
  reducedPhysicalDamage: "This unit takes {damageReduction}% reduced damage from physical attacks.",
  destroyed_statusText: "Destroyed",
  captured_statusText: "Captured",
  unitAnnihilated: "Unit annihilated",
  delay_toolTip: "Delay: {0}",
  turnsLeft_toolTip: "Turns left: {0}",
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
};
