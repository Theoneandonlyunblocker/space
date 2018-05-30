import {GrandStrategyAi} from "../../mapai/GrandStrategyAi";
import MapEvaluator from "../../mapai/MapEvaluator";

import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

export interface ObjectiveCreatorTemplate
{
  type: string;
  family: ObjectiveFamily;

  getUpdatedObjectivesList: (mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]) => Objective[];
  evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi) => number;
}
