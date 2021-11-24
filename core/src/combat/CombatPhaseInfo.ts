import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";


export interface CombatPhaseInfo<AllPhases extends string>
{
  key: AllPhases;

  // why "default"? can be overridden to hook custom phases?
  // TODO 2021.11.23 | rename   afterFinish maybe
  defaultPhaseFinishCallback: CombatPhaseFinishCallback<AllPhases>;
}
