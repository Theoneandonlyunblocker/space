import
{
  GetBattleTargetsFN,
} from "../targeting";

import {AbilityBase} from "./AbilityBase";
import
{
  AbilityEffectTemplate,
  AbilityMainEffectTemplate,
} from "./AbilityEffectTemplate";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export interface AbilityTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any> extends AbilityBase<EffectId, R>
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
  mainEffect: AbilityMainEffectTemplate<EffectId, R>;
  // called after mainEffect with same user & target
  secondaryEffects?: AbilityEffectTemplate<EffectId, R>[];

  beforeUse?: AbilityEffectTemplate<EffectId, R>[];
  afterUse?: AbilityEffectTemplate<EffectId, R>[];

  /**
   * how likely the AI will consider using this ability relative to other available ones
   * doesn't affect AI's final decision on which ability to use, but can guide it
   * in the right direction
   * default = 1
   */
  AiEvaluationPriority?: number;
  /**
   * prevent from being used in AI vs AI battles.
   * helps when simulation depth is too low to let AiEvaluationPriority kick in
   */
  disableInAiBattles?: boolean;
  /**
   * adjusts the final score of this ability. AI picks move with highest score.
   * to penalize moves that might be optimal but boring (e.g. skip turn) or otherwise unpleasant for the player
   */
  AiScoreMultiplier?: number;
}
