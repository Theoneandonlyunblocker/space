import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "modules/common/src/combat/modifiers/makeSimpleModifier";
import { healing } from "modules/common/src/combat/primitives/healing";
import { combatActionFlags } from "modules/common/src/combat/combatActionFlags";


export function repair(user: Unit, target: Unit, repairAmount: number): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(healing, {flat: repairAmount}, [combatActionFlags.heal]),
    source: user,
    target: target,
  });
}
