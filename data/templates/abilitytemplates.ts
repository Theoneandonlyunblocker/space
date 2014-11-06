/// <reference path="../../src/targeting.ts" />

module Rance
{
  export module Templates
  {
    export interface AbilityTemplate
    {
      name: string;
      delay: number;
      interruptsNeeded?: number;
      actionsUse: number;
      targetFleets: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, all
      //effect: (any) => void;
    }

    export module Abilities
    {
      export var rangedAttack: AbilityTemplate =
      {
        name: "rangedAttack",
        delay: 0,
        actionsUse: 1,
        targetFleets: "enemy",
        targetingFunction: targetNeighbors,
        targetRange: "all"
      }
      export var closeAttack: AbilityTemplate =
      {
        name: "closeAttack",
        delay: 0,
        actionsUse: 1,
        targetFleets: "enemy",
        targetingFunction: targetNeighbors,
        targetRange: "close"
      }
      export var standBy: AbilityTemplate =
      {
        name: "standBy",
        delay: 0,
        actionsUse: 0,
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "self"
      }
    }
  }
}
