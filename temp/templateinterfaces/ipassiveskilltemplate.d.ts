/// <reference path="iabilitybase.d.ts" />

namespace Templates
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
