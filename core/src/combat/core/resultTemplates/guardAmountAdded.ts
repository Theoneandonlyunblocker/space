import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


export const guardAmountAdded: CombatActionResultTemplate<number> =
{
  key: "guardAmountAdded",
  defaultValue: 0,
  applyResult: (value, user, target, battle) =>
  {
    target.battleStats.guardAmount += value;

    if (target.battleStats.guardAmount < 0)
    {
      target.battleStats.guardAmount = 0;
      target.battleStats.guardCoverage = null;
    }

    target.uiDisplayIsDirty = true;
  },
};
