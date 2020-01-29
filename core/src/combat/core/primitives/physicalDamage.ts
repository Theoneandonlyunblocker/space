import { CombatActionPrimitive } from "../../CombatActionPrimitive";
import { damageDealt } from "../resultTemplates/damageDealt";


export const physicalDamage: CombatActionPrimitive<number> =
{
  key: "physicalDamage",
  applyToResult: (value, result) =>
  {
    result.set(
      damageDealt,
      result.get(damageDealt) + value,
    );
  },
};
