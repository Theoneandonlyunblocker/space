import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI";
import MapEvaluator from "../../../src/mapai/MapEvaluator";
import Objective from "../../../src/mapai/Objective";
import ObjectivesAI from "../../../src/mapai/ObjectivesAI";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate";

import DiplomacyState from "../../../src/DiplomacyState";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";
import
{
  getObjectKeysSortedByValueOfProp
} from "../../../src/utility";

import
{
  musterAndAttackRoutine,
  buildingControllerFilter,
  defaultUnitDesireFN,
  defaultUnitFitFN,
  getUnitsToBeatImmediateTarget
} from "../aiUtils";

const conquer: ObjectiveTemplate =
{
  key: "conquer",
  movePriority: 6,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1
  },
  moveRoutineFN: musterAndAttackRoutine.bind(null, buildingControllerFilter),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
  {
    var hostilePlayers: Player[] = [];
    var diplomacyStatus = mapEvaluator.player.diplomacyStatus;
    for (let playerId in diplomacyStatus.metPlayers)
    {
      if (diplomacyStatus.statusByPlayer[playerId] >= DiplomacyState.war)
      {
        hostilePlayers.push(diplomacyStatus.metPlayers[playerId]);
      }
    }

    var relativeThreatOfPlayers = mapEvaluator.getRelativePerceivedThreatOfAllKnownPlayers();

    var possibleTargets: Star[] = [];
    for (let i = 0; i < hostilePlayers.length; i++)
    {
      var desirabilityByStar = mapEvaluator.evaluateDesirabilityOfPlayersStars(hostilePlayers[i]).byStar;
      var sortedIds = getObjectKeysSortedByValueOfProp(desirabilityByStar, "desirabilityByStar", "desc");
      if (sortedIds.length === 0)
      {
        continue;
      }
      possibleTargets.push(desirabilityByStar[sortedIds[0]].star);
    }

    var template = conquer;
    var objectives: Objective[] = [];
    for (let i = 0; i < possibleTargets.length; i++)
    {
      var star = possibleTargets[i];
      var player = star.owner;
      var threat = relativeThreatOfPlayers[player.id];
      objectives.push(new Objective(template, threat, star));
    }

    return objectives;
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default conquer;
