import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetAllAllies,
} from "core/src/abilities/targeting";

import {makePlaceholderVfx} from "modules/common/makePlaceholderVfx";
import { localize } from "../../../localization/localize";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { healTarget } from "modules/common/src/combat/actions/healTarget";


export const repair: CombatAbilityTemplate =
{
  key: "repair",
  get displayName()
  {
    return localize("repair_displayName").toString();
  },
  get description()
  {
    return localize("repair_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllAllies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Positive,
  }),
  use: (user, target, combatManager) =>
  {
    // TODO 2020.02.20 | need to make shit that scales with troop size
    const healAmount = 200;

    combatManager.addQueuedAction(
      mainPhase,
      healTarget(user, target, healAmount),
    );
  },
  vfx: makePlaceholderVfx("repair"),
};
