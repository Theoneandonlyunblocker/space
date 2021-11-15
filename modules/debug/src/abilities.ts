import { localize } from "../localization/localize";
import { targetAll, areaSingle, makeGetAbilityTargetDisplayDataFN } from "core/src/abilities/targeting";
import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { increaseCaptureChance } from "modules/baselib/src/combat/actions/increaseCaptureChance";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import {makePlaceholderVfx} from "modules/baselib/src/makePlaceholderVfx";


export const debugAbility: CombatAbilityTemplate =
{
  key: "debugAbility",
  get displayName()
  {
    return localize("debugAbility_displayName");
  },
  get description()
  {
    return localize("debugAbility_description");
  },
  moveDelay: 0,
  actionsUse: 1,
  getPossibleTargets: targetAll,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    const increaseCaptureChanceAction = increaseCaptureChance(user, target, 1);
    combatManager.addAction(mainPhase, increaseCaptureChanceAction);
  },
  vfx: makePlaceholderVfx("debugAbility"),
};
