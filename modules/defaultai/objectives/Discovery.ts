import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {moveToTarget} from "./common/moveroutines/moveToTarget";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class Discovery extends FrontObjective
{
  public readonly type = "Discovery";
  public readonly movePriority = movePriority.discovery;

  private target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator): Discovery[]
  {
    const linksToUnRevealedStars = mapEvaluator.player.getLinksToUnRevealedStars();

    return linksToUnRevealedStars.map((targetStar, linkedStars) =>
    {
      const nearestOwnedStar = mapEvaluator.player.getNearestOwnedStarTo(targetStar);
      const distanceToNearestOwnedStar = nearestOwnedStar.getDistanceToStar(targetStar);

      const desirabilityScore = mapEvaluator.evaluateIndividualStarDesirability(targetStar);
      const linksMultiplier = linkedStars.length;
      const distanceMultiplier = 1 / distanceToNearestOwnedStar;

      const score = desirabilityScore * linksMultiplier * distanceMultiplier;

      return new Discovery(score, targetStar);
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForExploration;
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.moveUnits(this.front, this.mapEvaluator, afterDoneCallback);
  }

  protected moveUnits(
    front: Front,
    mapEvaluator: MapEvaluator,
    afterDoneCallback: () => void,
  ): void
  {
    moveToTarget(front, afterDoneCallback, fleet =>
    {
      return this.target;
    });
  }
  protected evaluateUnitFit(unit: Unit): number
  {
    const scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);
    const movementMultiplier = unit.maxMovePoints;

    const score = scoutingScore * movementMultiplier;

    return score * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
  }
  protected getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
}
