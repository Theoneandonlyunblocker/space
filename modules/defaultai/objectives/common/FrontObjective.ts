import {Objective} from "./Objective";

import {Front} from "../../mapai/Front";
import MapEvaluator from "../../mapai/MapEvaluator";
import {UnitEvaluator} from "../../mapai/UnitEvaluator";

import Unit from "../../../../src/Unit";

export abstract class FrontObjective extends Objective
{
  public abstract readonly movePriority: number;

  protected front: Front;
  protected mapEvaluator: MapEvaluator;
  protected unitEvaluator: UnitEvaluator;

  protected abstract moveUnits(
    front: Front,
    mapEvaluator: MapEvaluator,
    afterDoneCallback: () => void,
  ): void;
  /**
   * how well unit fits for this objective relative to other units
   */
  protected abstract evaluateUnitFit(unit: Unit): number;
  protected abstract getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number;
  protected abstract getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number;

  protected evaluateDefaultUnitFit(
    unit: Unit,
    front: Front,
    lowHealthThreshhold: number = 0.75,
    healthAdjust: number = 1,
    distanceAdjust: number = 1,
  )
  {
    let score = 1;

    // penalize units on low health
    const healthPercentage = unit.currentHealth / unit.maxHealth;

    if (healthPercentage < lowHealthThreshhold)
    {
      score *= healthPercentage * healthAdjust;
    }

    // prioritize units closer to front target
    let turnsToReach = unit.getTurnsToReachStar(front.targetLocation);
    if (turnsToReach > 0)
    {
      turnsToReach *= distanceAdjust;
      const distanceMultiplier = 1 / (Math.log(turnsToReach + 2.5) / Math.log(2.5));
      score *= distanceMultiplier;
    }

    return score;
  }
}
