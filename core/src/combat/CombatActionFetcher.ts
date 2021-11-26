import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CorePhase } from "./core/coreCombatPhases";


/**
 * f.ex would fetch 'takePoisonDamage' action every turn if unit has 'poisoned' status effect
 */
export type CombatActionFetcher<AllPhases extends string = CorePhase> =
{
  key: string;
  phasesToApplyTo: Set<CombatPhaseInfo<AllPhases>>;
  fetch: (battle: Battle<AllPhases>, activeUnit: Unit) => CombatAction[];
};
