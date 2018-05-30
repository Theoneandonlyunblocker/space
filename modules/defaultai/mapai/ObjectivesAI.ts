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
form fronts     V
front requests
econ
front moves
diplo
econ
*/

import {IdDictionary} from "../../../src/IdDictionary";
import
{
  getRelativeValue,
} from "../../../src/utility";
import {FrontObjective} from "../objectives/common/FrontObjective";
import {Objective} from "../objectives/common/Objective";
import {ObjectiveCreatorTemplate} from "../objectives/common/ObjectiveCreatorTemplate";
import {ObjectiveFamily} from "../objectives/common/ObjectiveFamily";

import {GrandStrategyAi} from "./GrandStrategyAi";
import MapEvaluator from "./MapEvaluator";
import {ObjectiveQueue} from "./ObjectiveQueue";
import {objectiveCreatorTemplates} from "./objectiveCreatorTemplates";


export class ObjectivesAi
{
  private ongoingObjectives: Objective[] = [];

  private readonly grandStrategyAi: GrandStrategyAi;
  private readonly mapEvaluator: MapEvaluator;

  constructor(
    mapEvaluator: MapEvaluator,
    grandStrategyAi: GrandStrategyAi,
  )
  {
    this.mapEvaluator = mapEvaluator;
    this.grandStrategyAi = grandStrategyAi;
  }

  private static diplomaticFilter(toFilter: Objective | ObjectiveCreatorTemplate)
  {
    return toFilter.family === ObjectiveFamily.Diplomatic;
  }
  private static economicFilter(toFilter: Objective | ObjectiveCreatorTemplate)
  {
    return toFilter.family === ObjectiveFamily.Economic;
  }
  private static frontFilter(toFilter: Objective | ObjectiveCreatorTemplate)
  {
    return toFilter.family === ObjectiveFamily.Front;
  }
  private static groupObjectivesByType(objectives: Objective[]): {[type: string]: Objective[]}
  {
    const grouped:
    {
      [type: string]: Objective[],
    } = {};

    objectives.forEach(objective =>
    {
      if (!grouped[objective.type])
      {
        grouped[objective.type] = [];
      }

      grouped[objective.type].push(objective);
    });

    return grouped;
  }

  public processDiplomaticObjectives(onAllFinished: () => void): void
  {
    this.updateAndExecuteObjectives(ObjectivesAi.diplomaticFilter, onAllFinished);
  }
  public processEconomicObjectives(onAllFinished: () => void): void
  {
    this.updateAndExecuteObjectives(ObjectivesAi.economicFilter, onAllFinished);
  }
  public createFrontObjectives(): void
  {
    this.updateObjectivesForFilter(ObjectivesAi.frontFilter);
    this.calculateFinalPrioritiesForObjectivesMatchingFilter(ObjectivesAi.frontFilter);
  }
  public getFrontObjectives(): FrontObjective[]
  {
    return <FrontObjective[]> this.ongoingObjectives.filter(ObjectivesAi.frontFilter);
  }
  public executeFrontObjectives(onAllFinished: () => void): void
  {
    const objectives = this.getFrontObjectives();
    objectives.sort((a, b) =>
    {
      const movePrioritySort = b.movePriority - a.movePriority;
      if (movePrioritySort)
      {
        return movePrioritySort;
      }

      const finalPrioritySort = b.finalPriority - a.finalPriority;
      if (finalPrioritySort)
      {
        return finalPrioritySort;
      }

      return a.id - b.id;
    });

    const objectiveQueue = new ObjectiveQueue();
    objectiveQueue.executeObjectives(
      objectives,
      onAllFinished,
    );
  }

  private updateAndExecuteObjectives(
    filterFN: (toFilter: Objective | ObjectiveCreatorTemplate) => boolean,
    onAllFinished: () => void,
  ): void
  {
    this.updateObjectivesForFilter(filterFN);
    this.calculateFinalPrioritiesForObjectivesMatchingFilter(filterFN);

    const objectiveQueue = new ObjectiveQueue();

    objectiveQueue.executeObjectives(
      this.ongoingObjectives.filter(filterFN).sort(ObjectiveQueue.sortByFinalPriority),
      onAllFinished,
    );
  }
  private updateObjectivesForFilter(
    filterFN: (toFilter: Objective | ObjectiveCreatorTemplate) => boolean,
  ): void
  {
    const creatorTemplates = objectiveCreatorTemplates.filter(filterFN);

    creatorTemplates.forEach(template =>
    {
      const newObjectives = template.getUpdatedObjectivesList(this.mapEvaluator, this.ongoingObjectives);

      this.ongoingObjectives = newObjectives;
    });
  }
  private getRelativeScoresForObjectives(objectives: Objective[]): IdDictionary<Objective, number>
  {
    const objectivesByType = ObjectivesAi.groupObjectivesByType(objectives);
    const relativeScores = new IdDictionary<Objective, number>();

    for (const type in objectivesByType)
    {
      let min: number;
      let max: number;

      objectivesByType[type].forEach(objective =>
      {
        const score = objective.score;

        min = isFinite(min) ? Math.min(min, score) : score;
        max = isFinite(max) ? Math.max(max, score) : score;
      });

      objectivesByType[type].forEach(objective =>
      {
        const relativeScore = getRelativeValue(objective.score, min, max);
        relativeScores.set(objective, relativeScore);
      });
    }

    return relativeScores;
  }
  private calculateFinalPrioritiesForObjectivesMatchingFilter(
    filterFN: (toFilter: Objective | ObjectiveCreatorTemplate) => boolean,
  ): void
  {
    // evaluate priorities
    const priorities: {[type: string]: number} = {};
    objectiveCreatorTemplates.filter(filterFN).forEach(template =>
    {
      priorities[template.type] = template.evaluatePriority(this.mapEvaluator, this.grandStrategyAi);
    });

    // calculate relative scores
    const relativeScores = this.getRelativeScoresForObjectives(
      this.ongoingObjectives.filter(filterFN));

    // final priority = priority * relative score
    relativeScores.forEach((objective, score) =>
    {
      objective.finalPriority = score * priorities[objective.type];
    });
  }
}
