import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { restoreHealth } from "../actions/restoreHealth";
import { increaseMaxHealth } from "../actions/increaseMaxHealth";
import { lifeLeeched } from "./lifeLeeched";


export const lifeLeechedIntoMaxHealth: CombatActionResultTemplate<number> =
{
  key: "lifeLeechedIntoMaxHealth",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager, parentAction) =>
  {
    const amountOfLifeLeeched = parentAction.result.get(lifeLeeched);
    const amountToHeal = amountOfLifeLeeched * value;

    const increaseMaxHealthAction = increaseMaxHealth(source, source, amountToHeal);
    combatManager.attachAction(increaseMaxHealthAction, parentAction);

    const healAction = restoreHealth(source, source, amountToHeal);
    combatManager.attachAction(healAction, parentAction);
  },
};
