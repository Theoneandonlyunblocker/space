import {AbilityTemplate} from "../../../src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "../../../src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaAll,
  targetAllAllies,
} from "../../../src/abilities/targeting";

import {makePlaceholderVfx} from "../../common/makePlaceholderVfx";
import * as EffectActions from "../../space/effectactions/effectActions";
import { localize } from "../localization/localize";


export const massRepair: AbilityTemplate =
{
  type: "massRepair",
  get displayName()
  {
    return localize("massRepair_displayName")();
  },
  get description()
  {
    return localize("massRepair_description")();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetAllAllies,
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
    vfx: makePlaceholderVfx("massRepair"),
  },
};
