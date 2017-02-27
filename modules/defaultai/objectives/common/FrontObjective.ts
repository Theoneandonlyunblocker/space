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
}
