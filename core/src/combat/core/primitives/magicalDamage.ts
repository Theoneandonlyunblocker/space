import { CombatActionPrimitive } from "../../CombatActionPrimitive";
import { damageDealt } from "../resultTemplates/damageDealt";


export const magicalDamage: CombatActionPrimitive<number> =
{
  key: "magicalDamage",
  applyToResult: (value, result) =>
  {
    result.set(
      damageDealt,
      result.get(damageDealt) + value,
    );
  },
};
