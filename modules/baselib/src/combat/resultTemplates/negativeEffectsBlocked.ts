import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { blockNegativeEffect } from "../effects/blockNegativeEffect";


export const negativeEffectsBlocked: CombatActionResultTemplate<number> =
{
  key: "negativeEffectsBlocked",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager, parentAction) =>
  {
    // should this create an action? so you could do shit like "heal everytime a debuff is blocked"
    target.battleStats.combatEffects.get(blockNegativeEffect).strength -= value;
  },
};
