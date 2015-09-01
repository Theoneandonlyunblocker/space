/// <reference path="effecttemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IAbilityTemplateEffect
    {
      template: IEffectTemplate;
      data?: any;
      // called once with same user and effect target as parent effect
      // nesting these wont work and wouldnt do anything anyway
      attachedEffects?: IAbilityTemplateEffect[];
    }
    export interface IAbilityTemplate
    {
      type: string;
      displayName: string;
      description?: string;
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

      addsGuard?: boolean; // set dynamically
    }

    export module Abilities
    {
      export var dummyTargetColumn: IAbilityTemplate =
      {
        type: "dummyTargetColumn",
        displayName: "dummyTargetColumn",
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
            baseDamage: 100,
            damageType: DamageType.physical
          }
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
          template: Effects.closeAttack
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
          template: Effects.wholeRowAttack
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
          template: Effects.bombAttack
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
          template: Effects.guardColumn
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
            baseDamage: 1000,
            damageType: DamageType.physical
          },
          attachedEffects:
          [
            {
              template: Effects.increaseCaptureChance,
              data:
              {
                flat: 1
              }
            },
            {
              template: Effects.buffTest
            }
          ]
        },
        secondaryEffects:
        [
          {
            template: Effects.bombAttack
          }
        ]
      }

      export var standBy: IAbilityTemplate =
      {
        type: "standBy",
        displayName: "Standby",
        moveDelay: 50,
        actionsUse: 999,
        mainEffect:
        {
          template: Effects.standBy
        }
      }
    }
  }
}
