import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import {UnitAttribute} from "core/src/unit/UnitAttributes";
import
{
  areaSingle,
  makeGetAbilityTargetDisplayDataFN,
  targetEnemies,
} from "core/src/abilities/targeting";

import { localize } from "modules/space/localization/localize";
import { BattleVfxTemplate } from "core/src/templateinterfaces/BattleVfxTemplate";
import
{
  snipeAttack as snipeAttackVfx,
  snipeDefence as snipeDefenceVfx,
  snipeIntelligence as snipeIntelligenceVfx,
  snipeSpeed as snipeSpeedVfx,
} from "modules/space/src/battlevfx/templates/battleVfx";

import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { dealAttackDamage } from "modules/common/src/combat/actions/dealAttackDamage";
import { physicalDamage } from "core/src/combat/core/primitives/physicalDamage";
import { increaseSnipeDebuff } from "../actions/increaseSnipeDebuff";


export const snipeAttack = makeSnipeTemplate(UnitAttribute.Attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.Speed);

function makeSnipeTemplate(attribute: UnitAttribute): CombatAbilityTemplate
{
  let abilityKey: "snipeAttack" | "snipeDefence" | "snipeIntelligence" | "snipeSpeed";
  let battleVfx: BattleVfxTemplate;
  let displayNameKey: "snipeAttack_displayName" | "snipeDefence_displayName" | "snipeIntelligence_displayName" | "snipeSpeed_displayName";
  let descriptionKey: "snipeAttack_description" | "snipeDefence_description" | "snipeIntelligence_description" | "snipeSpeed_description";

  switch (attribute)
  {
    case UnitAttribute.Attack:
    {
      abilityKey = "snipeAttack";
      displayNameKey = "snipeAttack_displayName";
      descriptionKey = "snipeAttack_description";
      battleVfx = snipeAttackVfx;

      break;
    }
    case UnitAttribute.Defence:
    {
      abilityKey = "snipeDefence";
      displayNameKey = "snipeDefence_displayName";
      descriptionKey = "snipeDefence_description";
      battleVfx = snipeDefenceVfx;

      break;
    }
    case UnitAttribute.Intelligence:
    {
      abilityKey = "snipeIntelligence";
      displayNameKey = "snipeIntelligence_displayName";
      descriptionKey = "snipeIntelligence_description";
      battleVfx = snipeIntelligenceVfx;

      break;
    }
    case UnitAttribute.Speed:
    {
      abilityKey = "snipeSpeed";
      displayNameKey = "snipeSpeed_displayName";
      descriptionKey = "snipeSpeed_description";
      battleVfx = snipeSpeedVfx;

      break;
    }
  }

  return(
  {
    key: abilityKey,
    get displayName()
    {
      return localize(displayNameKey);
    },
    get description()
    {
      return localize(descriptionKey);
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
      const dealDamageAction = dealAttackDamage(user, target, 0.6, physicalDamage);
      combatManager.addQueuedAction(mainPhase, dealDamageAction);

      const addStatusEffectAction = increaseSnipeDebuff(user, target, attribute, {flat: 1});
      combatManager.addQueuedAction(mainPhase, addStatusEffectAction);
    },
    vfx: battleVfx,
  });
}
