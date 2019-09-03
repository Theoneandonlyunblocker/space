import {AbilityTemplate} from "../../../src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "../../../src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaSingle,
  targetAllAllies,
} from "../../../src/abilities/targeting";

import {makePlaceholderVfx} from "../../common/makePlaceholderVfx";
import * as EffectActions from "../../space/effectactions/effectActions";
import { localize } from "../localization/localize";


export const repair: AbilityTemplate =
{
  type: "repair",
  get displayName()
  {
    return localize("repair_displayName")();
  },
  get description()
  {
    return localize("repair_description")();
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
