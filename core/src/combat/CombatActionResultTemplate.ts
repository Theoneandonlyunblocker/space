import { Unit } from "../unit/Unit";
import { CombatManager } from "./CombatManager";
import { CorePhase } from "./core/coreCombatPhases";
import { CombatAction } from "./CombatAction";


export interface CombatActionResultTemplate<T, Phase extends string = CorePhase>
{
  key: string;
  defaultValue: T;
  applyResult: (
    value: T,
    source: Unit,
    target: Unit,
    combatManager: CombatManager<Phase>,
    parentAction: CombatAction | undefined,
  ) => void;
}
