/// <reference path="../../src/targeting.ts" />

module Rance
{
  module Templates
  {
    export interface AbilityTemplate
    {
      name: string;
      delay: number;
      interruptsNeeded?: number;
      canTarget: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, far, all
      effect: (any) => void;
    }
  }
}
