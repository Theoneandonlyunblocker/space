import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";
import {movePriority} from "./common/movePriority";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class CleanUpPirates extends TargetedFrontObjective
{
  public static readonly type = "CleanUpPirates";
  public readonly type = "CleanUpPirates";

  public readonly movePriority = movePriority.cleanUpPirates;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): CleanUpPirates[]
  {
    const ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(star =>
    {
      if (star.getSecondaryController)
      {
        return false;
      }
      else
      {
        return star.getUnits(player => player.isIndependent).length > 0;
      }
    });

    const evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithPirates);
    const scores = mapEvaluator.scoreIndependentTargets(evaluations);

    return scores.mapToArray((star, score) =>
    {
      return new CleanUpPirates(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForConsolidation;
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.musterAndAttack(afterDoneCallback, target =>
    {
      return target.enemy.isIndependent;
    });
  }
  public evaluateUnitFit(unit: Unit): number
  {
    const strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);

    return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
  }
  public getMinimumRequiredCombatStrength(): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 1.5;
  }
  public getIdealRequiredCombatStrength(): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 2;
  }
}
