import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";
import {adjustHealth} from "../effectactiontemplates/effectActions";
import {bindEffectActionData} from "../effectactiontemplates/effectActions";

const autoHeal: StatusEffectTemplate =
{
  type: "autoHeal",
  displayName: "Auto heal",
  description: "Restore 50 health after every action",

  afterAbilityUse:
  [
    {
      getUnitsInArea: (user) => [user],
      executeAction: bindEffectActionData(adjustHealth,
      {
        flat: 50
      }),
      trigger: (user) => user.currentHealth < user.maxHealth
    }
  ]
}

export default autoHeal;
