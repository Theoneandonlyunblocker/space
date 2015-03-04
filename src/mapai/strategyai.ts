/// <reference path="../../data/templates/personalitytemplates.ts" />

module Rance
{
  export class StrategyAI
  {
    player: Player;
    map: GalaxyMap;
    mapEvaluator: MapEvaluator;
    personality: IPersonalityData;

    constructor(mapEvaluator: MapEvaluator, game: Game,
      personality: IPersonalityData)
    {
      this.mapEvaluator = mapEvaluator;
      this.player = mapEvaluator.player;
      this.map = mapEvaluator.map;
      this.game = game;
      this.personality = personality;
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