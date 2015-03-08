/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>
/// <reference path="../player.ts"/>

/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="economicai.ts"/>
/// <reference path="frontsai.ts"/>

module Rance
{
  export class AIController
  {
    player: Player;
    game: Game;

    personality: IPersonalityData;
    map: GalaxyMap;

    mapEvaluator: MapEvaluator;

    objectivesAI: ObjectivesAI;
    economicAI: EconomicAI;
    frontsAI: FrontsAI;

    constructor(props:
    {
      player: Player;
      game: Game;
    })
    {
      this.personality = Templates.Personalities.testPersonality1;

      this.player = props.player;
      this.game = props.game;

      this.map = props.game.galaxyMap;

      this.mapEvaluator = new MapEvaluator(this.map, this.player);

      this.objectivesAI = new ObjectivesAI(this.mapEvaluator, this.game);
      this.frontsAI = new FrontsAI(this.mapEvaluator, this.objectivesAI,
        this.personality);
      this.economicAI = new EconomicAI(
      {
        objectivesAI: this.objectivesAI,
        frontsAI: this.frontsAI,
        mapEvaluator: this.mapEvaluator,
        personality: this.personality
      });
    }

    processTurn()
    {
      // gsai evaluate grand strategy


      // oai make objectives
      this.objectivesAI.setAllObjectives();

      // fai form fronts
      this.frontsAI.formFronts();
      
      // fai assign units
      this.frontsAI.assignUnits();

      // fai request units
      this.frontsAI.setUnitRequests();

      // eai fulfill requests
      this.economicAI.satisfyAllRequests();

      // fai organize fleets
      this.frontsAI.organizeFleets();

      // fai move fleets
      this.frontsAI.moveFleets();

      // fai organize fleets
      this.frontsAI.organizeFleets();
    }
  }
}