import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {musterAndAttack} from "./common/moveroutines/musterAndAttack";

import {Front} from "../mapai/Front";
import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class FightInvadingEnemy extends FrontObjective
{
  public readonly type = "FightInvadingEnemy";
  public readonly movePriority = movePriority.fightInvadingEnemy;

  private target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static createObjectives(mapEvaluator: MapEvaluator): FightInvadingEnemy[]
  {
    const ownedStarsWithInvaders = mapEvaluator.player.controlledLocations.filter(star =>
    {
      const hostileUnits = star.getUnits(player =>
      {
        return(
          !player.isIndependent &&
          mapEvaluator.player.diplomacyStatus.canAttackFleetOfPlayer(player)
        );
      });

      return hostileUnits.length > 0;
    });

    const evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithInvaders);
    const scores = mapEvaluator.scoreStarTargets(evaluations, (star, evaluation) =>
    {
      const strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
      const score = evaluation.desirability * strengthRatio;

      return score;
    });

    return scores.map((star, score) =>
    {
      return new FightInvadingEnemy(score, star);
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
      return !target.enemy.isIndependent;
    });
  }
  protected evaluateUnitFit(unit: Unit): number
  {
    const strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
    return strengthScore * this.unitEvaluator.evaluateDefaultFrontFit(unit, this.front);
  }
  protected getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 1.2;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 2;
  }
}
