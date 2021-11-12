import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";
import { blockNegativeEffect } from "modules/baselib/src/combat/effects/blockNegativeEffect";


export const systemsHardening: PassiveSkillTemplate =
{
  key: "systemsHardening",
  get displayName()
  {
    return localize("systemsHardening_displayName").toString();
  },
  get description()
  {
    return localize("systemsHardening_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "systemsHardeningInBattle",
      battlePrepEffects:
      [
        {
          adjustment: {flat: 1},
          effect:
          {
            onBattlePrepStart: (strength, unit) =>
            {
              unit.battleStats.combatEffects.get(blockNegativeEffect).strength += strength;
            },
          },
        },
      ],
    },
  ],
};
