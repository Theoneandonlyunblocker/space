import {ExecutedEffectsResult} from "../../src/templateinterfaces/AbilityEffectAction";
import AbilityTemplate from "../../src/templateinterfaces/AbilityTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import DamageType from "../../src/DamageType";
import
{
  areaAll,
  areaSingle,

  targetAllies,
  targetEnemies,
} from "../../src/targeting";

import {placeholder as placeholderSFX} from "../common/battlesfxtemplates/battleSFX";
import * as EffectActions from "../common/effectactiontemplates/effectActions";
import
{
  bindEffectActionData,
  resultType,
} from "../common/effectactiontemplates/effectActions";

import * as DroneStatusEffects from "./statusEffects";

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
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 0.8,
      damageType: DamageType.physical,
    }),
    getUnitsInArea: areaSingle,
    sfx: placeholderSFX,
    attachedEffects:
    [
      {
        id: "increaseUserHealth",
        getUnitsInArea: user => [user],
        executeAction: bindEffectActionData(EffectActions.adjustCurrentAndMaxHealth,
        {
          executedEffectsResultAdjustment: (executedEffectsResult: ExecutedEffectsResult) =>
          {
            const damageDealt = executedEffectsResult[resultType.healthChanged] || 0;
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
    executeAction: bindEffectActionData(EffectActions.adjustHealth,
    {
      maxHealthPercentage: -0.25,
    }),
    getUnitsInArea: user => [user],
    sfx: placeholderSFX,
  },
  secondaryEffects:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: areaSingle,
      trigger: (user, target, battle, executedEffectsResult) =>
      {
        return Boolean(executedEffectsResult[resultType.healthChanged]);
      },
      executeAction: bindEffectActionData(EffectActions.addStatusEffect,
      {
        duration: -1,
        template: DroneStatusEffects.merge,
      }),
      attachedEffects:
      [
        {
          id: "addTargetHealth",
          getUnitsInArea: areaSingle,
          trigger: (user, target, battle, executedEffectsResult) =>
          {
            return Boolean(executedEffectsResult[resultType.healthChanged]);
          },
          executeAction: bindEffectActionData(EffectActions.adjustHealth,
          {
            executedEffectsResultAdjustment: (executedEffectsResult: ExecutedEffectsResult) =>
            {
              return -executedEffectsResult[resultType.healthChanged];
            },
          }),
        },
      ],
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
    executeAction: bindEffectActionData(EffectActions.addStatusEffect,
    {
      duration: 3,
      template: DroneStatusEffects.infest,
    }),
    sfx: placeholderSFX,
    attachedEffects:
    [
      {
        id: "increaseCaptureChance",
        getUnitsInArea: areaSingle,
        executeAction: bindEffectActionData(EffectActions.increaseCaptureChance,
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
    executeAction: bindEffectActionData(EffectActions.adjustHealth,
    {
      perUserUnit: 0.5,
    }),
    sfx: placeholderSFX,
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
    getUnitsInArea: areaAll,
    executeAction: bindEffectActionData(EffectActions.adjustHealth,
    {
      perUserUnit: 0.33,
    }),
    sfx: placeholderSFX,
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
