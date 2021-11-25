import { CorePhase } from "core/src/combat/core/coreCombatPhases";
import { combatActionFlags } from "../combatActionFlags";
import { CombatActionListener } from "core/src/combat/CombatActionListener";
import { lifeLeechMultiplier } from "../effects/lifeLeechMultiplier";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { lifeLeech } from "../primitives/lifeLeech";


export const multiplyLifeLeech: CombatActionListener<CorePhase> =
{
  key: "multiplyLifeLeech",
  flagsWhichTrigger: [combatActionFlags.lifeLeech],
  onAdd: (action, combatManager) =>
  {
    const strength = action.target.battleStats.combatEffects.get(lifeLeechMultiplier).strength;
    action.modifiers.push(makeSimpleModifier(lifeLeech, {additiveMultiplier: strength}));
  },
};
