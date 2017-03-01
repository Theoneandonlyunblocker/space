import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {musterAndAttack} from "./common/moveroutines/musterAndAttack";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class Expansion extends FrontObjective
{
  public readonly type = "Expansion";
  public readonly movePriority = movePriority.expansion;

  public readonly target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: Expansion[]): Expansion[]
  {
    const independentNeighborStars = mapEvaluator.getIndependentNeighborStars();

    const evaluations = mapEvaluator.evaluateStarTargets(independentNeighborStars);
    const scores = mapEvaluator.scoreIndependentTargets(evaluations);

    const currentObjectivesByTarget = this.getObjectivesByTarget(currentObjectives);

    return scores.map((star, score) =>
    {
      if (currentObjectivesByTarget.has(star))
      {
        const ongoing = currentObjectivesByTarget.get(star);
        ongoing.score = score;
        return ongoing;
      }
      else
      {
        return new Expansion(score, star);
      }
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForExpansion;
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
    musterAndAttack(front, afterDoneCallback, target =>
    {
      return target.enemy.isIndependent;
    });
  }
  protected evaluateUnitFit(unit: Unit): number
  {
    const strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
    return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
  }
  protected getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.2;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.6;
  }
}
