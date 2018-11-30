import {ExecutedEffectsResult} from "../../src/templateinterfaces/AbilityEffectAction";
import AbilityTemplate from "../../src/templateinterfaces/AbilityTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "../../src/AbilityTargetDisplayData";
import DamageType from "../../src/DamageType";
import
{
  areaAll,
  areaSingle,
  makeGetAbilityTargetDisplayDataFN,
  targetAllies,
  targetEnemies,
} from "../../src/targeting";

import {placeholder as placeholderSfx} from "../common/battlesfxtemplates/battleSfx";
import {ResultType} from "../common/effectactiontemplates/ResultType";
import * as EffectActions from "../common/effectactiontemplates/effectActions";

import * as DroneStatusEffects from "./unitEffects";


export const assimilate: AbilityTemplate =
{
  type: "assimilate",
  displayName: "Assimilate",
  description: "Deal damage and increase own troop size by 10% of damage dealt",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 0.8,
      damageType: DamageType.Physical,
    }),
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    sfx: placeholderSfx,
    attachedEffects:
    [
      {
        id: "increaseUserHealth",
        getUnitsInArea: user => [user],
        getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
        {
          areaFN: user => [user],
          targetType: AbilityTargetType.Primary,
          targetEffect: AbilityTargetEffect.Positive,
        }),
        executeAction: EffectActions.adjustCurrentAndMaxHealth.bind(null,
        {
          executedEffectsResultAdjustment: (executedEffectsResult: ExecutedEffectsResult) =>
          {
            const damageDealt = executedEffectsResult[ResultType.HealthChanged] || 0;

            return damageDealt * -0.1;
          },
        }),
      },
    ],
  },
};
export const merge: AbilityTemplate =
{
  type: "merge",
  displayName: "Merge",
  description: "Transfer up to 25% of own current health to target ally and increase target stats",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllies,
  mainEffect:
  {
    id: "removeOwnHealth",
    executeAction: EffectActions.adjustHealth.bind(null,
    {
      maxHealthPercentage: -0.25,
    }),
    getUnitsInArea: user => [user],
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: user => [user],
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    sfx: placeholderSfx,
  },
  secondaryEffects:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: areaSingle,
      getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
      {
        areaFN: areaSingle,
        targetType: AbilityTargetType.Primary,
        targetEffect: AbilityTargetEffect.Positive,
      }),
      trigger: (user, target, battle, executedEffectsResult) =>
      {
        return Boolean(executedEffectsResult[ResultType.HealthChanged]);
      },
      executeAction: EffectActions.addStatusEffect.bind(null,
      {
        duration: -1,
        template: DroneStatusEffects.merge,
      }),
    },
    {
      id: "addTargetHealth",
      getUnitsInArea: areaSingle,
      trigger: (user, target, battle, executedEffectsResult) =>
      {
        return Boolean(executedEffectsResult[ResultType.HealthChanged]);
      },
      executeAction: EffectActions.adjustHealth.bind(null,
      {
        executedEffectsResultAdjustment: (executedEffectsResult: ExecutedEffectsResult) =>
        {
          return -executedEffectsResult[ResultType.HealthChanged];
        },
      }),
    },
  ],
};
export const infest: AbilityTemplate =
{
  type: "infest",
  displayName: "Infest",
  description: "Increase target capture chance and deal damage over time",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "addStatusEffect",
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    executeAction: EffectActions.addStatusEffect.bind(null,
    {
      duration: 3,
      template: DroneStatusEffects.infest,
    }),
    sfx: placeholderSfx,
    attachedEffects:
    [
      {
        id: "increaseCaptureChance",
        getUnitsInArea: areaSingle,
        executeAction: EffectActions.increaseCaptureChance.bind(null,
        {
          flat: 0.4,
        }),
      },
    ],
  },
};
export const repair: AbilityTemplate =
{
  type: "repair",
  displayName: "Repair",
  description: "Restore health to one ally",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllies,
  mainEffect:
  {
    id: "heal",
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Positive,
    }),
    executeAction: EffectActions.adjustHealth.bind(null,
    {
      perUserUnit: 0.5,
    }),
    sfx: placeholderSfx,
  },
};
export const massRepair: AbilityTemplate =
{
  type: "massRepair",
  displayName: "Mass Repair",
  description: "Restore health to all allies",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllies,
  mainEffect:
  {
    id: "heal",
    getUnitsInArea: (user, target, battle) =>
    {
      return areaAll(user, target, battle).filter(unit =>
      {
        return unit && unit.isActiveInBattle && unit.battleStats.side === user.battleStats.side;
      });
    },
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
    executeAction: EffectActions.adjustHealth.bind(null,
    {
      perUserUnit: 0.33,
    }),
    sfx: placeholderSfx,
  },
};

export const abilityTemplates: TemplateCollection<AbilityTemplate> =
{
  [assimilate.type]: assimilate,
  [merge.type]: merge,
  [infest.type]: infest,
  [repair.type]: repair,
  [massRepair.type]: massRepair,
};
