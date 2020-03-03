import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const maxHealthChanged: CombatActionResultTemplate<number> =
{
  key: "maxHealthChanged",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager) =>
  {
    target.addMaxHealth(value);
  },
};
