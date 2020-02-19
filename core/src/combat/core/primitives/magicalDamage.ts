import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { damageDealt } from "../resultTemplates/damageDealt";


export const magicalDamage: CombatActionPrimitiveTemplate<number> =
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
