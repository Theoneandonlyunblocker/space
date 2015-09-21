declare module Rance
{
  module Templates
  {
    interface IObjectiveTemplate
    {
      preferredUnitComposition: IArchetypeValues;
      //moveRoutine
      moveRoutine: (front: MapAI.Front, afterMoveCallback: () => void) => void;
      //unitFit
      unitFit: (unit: Unit, front: MapAI.Front) => number;
      //creatorFunction
      creatorFunction: (grandStrategyAI: MapAI.GrandStrategyAI,
        mapEvaluator: MapAI.MapEvaluator) => MapAI.Objective[];
      //unitsToFillObjective
      unitsToFillObjective: (objective: MapAI.Objective) => {min: number; ideal: number;};
    }
  }
}
