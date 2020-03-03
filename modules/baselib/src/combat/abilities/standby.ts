import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

import
{
  targetSelf,
} from "core/src/abilities/targeting";

import { localize } from "../../../localization/localize";
import { makePlaceholderVfx } from "modules/baselib/src/makePlaceholderVfx";


export const standby: CombatAbilityTemplate =
{
  key: "standby",
  get displayName()
  {
    return localize("standby_displayName").toString();
  },
  get description()
  {
    return localize("standby_description").toString();
  },
  moveDelay: 50,
  actionsUse: 1,
  getPossibleTargets: targetSelf,
  // tslint:disable-next-line
  getDisplayDataForTarget: () => {return {}},
  use: (user, target, combatManager) =>
  {

  },
  vfx: makePlaceholderVfx("standby"),
  AiEvaluationPriority: 0.6,
  AiScoreMultiplier: 0.6,
  disableInAiBattles: true,
};
