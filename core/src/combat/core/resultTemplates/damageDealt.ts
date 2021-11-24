import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


export const damageDealt: CombatActionResultTemplate<number> =
{
  key: "damageDealt",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager) =>
  {
    // TODO 2021.11.23 | need to clamp to currenthealth?
    target.removeHealth(value);
  },
};
