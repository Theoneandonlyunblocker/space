import {AbilityTemplate} from "core/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetEnemies,
} from "core/abilities/targeting";

import {makePlaceholderVfx} from "modules/common/makePlaceholderVfx";
import * as EffectActions from "modules/space/effectactions/effectActions";

import * as DroneStatusEffects from "../unitEffects";
import { localize } from "../localization/localize";


export const infest: AbilityTemplate =
{
  type: "infest",
  get displayName()
  {
    return localize("infest_displayName").toString();
  },
  get description()
  {
    return localize("infest_description").toString();
  },
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
