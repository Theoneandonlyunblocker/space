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
      export var poisoned: IPassiveSkillTemplate =
      {
        type: "poisoned",
        displayName: "Poisoned",
        description: "",
        afterAbilityUse:
        [
          {
            template: Effects.healSelf,
            data:
            {
              maxHealthPercentage: -0.1
            },
            sfx:
            {
              duration: 1200,
              userOverlay: function(props: Templates.SFXParams)
              {
                var canvas = <HTMLCanvasElement> document.createElement("canvas");
                canvas.width = props.width;
                canvas.height = props.height;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = "rgba(30, 150, 30, 0.5)"
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                return canvas;
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