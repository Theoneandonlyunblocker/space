import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";


export function increaseInfestationAmount(
  source: Unit,
  target: Unit,
  amount: Partial<FlatAndMultiplierAdjustment>,
): CombatAction
{
  return new CombatAction(
  {
    mainAction:
    {
      primitives:
      {

      },
    },
    source: source,
    target: target,
  });
}
