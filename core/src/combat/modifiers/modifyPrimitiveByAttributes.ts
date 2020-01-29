import { CombatActionModifier } from "../CombatActionModifier";
import { Unit } from "core/src/unit/Unit";
import { CombatActionPrimitive } from "../CombatActionPrimitive";
import { AdjustmentsPerAttribute } from "core/src/unit/UnitAttributes";


export function modifyPrimitiveByAttributes(
  primitive: CombatActionPrimitive<number>,
  unit: Unit,
  adjustments: AdjustmentsPerAttribute,
): CombatActionModifier
{

  return {
    primitives:
    {
      [primitive.key]:
      {
        primitive: primitive,
        value: unit.attributes.resolveAdjustmentsPerAttribute(adjustments),
      },
    },
  };
}
