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
      
      targetFormations: TargetFormation;
      battleAreaFunction: BattleAreaFunction;
      targetRangeFunction: TargetRangeFunction;
      effect: (user: Unit, target: Unit, battle: Battle, data?: any) => void;
    }
  }
}
