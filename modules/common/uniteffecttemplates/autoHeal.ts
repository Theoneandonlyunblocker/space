import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";
import {bindEffectActionData} from "../effectactiontemplates/effectActionBinding";
import {adjustHealth} from "../effectactiontemplates/effectActions";


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
      executeAction: bindEffectActionData(adjustHealth,
      {
        flat: 50,
      }),
      trigger: user => user.currentHealth < user.maxHealth,
    },
  ],
};

export default autoHeal;
