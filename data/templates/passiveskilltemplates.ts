/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface ITurnStartEffect
    {
      (unit: Unit): void;
    }
    // called for each unit present in star in battleprep constructor
    export interface IBattlePrepEffect
    {
      (unit: Unit, battlePrep: BattlePrep): void;
    }
    export interface IPassiveSkillTemplate
    {
      type: string;
      displayName: string;
      description: string;

      atBattleStart?: IAbilityTemplateEffect[];
      beforeAbilityUse?: IAbilityTemplateEffect[];
      afterAbilityUse?: IAbilityTemplateEffect[];
      atTurnStart?: ITurnStartEffect[];
      inBattlePrep?: IBattlePrepEffect[];
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
        description: "-10% max health per turn",
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
        description: "Gives buffs at battle start but become poisoned from rabbits making fun of you",

        atBattleStart:
        [
          {
            template: Effects.buffTest
          }
        ]
      }
      export var warpJammer: IPassiveSkillTemplate =
      {
        type: "warpJammer",
        displayName: "Warp Jammer",
        description: "Forces an extra unit to defend in neutral territory",

        inBattlePrep:
        [
          function(user: Unit, battlePrep: BattlePrep)
          {
            if (user.fleet.player === battlePrep.attacker)
            {
              battlePrep.minDefendersInNeutralTerritory += 1;
            }
          }
        ]
      }
      export var medic: IPassiveSkillTemplate =
      {
        type: "medic",
        displayName: "Medic",
        description: "Heals all units in same star to full at turn start",

        atTurnStart:
        [
          function(user: Unit)
          {
            var star = user.fleet.location;
            var allFriendlyUnits = star.getAllShipsOfPlayer(user.fleet.player);
            for (var i = 0; i < allFriendlyUnits.length; i++)
            {
              allFriendlyUnits[i].addStrength(allFriendlyUnits[i].maxHealth)
            }
          }
        ]
      }
    }
  }
}