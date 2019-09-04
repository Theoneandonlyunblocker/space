import {UnitEffectTemplate} from "../../../src/templateinterfaces/UnitEffectTemplate";
import {adjustHealth} from "../effectactions/effectActions";
import { localize } from "./localization/localize";


export const autoHeal: UnitEffectTemplate =
{
  type: "autoHeal",
  get displayName()
  {
    return localize("autoHeal_displayName").toString();
  },
  get description()
  {
    return localize("autoHeal_description").toString();
  },

  afterAbilityUse:
  [
    {
      id: "heal",
      getUnitsInArea: user => [user],
      executeAction: adjustHealth.bind(null,
      {
        flat: 50,
      }),
      trigger: user => user.currentHealth < user.maxHealth,
    },
  ],
};
