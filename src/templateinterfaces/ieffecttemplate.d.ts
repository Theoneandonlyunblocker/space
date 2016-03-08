/// <reference path="../targeting.ts" />
/// <reference path="../unit.ts" />
/// <reference path="../battle.ts" />

declare module Rance
{
  module Templates
  {
    interface IEffectTemplate
    {
      name: string;
      
      targetFleets: TargetFleet;
      battleAreaFunction: BattleAreaFunction;
      targetRange: "self" | "close" | "all"; // todo
      effect: (user: Unit, target: Unit, battle: Battle, data?: any) => void;
    }
  }
}
