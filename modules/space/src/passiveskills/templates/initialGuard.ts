import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";

import { GuardCoverage } from "core/src/unit/GuardCoverage";


export const initialGuard: PassiveSkillTemplate =
{
  key: "initialGuard",
  get displayName()
  {
    return localize("initialGuard_displayName").toString();
  },
  get description()
  {
    return localize("initialGuard_description").toString();
  },
  isHidden: true,
  mapLevelModifiers:
  [
    {
      key: "addInitialGuardInBattle",
      battlePrepEffects:
      [
        {
          adjustment: {flat: 50},
          effect:
          {
            onBattlePrepStart: (strength, unit) =>
            {
              unit.battleStats.guardCoverage = GuardCoverage.Row;
              unit.battleStats.guardAmount = strength;
            },
          },
        },
      ],
    },
  ],
};
