import {Star} from "core/src/map/Star";
import {Unit} from "core/src/unit/Unit";
import {ValuesByStar} from "core/src/map/ValuesByStar";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {TargetedFrontObjective} from "./common/TargetedFrontObjective";
import {moveToTarget} from "./common/moveroutines/moveToTarget";


export class ScoutingPerimeter extends TargetedFrontObjective
{
  public static override readonly type = "ScoutingPerimeter";
  public readonly type = "ScoutingPerimeter";

  public readonly movePriority = MovePriority.ScoutingPerimeter;

  protected constructor(score: number, target: Star, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, target, mapEvaluator, unitEvaluator);
  }

  protected static override createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): ScoutingPerimeter[]
  {
    const playersToEstablishPerimeterAgainst = mapEvaluator.player.diplomacy.getMetPlayers().filter(player =>
    {
      return !player.isDead && player.diplomacy.canAttackBuildingOfPlayer(mapEvaluator.player);
    });

    const allScores = playersToEstablishPerimeterAgainst.map(player =>
    {
      return mapEvaluator.getScoredPerimeterLocationsAgainstPlayer(player, 1, true);
    });

    const mergedScores = new ValuesByStar<number>();

    mergedScores.merge((...scores) =>
    {
      return scores.reduce((total, current) =>
      {
        return total + current;
      }, 0);
    }, ...allScores);

    return mergedScores.mapToArray((star, score) =>
    {
      return new ScoutingPerimeter(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
    });
  }
  protected static override evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForConsolidation;
  }

  public execute(afterDoneCallback: () => void): void
  {
    moveToTarget(this.front, afterDoneCallback, fleet =>
    {
      return this.target;
    });
  }
  public evaluateUnitFit(unit: Unit): number
  {
    const scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);

    return scoutingScore * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
  }
  public getMinimumRequiredCombatStrength(): number
  {
    return 0;
  }
  public getIdealRequiredCombatStrength(): number
  {
    return 0;
  }
}
