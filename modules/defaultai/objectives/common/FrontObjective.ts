import {Objective} from "./Objective";

import {Front} from "../../mapai/Front";
import MapEvaluator from "../../mapai/MapEvaluator";

import Unit from "../../../../src/Unit";

export abstract class FrontObjective extends Objective
{
  public abstract readonly movePriority: number;

  protected front: Front;
  protected mapEvaluator: MapEvaluator;

  protected abstract moveUnits(
    front: Front,
    mapEvaluator: MapEvaluator,
    afterDoneCallback: () => void,
  ): void;
  /**
   * how well individual unit fits for this objective. 0-1
   */
  protected abstract evaluateUnitFit(unit: Unit): number;
  protected abstract evaluateMinimumUnitsNeeded(mapEvaluator: MapEvaluator): number;
  protected abstract evaluateIdealUnitsNeeded(mapEvaluator: MapEvaluator): number;
}
