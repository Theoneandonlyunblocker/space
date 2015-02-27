/// <reference path="galaxymap.ts"/>
/// <reference path="game.ts"/>
/// <reference path="mapevaluator.ts"/>

module Rance
{
  export class ObjectivesAI
  {
    mapEvaluator: MapEvaluator;
    map: GalaxyMap;
    player: Player;
    game: Game;

    constructor(mapEvaluator: MapEvaluator, game: Game)
    {
      this.mapEvaluator = mapEvaluator;
      this.map = mapEvaluator.map;
      this.player = mapEvaluator.player;
      this.game = game;
    }

    getDesireToExpand()
    {
      var neighboringStars = this.player.getNeighboringStars();

      var independentNeighbors = neighboringStars.filter(function(star)
      {
        return star.owner.isIndependent;
      });

      if (independentNeighbors.length <= 0)
      {
        return 0;
      }

      var starsPerPlayer = this.map.stars.length / this.game.playerOrder.length;
      var minDesiredStars = starsPerPlayer / 2;

      var desire = minDesiredStars / this.player.controlledLocations.length;
      desire = clamp(desire, 0, 1);

      return desire;
    }
  }
}
