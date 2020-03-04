import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";


export interface CombatPhaseInfo<AllPhases extends string>
{
  key: string;

  defaultPhaseFinishCallback: CombatPhaseFinishCallback<AllPhases>;
}
