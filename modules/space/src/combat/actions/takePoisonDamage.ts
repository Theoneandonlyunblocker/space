import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";
import { addPoisonDamage } from "../modifiers/addPoisonDamage";
import { poisoned } from "../effects/poisoned";


export function takePoisonDamage(
  target: Unit,
): CombatAction
{
  const poisonStrength = target.battleStats.combatEffects.get(poisoned).strength;

  return new CombatAction(
  {
    mainAction: addPoisonDamage({flat: poisonStrength}),
    source: target,
    target: target,
  });
}
