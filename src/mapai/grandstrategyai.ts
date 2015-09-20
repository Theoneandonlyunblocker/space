/// <reference path="../../modules/default/templates/personalities.ts" />
/// <reference path="mapevaluator.ts"/>

module Rance
{
  export module MapAI
  {
    export class GrandStrategyAI
    {
      personality: IPersonality;
      mapEvaluator: MapEvaluator;

      desireForWar: number;
      desireForExpansion: number;
      desireForConsolidation: number;

      constructor(personality: IPersonality, mapEvaluator: MapEvaluator)
      {
        this.personality = personality;
        this.mapEvaluator = mapEvaluator;
      }

      setDesires()
      {
        this.desireForWar = this.getDesireForWar();
        this.desireForExpansion = this.getDesireForExpansion();
        this.desireForConsolidation = 0.4 + 0.6 * (1 - this.desireForExpansion);
      }

      getDesireForWar()
      {
        var fromAggressiveness = this.personality.aggressiveness;
        var fromExpansiveness = 0;
        var availableExpansionTargets = this.mapEvaluator.getIndependentNeighborStarIslands(4);
        if (availableExpansionTargets.length < 4)
        {

          fromExpansiveness += this.personality.expansiveness / (1 + availableExpansionTargets.length);
        }

        // TODO penalize for lots of ongoing objectives (maybe in objectivesAI instead)

        var desire = fromAggressiveness + fromExpansiveness;

        return desire;
      }

      getDesireForExpansion()
      {
        var starsOwned = this.mapEvaluator.player.controlledLocations.length;
        var totalStarsInMap = this.mapEvaluator.map.stars.length;
        var playersInGame = this.mapEvaluator.game.playerOrder.length;

        var starsPerPlayer = totalStarsInMap / playersInGame;

        var baseMinStarsDesired = starsPerPlayer * 0.34;
        var baseMaxStarsDesired = starsPerPlayer;

        var extraMinStarsDesired = this.personality.expansiveness * (starsPerPlayer * 0.66);
        var extraMaxStarsDesired = this.personality.expansiveness * (starsPerPlayer * (playersInGame / 4));

        var minStarsDesired = baseMinStarsDesired + extraMinStarsDesired;
        var maxStarsDesired = baseMaxStarsDesired + extraMaxStarsDesired;

        var desire = 1 - clamp(getRelativeValue(starsOwned, minStarsDesired, maxStarsDesired), 0, 1);

        // console.table([
        // {
        //   player: this.mapEvaluator.player.id,
        //   expansiveness: this.personality.expansiveness.toFixed(2),
        //   minDesired: Math.round(minStarsDesired),
        //   maxdesired: Math.round(maxStarsDesired),
        //   currentStars: starsOwned,
        //   desire: desire.toFixed(2)
        // }]);

        return desire;
      }
    }
  }
}
