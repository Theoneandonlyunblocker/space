import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { localize } from "modules/space/localization/localize";
import { targetEnemies, makeGetAbilityTargetDisplayDataFN, areaRowNeighbors } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { makeFilteringUnitSelectFN, activeUnitsFilter } from "modules/common/src/combat/utility";
import { dealAttackDamage } from "modules/common/src/combat/actions/dealAttackDamage";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { rocketAttack as rocketAttackVfx } from "../../battlevfx/templates/battleVfx";


export const closeAttack: CombatAbilityTemplate =
{
  key: "closeAttack",
  get displayName()
  {
    return localize("closeAttack_displayName");
  },
  get description()
  {
    return localize("closeAttack_description");
  },
  moveDelay: 90,
  actionsUse: 2,
  getPossibleTargets: targetEnemies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: makeFilteringUnitSelectFN(areaRowNeighbors, activeUnitsFilter),
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    const unitsToHit = areaRowNeighbors(user, target, combatManager.battle).filter(activeUnitsFilter);
    unitsToHit.forEach(unitToHit =>
    {
      const dealDamageAction = dealAttackDamage(user, unitToHit, 0.66, physicalDamage);
      combatManager.addQueuedAction(mainPhase, dealDamageAction);
    });
  },
  vfx: rocketAttackVfx,
};
