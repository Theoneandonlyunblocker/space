/// <reference path="../galaxymap.ts"/>
/// <reference path="../player.ts"/>

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
  export interface IIndependentTargetEvaluations
  {
    [starId: number]:
    {
      star: Star;
      desirability: number;
      independentStrength: number;
      ownInfluence: number;
    }
  }
  export class MapEvaluator
  {
    map: GalaxyMap;
    player: Player;
    game: Game;
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

    constructor(map: GalaxyMap, player: Player, game?: Game)
    {
      this.map = map;
      this.player = player;
      this.game = game;

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

    evaluateIndependentTargets(targetStars: Star[]): IIndependentTargetEvaluations
    {
      var evaluationByStar: IIndependentTargetEvaluations = {};

      for (var i = 0; i < targetStars.length; i++)
      {
        var star = targetStars[i];

        var desirability = this.evaluateStarDesirability(star);
        var independentStrength = this.getIndependentStrengthAtStar(star) || 1;

        var ownInfluenceMap = this.buildPlayerInfluenceMap(this.player);
        var ownInfluenceAtStar = ownInfluenceMap[star.id] || 0;

        evaluationByStar[star.id] =
        {
          star: star,
          desirability: desirability,
          independentStrength: independentStrength,
          ownInfluence: ownInfluenceAtStar
        }
      }

      return evaluationByStar;
    }

    scoreIndependentTargets(evaluations: IIndependentTargetEvaluations)
    {
      var scores:
      {
        star: Star;
        score: number;
      }[] = [];

      for (var starId in evaluations)
      {
        var evaluation = evaluations[starId];

        var easeOfCapturing = Math.log(0.01 + evaluation.ownInfluence / evaluation.independentStrength);

        var score = evaluation.desirability * easeOfCapturing;

        scores.push(
        {
          star: evaluation.star,
          evaluation: evaluation,
          score: score
        });
      }

      return scores.sort(function(a, b)
      {
        return b.score - a.score;
      });
    }

    getScoredExpansionTargets()
    {
      var independentNeighborStars = this.player.getNeighboringStars().filter(function(star)
      {
        return star.owner.isIndependent;
      });
      var evaluations = this.evaluateIndependentTargets(independentNeighborStars);
      var scores = this.scoreIndependentTargets(evaluations);

      return scores;
    }

    getScoredCleanPiratesTargets()
    {
      var independentIds = this.game.independents.map(function(independent: Player)
      {
        return independent.id;
      });

      var ownedStarsWithPirates = this.player.controlledLocations.filter(function(star: Star)
      {
        // we could filter out stars with secondary controllers as cleaning up in
        // contested areas probably isnt smart, but clean up objectives should get
        // overridden in objective priority. maybe do it later if minimizing the
        // amount of objectives generated is important for performance

        for (var i = 0; i < independentIds.length; i++)
        {
          if (star.fleets[independentIds[i]])
          {
            return true;
          }
        }

        return false;
      });

      var evaluations = this.evaluateIndependentTargets(ownedStarsWithPirates);
      var scores = this.scoreIndependentTargets(evaluations);

      return scores;
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
          strength += hostileShipsByPlayer[playerId][i].getStrengthEvaluation();
        }

        strengthByEnemy[playerId] = strength;
      }

      return strengthByEnemy;
    }

    getIndependentStrengthAtStar(star: Star): number
    {
      var byPlayer = this.getHostileStrengthAtStar(star);

      var total = 0;

      for (var playerId in byPlayer)
      {
        // TODO
        var isIndependent = false;
        for (var i = 0; i < this.game.independents.length; i++)
        {
          if (this.game.independents[i].id === parseInt(playerId))
          {
            isIndependent = true;
            break;
          }
        }
        // END

        if (isIndependent)
        {
          total += byPlayer[playerId];
        }
        else
        {
          continue;
        }
      }

      return total;
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

    evaluateFleetStrength(fleet: Fleet): number
    {
      return fleet.getTotalStrengthEvaluation();
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

      var fleets = this.getVisibleFleetsByPlayer()[player.id] || [];

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
        var turnsToCheck = 4;

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
    getDiplomacyEvaluations(currentTurn: number)
    {
      var evaluationByPlayer:
      {
        [playerId: number]: IDiplomacyEvaluation;
      } = {};

      var neighborStarsCountByPlayer:
      {
        [playerId: number]: number;
      } = {};

      var allNeighbors = this.player.getNeighboringStars();
      var neighborStarsForPlayer: Star[] = [];

      for (var i = 0; i < allNeighbors.length; i++)
      {
        var star: Star = allNeighbors[i];
        if (!star.owner.isIndependent)
        {
          if (!neighborStarsCountByPlayer[star.owner.id])
          {
            neighborStarsCountByPlayer[star.owner.id] = 0;
          }

          neighborStarsCountByPlayer[star.owner.id]++;
        }
      }


      for (var playerId in this.player.diplomacyStatus.metPlayers)
      {
        var player = this.player.diplomacyStatus.metPlayers[playerId];

        evaluationByPlayer[player.id] =
        {
          currentTurn: currentTurn,
          opinion: this.player.diplomacyStatus.getOpinionOf(player),
          neighborStars: neighborStarsCountByPlayer[player.id],
          currentStatus: this.player.diplomacyStatus.statusByPlayer[player.id]
        }
      }

      return evaluationByPlayer;
    }
  }
}
