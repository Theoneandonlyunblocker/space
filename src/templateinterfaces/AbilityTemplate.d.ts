import AbilityBase from "./AbilityBase";
import
{
  AbilityEffectTemplate,
  AbilityMainEffectTemplate,
} from "./AbilityEffectTemplate";

import
{
  GetBattleTargetsFN,
} from "../targeting";

declare interface AbilityTemplate extends AbilityBase
{
  type: string;
  displayName: string;
  description: string;
  moveDelay: number;
  preparation?:
  {
    turnsToPrep: number;
    interruptsNeeded: number;
    /**
     * Delay added for each turn spent preparing. ability use turn included
     * moveDelay is used when preparation is complete and effects are executed
     */
    prepDelay: number;
  };
  actionsUse: number;

  doesNotRemoveUserGuard?: boolean;
  targetCannotBeDiverted?: boolean;

  getPossibleTargets: GetBattleTargetsFN;

  // called first
  mainEffect: AbilityMainEffectTemplate;
  // called after mainEffect with same user & target
  secondaryEffects?: AbilityEffectTemplate[];

  beforeUse?: AbilityEffectTemplate[];
  afterUse?: AbilityEffectTemplate[];

  /**
   * how likely the AI will consider using this ability relative to other available ones
   * doesn't affect AI's final decision on which ability to use, but can guide it
   * in the right direction
   * default = 1
   */
  AIEvaluationPriority?: number;
  /**
   * adjusts the final score of this ability. AI picks move with highest score.
   * used to penalize moves that might be optimal but boring, such as doing nothing
   */
  AIScoreAdjust?: number;
  /**
   * prevent from being used in AI vs AI battles.
   * helps when simulation depth is too low to let AIScoreAdjust kick in
   */
  disableInAIBattles?: boolean;
}

export default AbilityTemplate;
