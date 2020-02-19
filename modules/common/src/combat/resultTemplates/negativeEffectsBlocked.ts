import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const negativeEffectsBlocked: CombatActionResultTemplate<number> =
{
  key: "negativeEffectsBlocked",
  defaultValue: 0,
  applyResult: (changes, source, target, battle) =>
  {

  },
};
