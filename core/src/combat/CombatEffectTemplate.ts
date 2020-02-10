import { CorePhase } from "./core/coreCombatPhases";
import { CombatActionFetcher, CombatActionListenerFetcher } from "./CombatPhaseInfo";
import { UnitAttributeAdjustments } from "../unit/UnitAttributes";


export interface CombatEffectTemplate<Phase extends string = CorePhase>
{
  key: string;
  limit?:
  {
    min?: number;
    max?: number;
  };
  roundingFN?: (toRound: number) => number;

  // TODO 2020.02.10 | temporary? added because old system used them like this, but attributes themselves should probably be combat effects.
  getAttributeAdjustments?: (effectStrength: number) => UnitAttributeAdjustments;
  actionsPerPhase?:
  {
    [key in Phase]: CombatActionFetcher;
  };
  listenersPerPhase?:
  {
    [key in Phase]: CombatActionListenerFetcher<Phase>;
  };
}
