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

      this.evaluationParameters = defaultEvaluationParameters;
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

      var evaluations:
      {
        star: Star;
        desirability: number;
      }[] = [];

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];
        var starDesirability = this.evaluateStarDesirability(star);

        evaluations.push(
        {
          star: star,
          desirability: starDesirability
        });
      }

      return evaluations.sort(function(a, b)
      {
        return b.desirability - a.desirability;
      });
    }

    getHostileShipsAtStar(star: Star)
    {
      var hostilePlayers = star.getEnemyFleetOwners(this.player);

      var shipsByEnemy:
      {
        [playerId: number]: Unit[];
      } = {};

      for (var i = 0; i < hostilePlayers.length; i++)
      {
        shipsByEnemy[hostilePlayers[i].id] = star.getAllShipsOfPlayer(hostilePlayers[i]);
      }

      return shipsByEnemy;
    }

    getHostileStrengthAtStar(star: Star)
    {
      var hostileShipsByPlayer = this.getHostileShipsAtStar(star);

      var strengthByEnemy:
      {
        [playerId: number]: number;
      } = {};

      for (var playerId in hostileShipsByPlayer)
      {
        var strength = 0;

        for (var i = 0; i < hostileShipsByPlayer[playerId].length; i++)
        {
          strength += hostileShipsByPlayer[playerId][i].currentStrength;
        }

        strengthByEnemy[playerId] = strength;
      }

      return strengthByEnemy;
    }

    getTotalHostileStrengthAtStar(star: Star): number
    {
      var byPlayer = this.getHostileStrengthAtStar(star);

      var total = 0;

      for (var playerId in byPlayer)
      {
        total += byPlayer[playerId];
      }

      return total;
    }

    evaluateHostileStrengthAtNeighboringStars(star: Star, range: number): number
    {
      var strength = 0;

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
          strength += this.getTotalHostileStrengthAtStar(stars[i]) * distanceFalloff
        }
      }

      return strength;
    }

    getDefenceBuildingStrengthAtStar(star: Star): number
    {
      var strength = 0;

      for (var i = 0; i < star.buildings["defence"].length; i++)
      {
        var building = star.buildings["defence"][i];
        strength += building.totalCost;
      }

      return strength;
    }



    evaluateStarVulnerability(star: Star)
    {
      var currentDefenceStrength = 0;
      currentDefenceStrength += this.getTotalHostileStrengthAtStar(star);
      currentDefenceStrength += this.getDefenceBuildingStrengthAtStar(star);

      var nearbyDefenceStrength = this.evaluateHostileStrengthAtNeighboringStars(star, 2);
    }
  }
}
