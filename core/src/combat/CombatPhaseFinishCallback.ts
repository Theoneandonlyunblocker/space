import { CombatManager } from "./CombatManager";


// probably needs other params too
export type CombatPhaseFinishCallback<AllPhases extends string> =
  (combatManager: CombatManager<AllPhases>) => void;
