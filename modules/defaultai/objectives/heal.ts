import Front from "../../../src/mapai/Front";
import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI";
import MapEvaluator from "../../../src/mapai/MapEvaluator";
import Objective from "../../../src/mapai/Objective";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate";

import Fleet from "../../../src/Fleet";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";

import movePriority from "./common/movePriority";
import moveTo from "./common/moveroutines/moveTo";

const heal: ObjectiveTemplate =
{
  key: "heal",
  movePriority: movePriority.heal,
  preferredUnitComposition:
  {

  },
  moveRoutineFN: function(front: Front, afterMoveCallback: Function)
  {
    moveTo(front, afterMoveCallback, function(fleet: Fleet)
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
