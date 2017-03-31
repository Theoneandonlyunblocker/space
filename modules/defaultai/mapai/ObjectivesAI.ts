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

import {GrandStrategyAI} from "./GrandStrategyAI";
import MapEvaluator from "./MapEvaluator";
import {ObjectiveQueue} from "./ObjectiveQueue";

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

  constructor(
    mapEvaluator: MapEvaluator,
    grandStrategyAI: GrandStrategyAI,
  )
  {
    this.mapEvaluator = mapEvaluator;
    this.grandStrategyAI = grandStrategyAI;
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
      [type: string]: Objective[]
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
    this.updateAndExecuteObjectives(ObjectivesAI.diplomaticFilter, onAllFinished);
  }
  public processEconomicObjectives(onAllFinished: () => void): void
  {
    this.updateAndExecuteObjectives(ObjectivesAI.economicFilter, onAllFinished);
  }
  public createFrontObjectives(): void
  {
    this.updateObjectivesForFilter(ObjectivesAI.frontFilter);
  }
  public executeFrontObjectives(onAllFinished: () => void): void
  {
    const objectiveQueue = new ObjectiveQueue(
      () =>
      {
        this.updateObjectivesForFilter(ObjectivesAI.frontFilter);
        this.calculateFinalPrioritiesForObjectivesMatchingFilter(ObjectivesAI.frontFilter);

        return this.ongoingObjectives.filter(ObjectivesAI.frontFilter);
      },
    );

    objectiveQueue.executeObjectives(onAllFinished);
  }

  private updateAndExecuteObjectives(
    filterFN: (toFilter: Objective | ObjectiveCreatorTemplate) => boolean,
    onAllFinished: () => void,
  ): void
  {
    const objectiveQueue = new ObjectiveQueue(
      () =>
      {
        this.updateObjectivesForFilter(filterFN);
        this.calculateFinalPrioritiesForObjectivesMatchingFilter(filterFN);

        return this.ongoingObjectives.filter(filterFN);
      },
    );

    objectiveQueue.updateObjectives();
    objectiveQueue.executeObjectives(onAllFinished);
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
    const objectivesByType = ObjectivesAI.groupObjectivesByType(objectives);
    const relativeScores = new IDDictionary<Objective, number>();

    for (let type in objectivesByType)
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
    this.objectiveCreatorTemplates.filter(filterFN).forEach(template =>
    {
      priorities[template.type] = template.evaluatePriority(this.mapEvaluator, this.grandStrategyAI);
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
