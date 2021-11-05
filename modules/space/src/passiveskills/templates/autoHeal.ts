import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";

import { autoHeal as autoHealEffect } from "modules/space/src/combat/effects/autoHeal";


export const autoHeal: PassiveSkillTemplate =
{
  key: "autoHeal",
  get displayName()
  {
    return localize("autoHeal_displayName").toString();
  },
  get description()
  {
    return localize("autoHeal_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "autoHealInBattle",
      battlePrepEffects:
      [
        {
          adjustment: {flat: 50},
          effect:
          {
            onBattlePrepStart: (strength, unit) =>
            {
              unit.battleStats.combatEffects.get(autoHealEffect).strength += strength;
            },
          },
        },
      ],
    },
  ],
};
