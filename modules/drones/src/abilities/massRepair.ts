import {AbilityTemplate} from "core/src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  areaAll,
  targetAllAllies,
} from "core/src/abilities/targeting";

import {makePlaceholderVfx} from "modules/common/makePlaceholderVfx";
import * as EffectActions from "modules/space/src/effectactions/effectActions";
import { localize } from "../../localization/localize";


export const massRepair: AbilityTemplate =
{
  type: "massRepair",
  get displayName()
  {
    return localize("massRepair_displayName").toString();
  },
  get description()
  {
    return localize("massRepair_description").toString();
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
