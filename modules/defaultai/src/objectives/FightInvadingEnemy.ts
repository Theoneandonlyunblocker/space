import {Star} from "core/src/map/Star";
import {Unit} from "core/src/unit/Unit";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";


export class FightInvadingEnemy extends TargetedFrontObjective
{
  public static readonly type = "FightInvadingEnemy";
  public readonly type = "FightInvadingEnemy";

  public readonly movePriority = MovePriority.FightInvadingEnemy;

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
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForConsolidation;
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
