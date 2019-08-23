import {AbilityTemplate} from "../../../src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "../../../src/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetEnemies,
} from "../../../src/targeting";

import {makePlaceholderVfx} from "../../common/makePlaceholderVfx";
import * as EffectActions from "../../space/effectactions/effectActions";

import * as DroneStatusEffects from "../unitEffects";


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
    vfx: makePlaceholderVfx("infest"),
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
