import MapEvaluator from "./MapEvaluator";

import Game from "../../../src/Game";
import Personality from "../../../src/Personality";
import
{
  clamp,
  getRelativeValue,
} from "../../../src/utility";

export class GrandStrategyAI
{
  public desireForWar: number;
  public desireForExpansion: number;
  public desireForConsolidation: number;

  private personality: Personality;
  private game: Game;
  private mapEvaluator: MapEvaluator;

  private desiredStars:
  {
    min: number;
    max: number;
  };

  constructor(personality: Personality, mapEvaluator: MapEvaluator, game: Game)
  {
    this.personality = personality;
    this.mapEvaluator = mapEvaluator;
    this.game = game;
  }

  public setDesires()
  {
    this.desireForExpansion = this.getDesireForExpansion();
    this.desireForWar = this.getDesireForWar();
    this.desireForConsolidation = 0.4 + 0.6 * (1 - this.desireForExpansion);
  }

  private setDesiredStars()
  {
    const totalStarsInMap = this.mapEvaluator.map.stars.length;
    const playersInGame = this.game.playerOrder.length;

    const starsPerPlayer = totalStarsInMap / playersInGame;

    const baseMinStarsDesired = starsPerPlayer * 0.34;
    const baseMaxStarsDesired = starsPerPlayer;

    const extraMinStarsDesired = this.personality.expansiveness * (starsPerPlayer * 0.66);
    const extraMaxStarsDesired = this.personality.expansiveness * (starsPerPlayer * (playersInGame / 4));

    const minStarsDesired = baseMinStarsDesired + extraMinStarsDesired;
    const maxStarsDesired = baseMaxStarsDesired + extraMaxStarsDesired;

    this.desiredStars =
    {
      min: minStarsDesired,
      max: maxStarsDesired,
    };
  }

  private getDesireForWar()
  {
    if (!this.desiredStars)
    {
      this.setDesiredStars();
    }
    const fromAggressiveness = this.personality.aggressiveness;
    let fromExpansiveness = 0;
    const minStarsStillDesired = this.mapEvaluator.player.controlledLocations.length - this.desiredStars.min;
    const availableExpansionTargets = this.mapEvaluator.getIndependentNeighborStarIslands(minStarsStillDesired);
    if (availableExpansionTargets.length < minStarsStillDesired)
    {
      fromExpansiveness += this.personality.expansiveness / (1 + availableExpansionTargets.length);
    }

    // TODO ai | penalize for lots of ongoing objectives (maybe in objectivesAI instead)

    const desire = fromAggressiveness + fromExpansiveness;

    return clamp(desire, 0, 1);
  }

  private getDesireForExpansion()
  {
    if (!this.desiredStars)
    {
      this.setDesiredStars();
    }
    const starsOwned = this.mapEvaluator.player.controlledLocations.length;


    const desire = 1 - getRelativeValue(starsOwned, this.desiredStars.min, this.desiredStars.max);

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
