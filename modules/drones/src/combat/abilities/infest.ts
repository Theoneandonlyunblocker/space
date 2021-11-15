import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetEnemies,
} from "core/src/abilities/targeting";

import {makePlaceholderVfx} from "modules/baselib/src/makePlaceholderVfx";

import { localize } from "../../../localization/localize";
import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { increaseInfestationAmount } from "../actions/increaseInfestationAmount";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";


export const infest: CombatAbilityTemplate =
{
  key: "infest",
  get displayName()
  {
    return localize("infest_displayName").toString();
  },
  get description()
  {
    return localize("infest_description").toString();
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
    const addCombatEffectAction = increaseInfestationAmount(user, target, {flat: 1});
    combatManager.addAction(mainPhase, addCombatEffectAction);
  },
  vfx: makePlaceholderVfx("infest"),
};
