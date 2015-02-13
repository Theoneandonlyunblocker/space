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

    getDefenceBuildingStrengthAtStarByPlayer(star: Star)
    {
      var byPlayer:
      {
        [playerId: number]: number;
      } = {};

      for (var i = 0; i < star.buildings["defence"].length; i++)
      {
        var building = star.buildings["defence"][i];

        if (!byPlayer[building.controller.id])
        {
          byPlayer[building.controller.id] = 0;
        }
        
        byPlayer[building.controller.id] += building.totalCost;
      }

      return byPlayer;
    }

    getTotalDefenceBuildingStrengthAtStar(star: Star): number
    {
      var strength = 0;

      for (var i = 0; i < star.buildings["defence"].length; i++)
      {
        var building = star.buildings["defence"][i];
        
        if (building.controller.id === this.player.id) continue;

        strength += building.totalCost;
      }

      return strength;
    }

    evaluateStarVulnerability(star: Star)
    {
      var currentDefenceStrength = 0;
      currentDefenceStrength += this.getTotalHostileStrengthAtStar(star);
      currentDefenceStrength += this.getTotalDefenceBuildingStrengthAtStar(star);

      var nearbyDefenceStrength = this.evaluateHostileStrengthAtNeighboringStars(star, 2);
    }

    evaluateFleetStrength(fleet: Fleet): number
    {
      return fleet.getTotalStrength().current;
    }

    getVisibleFleetsByPlayer()
    {
      var stars = this.player.getVisibleStars();

      var byPlayer:
      {
        [playerId: number]: Fleet[];
      } = {};

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];

        for (var playerId in star.fleets)
        {
          var playerFleets = star.fleets[playerId];

          if (!byPlayer[playerId])
          {
            byPlayer[playerId] = [];
          }

          for (var j = 0; j < playerFleets.length; j++)
          {
            byPlayer[playerId] = byPlayer[playerId].concat(playerFleets[j]);
          }
        }
      }

      return byPlayer;
    }

    buildPlayerInfluenceMap(player: Player)
    {
      var playerIsImmobile = player.isIndependent;

      var influenceByStar:
      {
        [starId: number]: number;
      } = {};

      var stars = this.player.getRevealedStars();

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];

        var defenceBuildingStrengths =
          this.getDefenceBuildingStrengthAtStarByPlayer(star);

        if (defenceBuildingStrengths[player.id])
        {
          if (!isFinite(influenceByStar[star.id]))
          {
            influenceByStar[star.id] = 0;
          };

          influenceByStar[star.id] += defenceBuildingStrengths[player.id];
        }
      }

      var fleets = this.getVisibleFleetsByPlayer()[player.id];

      function getDistanceFalloff(distance: number)
      {
        return 1 / (distance + 1);
      }

      for (var i = 0; i < fleets.length; i++)
      {
        var fleet = fleets[i];
        var strength = this.evaluateFleetStrength(fleet);
        var location = fleet.location;

        var range = fleet.getMinMaxMovePoints();
        var turnsToCheck = 2;

        var inFleetRange = location.getLinkedInRange(range * turnsToCheck).byRange;

        inFleetRange[0] = [location];

        for (var distance in inFleetRange)
        {
          var numericDistance = parseInt(distance);
          var turnsToReach = Math.floor((numericDistance - 1) / range);
          if (turnsToReach < 0) turnsToReach = 0;
          var distanceFalloff = getDistanceFalloff(turnsToReach);
          var adjustedStrength = strength * distanceFalloff;

          for (var j = 0; j < inFleetRange[distance].length; j++)
          {
            var star = inFleetRange[distance][j];

            if (!isFinite(influenceByStar[star.id]))
            {
              influenceByStar[star.id] = 0;
            };

            influenceByStar[star.id] += adjustedStrength;
          }
        }
      }

      return influenceByStar;
    }
  }
}
