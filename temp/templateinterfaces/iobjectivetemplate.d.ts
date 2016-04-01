declare interface IRoutineAdjustment
{
  target: Star | Player;
  multiplier: number;
}
declare interface IRoutineAdjustmentByTargetId
{
  [targetId: number]: IRoutineAdjustment;
}
namespace Templates
{
  declare interface IObjectiveTemplate
  {
    key: string;
    creatorFunction: (grandStrategyAI: MapAI.GrandStrategyAI,
      mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI) => MapAI.Objective[];

    movePriority?: number;
    preferredUnitComposition?: IArchetypeValues;
    // moveRoutine
    moveRoutineFN?: (front: MapAI.Front, afterMoveCallback: () => void) => void;
    // both this and unitFitFN should usually return 0.0..1.0
    // values higher than 1 should only be used to prioritize units already part of the front
    // how much front with this objective wants units
    unitDesireFN?: (front: MapAI.Front) => number;
    // how well individual unit fits into front
    unitFitFN?: (unit: Unit, front: MapAI.Front) => number;
    // unitsToFillObjective
    unitsToFillObjectiveFN?: (mapEvaluator: MapAI.MapEvaluator,
      objective: MapAI.Objective) => {min: number; ideal: number};

    economyRoutineFN?: (objective: MapAI.Objective, economyAI: MapAI.EconomyAI,
      adjustments: IRoutineAdjustmentByTargetId) => void;
    diplomacyRoutineFN?: (objective: MapAI.Objective, diplomacyAI: MapAI.DiplomacyAI,
      adjustments: IRoutineAdjustmentByTargetId, afterDoneCallback: () => void) => void;

    // applies to all current objectives
    // f.ex. don't go through star, try to trade with particular player
    moveRoutineAdjustments?: IRoutineAdjustment[];
    economyRoutineAdjustments?: IRoutineAdjustment[];
    diplomacyRoutineAdjustments?: IRoutineAdjustment[];
  }
}
