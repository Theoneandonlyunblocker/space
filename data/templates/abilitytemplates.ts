/// <reference path="effecttemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IAbilityTemplate
    {
      type: string;
      displayName: string;
      moveDelay: number;
      preparation?:
      {
        turnsToPrep: number;
        prepDelay: number;
        interruptsNeeded: number;
      };
      actionsUse: any; // number or "all"

      mainEffect: IEffectTemplate;
      secondaryEffects?: IEffectTemplate[];
    }

    export module Abilities
    {
      export var dummyTargetColumn: IAbilityTemplate =
      {
        type: "dummyTargetColumn",
        displayName: "dummyTargetColumn",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect: Effects.dummyTargetColumn
      }
      export var dummyTargetAll: IAbilityTemplate =
      {
        type: "dummyTargetAll",
        displayName: "dummyTargetAll",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect: Effects.dummyTargetAll
      }
      export var rangedAttack: IAbilityTemplate =
      {
        type: "rangedAttack",
        displayName: "Ranged Attack",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect: Effects.rangedAttack
      }
      export var closeAttack: IAbilityTemplate =
      {
        type: "closeAttack",
        displayName: "Close Attack",
        moveDelay: 90,
        actionsUse: 2,
        mainEffect: Effects.closeAttack
      }
      export var wholeRowAttack: IAbilityTemplate =
      {
        type: "wholeRowAttack",
        displayName: "Row Attack",
        moveDelay: 300,
        actionsUse: 1,
        mainEffect: Effects.wholeRowAttack
      }

      export var bombAttack: IAbilityTemplate =
      {
        type: "bombAttack",
        displayName: "Bomb Attack",
        moveDelay: 120,
        actionsUse: 1,
        mainEffect: Effects.bombAttack
      }
      export var guardColumn: IAbilityTemplate =
      {
        type: "guardColumn",
        displayName: "Guard Column",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect: Effects.guardColumn
      }

      export var standBy: IAbilityTemplate =
      {
        type: "standBy",
        displayName: "Standby",
        moveDelay: 50,
        actionsUse: "all",
        mainEffect: Effects.standBy
      }
    }
  }
}
