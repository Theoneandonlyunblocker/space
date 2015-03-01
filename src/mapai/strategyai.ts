module Rance
{
  export class StrategyAI
  {
    player: Player;
    map: GalaxyMap;
    mapEvaluator: MapEvaluator;

    constructor(mapEvaluator: MapEvaluator, game: Game)
    {
      this.mapEvaluator = mapEvaluator;
      this.player = mapEvaluator.player;
      this.map = mapEvaluator.map;
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