import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { localize } from "modules/space/localization/localize";
import { targetEnemies, makeGetAbilityTargetDisplayDataFN, GetUnitsInAreaFN, areaOrthogonalNeighbors } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { makeFilteringUnitSelectFN, activeUnitsFilter } from "modules/common/src/combat/utility";
import { dealAttackDamage } from "modules/common/src/combat/actions/dealAttackDamage";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { rocketAttack as rocketAttackVfx } from "../../battlevfx/templates/battleVfx";


const bombAttackAreaFN: GetUnitsInAreaFN = (user, target, battle) =>
{
  return areaOrthogonalNeighbors(user, target, battle).filter(unit =>
    {
      return unit && unit.battleStats.side !== user.battleStats.side;
    });
};
export const bombAttack: CombatAbilityTemplate =
{
  key: "bombAttack",
  get displayName()
  {
    return localize("bombAttack_displayName");
  },
  get description()
  {
    return localize("bombAttack_description");
  },
  moveDelay: 120,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: makeFilteringUnitSelectFN(bombAttackAreaFN, activeUnitsFilter),
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    const unitsToHit = bombAttackAreaFN(user, target, combatManager.battle).filter(activeUnitsFilter);
    unitsToHit.forEach(unitToHit =>
    {
      const dealDamageAction = dealAttackDamage(user, unitToHit, 0.5, physicalDamage);
      combatManager.addQueuedAction(mainPhase, dealDamageAction);
    });
  },
  vfx: rocketAttackVfx,
};
