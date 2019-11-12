import { AbilityTemplate } from "core/src/templateinterfaces/AbilityTemplate";
import { localize } from "../localization/localize";
import { targetAll, areaSingle, makeGetAbilityTargetDisplayDataFN } from "core/src/abilities/targeting";
import { AbilityTargetType, AbilityTargetEffect } from "core/src/abilities/AbilityTargetDisplayData";
import * as BattleVfx from "modules/space/src/battlevfx/templates/battleVfx";
import * as EffectActions from "modules/space/src/effectactions/effectActions";


export const debugAbility: AbilityTemplate =
{
  type: "debugAbility",
  get displayName()
  {
    return localize("debugAbility_displayName");
  },
  get description()
  {
    return localize("debugAbility_description");
  },
  moveDelay: 0,
  actionsUse: 1,
  getPossibleTargets: targetAll,
  mainEffect:
  {
    id: "debugAbility",
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Positive,
    }),
    executeAction: EffectActions.increaseCaptureChance.bind(null,
    {
      flat: 1,
    }),
    vfx: BattleVfx.guard,
  },
};
