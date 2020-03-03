import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { localize } from "modules/space/localization/localize";
import { targetEnemies, makeGetAbilityTargetDisplayDataFN, areaColumn } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { makeFilteringUnitSelectFN, activeUnitsFilter } from "modules/baselib/src/combat/utility";
import { dealAttackDamage } from "modules/baselib/src/combat/actions/dealAttackDamage";
import { beam as beamVfx } from "../../battlevfx/templates/battleVfx";
import { magicalDamage } from "core/src/combat/core/primitives/magicalDamage";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";


export const beamAttack: CombatAbilityTemplate =
{
  key: "beamAttack",
  get displayName()
  {
    return localize("beamAttack_displayName");
  },
  get description()
  {
    return localize("beamAttack_description");
  },
  moveDelay: 300,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: makeFilteringUnitSelectFN(areaColumn, activeUnitsFilter),
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    const unitsToHit = areaColumn(user, target, combatManager.battle).filter(activeUnitsFilter);
    unitsToHit.forEach(unitToHit =>
    {
      const dealDamageAction = dealAttackDamage(user, unitToHit, 0.8, magicalDamage);
      combatManager.addQueuedAction(mainPhase, dealDamageAction);
    });
  },
  vfx: beamVfx,
  targetCannotBeDiverted: true,
};
