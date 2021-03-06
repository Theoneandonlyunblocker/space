import {Star} from "core/src/map/Star";
import {Unit} from "core/src/unit/Unit";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";


export class Expansion extends TargetedFrontObjective
{
  public static override readonly key = "Expansion";
  public readonly key = "Expansion";

  public readonly movePriority = MovePriority.Expansion;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static override createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): Expansion[]
  {
    const independentNeighborStars = mapEvaluator.getIndependentNeighborStars();

    const evaluations = mapEvaluator.evaluateStarTargets(independentNeighborStars);
    const scores = mapEvaluator.scoreIndependentTargets(evaluations);

    return scores.mapToArray((star, score) =>
    {
      return new Expansion(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
    });
  }
  protected static override evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForExpansion;
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
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.2;
  }
  public getIdealRequiredCombatStrength(): number
  {
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.6;
  }
}
