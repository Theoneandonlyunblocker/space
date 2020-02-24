import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { combatActionFlags } from "../combatActionFlags";
import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";


export function dealAttackDamage(
  source: Unit,
  target: Unit,
  amount: number,
  damageTypePrimitive: CombatActionPrimitiveTemplate<number>,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(damageTypePrimitive, {flat: amount}, [combatActionFlags.attack]),
    source: source,
    target: target,
  });
}
