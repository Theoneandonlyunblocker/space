import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";


export interface CombatPhaseInfo<AllPhases extends string>
{
  key: AllPhases;

  defaultPhaseFinishCallback: CombatPhaseFinishCallback<AllPhases>;
}
