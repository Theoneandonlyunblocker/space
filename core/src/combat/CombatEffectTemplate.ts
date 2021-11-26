import { CorePhase } from "./core/coreCombatPhases";
import { UnitAttributeAdjustments } from "../unit/UnitAttributes";
import { CombatActionFetcher } from "./CombatActionFetcher";
import { UnitAttachedCombatActionListener } from "./CombatActionListener";


export interface CombatEffectTemplate<Phase extends string = CorePhase>
{
  key: string;
  displayName: string;
  getDescription: (strength: number) => string;
  isActive: (strength: number) => boolean;
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
  // TODO 2020.06.08 | not read anywhere
  actionFetchers?: CombatActionFetcher<Phase>[];
  // TODO 2020.06.08 | not read anywhere
  actionListeners?: UnitAttachedCombatActionListener<Phase>[];
}
