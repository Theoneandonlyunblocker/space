/// <reference path="effecttemplates.ts" />
/// <reference path="battleeffectsfxtemplates.ts" />


module Rance
{
  export module Templates
  {
    export interface IAbilityTemplateEffect
    {
      template: IEffectTemplate;
      data?: any;
      // called after parent effect with same user and effect target
      // nesting these wont work and wouldnt do anything anyway
      attachedEffects?: IAbilityTemplateEffect[];
      sfx?: IBattleEffectSFX;
    }
    export interface IAbilityTemplate
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
      byPassesGuard?: boolean;

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

    export module Abilities
    {
      export var dummyTargetColumn: IAbilityTemplate =
      {
        type: "dummyTargetColumn",
        displayName: "dummyTargetColumn",
        description: "you shouldnt see this",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.dummyTargetColumn
        }
      }
      export var dummyTargetAll: IAbilityTemplate =
      {
        type: "dummyTargetAll",
        displayName: "dummyTargetAll",
        description: "you shouldnt see this",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.dummyTargetAll
        }
      }
      export var rangedAttack: IAbilityTemplate =
      {
        type: "rangedAttack",
        displayName: "Ranged Attack",
        description: "Standard ranged attack",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
          },
          data:
          {
            baseDamage: 1,
            damageType: DamageType.physical
          },
          attachedEffects:
          [
            {
              template: Effects.receiveCounterAttack,
              data:
              {
                baseDamage: 1
              }
            }
          ]
        }
      }
      export var closeAttack: IAbilityTemplate =
      {
        type: "closeAttack",
        displayName: "Close Attack",
        description: "Close range attack that hits adjacent targets in same row as well",
        moveDelay: 90,
        actionsUse: 2,
        mainEffect:
        {
          template: Effects.closeAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }
      export var wholeRowAttack: IAbilityTemplate =
      {
        type: "wholeRowAttack",
        displayName: "Row Attack",
        description: "Attack entire row of units",
        moveDelay: 300,
        actionsUse: 1,
        byPassesGuard: true,
        AIEvaluationPriority: 0.5,
        mainEffect:
        {
          template: Effects.wholeRowAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }

      export var bombAttack: IAbilityTemplate =
      {
        type: "bombAttack",
        displayName: "Bomb Attack",
        description: "Ranged attack that hits all adjacent enemy units",
        moveDelay: 120,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.bombAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }
      export var guardColumn: IAbilityTemplate =
      {
        type: "guardColumn",
        displayName: "Guard Column",
        description: "Protect allies in the same row and boost defence up to 2x",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.guardColumn,
          sfx:
          {
            duration: 1500
          },
          data:
          {
            perInt: 20
          }
        }
      }
      export var boardingHook: IAbilityTemplate =
      {
        type: "boardingHook",
        displayName: "Boarding Hook",
        description: "0.8x damage but increases target capture chance",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
          },
          data:
          {
            baseDamage: 0.8,
            damageType: DamageType.physical
          },
          attachedEffects:
          [
            {
              template: Effects.increaseCaptureChance,
              data:
              {
                flat: 0.5
              }
            },
            {
              template: Effects.receiveCounterAttack,
              data:
              {
                baseDamage: 1
              }
            }
          ]
        }
      }

      export var debugAbility: IAbilityTemplate =
      {
        type: "debugAbility",
        displayName: "Debug Ability",
        description: "who knows what its going to do today",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
            battleOverlay: BattleSFX.rocketAttack
          },
          data:
          {
            baseDamage: 0,
            damageType: DamageType.physical
          }
        }
      }

      export var ranceAttack: IAbilityTemplate =
      {
        type: "ranceAttack",
        displayName: "Rance attack",
        description: "dont sue",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1200,
            userSprite: function(props: SFXParams)
            {
              // cg13600.bmp
              return BattleSFX.makeSprite("img\/battleEffects\/ranceAttack2.png", props);
            },
            battleOverlay: function(props: SFXParams)
            {
              // cg40500.bmp - cg40529.bmp converted to webm
              return BattleSFX.makeVideo("img\/battleEffects\/ranceAttack.webm", props);
            }
          },
          data:
          {
            baseDamage: 0.1,
            damageType: DamageType.physical
          }
        },
        secondaryEffects:
        [
          {
            template: Effects.singleTargetDamage,
            data:
            {
              baseDamage: 0.1,
              damageType: DamageType.physical
            },
            attachedEffects:
            [
              {
                template: Effects.receiveCounterAttack,
                data:
                {
                  baseDamage: 0.1
                }
              }
            ],
            sfx:
            {
              duration: 1500,
              userSprite: function(props: SFXParams)
              {
                // cg13300.bmp
                return BattleSFX.makeSprite("img\/battleEffects\/ranceAttack.png", props);
              },
              battleOverlay: function(props: SFXParams)
              {
                // cg40000.bmp - cg40029.bmp converted to webm
                return BattleSFX.makeVideo("img\/battleEffects\/bushiAttack.webm", props);
              }
            }
          }
        ]
      }

      export var standBy: IAbilityTemplate =
      {
        type: "standBy",
        displayName: "Standby",
        description: "Skip a turn but next one comes faster",
        moveDelay: 50,
        actionsUse: 1,
        AIEvaluationPriority: 0.6,
        AIScoreAdjust: -0.1,
        disableInAIBattles: true,
        mainEffect:
        {
          template: Effects.standBy,
          sfx:
          {
            duration: 750,
            userSprite: function(props: SFXParams)
            {
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");

              canvas.width = 80;
              canvas.height = 80

              ctx.fillStyle = "#FFF";
              ctx.fillRect(20, 20, 40, 40);

              return canvas;
            }
          }
        }
      }
    }
  }
}
