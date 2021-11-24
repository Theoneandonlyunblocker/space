import { CombatManager } from "./CombatManager";


// probably needs other params too
// TODO 2021.11.23 | rename. used for other things than finish
export type CombatPhaseFinishCallback<AllPhases extends string> =
  (combatManager: CombatManager<AllPhases>) => void;
