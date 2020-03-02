import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { captureChance } from "../primitives/captureChance";


export function increaseCaptureChance(
  source: Unit,
  target: Unit,
  amount: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(captureChance, {flat: amount}),
    source: source,
    target: target,
  });
}
