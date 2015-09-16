declare module Rance
{
  module Templates
  {
    interface IAbilityTemplate
    {
      type: string;
      displayName: string;
      description: string;
      moveDelay: number;
      preparation?:
      {
        turnsToPrep: number;
        prepDelay: number;
        interruptsNeeded: number;
      };
      actionsUse: number;
      bypassesGuard?: boolean;
      
      // determines targeting range of function, called first
      mainEffect: IAbilityTemplateEffect;
      // combined with mainEffect, determines target area of function, called second
      // uses same user and target as maineffect, can have own target area
      secondaryEffects?: IAbilityTemplateEffect[];
      
      beforeUse?: IAbilityTemplateEffect[];
      afterUse?: IAbilityTemplateEffect[];
      
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
