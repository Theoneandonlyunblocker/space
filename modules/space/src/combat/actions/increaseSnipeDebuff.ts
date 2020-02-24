import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "modules/common/src/combat/modifiers/makeSimpleModifier";
import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { snipeAttackAmount, snipeDefenceAmount, snipeIntelligenceAmount, snipeSpeedAmount } from "../primitives/snipeDebuffAmount";
import { UnitAttribute } from "core/src/unit/UnitAttributes";


export function increaseSnipeDebuff(
  source: Unit,
  target: Unit,
  attribute: UnitAttribute,
  amount: Partial<FlatAndMultiplierAdjustment>,
): CombatAction
{
  const primitive = primitives[attribute];

  return new CombatAction(
  {
    mainAction: makeSimpleModifier(primitive, amount),
    source: source,
    target: target,
  });
}

const primitives: {[K in UnitAttribute]: CombatActionPrimitiveTemplate<number>} =
{
  [UnitAttribute.Attack]: snipeAttackAmount,
  [UnitAttribute.Defence]: snipeDefenceAmount,
  [UnitAttribute.Intelligence]: snipeIntelligenceAmount,
  [UnitAttribute.Speed]: snipeSpeedAmount,
};
