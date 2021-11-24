import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { damageDealt } from "core/src/combat/core/resultTemplates/damageDealt";
import { restoreHealth } from "../actions/restoreHealth";


export const lifeLeeched: CombatActionResultTemplate<number> =
{
  key: "lifeLeeched",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager, parentAction) =>
  {
    const amountOfDamageDealt = parentAction.result.get(damageDealt);
    const amountToHeal = amountOfDamageDealt * value;

    const healAction = restoreHealth(source, source, amountToHeal);
    combatManager.attachAction(healAction, parentAction);
  },
};
