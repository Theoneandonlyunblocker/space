import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {moveToTarget} from "./common/moveroutines/moveToTarget";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Unit from "../../../src/Unit";


export class Heal extends FrontObjective
{
  public readonly type = "Heal";
  public readonly movePriority = movePriority.heal;

  protected constructor(score: number)
  {
    super(score);
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: Heal[]): Heal[]
  {
    if (currentObjectives.length > 0)
    {
      return currentObjectives;
    }
    else
    {
      return [new Heal(1)];
    }
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return 0.5;
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
    moveToTarget(front, afterDoneCallback, fleet =>
    {
      return fleet.player.getNearestOwnedStarTo(fleet.location);
    });
  }
  public evaluateUnitFit(unit: Unit): number
  {
    const healthPercentage = unit.currentHealth / unit.maxHealth;
    return 1 - healthPercentage;
  }
  protected getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
}
