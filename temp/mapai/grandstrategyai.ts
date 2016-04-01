/// <reference path="../../modules/default/templates/personalities.ts" />
/// <reference path="mapevaluator.ts"/>

export namespace MapAI
{
  export class GrandStrategyAI
  {
    personality: IPersonality;
    mapEvaluator: MapEvaluator;

    desireForWar: number;
    desireForExpansion: number;
    desireForConsolidation: number;

    private desiredStars:
    {
      min: number;
      max: number;
    };

    constructor(personality: IPersonality, mapEvaluator: MapEvaluator)
    {
      this.personality = personality;
      this.mapEvaluator = mapEvaluator;
    }

    private setDesiredStars()
    {
      var totalStarsInMap = this.mapEvaluator.map.stars.length;
      var playersInGame = this.mapEvaluator.game.playerOrder.length;

      var starsPerPlayer = totalStarsInMap / playersInGame;

      var baseMinStarsDesired = starsPerPlayer * 0.34;
      var baseMaxStarsDesired = starsPerPlayer;

      var extraMinStarsDesired = this.personality.expansiveness * (starsPerPlayer * 0.66);
      var extraMaxStarsDesired = this.personality.expansiveness * (starsPerPlayer * (playersInGame / 4));

      var minStarsDesired = baseMinStarsDesired + extraMinStarsDesired;
      var maxStarsDesired = baseMaxStarsDesired + extraMaxStarsDesired;

      this.desiredStars =
      {
        min: minStarsDesired,
        max: maxStarsDesired
      }
    }

    setDesires()
    {
      this.desireForExpansion = this.getDesireForExpansion();
      this.desireForWar = this.getDesireForWar();
      this.desireForConsolidation = 0.4 + 0.6 * (1 - this.desireForExpansion);
    }

    getDesireForWar()
    {
      if (!this.desiredStars) this.setDesiredStars();
      var fromAggressiveness = this.personality.aggressiveness;
      var fromExpansiveness = 0;
      var minStarsStillDesired = this.mapEvaluator.player.controlledLocations.length - this.desiredStars.min;
      var availableExpansionTargets = this.mapEvaluator.getIndependentNeighborStarIslands(minStarsStillDesired);
      if (availableExpansionTargets.length < minStarsStillDesired)
      {
        fromExpansiveness += this.personality.expansiveness / (1 + availableExpansionTargets.length);
      }

      // TODO ai | penalize for lots of ongoing objectives (maybe in objectivesAI instead)

      var desire = fromAggressiveness + fromExpansiveness;

      return clamp(desire, 0, 1);
    }

    getDesireForExpansion()
    {
      if (!this.desiredStars) this.setDesiredStars();
      var starsOwned = this.mapEvaluator.player.controlledLocations.length;
    

      var desire = 1 - getRelativeValue(starsOwned, this.desiredStars.min, this.desiredStars.max);

      // console.table([
      // {
      //   player: this.mapEvaluator.player.id,
      //   expansiveness: this.personality.expansiveness.toFixed(2),
      //   minDesired: Math.round(minStarsDesired),
      //   maxdesired: Math.round(maxStarsDesired),
      //   currentStars: starsOwned,
      //   desire: desire.toFixed(2)
      // }]);

      return clamp(desire, 0.1, 1);
    }
  }
}
