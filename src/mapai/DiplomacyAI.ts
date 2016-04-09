import RoutineAdjustmentByID from "../templateinterfaces/RoutineAdjustmentByID.d.ts";

import Personality from "../Personality.d.ts";
import Game from "../Game.ts";
import Player from "../Player.ts";
import DiplomacyStatus from "../DiplomacyStatus.ts";

import MapEvaluator from "./MapEvaluator.ts";
import ObjectivesAI from "./ObjectivesAI.ts";
import Objective from "./Objective.ts";

export default class DiplomacyAI
{
  game: Game;

  player: Player;
  diplomacyStatus: DiplomacyStatus;

  personality: Personality;
  mapEvaluator: MapEvaluator;
  objectivesAI: ObjectivesAI;

  constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI, game: Game,
    personality: Personality)
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
  resolveNextObjective(objectives: Objective[], adjustments: RoutineAdjustmentByID,
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
