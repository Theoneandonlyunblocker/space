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

      // determines targeting range of function, called first
      mainEffect: IAbilityTemplateEffect;
      // combined with mainEffect, determines target area of function, called second
      // uses same user and target as maineffect, can have own target area
      secondaryEffects?: IAbilityTemplateEffect[];

      beforeUse?: IAbilityTemplateEffect[];
      afterUse?: IAbilityTemplateEffect[];

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
          data:
          {
            baseDamage: 1,
            damageType: DamageType.physical,
            sfx:
            {
              duration: 1500
            }
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
          ],
          sfx:
          {
            duration: 1500
          }
        }
      }

      export var debugAbility: IAbilityTemplate =
      {
        type: "debugAbility",
        displayName: "Debug Ability",
        description: "who knows what its going to do today",
        moveDelay: 20,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          data:
          {
            baseDamage: 5,
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
        },
        secondaryEffects:
        [
          {
            template: Effects.bombAttack
          }
        ],
        afterUse:
        [
          {
            template: Effects.buffTest
          }
        ],
        sfx:
        {
          duration: 100
        }
      }

      export var standBy: IAbilityTemplate =
      {
        type: "standBy",
        displayName: "Standby",
        description: "Skip a turn but next one comes faster",
        moveDelay: 50,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.standBy,
          sfx:
          {
            duration: 750
          }
        }
      }
    }
  }
}
