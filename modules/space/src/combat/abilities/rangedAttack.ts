import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { localize } from "modules/space/localization/localize";
import { targetEnemies, makeGetAbilityTargetDisplayDataFN, areaSingle } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import { dealAttackDamage } from "modules/common/src/combat/actions/dealAttackDamage";
import { rocketAttack as rocketAttackVfx } from "../../battlevfx/templates/battleVfx";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { bombAttack } from "./bombAttack";
import { boardingHook } from "./boardingHook";


export const rangedAttack: CombatAbilityTemplate =
{
  key: "rangedAttack",
  get displayName()
  {
    return localize("rangedAttack_displayName");
  },
  get description()
  {
    return localize("rangedAttack_description");
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
    const dealDamageAction = dealAttackDamage(user, target, 1, physicalDamage);
    combatManager.addQueuedAction(mainPhase, dealDamageAction);
  },
  vfx: rocketAttackVfx,
  defaultUpgrades:
  [
    {
      weight: 1,
      probabilityItems: [bombAttack],
    },
    {
      weight: 1,
      probabilityItems: [boardingHook],
    },
  ],
};
