/// <reference path="../../src/targeting.ts" />
/// <reference path="../../src/unit.ts" />

module Rance
{
  export module Templates
  {
    export interface AbilityTemplate
    {
      name: string;
      moveDelay: number;
      interruptsNeeded?: number;
      actionsUse: any; // number or "all"
      targetFleets: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, all
      effect: (user: Unit, target: Unit) => void;
    }

    export module Abilities
    {
      export var rangedAttack: AbilityTemplate =
      {
        name: "rangedAttack",
        moveDelay: 100,
        actionsUse: 1,
        targetFleets: "enemy",
        targetingFunction: targetSingle,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          target.removeStrength(100);
        }
      }
      export var closeAttack: AbilityTemplate =
      {
        name: "closeAttack",
        moveDelay: 90,
        actionsUse: 2,
        targetFleets: "enemy",
        targetingFunction: targetSingle,
        targetRange: "close",
        effect: function(user: Unit, target: Unit)
        {
          target.removeStrength(100);
        }
      }
      export var wholeRowAttack: AbilityTemplate =
      {
        name: "wholeRowAttack",
        moveDelay: 90,
        actionsUse: 1,
        targetFleets: "all",
        targetingFunction: targetRow,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          target.removeStrength(100);
        }
      }

      export var standBy: AbilityTemplate =
      {
        name: "standBy",
        moveDelay: 50,
        actionsUse: "all",
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "self",
        effect: function(){}
      }
    }
  }
}
