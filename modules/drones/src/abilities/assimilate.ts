import {ExecutedEffectsResult} from "core/src/templateinterfaces/ExecutedEffectsResult";
import {AbilityTemplate} from "core/src/templateinterfaces/AbilityTemplate";
import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import {DamageType} from "modules/space/src/effectactions/DamageType";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetEnemies,
} from "core/src/abilities/targeting";

import {ResultType} from "modules/space/src/effectactions/ResultType";
import * as EffectActions from "modules/space/src/effectactions/effectActions";

import * as DroneBattleVfx from "../battlevfx/templates";
import { localize } from "../../localization/localize";


export const assimilate: AbilityTemplate =
{
  type: "assimilate",
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
    vfx: DroneBattleVfx.assimilate,
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
