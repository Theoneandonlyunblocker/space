import RoutineAdjustmentByID from "../RoutineAdjustmentByID";

import DiplomacyStatus from "../../../src/DiplomacyStatus";
import Game from "../../../src/Game";
import Personality from "../../../src/Personality";
import Player from "../../../src/Player";

import MapEvaluator from "./MapEvaluator";
import Objective from "./Objective";
import ObjectivesAI from "./ObjectivesAI";

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

    for (let playerId in diplomacyEvaluations)
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
