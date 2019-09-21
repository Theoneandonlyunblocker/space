import {AbilityTemplate} from "core/src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetAllAllies,
} from "core/src/abilities/targeting";

import {makePlaceholderVfx} from "modules/common/makePlaceholderVfx";
import * as EffectActions from "modules/space/src/effectactions/effectActions";
import { localize } from "../../localization/localize";


export const repair: AbilityTemplate =
{
  type: "repair",
  get displayName()
  {
    return localize("repair_displayName").toString();
  },
  get description()
  {
    return localize("repair_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllAllies,
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
    vfx: makePlaceholderVfx("repair"),
  },
};
