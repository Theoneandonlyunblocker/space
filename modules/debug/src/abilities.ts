import { localize } from "../localization/localize";
import { targetAll, areaSingle, makeGetAbilityTargetDisplayDataFN } from "core/src/abilities/targeting";
import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { increaseCaptureChance } from "modules/baselib/src/combat/actions/increaseCaptureChance";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import {makePlaceholderVfx} from "modules/baselib/src/makePlaceholderVfx";
import { dealAttackDamage } from "modules/baselib/src/combat/actions/dealAttackDamage";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { leechLife } from "modules/baselib/src/combat/actions/leechLife";
import { lifeLeechIncreasesMaxHealth } from "modules/baselib/src/combat/resultModifiers/lifeLeechIncreasesMaxHealth";


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

    const dealDamageAction = dealAttackDamage(user, target, 500, physicalDamage);
    combatManager.addAction(mainPhase, dealDamageAction);

    const lifeLeechAction = leechLife(user, target, 0.1);
    lifeLeechAction.resultModifiers.push({modifier: lifeLeechIncreasesMaxHealth, value: 1});
    combatManager.attachAction(lifeLeechAction, dealDamageAction);
  },
  vfx: makePlaceholderVfx("debugAbility"),
};
