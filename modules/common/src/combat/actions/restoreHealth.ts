import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { rawHealthRestoration } from "../primitives/rawHealthRestoration";


export function restoreHealth(
  source: Unit,
  target: Unit,
  amount: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(rawHealthRestoration, {flat: amount}),
    source: source,
    target: target,
  });
}
