import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


export const moveDelayAdded: CombatActionResultTemplate<number> =
{
  key: "moveDelayAdded",
  defaultValue: 0,
  applyResult: (value, user, target, battle) =>
  {
    target.addMoveDelay(value);
  },
};
