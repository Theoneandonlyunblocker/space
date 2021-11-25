import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { coreCombatActionFlags } from "core/src/combat/core/coreCombatActionFlags";
import { scalePrimitiveByTroopSize } from "core/src/combat/core/modifiers/scalePrimitiveByTroopSize";


export function dealAttackDamage(
  source: Unit,
  target: Unit,
  amount: number,
  damageTypePrimitive: CombatActionPrimitiveTemplate<number>,
): CombatAction
{
  const damageAction = new CombatAction(
  {
    mainAction: makeSimpleModifier(damageTypePrimitive, {flat: amount}, [coreCombatActionFlags.attack]),
    source: source,
    target: target,
  });

  damageAction.modifiers.push(scalePrimitiveByTroopSize(damageTypePrimitive, source));

  return damageAction;
}
