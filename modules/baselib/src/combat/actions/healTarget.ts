import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { healing } from "../primitives/healing";
import { combatActionFlags } from "../combatActionFlags";


export function healTarget(
  source: Unit,
  target: Unit,
  amount: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(healing, {flat: amount}, [combatActionFlags.heal]),
    source: source,
    target: target,
  });
}
