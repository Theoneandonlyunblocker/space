/// <reference path="../game.ts"/>
/// <reference path="../player.ts"/>
/// <reference path="../diplomacystatus.ts"/>

/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>

export namespace MapAI
{
  export class DiplomacyAI
  {
    game: Game;

    player: Player;
    diplomacyStatus: DiplomacyStatus;

    personality: IPersonality;
    mapEvaluator: MapEvaluator;
    objectivesAI: ObjectivesAI;

    constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI, game: Game,
      personality: IPersonality)
    {
      this.game = game;
      
      this.player = mapEvaluator.player;
      this.diplomacyStatus = this.player.diplomacyStatus;

      this.mapEvaluator = mapEvaluator;
      this.objectivesAI = objectivesAI;
      
      this.personality = personality;
    }
    setAttitudes()
    {
      var diplomacyEvaluations =
        this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);

      for (var playerId in diplomacyEvaluations)
      {
        this.diplomacyStatus.processAttitudeModifiersForPlayer(
          this.diplomacyStatus.metPlayers[playerId], diplomacyEvaluations[playerId]
        );
      }
    }
    resolveDiplomaticObjectives(afterAllDoneCallback: () => void)
    {
      var objectives = this.objectivesAI.getObjectivesWithTemplateProperty("diplomacyRoutineFN");
      var adjustments = this.objectivesAI.getAdjustmentsForTemplateProperty("diplomacyRoutineAdjustments");

      this.resolveNextObjective(objectives, adjustments, afterAllDoneCallback)
    }
    resolveNextObjective(objectives: Objective[], adjustments: IRoutineAdjustmentByTargetId,
      afterAllDoneCallback: () => void)
    {
      var objective = objectives.pop();

      if (!objective)
      {
        afterAllDoneCallback();
        return;
      }

      var boundResolveNextFN = this.resolveNextObjective.bind(this, objectives, adjustments, afterAllDoneCallback);
      objective.template.diplomacyRoutineFN(objective, this, adjustments, boundResolveNextFN)
    }
  }
}
