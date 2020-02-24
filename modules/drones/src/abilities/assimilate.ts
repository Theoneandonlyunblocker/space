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

import * as DroneBattleVfx from "../battlevfx/templates";
import { localize } from "../../localization/localize";
import { dealAttackDamage } from "modules/common/src/combat/actions/dealAttackDamage";
import { leechLife } from "modules/common/src/combat/actions/leechLife";
import { lifeLeechIncreasesMaxHealth } from "modules/common/src/combat/resultModifiers/lifeLeechIncreasesMaxHealth";
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
  // TODO 2020.02.20 | currently only shows target being damaged, needs to show user being buffed as well
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: areaSingle,
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Negative,
  }),
  use: (user, target, combatManager) =>
  {
    // deal physical damage @ 0.8 normal
    // TODO 2020.02.24 |
    const dealDamageAction = dealAttackDamage(user, target, 0.8, physicalDamage);
    combatManager.addQueuedAction(mainPhase, dealDamageAction);

    // increase current & max health
    const lifeLeechAction = leechLife(user, target, 0.1);
    lifeLeechAction.resultModifiers.push({modifier: lifeLeechIncreasesMaxHealth, value: 1});
    combatManager.attachAction(lifeLeechAction, dealDamageAction);
  },
  vfx: DroneBattleVfx.assimilate,
};
