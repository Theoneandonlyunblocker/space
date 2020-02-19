import { CombatActionResultTemplate } from "../../CombatActionResultTemplate";


// TODO 2020.02.17 | rename (damageTaken?)
export const damageDealt: CombatActionResultTemplate<number> =
{
  key: "damageDealt",
  defaultValue: 0,
  applyResult: (value, source, target, battle) =>
  {
    target.removeHealth(value);
  },
};
