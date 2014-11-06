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
      targetFleets: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, all
      //effect: (any) => void;
    }

    export module Abilities
    {
      export var testAbility: AbilityTemplate =
      {
        name: "testAbility",
        delay: 0,
        targetFleets: "enemy",
        targetingFunction: targetNeighbors,
        targetRange: "all"
      }
      export var standBy: AbilityTemplate =
      {
        name: "standBy",
        delay: 0,
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "self"
      }
    }
  }
}
