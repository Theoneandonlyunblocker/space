/// <reference path="../targeting.ts" />
/// <reference path="../unit.ts" />
/// <reference path="../battle.ts" />

declare namespace Rance
{
  namespace Templates
  {
    interface IEffectActionTemplate
    {
      name: string;
      
      targetFormations: TargetFormation;
      battleAreaFunction: BattleAreaFunction;
      targetRangeFunction: TargetRangeFunction;
      // TODO ability | handle changes to battle done by actions
      // shouldn't modify any other units than the provided user and target
      executeAction: (user: Unit, target: Unit, battle: Battle, data?: any) => void;
    }
  }
}
