import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const negativeEffectsBlocked: CombatActionResultTemplate<number> =
{
  key: "negativeEffectsBlocked",
  defaultValue: 0,
  applyResult: (changes, source, target, combatManager) =>
  {
    // TODO 2021.11.05 | remove negativeEffectsBlocked effect by # of effects blocked
  },
};
