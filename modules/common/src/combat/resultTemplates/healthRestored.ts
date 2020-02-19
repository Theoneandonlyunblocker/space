import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const healthRestored: CombatActionResultTemplate<number> =
{
  key: "healthRestored",
  defaultValue: 0,
  applyResult: (value, source, target, battle) =>
  {
    target.addHealth(value);
  },
};
