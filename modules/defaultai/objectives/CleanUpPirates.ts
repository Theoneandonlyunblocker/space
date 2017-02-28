import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {musterAndAttack} from "./common/moveroutines/musterAndAttack";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class CleanUpPirates extends FrontObjective
{
  public readonly type = "CleanUpPirates";
  public readonly movePriority = movePriority.cleanUpPirates;

  private target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: CleanUpPirates[]): CleanUpPirates[]
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

    return scores.map((star, score) =>
    {
      return new CleanUpPirates(score, star);
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForConsolidation;
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
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 1.5;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 2;
  }
}
