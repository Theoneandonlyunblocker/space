import { CombatActionResultModifier } from "core/src/combat/CombatActionResultModifier";
import { lifeLeeched } from "../resultTemplates/lifeLeeched";
import { lifeLeechedIntoMaxHealth } from "../resultTemplates/lifeLeechedIntoMaxHealth";


export const lifeLeechIncreasesMaxHealth: CombatActionResultModifier<number> =
{
  key: "lifeLeechIncreasesMaxHealth",
  modifyResult: (result) =>
  {
    const lifeLeechAmount = result.get(lifeLeeched);
    result.set(lifeLeechedIntoMaxHealth, lifeLeechAmount);
  },
};
