/// <reference path="../../data/templates/personalities.ts" />

/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>
/// <reference path="../player.ts"/>

/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="economyai.ts"/>
/// <reference path="frontsai.ts"/>
/// <reference path="diplomacyai.ts"/>

module Rance
{
  export class AIController
  {
    player: Player;
    game: Game;

    personality: IPersonality;
    map: GalaxyMap;

    mapEvaluator: MapEvaluator;

    objectivesAI: ObjectivesAI;
    economicAI: EconomyAI;
    frontsAI: FrontsAI;
    diplomacyAI: DiplomacyAI;

    constructor(player: Player, game: Game, personality?: IPersonality)
    {
      this.personality = personality || makeRandomPersonality();

      this.player = player;
      this.game = game;

      this.map = game.galaxyMap;

      this.mapEvaluator = new MapEvaluator(this.map, this.player, this.game);

      this.objectivesAI = new ObjectivesAI(this.mapEvaluator, this.personality);
      this.frontsAI = new FrontsAI(this.mapEvaluator, this.objectivesAI, this.personality);
      this.economicAI = new EconomyAI(
      {
        objectivesAI: this.objectivesAI,
        frontsAI: this.frontsAI,
        mapEvaluator: this.mapEvaluator,
        personality: this.personality
      });
      this.diplomacyAI = new DiplomacyAI(this.mapEvaluator, this.game, this.personality);
    }

    processTurn(afterFinishedCallback?: any)
    {
      // clear cached stuff from mapevaluator
      this.mapEvaluator.processTurnStart();

      // gsai evaluate grand strategy

      // dai set attitude
      this.diplomacyAI.setAttitudes();

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

      // fai set fleets yet to move
      this.frontsAI.setFrontsToMove();

      // fai move fleets
      // function param is called after all fronts have moved
      this.frontsAI.moveFleets(this.finishMovingFleets.bind(this, afterFinishedCallback));
    }
    finishMovingFleets(afterFinishedCallback?: any)
    {
      this.frontsAI.organizeFleets();
      if (afterFinishedCallback)
      {
        afterFinishedCallback();
      }
    }
  }
}