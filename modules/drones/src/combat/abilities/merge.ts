import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  targetOtherAllies,
  areaSingle,
} from "core/src/abilities/targeting";

import { localize } from "../../../localization/localize";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { makePlaceholderVfx } from "modules/common/makePlaceholderVfx";
import { losePercentMaxHealth } from "modules/common/src/combat/actions/losePercentMaxHealth";
import { increaseMergeBuffAmount } from "../actions/increaseMergeBuffAmount";
import { leechLife } from "modules/common/src/combat/actions/leechLife";


export const merge: CombatAbilityTemplate =
{
  key: "merge",
  get displayName()
  {
    return localize("merge_displayName").toString();
  },
  get description()
  {
    return localize("merge_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetOtherAllies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: user => [user],
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  },
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Positive,
  }),
  use: (user, target, combatManager) =>
  {
    // vfx: DroneBattleVfx.mergeRelease,
    const damageSelfAction = losePercentMaxHealth(user, user, 0.25);
    combatManager.addQueuedAction(mainPhase, damageSelfAction);

    // vfx: DroneBattleVfx.mergeAbsorb,
    const addCombatEffectAction = increaseMergeBuffAmount(user, target, {flat: 1});
    combatManager.addQueuedAction(mainPhase, addCombatEffectAction);

    const healTargetAction = leechLife(target, user, 1);
    combatManager.attachAction(healTargetAction, damageSelfAction);
  },
  vfx: makePlaceholderVfx("merge"),
};
