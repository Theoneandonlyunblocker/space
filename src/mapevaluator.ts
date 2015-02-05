/// <reference path="galaxymap.ts"/>
/// <reference path="player.ts"/>

module Rance
{
  export var defaultEvaluationParameters =
  {
    starDesirability:
    {
      neighborRange: 1,
      neighborWeight: 0.5,

      totalIncomeWeight: 1,
      baseIncomeWeight: 0.5,

      infrastructureWeight: 1,
      productionWeight: 1,
    }
  }
  export class MapEvaluator
  {
    map: GalaxyMap;
    player: Player;
    evaluationParameters:
    {
      starDesirability:
      {
        neighborRange: number;
        neighborWeight: number;

        totalIncomeWeight: number;
        baseIncomeWeight: number;

        infrastructureWeight: number;
        productionWeight: number;
      };
    };

    constructor(map: GalaxyMap, player: Player)
    {
      this.map = map;
      this.player = player;
    }

    getHostileStrengthAtStar(star: Star)
    {
      var hostilePlayers = star.getEnemyFleetOwners(this.player);
      var strengthByEnemy:
      {
        [playerId: number]: number;
      } = {};

      for (var i = 0; i < hostilePlayers.length; i++)
      {
        var enemyShips = star.getAllShipsOfPlayer(hostilePlayers[i]);

        var strength = 0;
        for (var j = 0; j < enemyShips.length; j++)
        {
          strength += enemyShips[j].currentStrength;
        }

        strengthByEnemy[hostilePlayers[i].id] = strength;
      }

      return strengthByEnemy;
    }

    getTotalHostileStrengthAtStar(star: Star)
    {
      var byPlayer = this.getHostileStrengthAtStar(star);

      var total = 0;

      for (var playerId in byPlayer)
      {
        total += byPlayer[playerId];
      }

      return total;
    }

    evaluateStarIncome(star: Star): number
    {
      var evaluation = 0;

      evaluation += star.baseIncome;
      evaluation += (star.getIncome() - star.baseIncome) *
      (1 - this.evaluationParameters.starDesirability.baseIncomeWeight);

      return evaluation;
    }

    evaluateStarInfrastructure(star: Star): number
    {
      var evaluation = 0;

      for (var category in star.buildings)
      {
        for (var i = 0; i < star.buildings[category].length; i++)
        {
          evaluation += star.buildings[category][i].totalCost;
        }
      }

      return evaluation;
    }

    evaluateStarProduction(star: Star): number
    {
      var evaluation = 0;

      evaluation += star.getItemManufactoryLevel();

      return evaluation;
    }

    evaluateNeighboringStarsDesirability(star: Star, range: number): number
    {
      var evaluation = 0;

      var getDistanceFalloff = function(distance)
      {
        return 1 / (distance + 1);
      }
      var inRange = star.getLinkedInRange(range).byRange;

      for (var distanceString in inRange)
      {
        var stars = inRange[distanceString];
        var distanceFalloff = getDistanceFalloff(parseInt(distanceString));

        for (var i = 0; i < stars.length; i++)
        {
          evaluation += this.evaluateIndividualStarDesirability(stars[i]) * distanceFalloff
        }
      }

      return evaluation;
    }

    evaluateIndividualStarDesirability(star: Star): number
    {
      var evaluation = 0;
      var p = this.evaluationParameters.starDesirability;

      evaluation += this.evaluateStarIncome(star) * p.totalIncomeWeight;
      evaluation += this.evaluateStarInfrastructure(star) * p.infrastructureWeight;
      evaluation += this.evaluateStarProduction(star) * p.productionWeight;

      return evaluation;
    }

    evaluateStarDesirability(star: Star): number
    {
      var evaluation = 0;
      var p = this.evaluationParameters.starDesirability;

      evaluation += this.evaluateIndividualStarDesirability(star);
      evaluation += this.evaluateNeighboringStarsDesirability(star, p.neighborRange) *
        p.neighborWeight;

      return evaluation;
    }

    getImmediateExpansionDesirability()
    {
      var stars = this.player.getNeighboringStars();

      
    }
  }
}
