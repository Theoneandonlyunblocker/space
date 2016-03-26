/// <reference path="iabilitybase.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IPassiveSkillTemplate extends IAbilityBase
    {
      type: string;
      displayName: string;
      description: string;
      isHidden?: boolean;
      
      atBattleStart?: IAbilityEffectTemplate[];
      beforeAbilityUse?: IAbilityEffectTemplate[];
      afterAbilityUse?: IAbilityEffectTemplate[];
      atTurnStart?: ITurnStartEffect[];
      inBattlePrep?: IBattlePrepEffect[];
    }
  }
}
