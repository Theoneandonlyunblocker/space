import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

import {GrandStrategyAI} from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";

export interface ObjectiveCreatorTemplate
{
  type: string;
  family: ObjectiveFamily;

  getObjectives: (mapEvaluator: MapEvaluator, currentObjectives: Objective[]) => Objective[];
  evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI) => number;
}
