import Front from "../../../src/mapai/Front.ts";
import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI.ts";
import MapEvaluator from "../../../src/mapai/MapEvaluator.ts";
import Objective from "../../../src/mapai/Objective.ts";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate.d.ts";

import Fleet from "../../../src/Fleet.ts";
import Star from "../../../src/Star.ts";
import Unit from "../../../src/Unit.ts";

import
{
  moveToRoutine
} from "./aiutils.ts";

const heal: ObjectiveTemplate =
{
  key: "heal",
  movePriority: -1,
  preferredUnitComposition:
  {

  },
  moveRoutineFN: function(front: Front, afterMoveCallback: Function)
  {
    moveToRoutine(front, afterMoveCallback, function(fleet: Fleet)
    {
      return fleet.player.getNearestOwnedStarTo(fleet.location);
    });
  },
  unitDesireFN: function(front: Front)
  {
    return 1;
  },
  unitFitFN: function(unit: Unit, front: Front)
  {
    var healthPercentage = unit.currentHealth / unit.maxHealth;
    return 1 - healthPercentage;
  },
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var template = heal;
    return [new Objective(template, 1, null)];
  },
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 0, ideal: 0};
  }
}

export default heal;
