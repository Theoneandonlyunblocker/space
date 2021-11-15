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
  targetEnemies,
} from "core/src/abilities/targeting";

import * as DroneBattleVfx from "../../battlevfx/templates";
import { localize } from "../../../localization/localize";
import { dealAttackDamage } from "modules/baselib/src/combat/actions/dealAttackDamage";
import { leechLife } from "modules/baselib/src/combat/actions/leechLife";
import { lifeLeechIncreasesMaxHealth } from "modules/baselib/src/combat/resultModifiers/lifeLeechIncreasesMaxHealth";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";


export const assimilate: CombatAbilityTemplate =
{
  key: "assimilate",
  get displayName()
  {
    return localize("assimilate_displayName").toString();
  },
  get description()
  {
    return localize("assimilate_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  },
  {
    areaFN: user => [user],
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Positive,
  }),
  use: (user, target, combatManager) =>
  {
    const dealDamageAction = dealAttackDamage(user, target, 0.8, physicalDamage);
    combatManager.addAction(mainPhase, dealDamageAction);

    const lifeLeechAction = leechLife(user, target, 0.1);
    lifeLeechAction.resultModifiers.push({modifier: lifeLeechIncreasesMaxHealth, value: 1});
    combatManager.attachAction(lifeLeechAction, dealDamageAction);
  },
  vfx: DroneBattleVfx.assimilate,
};
