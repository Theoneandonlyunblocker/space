import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { damageDealt } from "core/src/combat/core/resultTemplates/damageDealt";


export const poisonDamage: CombatActionPrimitiveTemplate<number> =
{
  key: "poisonDamage",
  applyToResult: (value, result) =>
  {
    result.set(
      damageDealt,
      result.get(damageDealt) + value,
    );
  },
};
