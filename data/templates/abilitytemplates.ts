/// <reference path="effecttemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface AbilityTemplate
    {
      name: string;
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
      export var dummyTargetColumn: AbilityTemplate =
      {
        name: "dummyTargetColumn",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect: Effects.dummyTargetColumn
      }
      export var dummyTargetAll: AbilityTemplate =
      {
        name: "dummyTargetAll",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect: Effects.dummyTargetAll
      }
      export var rangedAttack: AbilityTemplate =
      {
        name: "rangedAttack",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect: Effects.rangedAttack
      }
      export var closeAttack: AbilityTemplate =
      {
        name: "closeAttack",
        moveDelay: 90,
        actionsUse: 2,
        mainEffect: Effects.closeAttack
      }
      export var wholeRowAttack: AbilityTemplate =
      {
        name: "wholeRowAttack",
        moveDelay: 300,
        actionsUse: 1,
        mainEffect: Effects.wholeRowAttack
      }

      export var bombAttack: AbilityTemplate =
      {
        name: "bombAttack",
        moveDelay: 120,
        actionsUse: 1,
        mainEffect: Effects.bombAttack
      }
      export var guardColumn: AbilityTemplate =
      {
        name: "guardColumn",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect: Effects.guardColumn
      }

      export var standBy: AbilityTemplate =
      {
        name: "standBy",
        moveDelay: 50,
        actionsUse: "all",
        mainEffect: Effects.standBy
      }
    }
  }
}
