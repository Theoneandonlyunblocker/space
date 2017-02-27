import {UnitEvaluator} from "./UnitEvaluator";

import DiplomacyEvaluation from "../../../src/DiplomacyEvaluation";
import {Fleet} from "../../../src/Fleet";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";
import ValuesByPlayer from "../../../src/ValuesByPlayer";
import ValuesByStar from "../../../src/ValuesByStar";
import
{
  getRelativeValue,
} from "../../../src/utility";

export const defaultEvaluationParameters =
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
  },
};

interface StarTargetEvaluation
{
  desirability: number;
  hostileStrength: number;
  ownInfluence: number;
}

type InfluenceMap = ValuesByStar<number>;

// TODO refactor | split into multiple classes eg vision, influence maps etc.
export default class MapEvaluator
{
  map: GalaxyMap;
  player: Player;
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
  private unitEvaluator: UnitEvaluator;

  constructor(map: GalaxyMap, player: Player, unitEvaluator: UnitEvaluator)
  {
    this.map = map;
    this.player = player;
    this.unitEvaluator = unitEvaluator;

    this.evaluationParameters = defaultEvaluationParameters;
  }

  evaluateStarIncome(star: Star): number
  {
    let evaluation = 0;

    evaluation += star.baseIncome;
    evaluation += (star.getIncome() - star.baseIncome) *
    (1 - this.evaluationParameters.starDesirability.baseIncomeWeight);

    return evaluation;
  }

  evaluateStarInfrastructure(star: Star): number
  {
    let evaluation = 0;

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
    const evaluation = 0;

    // TODO manufactory TODO ai

    return evaluation;
  }

