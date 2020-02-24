import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaAll,
  targetAllAllies,
} from "core/src/abilities/targeting";

import {makePlaceholderVfx} from "modules/common/makePlaceholderVfx";
import { localize } from "../../localization/localize";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { healTarget } from "modules/common/src/combat/actions/healTarget";


export const massRepair: CombatAbilityTemplate =
{
  key: "massRepair",
  get displayName()
  {
    return localize("massRepair_displayName").toString();
  },
  get description()
  {
    return localize("massRepair_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllAllies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: (user, target, battle) =>
    {
      return areaAll(user, target, battle).filter(unit =>
      {
        return unit && unit.isActiveInBattle && unit.battleStats.side === user.battleStats.side;
      });
    },
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Positive,
  }),
  use: (user, target, combatManager) =>
  {
    // TODO 2020.02.20 | need to make shit that scales with troop size
    const healAmount = 100;

    const unitsToHeal = areaAll(user, target, combatManager.battle).filter(unit =>
    {
      return unit && unit.isActiveInBattle && unit.battleStats.side === user.battleStats.side;
    });

    unitsToHeal.forEach(unitToHeal =>
    {
      combatManager.addQueuedAction(
        mainPhase,
        healTarget(user, target, healAmount),
      );
    });
  },
  vfx: makePlaceholderVfx("massRepair"),
};
