import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


export const actionPointsAdded: CombatActionResultTemplate<number> =
{
  key: "actionPointsAdded",
  defaultValue: 0,
  applyResult: (value, user, target, combatManager) =>
  {
    target.battleStats.currentActionPoints += value;
    if (target.battleStats.currentActionPoints < 0)
    {
      target.battleStats.currentActionPoints = 0;
    }

    target.uiDisplayIsDirty = true;
  }
};
