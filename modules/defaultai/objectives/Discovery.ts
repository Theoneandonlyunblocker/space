import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";
import {movePriority} from "./common/movePriority";

import {moveToTarget} from "./common/moveroutines/moveToTarget";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class Discovery extends TargetedFrontObjective
{
  public static readonly type = "Discovery";
  public readonly type = "Discovery";

  public readonly movePriority = movePriority.discovery;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): Discovery[]
  {
    const linksToUnRevealedStars = mapEvaluator.player.getLinksToUnRevealedStars();

    return linksToUnRevealedStars.mapToArray((targetStar, linkedStars) =>
    {
      const nearestOwnedStar = mapEvaluator.player.getNearestOwnedStarTo(targetStar);
      const distanceToNearestOwnedStar = nearestOwnedStar.getDistanceToStar(targetStar);

      const desirabilityScore = mapEvaluator.evaluateIndividualStarDesirability(targetStar);
      const linksMultiplier = linkedStars.length;
      const distanceMultiplier = 1 / distanceToNearestOwnedStar;

      const score = desirabilityScore * linksMultiplier * distanceMultiplier;

      return new Discovery(score, targetStar, mapEvaluator, mapEvaluator.unitEvaluator);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForExploration;
  }

  public execute(afterDoneCallback: () => void): void
  {
    moveToTarget(this.front, afterDoneCallback, fleet =>
    {
      return this.target;
    });
  }
  public evaluateUnitFit(unit: Unit): number
  {
    const scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);
    const movementMultiplier = unit.maxMovePoints;

    const score = scoutingScore * movementMultiplier;

    return score * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
  }
  public getMinimumRequiredCombatStrength(): number
  {
    return 0;
  }
  public getIdealRequiredCombatStrength(): number
  {
    return 0;
  }
}
