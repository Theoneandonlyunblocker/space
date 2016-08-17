import Star from "../Star";
import Player from "../Player";
import Game from "../Game";
import GalaxyMap from "../GalaxyMap";
import Fleet from "../Fleet";
import Unit from "../Unit";
import DiplomacyEvaluation from "../DiplomacyEvaluation";
import
{
  getRelativeValue
} from "../utility";

import ValuesByStar from "./ValuesByStar";

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

interface IndependentTargetEvaluations
{
  star: Star;
  desirability: number;
  independentStrength: number;
  ownInfluence: number;
}

// TODO refactor | split into multiple classes eg vision, influence maps etc.
export default class MapEvaluator
{
  map: GalaxyMap;
  player: Player;
  game: Game;
  cachedInfluenceMaps:
  {
    [turnNumber: number]:
    {
      [playerId: number]: ValuesByStar<number>
    }
  } = {};
  cachedVisibleFleets:
  {
    [turnNumber: number]:
    {
      [playerId: number]: Fleet[];
    }
  } = {};
  cachedVisionMaps:
  {
    [playerId: number]:
    {
      visible:
      {
        [starID: number]: Star;
      };
      detected:
      {
        [starID: number]: Star;
      };
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
    this.cachedVisionMaps = {};
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

    for (let category in star.buildings)
    {
      for (let i = 0; i < star.buildings[category].length; i++)
      {
        evaluation += star.buildings[category][i].totalCost / 25;
      }
    }

    return evaluation;
  }

  evaluateStarProduction(star: Star): number
  {
    var evaluation = 0;

    // TODO manufactory TODO ai

    return evaluation;
  }

  evaluateStarDefendability(star: Star): number
  {
    var evaluation = 0;

    // neighboring own stars ++
    // player owns star ++
    // neighboring neutral stars -
    // neighboring other player stars --
    // neighboring other player with low trust stars --- TODO ai
    var nearbyStars = star.getLinkedInRange(2).byRange;
    for (let rangeString in nearbyStars)
    {
      var distanceMultiplier = 1 / parseInt(rangeString);
      var starsInRange = nearbyStars[rangeString];
      for (let i = 0; i < starsInRange.length; i++)
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

    for (let distanceString in inRange)
    {
      var stars = inRange[distanceString];
      var distanceFalloff = getDistanceFalloff(parseInt(distanceString));

      for (let i = 0; i < stars.length; i++)
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

  evaluateIndependentTargets(targetStars: Star[]): ValuesByStar<IndependentTargetEvaluations>
  {
    const evaluationByStar = new ValuesByStar<IndependentTargetEvaluations>(
      targetStars,
      (star) =>
      {
        const desirability = this.evaluateStarDesirability(star);
        const independentStrength = this.getIndependentStrengthAtStar(star) || 1;

        const ownInfluenceMap = this.getPlayerInfluenceMap(this.player);
        const ownInfluenceAtStar = ownInfluenceMap[star.id] || 1;

        return(
        {
          star: star,
          desirability: desirability,
          independentStrength: independentStrength,
          ownInfluence: ownInfluenceAtStar
        });
      }
    );

    return evaluationByStar;
  }

  scoreIndependentTargets(evaluations: ValuesByStar<IndependentTargetEvaluations>)
  {
    var scores:
    {
      star: Star;
      score: number;
    }[] = [];

    for (let starID in evaluations)
    {
      var evaluation = evaluations[starID];

      var easeOfCapturing = evaluation.ownInfluence / evaluation.independentStrength;

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
  evaluateDesirabilityOfPlayersStars(player: Player)
  {
    var byStar:
    {
      [starID: number]:
      {
        star: Star;
        desirability: number;
      }
    } = {};
    var total = 0;

    var stars = this.getVisibleStarsOfPlayer(player);

    for (let i = 0; i < stars.length; i++)
    {
      var star = stars[i];
      var desirability = this.evaluateStarDesirability(star);
      byStar[star.id] = 
      {
        star: star,
        desirability: desirability
      };
      total += desirability;
    }

    return(
    {
      byStar: byStar,
      total: total
    });
  }
  getIndependentNeighborStars()
  {
    const independentNeighborStars = this.player.getNeighboringStars().filter(star =>
    {
      const secondaryController = star.getSecondaryController();
      return star.owner.isIndependent && (!secondaryController || secondaryController === this.player);
    });

    return independentNeighborStars;
  }

  getIndependentNeighborStarIslands(earlyReturnSize?: number)
  {
    const alreadyVisited:
    {
      [starID: number]: boolean
    } = {};

    const allStars: Star[] = [];

    const islandQualifierFN = (a: Star, b: Star) =>
    {
      const secondaryController = b.getSecondaryController();
      return b.owner.isIndependent && (!secondaryController || secondaryController === this.player);
    }

    const neighborStars = this.getIndependentNeighborStars();
    for (let i = 0; i < neighborStars.length; i++)
    {
      const neighborStar = neighborStars[i];
      if (alreadyVisited[neighborStar.id])
      {
        continue;
      }

      const island = neighborStar.getIslandForQualifier(islandQualifierFN, earlyReturnSize);

      for (let j = 0; j < island.length; j++)
      {
        const star = island[j];
        alreadyVisited[star.id] = true;
        allStars.push(star);
      }
    }

    return allStars;
  }
  getHostileUnitsAtStar(star: Star)
  {
    const hostilePlayers = star.getEnemyFleetOwners(this.player);

    const unitsByEnemy:
    {
      [playerId: number]: Unit[];
    } = {};
    const allUnits: Unit[] = [];

    const hostileFleets = star.getFleets((player: Player) =>
    {
      return hostilePlayers.indexOf(player) !== -1;
    });

    hostileFleets.forEach(fleet =>
    {
      if (!unitsByEnemy[fleet.player.id])
      {
        unitsByEnemy[fleet.player.id] = [];
      }

      unitsByEnemy[fleet.player.id].push(...fleet.units);
      allUnits.push(...fleet.units);
    });

    return(
    {
      byEnemy: unitsByEnemy,
      all: allUnits
    });
  }
  getHostileStrengthAtStar(star: Star)
  {
    var hostileUnitsByPlayer = this.getHostileUnitsAtStar(star).byEnemy;

    var strengthByEnemy:
    {
      [playerId: number]: number;
    } = {};

    for (let playerId in hostileUnitsByPlayer)
    {
      var strength = 0;

      for (let i = 0; i < hostileUnitsByPlayer[playerId].length; i++)
      {
        strength += hostileUnitsByPlayer[playerId][i].getStrengthEvaluation();
      }

      strengthByEnemy[playerId] = strength;
    }

    return strengthByEnemy;
  }
  getIndependentStrengthAtStar(star: Star): number
  {
    const units = star.getUnits(player => player.isIndependent);

    let total = 0;

    for (let i = 0; i < units.length; i++)
    {
      total += units[i].getStrengthEvaluation();
    }

    return total;
  }
  getTotalHostileStrengthAtStar(star: Star): number
  {
    var byPlayer = this.getHostileStrengthAtStar(star);

    var total = 0;

    for (let playerId in byPlayer)
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

    for (let i = 0; i < star.buildings["defence"].length; i++)
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

    for (let i = 0; i < star.buildings["defence"].length; i++)
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

    for (let i = 0; i < stars.length; i++)
    {
      var star = stars[i];

      for (let playerId in star.fleets)
      {
        var playerFleets = star.fleets[playerId];

        if (!byPlayer[playerId])
        {
          byPlayer[playerId] = [];
        }

        for (let j = 0; j < playerFleets.length; j++)
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
  buildPlayerInfluenceMap(player: Player): ValuesByStar<number>
  {
    var playerIsImmobile = player.isIndependent;


    const stars = this.player.getRevealedStars();
    const influence = new ValuesByStar<number>(stars, (star) =>
    {
      const defenceBuildingStrength = this.getDefenceBuildingStrengthAtStarByPlayer(star);
      return defenceBuildingStrength[player.id] || 0;
    });

    var fleets = this.getVisibleFleetsByPlayer()[player.id] || [];

    function getDistanceFalloff(distance: number)
    {
      return 1 / (distance + 1);
    }

    for (let i = 0; i < fleets.length; i++)
    {
      var fleet = fleets[i];
      var strength = this.evaluateFleetStrength(fleet);
      var location = fleet.location;

      var range = fleet.getMinMaxMovePoints();
      var turnsToCheck = 4;

      var inFleetRange = location.getLinkedInRange(range * turnsToCheck).byRange;

      inFleetRange[0] = [location];

      for (let distance in inFleetRange)
      {
        var numericDistance = parseInt(distance);
        var turnsToReach = Math.floor((numericDistance - 1) / range);
        if (turnsToReach < 0) turnsToReach = 0;
        var distanceFalloff = getDistanceFalloff(turnsToReach);
        var adjustedStrength = strength * distanceFalloff;

        for (let j = 0; j < inFleetRange[distance].length; j++)
        {
          var star = inFleetRange[distance][j];

          if (!isFinite(influence[star.id]))
          {
            influence[star.id] = 0;
          };

          influence[star.id] += adjustedStrength;
        }
      }
    }

    return influence;
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
      [playerId: number]: ValuesByStar<number>
    } = {};

    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      var player = this.player.diplomacyStatus.metPlayers[playerId];
      byPlayer[playerId] = this.getPlayerInfluenceMap(player);
    }

    return byPlayer;
  }
  getVisibleStarsOfPlayer(player: Player)
  {
    return this.player.getVisibleStars().filter(function(star: Star)
    {
      return star.owner === player;
    });
  }
  getVisibleStarsOfKnownPlayers()
  {
    var byPlayer:
    {
      [playerId: number]: Star[];
    } = {};

    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      var player = this.player.diplomacyStatus.metPlayers[playerId];
      byPlayer[playerId] = this.getVisibleStarsOfPlayer(player);
    }

    return byPlayer;
  }
  estimateGlobalStrength(player: Player)
  {
    var visibleStrength = 0;
    var invisibleStrength = 0;

    var fleets = this.getVisibleFleetsByPlayer()[player.id] || [];
    for (let i = 0; i < fleets.length; i++)
    {
      visibleStrength += this.evaluateFleetStrength(fleets[i]);
    }

    if (player !== this.player)
    {
      // TODO ai | be smarter about estimating invisible strength
      invisibleStrength = visibleStrength * 0.5;
    }

    return visibleStrength + invisibleStrength;
  }
  getPerceivedThreatOfPlayer(player: Player)
  {
    if (!this.player.diplomacyStatus.metPlayers[player.id])
    {
      throw new Error(this.player.name.fullName +
        " tried to call getPerceivedThreatOfPlayer on unkown player " + player.name.fullName);
    }

    var otherInfluenceMap = this.getPlayerInfluenceMap(player);
    var ownInfluenceMap = this.getPlayerInfluenceMap(this.player);

    var totalInfluenceInOwnStars = 0;

    for (let starID in otherInfluenceMap)
    {
      for (let i = 0; i < this.player.controlledLocations.length; i++)
      {
        var star = this.player.controlledLocations[i];
        if (star.id === parseInt(starID))
        {
          var otherInfluence = otherInfluenceMap[starID];
          var ownInfluence = ownInfluenceMap[starID];
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

    for (let playerId in this.player.diplomacyStatus.metPlayers)
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

    for (let playerId in byPlayer)
    {
      var threat = byPlayer[playerId];
      min = isFinite(min) ? Math.min(min, threat) : threat;
      max = isFinite(max) ? Math.max(max, threat) : threat;
    }

    for (let playerId in byPlayer)
    {
      relative[playerId] = getRelativeValue(byPlayer[playerId], min, max);
    }

    return relative;
  }
  getVisionCoverageAroundStar(star: Star, range: number, useDetection: boolean = false)
  {
    var toCheck = star.getLinkedInRange(range).all;
    var scorePerVisibleStar = 1 / toCheck.length;
    var coverageScore: number = 0;
    var visibilityCheckFN = useDetection ? this.player.starIsDetected : this.player.starIsVisible;

    for (let i = 0; i < toCheck.length; i++)
    {
      var neighbor = toCheck[i];
      if (visibilityCheckFN.call(this.player, neighbor))
      {
        coverageScore += scorePerVisibleStar;
      }
    }

    return coverageScore;
  }
  estimateFleetVisionRange(fleet: Fleet)
  {
    const fleetLikelyHasScoutingUnit: boolean = fleet.units.length >= 5;
    let estimatedRange = fleetLikelyHasScoutingUnit ? 2 : 1;
    
    fleet.units.forEach(unit =>
    {
      if (this.player.unitIsIdentified(unit))
      {
        estimatedRange = Math.max(estimatedRange, unit.getVisionRange());
      }
    });
    
    return estimatedRange;
  }
  estimateFleetDetectionRange(fleet: Fleet)
  {
    const fleetLikelyHasScoutingUnit: boolean = fleet.units.length >= 5;
    let estimatedRange = fleetLikelyHasScoutingUnit ? 0 : -1;
    
    fleet.units.forEach(unit =>
    {
      if (this.player.unitIsIdentified(unit))
      {
        estimatedRange = Math.max(estimatedRange, unit.getDetectionRange());
      }
    });
    
    return estimatedRange;
  }
  buildPlayerVisionMap(player: Player)
  {
    var detectedStars:
    {
      [starID: number]: Star;
    } = {};
    var visibleStars:
    {
      [starID: number]: Star;
    } = {};

    var revealedStarsOfPlayer: Star[] = this.player.getRevealedStars().filter(function(star: Star)
    {
      return star.owner === player;
    });
    var visibleFleetsOfPlayer: Fleet[] = this.getVisibleFleetsByPlayer()[player.id] || [];

    var processDetectionSource = function(source: Star, detectionRange: number, visionRange: number)
    {
      var detected = source.getLinkedInRange(detectionRange).all;
      for (let i = 0; i < detected.length; i++)
      {
        var star = detected[i];
        if (!detectedStars[star.id])
        {
          detectedStars[star.id] = star;
        }
      }

      var visible = source.getLinkedInRange(visionRange).all;
      for (let i = 0; i < visible.length; i++)
      {
        var star = visible[i];
        if (!visibleStars[star.id])
        {
          visibleStars[star.id] = star;
        }
      }
    };

    for (let i = 0; i < revealedStarsOfPlayer.length; i++)
    {
      var star = revealedStarsOfPlayer[i];
      var detectionRange = this.player.starIsDetected(star) ? star.getDetectionRange() : 0;
      var visionRange = this.player.starIsDetected(star) ? star.getVisionRange() : 1;
      processDetectionSource(star, detectionRange, visionRange);
    }
    for (let i = 0; i < visibleFleetsOfPlayer.length; i++)
    {
      var fleet = visibleFleetsOfPlayer[i];
      var detectionRange = this.estimateFleetDetectionRange(fleet);
      var visionRange = this.estimateFleetVisionRange(fleet);
      processDetectionSource(fleet.location, detectionRange, visionRange);
    }

    return(
    {
      visible: visibleStars,
      detected: detectedStars
    });
  }
  getPlayerVisionMap(player: Player)
  {
    if (!this.cachedVisionMaps[player.id])
    {
      this.cachedVisionMaps[player.id] = this.buildPlayerVisionMap(player);
    }

    return this.cachedVisionMaps[player.id];
  }
  getScoredPerimeterLocationsAgainstPlayer(player: Player, safetyFactor: number, forScouting: boolean)
  {
    var ownInfluence = this.getPlayerInfluenceMap(this.player);
    var enemyInfluence = this.getPlayerInfluenceMap(player);
    var enemyVision = this.getPlayerVisionMap(player);

    var scores:
    {
      score: number;
      star: Star;
    }[] = [];

    var revealedStars = this.player.getRevealedStars();

    var stars = revealedStars.filter(function(star: Star)
    {
      return star.owner.isIndependent || star.owner === this.player;
    }, this);

    for (let i = 0; i < stars.length; i++)
    {
      var star = stars[i];
      var nearestOwnedStar = player.getNearestOwnedStarTo(star);
      var distanceToEnemy = star.getDistanceToStar(nearestOwnedStar);
      distanceToEnemy = Math.max(distanceToEnemy - 1, 1);
      var distanceScore = Math.pow(1 / distanceToEnemy, 2);

      var danger = enemyInfluence[star.id] || 1;
      if (!enemyVision.visible[star.id])
      {
        danger *= 0.5;
      }
      danger *= safetyFactor;
      if (forScouting)
      {
        var safety = ownInfluence[star.id] / (danger * safetyFactor);
        var score = safety * distanceScore;
        // var vision = this.getVisionCoverageAroundStar(star, 2);
        // var lackOfVision = 1 - vision;
        // var score = lackOfVision * safety;
      }
      else
      {
        var score = (danger / ownInfluence[star.id]) / safetyFactor;
      }

      scores.push(
      {
        star: star,
        score: score
      });
    }

    return scores;
  }
  getDesireToGoToWarWith(player: Player)
  {
    // // potential gain
    // // perceived difficulty
    // var strength = this.estimateGlobalStrength(player);
    // // relations
    // var opinion = this.player.diplomacyStatus.getOpinionOf(player);
    // // trust
    // // own allies
    // //   ally ability to go to war with
    // //   ally trustworthiness
    // //   ally opinion of us
    // // enemy allies
    // //   enemy ally strength
    // // perceived threat
    // var threat = this.getPerceivedThreatOfPlayer(player);

    return Math.random(); // TODO ai
  }
  getAbilityToGoToWarWith(player: Player)
  {
    // // perceived strength
    // var strength = this.estimateGlobalStrength(player);
    // // own trustworthy allies who can join
    // //   ally ability to go to war with
    // //   ally trustworthiness
    // //   ally opinion of us
    // // enemy allies
    // //   enemy ally strength
    // // enemy is well liked
    // // distance

    return Math.random(); // TODO ai
  }
  getDiplomacyEvaluations(currentTurn: number)
  {
    var evaluationByPlayer:
    {
      [playerId: number]: DiplomacyEvaluation;
    } = {};

    var neighborStarsCountByPlayer:
    {
      [playerId: number]: number;
    } = {};

    var allNeighbors = this.player.getNeighboringStars();
    var neighborStarsForPlayer: Star[] = [];

    for (let i = 0; i < allNeighbors.length; i++)
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


    for (let playerId in this.player.diplomacyStatus.metPlayers)
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
