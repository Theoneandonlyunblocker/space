import {Star} from "../../../src/map/Star";
import {Unit} from "../../../src/unit/Unit";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";


export class CleanUpPirates extends TargetedFrontObjective
{
  public static readonly type = "CleanUpPirates";
  public readonly type = "CleanUpPirates";

  public readonly movePriority = MovePriority.CleanUpPirates;

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
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForConsolidation;
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
