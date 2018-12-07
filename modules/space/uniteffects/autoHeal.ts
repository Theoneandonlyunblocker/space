import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";
import {adjustHealth} from "../effectactions/effectActions";


const autoHeal: UnitEffectTemplate =
{
  type: "autoHeal",
  displayName: "Auto heal",
  description: "Restore 50 health after every action",

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

export default autoHeal;
