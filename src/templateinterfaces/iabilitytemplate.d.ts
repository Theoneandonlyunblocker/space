/// <reference path="iabilitybase.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IAbilityTemplate extends IAbilityBase
    {
      type: string;
      displayName: string;
      description: string;
      moveDelay: number;
      preparation?:
      {
        turnsToPrep: number;
        interruptsNeeded: number;
        // moveDelay is used for turns in which ability is used or being prepared
        prepDelay: number;
      };
      actionsUse: number;
      // if true, ability will always hit intended target. guard can still provide defensive benefits
      bypassesGuard?: boolean;
      
      // determines targeting range of function, called first
      mainEffect: IAbilityEffectTemplate;
      // uses same user and target as mainEffect, called after mainEffect
      secondaryEffects?: IAbilityEffectTemplate[];
      
      beforeUse?: IAbilityEffectTemplate[];
      afterUse?: IAbilityEffectTemplate[];
      
      // how likely the AI will consider using this ability relative to other available ones
      // doesn't affect AI's final decision on which ability to use, but can guide it
      // in the right direction
      AIEvaluationPriority?: number; // default = 1
      // adjusts the final score of this ability. AI picks move with highest score.
      // used to penalize moves that might be optimal but boring, such as doing nothing
      AIScoreAdjust?: number;
      // prevent from being used in AI vs AI battles. helps when simulation depth is too low
      // to let AIScoreAdjust kick in
      disableInAIBattles?: boolean;
      
      addsGuard?: boolean; // set dynamically
    }
  }
}
