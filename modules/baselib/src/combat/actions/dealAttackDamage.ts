import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { coreCombatActionFlags } from "core/src/combat/core/coreCombatActionFlags";


// TODO 2021.11.23 | implement troop scaling
export function dealAttackDamage(
  source: Unit,
  target: Unit,
  amount: number,
  damageTypePrimitive: CombatActionPrimitiveTemplate<number>,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(damageTypePrimitive, {flat: amount}, [coreCombatActionFlags.attack]),
    source: source,
    target: target,
  });
}
