import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {moveToTarget} from "./common/moveroutines/moveToTarget";

import {Front} from "../mapai/Front";
import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Manufactory from "../../../src/Manufactory";
import Player from "../../../src/Player";
import Unit from "../../../src/Unit";


export class Heal extends FrontObjective
{
  public readonly type = "Heal";
  public readonly movePriority = movePriority.heal;

  constructor(score: number)
  {
    super(score);
  }

  public static createObjectives(mapEvaluator: MapEvaluator): Heal[]
  {
    return [new Heal(1)];
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
  protected evaluateUnitFit(unit: Unit): number
  {
    const healthPercentage = unit.currentHealth / unit.maxHealth;
    return 1 - healthPercentage;
  }
  protected evaluateMinimumUnitsNeeded(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
  protected evaluateIdealUnitsNeeded(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
}
