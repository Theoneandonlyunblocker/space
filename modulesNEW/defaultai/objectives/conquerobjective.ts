/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

export var conquer: ObjectiveTemplate =
{
  key: "conquer",
  movePriority: 6,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1
  },
  moveRoutineFN: AIUtils.musterAndAttackRoutine.bind(null, AIUtils.buildingControllerFilter),
  unitDesireFN: AIUtils.defaultUnitDesireFN,
  unitFitFN: AIUtils.defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
    mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI)
  {
    var hostilePlayers: Player[] = [];
    var diplomacyStatus = mapEvaluator.player.diplomacyStatus;
    for (var playerId in diplomacyStatus.metPlayers)
    {
      if (diplomacyStatus.statusByPlayer[playerId] >= DiplomaticState.war)
      {
        hostilePlayers.push(diplomacyStatus.metPlayers[playerId]);
      }
    }

    var relativeThreatOfPlayers = mapEvaluator.getRelativePerceivedThreatOfAllKnownPlayers();

    var possibleTargets: Star[] = [];
    for (var i = 0; i < hostilePlayers.length; i++)
    {
      var desirabilityByStar = mapEvaluator.evaluateDesirabilityOfPlayersStars(hostilePlayers[i]).byStar;
      var sortedIds = getObjectKeysSortedByValueOfProp(desirabilityByStar, "desirabilityByStar", "desc");
      if (sortedIds.length === 0)
      {
        continue;
      }
      possibleTargets.push(desirabilityByStar[sortedIds[0]].star);
    }

    var template = Modules.DefaultModule.Objectives.conquer;
    var objectives: MapAI.Objective[] = [];
    for (var i = 0; i < possibleTargets.length; i++)
    {
      var star = possibleTargets[i];
      var player = star.owner;
      var threat = relativeThreatOfPlayers[player.id];
      objectives.push(new MapAI.Objective(template, threat, star));
    }

    return objectives;
  },
  unitsToFillObjectiveFN: AIUtils.getUnitsToBeatImmediateTarget
}
