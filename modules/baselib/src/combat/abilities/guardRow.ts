import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import
{
  makeGetAbilityTargetDisplayDataFN,
  targetSelf,
  areaRow,
} from "core/src/abilities/targeting";

import { localize } from "../../../localization/localize";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { guardVfx } from "../vfx/guardVfx";
import { makeFilteringUnitSelectFN, activeUnitsFilter } from "../utility";
import { addGuard } from "../actions/addGuard";
import { GuardCoverage } from "core/src/unit/GuardCoverage";


export const guardRow: CombatAbilityTemplate =
{
  key: "guardRow",
  get displayName()
  {
    return localize("guardRow_displayName").toString();
  },
  get description()
  {
    return localize("guardRow_description").toString();
  },
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetSelf,
  getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
  {
    areaFN: makeFilteringUnitSelectFN(areaRow, activeUnitsFilter),
    targetType: AbilityTargetType.Primary,
    targetEffect: AbilityTargetEffect.Positive,
  }),
  use: (user, target, combatManager) =>
  {
    const addGuardAction = addGuard(user, target, GuardCoverage.Row,
    {
      perAttribute: {intelligence: {flatPerPoint: 20}},
    });
    combatManager.addQueuedAction(mainPhase, addGuardAction);
  },
  vfx: guardVfx,
};
