/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IPassiveSkillTemplate
    {
      type: string;
      displayName: string;
      description: string;

      atBattleStart?: IAbilityTemplateEffect[];
      beforeAbilityUse?: IAbilityTemplateEffect[];
      afterAbilityUse?: IAbilityTemplateEffect[];
    }
    export module PassiveSkills
    {
      export var autoHeal: IPassiveSkillTemplate =
      {
        type: "autoHeal",
        displayName: "Auto heal",
        description: "hin hin",

        afterAbilityUse:
        [
          {
            template: Effects.healSelf,
            data:
            {
              flat: 50
            }
          }
        ]
      }
      export var overdrive: IPassiveSkillTemplate =
      {
        type: "overdrive",
        displayName: "Overdrive",
        description: "o-o",

        atBattleStart:
        [
          {
            template: Effects.buffTest
          }
        ]
      }
    }
  }
}