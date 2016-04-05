/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

export var heal: ObjectiveTemplate =
{
  key: "heal",
  movePriority: -1,
  preferredUnitComposition:
  {

  },
  moveRoutineFN: function(front: Front, afterMoveCallback: Function)
  {
    AIUtils.moveToRoutine(front, afterMoveCallback, function(fleet: Fleet)
    {
      return fleet.player.getNearestOwnedStarTo(fleet.location);
    });
  },
  unitDesireFN: function(front: Front){return 1;},
  unitFitFN: function(unit: Unit, front: Front)
  {
    var healthPercentage = unit.currentHealth / unit.maxHealth;
    return 1 - healthPercentage;
  },
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var template = Modules.DefaultModule.Objectives.heal;
    return [new Objective(template, 1, null)];
  },
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 0, ideal: 0};
  }
}
