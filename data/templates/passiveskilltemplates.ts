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
        description: "hiku hiku",

        afterAbilityUse:
        [
          {
            template: Effects.healSelf,
            data:
            {
              flat: 50
            },
            sfx:
            {
              duration: 1200,
              battleOverlay: function(props: Templates.SFXParams)
              {
                // cg40400.bmp - cg40429.bmp converted to webm
                return makeVideo("img\/battleEffects\/heal.webm", props);
              }
            }
          }
        ]
      }
      export var overdrive: IPassiveSkillTemplate =
      {
        type: "overdrive",
        displayName: "Overdrive",
        description: "o-",

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