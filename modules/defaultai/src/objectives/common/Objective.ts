import {IdDictionary} from "core/src/generic/IdDictionary";
import {idGenerators} from "core/src/app/idGenerators";
import {GrandStrategyAi} from "../../mapai/GrandStrategyAi";
import {MapEvaluator} from "../../mapai/MapEvaluator";

import {ObjectiveCreatorTemplate} from "./ObjectiveCreatorTemplate";
import {ObjectiveFamily} from "./ObjectiveFamily";


export abstract class Objective
{
  // all this static stuff should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/14600

  // TODO 2017.02.28 | family and type might be a bit confusingly named here
  // type is used like this for templates, so it's used here as well at least for now
  // TODO 2021.11.08 | rename type => key
  public static readonly type: string;
  public static readonly family: ObjectiveFamily;

  protected static createObjectives: (
    mapEvaluator: MapEvaluator,
    allOngoingObjectives: Objective[],
  ) => Objective[];

  protected static updateOngoingObjectivesList: (
    allOngoingObjectives: Objective[],
    createdObjectives: Objective[],
  ) => Objective[];

  /**
   * should return player's current priority for this type of objetive. 0-1
   */
  protected static evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi) => number;

  public abstract readonly type: string;
  public abstract readonly family: ObjectiveFamily;
  public readonly id: number;

  /**
   * score relative to other objectives of same type * priority of objective type
   * comparable to all other objectives
   */
  public finalPriority: number;

  /**
   * arbitrary score
   * comparable only to objectives of same type
   */
  public get score(): number
  {
    return this.isOngoing ? this.baseScore * this.ongoingMultiplier : this.baseScore;
  }
  public set score(score: number)
  {
    this.baseScore = score;
  }
  public isOngoing: boolean = false; // used to prioritize old objectives

  protected readonly ongoingMultiplier: number = 1.25;

  private baseScore: number;

  protected constructor(score: number)
  {
    this.id = idGenerators.objective++;
    this.score = score;
  }

  public static makeCreatorTemplate(): ObjectiveCreatorTemplate
  {
    // checking these at runtime since we can't actually tag them abstract for the compiler
    // https://github.com/Microsoft/TypeScript/issues/14600
    [
      {member: this.type, memberIdentifier: "type"},
      {member: this.family, memberIdentifier: "family"},
      {member: this.createObjectives, memberIdentifier: "createObjectives"},
      {member: this.updateOngoingObjectivesList, memberIdentifier: "updateOngoingObjectivesList"},
      {member: this.evaluatePriority, memberIdentifier: "evaluatePriority"},
    ].forEach(toCheck =>
    {
      if (toCheck.member === undefined)
      {
        throw new Error(`Objective ${this.type || this} lacks required static member ${toCheck.memberIdentifier}`);
      }
    });

    return(
    {
      type: this.type,
      family: this.family,
      getUpdatedObjectivesList: (mapEvaluator, allOngoingObjectives) =>
      {
        const createdObjectives = this.createObjectives(mapEvaluator, allOngoingObjectives);

        return this.updateOngoingObjectivesList(allOngoingObjectives, createdObjectives);
      },
      evaluatePriority: this.evaluatePriority.bind(this),
    });
  }

  // TODO 2017.04.09 | doesn't belong in this class
  protected static getObjectivesByTarget<O extends Objective & {target: T}, T extends {id: number}>(objectives: O[]): IdDictionary<T, O>
  {
    const byTarget = new IdDictionary<T, O>();

    objectives.forEach(objective =>
    {
      if (byTarget.has(objective.target))
      {
        throw new Error(`Duplicate target id:'${objective.target.id}' for objectives of type '${objective.type}'`);
      }
      else
      {
        byTarget.set(objective.target, objective);
      }
    });

    return byTarget;
  }
  // TODO 2017.04.09 | doesn't belong in this class
  protected static updateTargetedObjectives<O extends Objective & {target: T}, T extends {id: number}>(
    allOngoingObjectives: Objective[],
    createdObjectives: O[],
  ): Objective[]
  {
    const resultingObjectives: Objective[] = [];

    const createdObjectivesByTarget = Objective.getObjectivesByTarget(createdObjectives);

    allOngoingObjectives.forEach(objective =>
    {
      if (objective.type === this.type)
      {
        if (createdObjectivesByTarget.has((<O>objective).target))
        {
          const createdObjective = createdObjectivesByTarget.get((<O>objective).target)!;

          objective.score = createdObjective.score;
          objective.isOngoing = true;

          resultingObjectives.push(objective);
          createdObjectivesByTarget.delete((<O>objective).target);
        }
        else
        {
          // objective isn't relevant anymore. don't add to updated objectives
        }
      }
      else
      {
        resultingObjectives.push(objective);
      }
    });

    createdObjectivesByTarget.forEach((target, objective) =>
    {
      resultingObjectives.push(objective);
    });

    return resultingObjectives;
  }
  // TODO 2017.04.09 | probably doesn't belong in this class
  protected static updateUniqueObjective(allOngoingObjectives: Objective[], createdObjective: Objective): Objective[]
  {
    for (let i = 0; i < allOngoingObjectives.length; i++)
    {
      const objective = allOngoingObjectives[i];
      if (objective.type === createdObjective.type)
      {
        objective.score = createdObjective.score;
        // don't mark as ongoing, as unique objectives don't need to prioritize ongoing objectives

        return allOngoingObjectives;
      }
    }

    allOngoingObjectives.push(createdObjective);

    return allOngoingObjectives;
  }
  // TODO 2017.04.12 | probably doesn't belong in this class
  protected static replaceObjectives<O extends Objective>(
    allOngoingObjectives: Objective[],
    createdObjectives: O[],
  ): Objective[]
  {
    const resultingObjectives = allOngoingObjectives.filter(objective =>
    {
      return objective.type !== this.type;
    });

    resultingObjectives.push(...createdObjectives);

    return resultingObjectives;
  }

  public abstract execute(
    afterDoneCallback: () => void,
  ): void;
}
