import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { damageDealt } from "../resultTemplates/damageDealt";


export const physicalDamage: CombatActionPrimitiveTemplate<number> =
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
