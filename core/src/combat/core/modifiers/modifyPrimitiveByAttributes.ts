import { CombatActionModifier } from "../../CombatActionModifier";
import { Unit } from "core/src/unit/Unit";
import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { AdjustmentsPerAttribute } from "core/src/unit/UnitAttributes";


export function modifyPrimitiveByAttributes(
  primitive: CombatActionPrimitiveTemplate<number>,
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
