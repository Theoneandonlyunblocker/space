import { CorePhase } from "./core/coreCombatPhases";
import { UnitAttributeAdjustments } from "../unit/UnitAttributes";
import { CombatActionFetcher, CombatActionListenerFetcher } from "./CombatActionFetcher";


export interface CombatEffectTemplate<Phase extends string = CorePhase>
{
  key: string;
  getDisplayName: (strength: number) => string;
  getDescription: (strength: number) => string;
  limit?:
  {
    min?: number;
    max?: number;
  };
  /**
   * @default Math.round
   */
  roundingFN?: (toRound: number) => number;
  flags?: Set<string>;

  getAttributeAdjustments?: (effectStrength: number) => UnitAttributeAdjustments;
  actionsPerPhase?:
  {
    [key in Phase]?: CombatActionFetcher;
  };
  listenersPerPhase?:
  {
    [key in Phase]?: CombatActionListenerFetcher<Phase>;
  };
}
