import MapEvaluator from "./MapEvaluator";
import GrandStrategyAI from "./GrandStrategyAI";
import EconomyAI from "./EconomyAI";
import FrontsAI from "./FrontsAI";
import ObjectivesAI from "./ObjectivesAI";
import DiplomacyAI from "./DiplomacyAI";
import AIControllerSaveData from "./AIControllerSaveData";

import AITemplate from "../../../src/templateinterfaces/AITemplate";

import Game from "../../../src/Game";
import Player from "../../../src/Player";
import Personality from "../../../src/Personality";
import GalaxyMap from "../../../src/GalaxyMap";
import
{
  makeRandomPersonality
} from "../../../src/utility";

export default class AIController implements AITemplate<AIControllerSaveData>
{
  static type: string = "AIController";
  public type: string = "AIController";
  
  player: Player;
  game: Game;

  personality: Personality;
  map: GalaxyMap;

  mapEvaluator: MapEvaluator;

  grandStrategyAI: GrandStrategyAI;
  objectivesAI: ObjectivesAI;
  economyAI: EconomyAI;
  frontsAI: FrontsAI;
  diplomacyAI: DiplomacyAI;

  constructor(player: Player, game: Game, personality?: Personality)
  {
    this.personality = personality || makeRandomPersonality();

    this.player = player;
    this.game = game;

    this.map = game.galaxyMap;

    this.mapEvaluator = new MapEvaluator(this.map, this.player, this.game);


    this.grandStrategyAI = new GrandStrategyAI(this.personality, this.mapEvaluator);
    this.objectivesAI = new ObjectivesAI(this.mapEvaluator, this.grandStrategyAI);
    this.frontsAI = new FrontsAI(this.mapEvaluator, this.objectivesAI, this.personality);
    this.economyAI = new EconomyAI(
    {
      objectivesAI: this.objectivesAI,
      frontsAI: this.frontsAI,
      mapEvaluator: this.mapEvaluator,
      personality: this.personality
    });
    this.diplomacyAI = new DiplomacyAI(this.mapEvaluator, this.objectivesAI,
      this.game, this.personality);
  }

  processTurn(afterFinishedCallback: () => void)
  {
    // gsai evaluate grand strategy
    this.grandStrategyAI.setDesires();

    // dai set attitude
    this.diplomacyAI.setAttitudes();

    // oai make objectives
    this.objectivesAI.setAllDiplomaticObjectives();

    // dai resolve diplomatic objectives
    this.diplomacyAI.resolveDiplomaticObjectives(
      this.processTurnAfterDiplomaticObjectives.bind(this, afterFinishedCallback));
  }
  processTurnAfterDiplomaticObjectives(afterFinishedCallback: () => void)
  {
    this.objectivesAI.setAllEconomicObjectives();
    this.economyAI.resolveEconomicObjectives();

    // oai make objectives
    this.objectivesAI.setAllMoveObjectives();

    // fai form fronts
    this.frontsAI.formFronts();
    
    // fai assign units
    this.frontsAI.assignUnits();

    // fai request units
    this.frontsAI.setUnitRequests();

    // eai fulfill requests
    this.economyAI.satisfyAllRequests();

    // fai organize fleets
    this.frontsAI.organizeFleets();

    // fai set fleets yet to move
    this.frontsAI.setFrontsToMove();

    // fai move fleets
    // function param is called after all fronts have moved
    this.frontsAI.moveFleets(this.finishMovingFleets.bind(this, afterFinishedCallback));
  }
  finishMovingFleets(afterFinishedCallback: () => void)
  {
    this.frontsAI.organizeFleets();
    if (afterFinishedCallback)
    {
      afterFinishedCallback();
    }
  }
  public serialize(): AIControllerSaveData
  {
    // TODO
    return undefined;
  }
}