  evaluateStarDefendability(star: Star): number
  {
    let evaluation = 0;

    // neighboring own stars ++
    // player owns star ++
    // neighboring neutral stars -
    // neighboring other player stars --
    // neighboring other player with low trust stars --- TODO ai
    const nearbyStars = star.getLinkedInRange(2).byRange;
    for (let rangeString in nearbyStars)
    {
      const distanceMultiplier = 1 / parseInt(rangeString);
      const starsInRange = nearbyStars[rangeString];
      for (let i = 0; i < starsInRange.length; i++)
      {
        const neighbor = starsInRange[i];
        let neighborDefendability: number;
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
    let evaluation = 0;
    const p = this.evaluationParameters.starDesirability;

    let incomeEvaluation = this.evaluateStarIncome(star) * p.totalIncomeWeight;
    // prioritize income when would make big relative boost, penalize when opposite
    incomeEvaluation *= incomeEvaluation / (this.player.getIncome() / 4);
    evaluation += incomeEvaluation;

    const infrastructureEvaluation = this.evaluateStarInfrastructure(star) * p.infrastructureWeight;
    evaluation += infrastructureEvaluation;

    const productionEvaluation = this.evaluateStarProduction(star) * p.productionWeight;
    evaluation += productionEvaluation;

    const defendabilityEvaluation = this.evaluateStarDefendability(star) * p.defendabilityWeight;
    evaluation += defendabilityEvaluation;


    return evaluation;
  }

  evaluateNeighboringStarsDesirability(star: Star, range: number): number
  {
    let evaluation = 0;

    const getDistanceFalloff = function(distance: number)
    {
      return 1 / (distance + 1);
    };
    const inRange = star.getLinkedInRange(range).byRange;

    for (let distanceString in inRange)
    {
      const stars = inRange[distanceString];
      const distanceFalloff = getDistanceFalloff(parseInt(distanceString));

      for (let i = 0; i < stars.length; i++)
      {
        evaluation += this.evaluateIndividualStarDesirability(stars[i]) * distanceFalloff;
      }
    }

    return evaluation;
  }

  evaluateStarDesirability(star: Star): number
  {
    let evaluation = 0;
    const p = this.evaluationParameters.starDesirability;

    evaluation += this.evaluateIndividualStarDesirability(star);
    evaluation += this.evaluateNeighboringStarsDesirability(star, p.neighborRange) *
      p.neighborWeight;

    return evaluation;
  }

  evaluateStarTargets(targetStars: Star[]): ValuesByStar<StarTargetEvaluation>
  {
    const evaluationByStar = new ValuesByStar<StarTargetEvaluation>(
      targetStars,
      star =>
      {
        const desirability = this.evaluateStarDesirability(star);

        const hostileStrength = this.getHostileStrengthAtStar(star);

        const ownInfluenceMap = this.getPlayerInfluenceMap(this.player);
        const ownInfluenceAtStar = ownInfluenceMap.get(star) || 1;

        return(
        {
          desirability: desirability,
          hostileStrength: hostileStrength,
          ownInfluence: ownInfluenceAtStar,
        });
      },
    );

    return evaluationByStar;
  }

  public scoreStarTargets(
    evaluations: ValuesByStar<StarTargetEvaluation>,
    getScoreFN: (star: Star, evaluation: StarTargetEvaluation) => number,
  ): ValuesByStar<number>
  {
    const scores = new ValuesByStar<number>();

    evaluations.forEach((star, evaluation) =>
    {
      scores.set(star, getScoreFN(star, evaluation));
    });

    return scores;
  }
  public scoreIndependentTargets(evaluations: ValuesByStar<StarTargetEvaluation>): ValuesByStar<number>
  {
    return this.scoreStarTargets(evaluations, (star, evaluation) =>
    {
      const easeOfCapturing = evaluation.ownInfluence / evaluation.hostileStrength;

      let score = evaluation.desirability * easeOfCapturing;
      if (star.getSecondaryController() === this.player)
      {
        score *= 1.5;
      }

      return score;
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
    const islandQualifierFN = (a: Star, b: Star) =>
    {
      const secondaryController = b.getSecondaryController();
      return b.owner.isIndependent && (!secondaryController || secondaryController === this.player);
    };

    return Star.getIslandForQualifier(
      this.player.controlledLocations,
      earlyReturnSize,
      islandQualifierFN,
    );
  }
  public getHostileUnitsAtStar(star: Star): Unit[]
  {
    return star.getUnits(player =>
      this.player.diplomacyStatus.canAttackFleetOfPlayer(player));
  }
  public getHostileStrengthAtStar(star: Star): number
  {
    return this.unitEvaluator.evaluateMapStrength(...this.getHostileUnitsAtStar(star));
  }
  public getIndependentStrengthAtStar(star: Star): number
  {
    const independentUnits = star.getUnits(player => player.isIndependent);
    return this.unitEvaluator.evaluateMapStrength(...independentUnits);
  }
  getDefenceBuildingStrengthAtStarByPlayer(star: Star)
  {
    const byPlayer = new ValuesByPlayer<number>();

    for (let i = 0; i < star.buildings["defence"].length; i++)
    {
      const building = star.buildings["defence"][i];

      const previousValue = byPlayer.get(building.controller) || 0;
      byPlayer.set(building.controller, previousValue + building.totalCost);
    }

    return byPlayer;
  }
  getTotalDefenceBuildingStrengthAtStar(star: Star): number
  {
    let strength = 0;

    for (let i = 0; i < star.buildings["defence"].length; i++)
    {
      const building = star.buildings["defence"][i];

      if (building.controller.id === this.player.id) continue;

      strength += building.totalCost;
    }

    return strength;
  }

  public getVisibleFleetsOfPlayer(player: Player): Fleet[]
  {
    const visibleFleets: Fleet[] = [];

    this.player.getVisibleStars().forEach(star =>
    {
      const playerFleetsAtStar = star.fleets[player.id];
      if (playerFleetsAtStar)
      {
        const hasDetectionInStar = this.player.starIsDetected(star);
        const visibleFleetsAtStar = hasDetectionInStar ? playerFleetsAtStar :
          playerFleetsAtStar.filter(fleet =>
          {
            return !fleet.isStealthy;
          });

        visibleFleets.push(...visibleFleetsAtStar);
      }
    });

    return visibleFleets;
  }
  getPlayerInfluenceMap(player: Player): InfluenceMap
  {
    const stars = this.player.getRevealedStars();
    const influence = new ValuesByStar<number>(stars, star =>
    {
      const defenceBuildingStrength = this.getDefenceBuildingStrengthAtStarByPlayer(star);
      return defenceBuildingStrength.get(player) || 0;
    });

    const fleets = this.getVisibleFleetsOfPlayer(player);

    function getDistanceFalloff(distance: number)
    {
      return 1 / (distance + 1);
    }

    for (let i = 0; i < fleets.length; i++)
    {
      const fleet = fleets[i];
      const strength = this.unitEvaluator.evaluateMapStrength(...fleet.units);
      const location = fleet.location;

      const range = fleet.getMinMaxMovePoints();
      const turnsToCheck = 4;

      const inFleetRange = location.getLinkedInRange(range * turnsToCheck).byRange;

      inFleetRange[0] = [location];

      for (let distance in inFleetRange)
      {
        const numericDistance = parseInt(distance);
        let turnsToReach = Math.floor((numericDistance - 1) / range);
        if (turnsToReach < 0) turnsToReach = 0;
        const distanceFalloff = getDistanceFalloff(turnsToReach);
        const adjustedStrength = strength * distanceFalloff;

        for (let j = 0; j < inFleetRange[distance].length; j++)
        {
          const star = inFleetRange[distance][j];

          const previousInfluence = influence.get(star) || 0;
          influence.set(star, previousInfluence + adjustedStrength);
        }
      }
    }

    return influence;
  }
  getInfluenceMapsForKnownPlayers()
  {
    const byPlayer = new ValuesByPlayer<InfluenceMap>();

    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      const player = this.player.diplomacyStatus.metPlayers[playerId];
      byPlayer.set(player, this.getPlayerInfluenceMap(player));
    }

    return byPlayer;
  }
  getKnownPlayersInfluenceOnStar(star: Star)
  {
    const influenceMaps = this.getInfluenceMapsForKnownPlayers();

    const influenceByPlayer = new ValuesByPlayer<number>();

    influenceMaps.forEach((player, influenceMap) =>
    {
      const influenceOnStar = influenceMap.get(star);

      if (isFinite(influenceOnStar))
      {
        influenceByPlayer.set(player, influenceOnStar);
      }
    });

    return influenceByPlayer;
  }
  getVisibleStarsOfPlayer(player: Player): Star[]
  {
    return this.player.getVisibleStars().filter(function(star: Star)
    {
      return star.owner === player;
    });
  }
  getVisibleStarsOfKnownPlayers()
  {
    const byPlayer = new ValuesByPlayer<Star[]>();

    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      const player = this.player.diplomacyStatus.metPlayers[playerId];
      byPlayer.set(player, this.getVisibleStarsOfPlayer(player));
    }

    return byPlayer;
  }
  estimateGlobalStrength(player: Player)
  {
    let visibleStrength = 0;
    let invisibleStrength = 0;

    const fleets = this.getVisibleFleetsOfPlayer(player);
    for (let i = 0; i < fleets.length; i++)
    {
      visibleStrength += this.unitEvaluator.evaluateMapStrength(...fleets[i].units);
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

    const otherInfluenceMap = this.getPlayerInfluenceMap(player);
    const ownInfluenceMap = this.getPlayerInfluenceMap(this.player);

    let totalInfluenceInOwnStars = 0;

    this.player.controlledLocations.forEach(star =>
    {
      const ownInfluence = ownInfluenceMap.get(star);
      const otherInfluence = otherInfluenceMap.get(star);

      totalInfluenceInOwnStars += otherInfluence - 0.5 * ownInfluence;
    });

    const globalStrengthDifference =
      this.estimateGlobalStrength(player) - this.estimateGlobalStrength(this.player);

    return totalInfluenceInOwnStars + globalStrengthDifference;
  }
  getPerceivedThreatOfAllKnownPlayers()
  {
    const byPlayer = new ValuesByPlayer<number>();

    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      const player = this.player.diplomacyStatus.metPlayers[playerId];
      byPlayer.set(player, this.getPerceivedThreatOfPlayer(player));
    }

    return byPlayer;
  }
  getRelativePerceivedThreatOfAllKnownPlayers()
  {
    const byPlayer = this.getPerceivedThreatOfAllKnownPlayers();
    const relative = new ValuesByPlayer<number>();

    let min: number, max: number;

    byPlayer.forEach((player, threat) =>
    {
      min = isFinite(min) ? Math.min(min, threat) : threat;
      max = isFinite(max) ? Math.max(max, threat) : threat;
    });

    byPlayer.forEach((player, threat) =>
    {
      relative.set(player, getRelativeValue(threat, min, max));
    });

    return relative;
  }
  getVisionCoverageAroundStar(star: Star, range: number, useDetection: boolean = false)
  {
    const toCheck = star.getLinkedInRange(range).all;
    const scorePerVisibleStar = 1 / toCheck.length;
    let coverageScore: number = 0;
    const visibilityCheckFN = useDetection ? this.player.starIsDetected : this.player.starIsVisible;

    for (let i = 0; i < toCheck.length; i++)
    {
      const neighbor = toCheck[i];
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
  getPlayerVisionMap(player: Player)
  {
    const detectedStars:
    {
      [starID: number]: Star;
    } = {};
    const visibleStars:
    {
      [starID: number]: Star;
    } = {};

    const revealedStarsOfPlayer: Star[] = this.player.getRevealedStars().filter(function(star: Star)
    {
      return star.owner === player;
    });
    const visibleFleetsOfPlayer: Fleet[] = this.getVisibleFleetsOfPlayer(player);

    const processDetectionSource = function(source: Star, detectionRange: number, visionRange: number)
    {
      const detected = source.getLinkedInRange(detectionRange).all;
      for (let i = 0; i < detected.length; i++)
      {
        const star = detected[i];
        if (!detectedStars[star.id])
        {
          detectedStars[star.id] = star;
        }
      }

      const visible = source.getLinkedInRange(visionRange).all;
      for (let i = 0; i < visible.length; i++)
      {
        const star = visible[i];
        if (!visibleStars[star.id])
        {
          visibleStars[star.id] = star;
        }
      }
    };

    for (let i = 0; i < revealedStarsOfPlayer.length; i++)
    {
      const star = revealedStarsOfPlayer[i];
      const detectionRange = this.player.starIsDetected(star) ? star.getDetectionRange() : 0;
      const visionRange = this.player.starIsDetected(star) ? star.getVisionRange() : 1;
      processDetectionSource(star, detectionRange, visionRange);
    }
    for (let i = 0; i < visibleFleetsOfPlayer.length; i++)
    {
      const fleet = visibleFleetsOfPlayer[i];
      const detectionRange = this.estimateFleetDetectionRange(fleet);
      const visionRange = this.estimateFleetVisionRange(fleet);
      processDetectionSource(fleet.location, detectionRange, visionRange);
    }

    return(
    {
      visible: visibleStars,
      detected: detectedStars,
    });
  }
  getScoredPerimeterLocationsAgainstPlayer(
    player: Player,
    safetyFactor: number,
    forScouting: boolean
  ): ValuesByStar<number>
  {
    const ownInfluence = this.getPlayerInfluenceMap(this.player);
    const enemyInfluence = this.getPlayerInfluenceMap(player);
    const enemyVision = this.getPlayerVisionMap(player);

    const revealedStars = this.player.getRevealedStars();

    const stars = revealedStars.filter(star =>
    {
      return star.owner.isIndependent || star.owner === this.player;
    });

    const scores = new ValuesByStar(stars, star =>
    {
      let score: number;
      const nearestOwnedStar = player.getNearestOwnedStarTo(star);
      let distanceToEnemy = star.getDistanceToStar(nearestOwnedStar);
      distanceToEnemy = Math.max(distanceToEnemy - 1, 1);
      const distanceScore = Math.pow(1 / distanceToEnemy, 2);

      let danger = enemyInfluence.get(star) || 1;
      if (!enemyVision.visible[star.id])
      {
        danger *= 0.5;
      }
      danger *= safetyFactor;
      if (forScouting)
      {
        const safety = ownInfluence.get(star) / (danger * safetyFactor);
        score = safety * distanceScore;
        // const vision = this.getVisionCoverageAroundStar(star, 2);
        // const lackOfVision = 1 - vision;
        // score = lackOfVision * safety;
      }
      else
      {
        score = (danger / ownInfluence.get(star)) / safetyFactor;
      }

      return score;
    });

    return scores;
  }
  getDesireToGoToWarWith(player: Player)
  {
    // // potential gain
    // // perceived difficulty
    // const strength = this.estimateGlobalStrength(player);
    // // relations
    // const opinion = this.player.diplomacyStatus.getOpinionOf(player);
    // // trust
    // // own allies
    // //   ally ability to go to war with
    // //   ally trustworthiness
    // //   ally opinion of us
    // // enemy allies
    // //   enemy ally strength
    // // perceived threat
    // const threat = this.getPerceivedThreatOfPlayer(player);

    return Math.random(); // TODO ai
  }
  getAbilityToGoToWarWith(player: Player)
  {
    // // perceived strength
    // const strength = this.estimateGlobalStrength(player);
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
    const evaluationByPlayer:
    {
      [playerId: number]: DiplomacyEvaluation;
    } = {};

    const neighborStarsCountByPlayer = new ValuesByPlayer<number>();

    const allNeighbors = this.player.getNeighboringStars();
    for (let i = 0; i < allNeighbors.length; i++)
    {
      const star: Star = allNeighbors[i];
      if (!star.owner.isIndependent)
      {
        const previousCount = neighborStarsCountByPlayer.get(star.owner) || 0;
        neighborStarsCountByPlayer.set(star.owner, previousCount + 1);
      }
    }


    for (let playerId in this.player.diplomacyStatus.metPlayers)
    {
      const player = this.player.diplomacyStatus.metPlayers[playerId];

      evaluationByPlayer[player.id] =
      {
        currentTurn: currentTurn,
        opinion: this.player.diplomacyStatus.getOpinionOf(player),
        neighborStars: neighborStarsCountByPlayer.get(player),
        currentStatus: this.player.diplomacyStatus.statusByPlayer[player.id],
      };
    }

    return evaluationByPlayer;
  }
}
