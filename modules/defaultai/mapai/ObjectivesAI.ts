/* OLD STUFF
-- objectives ai
get expansion targets
create expansion objectives with priority based on score
add flat amount of priority if objective is ongoing
sort objectives by priority
while under max active expansion objectives
  make highest priority expansion objective active

-- fronts ai
divide available units to fronts based on priority
make requests for extra units if needed
muster units at muster location
when requested units arrive
  move units to target location
  execute action

-- economy ai
build units near request target
 */

/*
scouting objectives
  discovery
    find new locations
  tracking
    track enemy armies
  perimeter
    create perimeter of vision around own locations
END OLD STUFF*/

/*
diplo           |
front requests  V
econ
front moves
diplo
econ
*/

import {GrandStrategyAI} from "./GrandStrategyAI";
import MapEvaluator from "./MapEvaluator";

import {Objective} from "../objectives/common/Objective";
import {ObjectiveCreatorTemplate} from "../objectives/common/ObjectiveCreatorTemplate";
import {ObjectiveFamily} from "../objectives/common/ObjectiveFamily";

import {IDDictionary} from "../../../src/IDDictionary";
import
{
  getRelativeValue,
} from "../../../src/utility";

export class ObjectivesAI
{
  private readonly objectiveCreatorTemplates: ObjectiveCreatorTemplate[] = [];
  private ongoingObjectives: Objective[] = [];

  private readonly grandStrategyAI: GrandStrategyAI;
  private readonly mapEvaluator: MapEvaluator;

  public processDiplomaticObjectives(): void
  {
    const filterFN = (toFilter: Objective | ObjectiveCreatorTemplate) =>
    {
      return toFilter.family === ObjectiveFamily.Diplomatic;
    };

    // update objectives
    this.updateObjectivesForFilter(filterFN);

    // evaluate priorities
    const priorities: {[type: string]: number} = {};
    this.objectiveCreatorTemplates.filter(filterFN).forEach(template =>
    {
      priorities[template.type] = template.evaluatePriority(this.mapEvaluator, this.grandStrategyAI);
    });
    // calculate relative scores
    let minScore: number;
    let maxScore: number;


    // final priority = priority * relative score

    // execute
  }
  public processEconomicObjectives(): void
  {

  }
  public createFrontRequests(): void
  {

  }
  public executeFrontMoves(): void
  {

  }

  /**
   * removes from this.ongoingObjectives as a side effect
   */
  private spliceOngoingObjectives(filterFN: (objective: Objective) => boolean): Objective[]
  {
    const filteredOngoingObjectives: Objective[] = [];
    const splicedObjectives: Objective[] = [];

    this.ongoingObjectives.forEach(objective =>
    {
      if (filterFN(objective))
      {
        splicedObjectives.push(objective);
      }
      else
      {
        filteredOngoingObjectives.push(objective);
      }
    });

    this.ongoingObjectives = filteredOngoingObjectives;
    return splicedObjectives;
  }
  private updateObjectivesForFilter(
    filterFN: (toFilter: Objective | ObjectiveCreatorTemplate) => boolean,
  ): void
  {
    const creatorTemplates = this.objectiveCreatorTemplates.filter(filterFN);

    const ongoingObjectives = this.spliceOngoingObjectives(filterFN);

    creatorTemplates.forEach(template =>
    {
      const newObjectives = template.getObjectives(this.mapEvaluator, ongoingObjectives);
      this.ongoingObjectives.push(...newObjectives);
    });
  }
  private getRelativeScoresForObjectives(objectives: Objective[]): IDDictionary<Objective, number>
  {
    let min: number;
    let max: number;

    objectives.forEach(objective =>
    {
      const score = objective.score;

      min = isFinite(min) ? Math.min(min, score) : score;
      max = isFinite(max) ? Math.max(max, score) : score;
    });

    return new IDDictionary(objectives, objective =>
    {
      return getRelativeValue(objective.score, min, max);
    });
  }
}
