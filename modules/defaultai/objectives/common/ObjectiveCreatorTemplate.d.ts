import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

import {GrandStrategyAI} from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";

export interface ObjectiveCreatorTemplate
{
  type: string;
  family: ObjectiveFamily;

  getUpdatedObjectivesList: (mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]) => Objective[];
  evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI) => number;
}
