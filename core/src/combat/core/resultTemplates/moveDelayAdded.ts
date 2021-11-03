import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


export const moveDelayAdded: CombatActionResultTemplate<number> =
{
  key: "moveDelayAdded",
  defaultValue: 0,
  applyResult: (value, user, target, combatManager) =>
  {
    target.battleStats.moveDelay += value;
  },
};
