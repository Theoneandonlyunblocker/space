/// <reference path="../galaxymap.ts"/>
/// <reference path="../player.ts"/>
/// <reference path="../star.ts" />
/// <reference path="../game.ts" />
/// <reference path="../fleet.ts" />

module Rance
{
  export module MapAI
  {
    export var defaultEvaluationParameters =
    {
      starDesirability:
      {
        neighborRange: 1,
        neighborWeight: 0.5,
        defendabilityWeight: 1,

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
      cachedInfluenceMaps:
      {
        [turnNumber: number]:
        {
          [playerId: number]:
          {
            [starId: number]: number;
          }
        }
      } = {};
      cachedVisibleFleets:
      {
        [turnNumber: number]:
        {
          [playerId: number]: Fleet[];
        }
      } = {};
      cachedOwnIncome: number;
      evaluationParameters:
      {
        starDesirability:
        {
          neighborRange: number;
          neighborWeight: number;
          defendabilityWeight: number;

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

      processTurnStart()
      {
        this.cachedInfluenceMaps = {};
        this.cachedVisibleFleets = {};
        this.cachedOwnIncome = undefined;
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
            evaluation += star.buildings[category][i].totalCost / 25;
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

      evaluateStarDefendability(star: Star): number
      {
        var evaluation = 0;

        // neighboring own stars ++
        // neighboring neutral stars -
        // neighboring other player stars --
        // neighboring other player with low trust stars --- TODO
        var nearbyStars = star.getLinkedInRange(2).byRange;
        for (var rangeString in nearbyStars)
        {
          var distanceMultiplier = 1 / parseInt(rangeString);
          var starsInRange = nearbyStars[rangeString];
          for (var i = 0; i < starsInRange.length; i++)
          {
            var neighbor = starsInRange[i];
            var neighborDefendability: number;
            if (neighbor.owner === this.player)
            {
              neighborDefendability = 3;
            }
            else if (neighbor.owner.isIndependent)
            {
              neighborDefendability = -0.75;
            }
            else
            {
              neighborDefendability = -2;
            }

            evaluation += neighborDefendability * distanceMultiplier;
          }
        }

        if (star.owner === this.player)
        {
          evaluation += 3;
        }

        return evaluation * 5;
      }

      evaluateIndividualStarDesirability(star: Star): number
      {
        var evaluation = 0;
        var p = this.evaluationParameters.starDesirability;

        if (!isFinite(this.cachedOwnIncome))
        {
          this.cachedOwnIncome = this.player.getIncome();
        }

        var incomeEvaluation = this.evaluateStarIncome(star) * p.totalIncomeWeight;
        // prioritize income when would make big relative boost, penalize when opposite
        incomeEvaluation *= incomeEvaluation / (this.cachedOwnIncome / 4);
        evaluation += incomeEvaluation;

        var infrastructureEvaluation = this.evaluateStarInfrastructure(star) * p.infrastructureWeight;
        evaluation += infrastructureEvaluation;

        var productionEvaluation = this.evaluateStarProduction(star) * p.productionWeight;
        evaluation += productionEvaluation;

        var defendabilityEvaluation = this.evaluateStarDefendability(star) * p.defendabilityWeight;
        evaluation += defendabilityEvaluation;


        return evaluation;
      }

      evaluateNeighboringStarsDesirability(star: Star, range: number): number
      {
        var evaluation = 0;

        var getDistanceFalloff = function(distance: number)
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

          var ownInfluenceMap = this.getPlayerInfluenceMap(this.player);
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
          if (evaluation.star.getSecondaryController() === this.player)
          {
            score *= 1.5
          }

          scores.push(
          {
            star: evaluation.star,
            score: score
          });
        }

        return scores.sort(function(a, b)
        {
          return b.score - a.score;
        });
      }

      getIndependentNeighborStars()
      {
        var self = this;
        var independentNeighborStars = this.player.getNeighboringStars().filter(function(star)
        {
          var secondaryController = star.getSecondaryController();
          return star.owner.isIndependent && (!secondaryController || secondaryController === self.player);
        });

        return independentNeighborStars;
      }

      getIndependentNeighborStarIslands(earlyReturnSize?: number)
      {
        var self = this;

        var alreadyVisited:
        {
          [starId: number]: boolean
        } = {};

        var allStars: Star[] = [];

        var islandQualifierFN = function(a: Star, b: Star): boolean
        {
          var secondaryController = b.getSecondaryController();
          return b.owner.isIndependent && (!secondaryController || secondaryController === self.player);
        }

        var neighborStars = this.getIndependentNeighborStars();
        for (var i = 0; i < neighborStars.length; i++)
        {
          var neighborStar = neighborStars[i];
          if (alreadyVisited[neighborStar.id])
          {
            continue;
          }

          var island = neighborStar.getIslandForQualifier(islandQualifierFN, earlyReturnSize);

          for (var j = 0; j < island.length; j++)
          {
            var star = island[j];
            alreadyVisited[star.id] = true;
            allStars.push(star);
          }
        }

        return allStars;
      }

      getScoredExpansionTargets()
      {
        var independentNeighborStars = this.getIndependentNeighborStars();
        var evaluations = this.evaluateIndependentTargets(independentNeighborStars);
        var scores = this.scoreIndependentTargets(evaluations);

        return scores;
      }

      getScoredCleanPiratesTargets()
      {

        var ownedStarsWithPirates = this.player.controlledLocations.filter(function(star: Star)
        {
          // we could filter out stars with secondary controllers as cleaning up in
          // contested areas probably isnt smart, but clean up objectives should get
          // overridden in objective priority. maybe do it later if minimizing the
          // amount of objectives generated is important for performance

          return star.getIndependentShips().length > 0;
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
        var ships = star.getIndependentShips();
        var total = 0;

        for (var i = 0; i < ships.length; i++)
        {
          total += ships[i].getStrengthEvaluation();
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
        if (this.game && this.cachedVisibleFleets[this.game.turnNumber])
        {
          return this.cachedVisibleFleets[this.game.turnNumber];
        }

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
              if (playerFleets[j].isStealthy && !this.player.starIsDetected(star))
              {
                continue;
              }
              byPlayer[playerId] = byPlayer[playerId].concat(playerFleets[j]);
            }
          }
        }

        if (this.game)
        {
          this.cachedVisibleFleets[this.game.turnNumber] = byPlayer;
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
      getPlayerInfluenceMap(player: Player)
      {
        if (!this.game)
        {
          throw new Error("Can't use cached influence maps when game isn't specified for MapEvaluator");
        }

        if (!this.cachedInfluenceMaps[this.game.turnNumber])
        {
          this.cachedInfluenceMaps[this.game.turnNumber] = {};
        }

        if (!this.cachedInfluenceMaps[this.game.turnNumber][player.id])
        {
          this.cachedInfluenceMaps[this.game.turnNumber][player.id] = this.buildPlayerInfluenceMap(player);
        }

        return this.cachedInfluenceMaps[this.game.turnNumber][player.id];
      }
      getInfluenceMapsForKnownPlayers()
      {
        var byPlayer:
        {
          [playerId: number]:
          {
            [starId: number]: number
          }
        } = {};

        for (var playerId in this.player.diplomacyStatus.metPlayers)
        {
          var player = this.player.diplomacyStatus.metPlayers[playerId];
          byPlayer[playerId] = this.getPlayerInfluenceMap(player);
        }

        return byPlayer;
      }
      estimateGlobalStrength(player: Player)
      {
        var visibleStrength = 0;
        var invisibleStrength = 0;

        var fleets = this.getVisibleFleetsByPlayer()[player.id];
        for (var i = 0; i < fleets.length; i++)
        {
          visibleStrength += this.evaluateFleetStrength(fleets[i]);
        }

        if (player !== this.player)
        {
          invisibleStrength = visibleStrength * 0.5; // TODO
        }

        return visibleStrength + invisibleStrength;
      }
      getPerceivedThreatOfPlayer(player: Player)
      {
        if (!this.player.diplomacyStatus.metPlayers[player.id])
        {
          throw new Error(this.player.name +
            " tried to call getPerceivedThreatOfPlayer on unkown player " + player.name);
        }

        var otherInfluenceMap = this.getPlayerInfluenceMap(player);
        var ownInfluenceMap = this.getPlayerInfluenceMap(this.player);

        var totalInfluenceInOwnStars = 0;

        for (var starId in otherInfluenceMap)
        {
          for (var i = 0; i < this.player.controlledLocations.length; i++)
          {
            var star = this.player.controlledLocations[i];
            if (star.id === parseInt(starId))
            {
              var otherInfluence = otherInfluenceMap[starId];
              var ownInfluence = ownInfluenceMap[starId];
              totalInfluenceInOwnStars += otherInfluence - 0.5 * ownInfluence;
              break;
            }
          }
        }

        var globalStrengthDifference =
          this.estimateGlobalStrength(player) - this.estimateGlobalStrength(this.player);

        return totalInfluenceInOwnStars + globalStrengthDifference;
      }
      getPerceivedThreatOfAllKnownPlayers()
      {
        var byPlayer:
        {
          [playerId: number]: number;
        } = {};

        for (var playerId in this.player.diplomacyStatus.metPlayers)
        {
          var player = this.player.diplomacyStatus.metPlayers[playerId];
          byPlayer[playerId] = this.getPerceivedThreatOfPlayer(player);
        }

        return byPlayer;
      }
      getRelativePerceivedThreatOfAllKnownPlayers()
      {
        var byPlayer = this.getPerceivedThreatOfAllKnownPlayers();
        var relative:
        {
          [playerId: number]: number;
        } = {};

        var min: number, max: number;

        for (var playerId in byPlayer)
        {
          var threat = byPlayer[playerId];
          min = isFinite(min) ? Math.min(min, threat) : threat;
          max = isFinite(max) ? Math.max(max, threat) : threat;
        }

        for (var playerId in byPlayer)
        {
          relative[playerId] = getRelativeValue(byPlayer[playerId], min, max);
        }

        return relative;
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
}
