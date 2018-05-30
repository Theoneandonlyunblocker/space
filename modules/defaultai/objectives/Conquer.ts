import Star from "../../../src/Star";
import Unit from "../../../src/Unit";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import MapEvaluator from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";


export class Conquer extends TargetedFrontObjective
{
  public static readonly type = "Conquer";
  public readonly type = "Conquer";

  public readonly movePriority = MovePriority.Conquer;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): Conquer[]
  {
    const possibleTargets = mapEvaluator.player.getNeighboringStars().filter(star =>
    {
      // covered by expansion objectives
      if (star.owner.isIndependent)
      {
        return false;
      }

      if (!mapEvaluator.player.starIsRevealed(star))
      {
        return false;
      }

      return star.hasBuildingTargetForPlayer(mapEvaluator.player);
    });

    const evaluations = mapEvaluator.evaluateStarTargets(possibleTargets);
    const scores = mapEvaluator.scoreStarTargets(evaluations, (star, evaluation) =>
    {
      const strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
      const score = evaluation.desirability * strengthRatio;

      return score;
    });

    return scores.mapToArray((star, score) =>
    {
      return new Conquer(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForExpansion;
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.musterAndAttack(afterDoneCallback, target =>
    {
      return target.building && target.enemy === target.building.controller;
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

    return enemyStrength * 1.3;
  }
  public getIdealRequiredCombatStrength(): number
  {
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.75;
  }
}
