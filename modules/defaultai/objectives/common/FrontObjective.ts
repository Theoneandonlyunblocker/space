import {Objective} from "./Objective";

import {Front} from "../../mapai/Front";
import MapEvaluator from "../../mapai/MapEvaluator";

import Unit from "../../../../src/Unit";

export abstract class FrontObjective extends Objective
{
  // TODO 26.02.2017 | should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/10603
  protected static movePriority: number;

  protected front: Front;
  protected mapEvaluator: MapEvaluator;

  protected abstract moveUnits(front: Front, mapEvaluator: MapEvaluator): void;
  /**
   * how well individual unit fits for this objective. 0-1
   */
  protected abstract evaluateUnitFit(unit: Unit): number;
  protected abstract evaluateMinimumUnitsNeeded(mapEvaluator: MapEvaluator): number;
  protected abstract evaluateIdealUnitsNeeded(mapEvaluator: MapEvaluator): number;
}
