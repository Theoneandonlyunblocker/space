import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { localize } from "modules/space/localization/localize";
import { targetEnemies, makeGetAbilityTargetDisplayDataFN, areaSingle } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { dealAttackDamage } from "modules/baselib/src/combat/actions/dealAttackDamage";
import { increaseCaptureChance } from "modules/baselib/src/combat/actions/increaseCaptureChance";
import { boardingHook as boardingHookVfx } from "../../battlevfx/templates/battleVfx";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";


export const boardingHook: CombatAbilityTemplate =
{
  key: "boardingHook",
  get displayName()
  {
    return localize("boardingHook_displayName");
  },
  get description()
  {
    return localize("boardingHook_description");
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    const dealDamageAction = dealAttackDamage(user, target, 0.8, physicalDamage);
    combatManager.addQueuedAction(mainPhase, dealDamageAction);

    const increaseCaptureChanceAction = increaseCaptureChance(user, target, 0.5);
    combatManager.addQueuedAction(mainPhase, increaseCaptureChanceAction);
  },
  vfx: boardingHookVfx,
};
