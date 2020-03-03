import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { damageDealt } from "core/src/combat/core/resultTemplates/damageDealt";
import { restoreHealth } from "../actions/restoreHealth";
import { increaseMaxHealth } from "../actions/increaseMaxHealth";


export const lifeLeechedIntoMaxHealth: CombatActionResultTemplate<number> =
{
  key: "lifeLeechedIntoMaxHealth",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager, parentAction) =>
  {
    const amountOfDamageDealt = parentAction.actionAttachedTo.result.get(damageDealt);
    const amountToHeal = amountOfDamageDealt * value;

    const increaseMaxHealthAction = increaseMaxHealth(source, source, amountToHeal);
    combatManager.attachAction(increaseMaxHealthAction, parentAction);

    const healAction = restoreHealth(source, source, amountToHeal);
    combatManager.attachAction(healAction, parentAction);
  },
};
