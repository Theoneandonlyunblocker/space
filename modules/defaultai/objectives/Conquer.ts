import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {musterAndAttack} from "./common/moveroutines/musterAndAttack";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class Conquer extends FrontObjective
{
  public readonly type = "Conquer";
  public readonly movePriority = movePriority.conquer;

  private target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: Conquer[]): Conquer[]
  {
    const possibleTargets = mapEvaluator.player.getNeighboringStars().filter(star =>
    {
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

    return scores.map((star, score) =>
    {
      return new Conquer(score, star);
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
      return target.building && target.enemy === target.building.controller;
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

    return enemyStrength * 1.3;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);

    return enemyStrength * 1.75;
  }
}
