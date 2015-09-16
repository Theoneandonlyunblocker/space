declare module Rance
{
  module Templates
  {
    interface IEffectTemplate
    {
      name: string;
      
      targetFleets: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, all
      effect: (user: Unit, target: Unit, data?: any) => void;
    }
  }
}
