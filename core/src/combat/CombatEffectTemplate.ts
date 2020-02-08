import { CorePhase } from "./core/coreCombatPhases";
import { CombatActionFetcher, CombatActionListenerFetcher } from "./CombatPhaseInfo";


export interface CombatEffectTemplate<Phase extends string = CorePhase>
{
  key: string;
  limit?:
  {
    min?: number;
    max?: number;
  };
  roundingFN?: (toRound: number) => number;

  actionsPerPhase?:
  {
    [key in Phase]: CombatActionFetcher;
  };
  listenersPerPhase?:
  {
    [key in Phase]: CombatActionListenerFetcher<Phase>;
  };
}
