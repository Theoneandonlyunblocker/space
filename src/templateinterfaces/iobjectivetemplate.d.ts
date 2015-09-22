declare module Rance
{
  module Templates
  {
    interface IObjectiveTemplate
    {
      key: string;
      preferredUnitComposition: IArchetypeValues;
      // moveRoutine
      moveRoutineFN: (front: MapAI.Front, afterMoveCallback: () => void) => void;

      // both this and unitFitFN should usually return 0.0..1.0
      // values higher than 1 should only be used to prioritize units already part of the front
      // how much front with this objective wants units
      unitDesireFN: (front: MapAI.Front) => number;
      // how well individual unit fits into front
      unitFitFN: (unit: Unit, front: MapAI.Front) => number;

      // creatorFunction
      creatorFunction: (grandStrategyAI: MapAI.GrandStrategyAI,
        mapEvaluator: MapAI.MapEvaluator) => MapAI.Objective[];

      // unitsToFillObjective
      unitsToFillObjectiveFN: (objective: MapAI.Objective) => {min: number; ideal: number;};
    }
  }
}
