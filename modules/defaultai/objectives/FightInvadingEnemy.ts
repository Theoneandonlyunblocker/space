import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";
import {movePriority} from "./common/movePriority";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";


export class FightInvadingEnemy extends TargetedFrontObjective
{
  public static readonly type = "FightInvadingEnemy";
  public readonly type = "FightInvadingEnemy";

  public readonly movePriority = movePriority.FightInvadingEnemy;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): FightInvadingEnemy[]
  {
    const ownedStarsWithInvaders = mapEvaluator.player.controlledLocations.filter(star =>
    {
      const hostileUnits = star.getUnits(player =>
      {
        return(
          !player.isIndependent &&
          mapEvaluator.player.diplomacy.canAttackFleetOfPlayer(player)
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

    return scores.mapToArray((star, score) =>
    {
      return new FightInvadingEnemy(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
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
      return !target.enemy.isIndependent;
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

    return enemyStrength * 1.2;
  }
  public getIdealRequiredCombatStrength(): number
  {
    const enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);

    return enemyStrength * 2;
  }
}
