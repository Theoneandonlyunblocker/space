import {Unit} from "core/src/unit/Unit";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";
import {UnitEvaluator} from "../mapai/UnitEvaluator";

import {FrontObjective} from "./common/FrontObjective";
import {MovePriority} from "./common/MovePriority";
import {Objective} from "./common/Objective";
import {moveToTarget} from "./common/moveroutines/moveToTarget";


// @ts-ignore 2417
export class Heal extends FrontObjective
{
  public static readonly type = "Heal";
  public readonly type = "Heal";

  public readonly movePriority = MovePriority.Heal;

  protected constructor(score: number, mapEvaluator: MapEvaluator, unitEvaluator: UnitEvaluator)
  {
    super(score, mapEvaluator, unitEvaluator);
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): Heal[]
  {
    return [new Heal(1, mapEvaluator, mapEvaluator.unitEvaluator)];
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return 0.5;
  }
  protected static updateOngoingObjectivesList(
    allOngoingObjectives: Objective[],
    createdObjectives: Heal[],
  ): Objective[]
  {
    return this.updateUniqueObjective(allOngoingObjectives, createdObjectives[0]);
  }

  public execute(afterDoneCallback: () => void): void
  {
    moveToTarget(this.front, afterDoneCallback, fleet =>
    {
      return fleet.player.getNearestOwnedStarTo(fleet.location);
    });
  }
  public evaluateUnitFit(unit: Unit): number
  {
    const healthPercentage = unit.currentHealth / unit.maxHealth;

    return 1 - healthPercentage;
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
