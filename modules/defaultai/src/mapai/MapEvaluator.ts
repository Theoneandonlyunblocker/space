import {DiplomacyEvaluation} from "core/src/diplomacy/DiplomacyEvaluation";
import {Fleet} from "core/src/fleets/Fleet";
import {GalaxyMap} from "core/src/map/GalaxyMap";
import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import {Unit} from "core/src/unit/Unit";
import {ValuesByPlayer} from "core/src/player/ValuesByPlayer";
import {ValuesByStar} from "core/src/map/ValuesByStar";
import
{
  getRelativeValue, sumObjectValues,
} from "core/src/generic/utility";

import {UnitEvaluator} from "./UnitEvaluator";
import { activeModuleData } from "core/src/app/activeModuleData";
import { getBaseValuablenessOfResources } from "core/src/player/PlayerResources";


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
      defendabilityWeight: number;

      totalIncomeWeight: number;
      baseIncomeWeight: number;

      infrastructureWeight: number;
      productionWeight: number;
    };
  };
  public unitEvaluator: UnitEvaluator;

  constructor(map: GalaxyMap, player: Player, unitEvaluator: UnitEvaluator)
  {
    this.map = map;
    this.player = player;
    this.unitEvaluator = unitEvaluator;

    this.evaluationParameters = defaultEvaluationParameters;
  }

  evaluateStarIncome(star: Star): number
  {
    const evaluationOfBaseIncome = getBaseValuablenessOfResources(star.baseIncome);
    const evaluationOfImprovedIncome = (() =>
    {
      const improvedIncomeWeight = 1 - this.evaluationParameters.starDesirability.baseIncomeWeight;
      const evaluationOfAllIncome = getBaseValuablenessOfResources(star.getResourceIncome());

      return (evaluationOfAllIncome - evaluationOfBaseIncome) * improvedIncomeWeight;
    })();

    const evaluation = evaluationOfBaseIncome + evaluationOfImprovedIncome;

    return evaluation;
  }

  evaluateStarInfrastructure(star: Star): number
  {
    const allBuildCosts = star.buildings.map(building => building.totalCost);
    const totalCostOfAllBuildings = sumObjectValues(...allBuildCosts);

    const totalValueOfResourcesForBuildings = Object.keys(totalCostOfAllBuildings).reduce((total, resourceType) =>
    {
      const resource = activeModuleData.templates.resources.get(resourceType);
      const value = totalCostOfAllBuildings[resourceType] * resource.baseValuableness;

      return total + value;
    }, 0);

    return totalValueOfResourcesForBuildings / 25;
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
    for (const rangeString in nearbyStars)
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

    const incomeEvaluation = this.evaluateStarIncome(star) * p.totalIncomeWeight;
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

    const inRange = star.getLinkedInRange(range).byRange;

    for (const distanceString in inRange)
    {
      const stars = inRange[distanceString];
      const distance = parseInt(distanceString);
      const distanceFalloff = 1 / (distance + 1);

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
      this.player.diplomacy.canAttackFleetOfPlayer(player));
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
  // TODO 2018.06.13 | calculate first territory building & buildings that contribute to battle instead
  private getDefenceBuildingStrengthAtStarByPlayer(star: Star): ValuesByPlayer<number>
  {
    const byPlayer = new ValuesByPlayer<number>();

    star.territoryBuildings.forEach(building =>
    {
      const previousValue = byPlayer.get(building.controller) || 0;
      byPlayer.set(building.controller, previousValue + building.totalCost.money);
    });

    return byPlayer;
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

    for (let i = 0; i < fleets.length; i++)
    {
      const fleet = fleets[i];
      const strength = this.unitEvaluator.evaluateMapStrength(...fleet.units);
      const location = fleet.location;

      const range = fleet.getMinMaxMovePoints();
      const turnsToCheck = 4;

      const inFleetRange = location.getLinkedInRange(range * turnsToCheck).byRange;

      inFleetRange[0] = [location];

      for (const distance in inFleetRange)
      {
        const numericDistance = parseInt(distance);
        let turnsToReach = Math.floor((numericDistance - 1) / range);
        if (turnsToReach < 0) { turnsToReach = 0; }
        const distanceFalloff = 1 / (turnsToReach + 1);
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

    this.player.diplomacy.getMetPlayers().filter(player => !player.isDead).forEach(player =>
    {
      byPlayer.set(player, this.getPlayerInfluenceMap(player));
    });

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
    return this.player.getVisibleStars().filter(star =>
    {
      return star.owner === player;
    });
  }
  getVisibleStarsOfKnownPlayers()
  {
    const byPlayer = new ValuesByPlayer<Star[]>();

    this.player.diplomacy.getMetPlayers().filter(player => !player.isDead).forEach(player =>
    {
      byPlayer.set(player, this.getVisibleStarsOfPlayer(player));
    });

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
    if (!this.player.diplomacy.hasMetPlayer(player))
    {
      throw new Error(this.player.name.baseName +
        " tried to call getPerceivedThreatOfPlayer on unmet player " + player.name.baseName);
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

    this.player.diplomacy.getMetPlayers().filter(player => !player.isDead).forEach(player =>
    {
      byPlayer.set(player, this.getPerceivedThreatOfPlayer(player));
    });

    return byPlayer;
  }
  getRelativePerceivedThreatOfAllKnownPlayers()
  {
    const byPlayer = this.getPerceivedThreatOfAllKnownPlayers();
    const relative = new ValuesByPlayer<number>();

    let min: number;
    let max: number;

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
      [starId: number]: Star;
    } = {};
    const visibleStars:
    {
      [starId: number]: Star;
    } = {};

    const revealedStarsOfPlayer: Star[] = this.player.getRevealedStars().filter(star => star.owner === player);
    const visibleFleetsOfPlayer: Fleet[] = this.getVisibleFleetsOfPlayer(player);

    const processDetectionSource = (source: Star, detectionRange: number, visionRange: number) =>
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

      const assumedDetectionRange = activeModuleData.ruleSet.vision.baseStarDetectionRange;
      const detectionRange = this.player.starIsDetected(star) ?
        star.getDetectionRange() :
        assumedDetectionRange;

      const assumedVisionRange = activeModuleData.ruleSet.vision.baseStarVisionRange;
      const visionRange = this.player.starIsDetected(star) ?
        star.getVisionRange() :
        assumedVisionRange;

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
    // const opinion = this.player.diplomacy.getOpinionOf(player);
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
  getDiplomacyEvaluations(currentTurn: number): ValuesByPlayer<DiplomacyEvaluation>
  {
    const evaluations = new ValuesByPlayer<DiplomacyEvaluation>();
    const neighborStarsByPlayer = new ValuesByPlayer<Star[]>();

    this.player.getNeighboringStars().forEach(star =>
    {
      neighborStarsByPlayer.setIfDoesntExist(star.owner, []);
      neighborStarsByPlayer.get(star.owner).push(star);
    });

    this.player.diplomacy.getMetPlayers().filter(player => !player.isDead).forEach(player =>
    {
      neighborStarsByPlayer.setIfDoesntExist(player, []);

      evaluations.set(player,
      {
        currentTurn: currentTurn,
        opinion: this.player.diplomacy.getOpinionOf(player),
        neighborStars: neighborStarsByPlayer.get(player),
        currentStatus: this.player.diplomacy.getStatusWithPlayer(player),
      });
    });

    return evaluations;
  }
}
