import {ObjectiveCreatorTemplate} from "./ObjectiveCreatorTemplate";
import {ObjectiveFamily} from "./ObjectiveFamily";

import {GrandStrategyAI} from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";

import {IDDictionary} from "../../../../src/IDDictionary";
import idGenerators from "../../../../src/idGenerators";


export abstract class Objective
{
  // TODO 25.02.2017 | these should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/10603
  public static getObjectives: (mapEvaluator: MapEvaluator, currentObjectives: Objective[]) => Objective[];
  /**
   * should return player's current priority for this type of objetive. 0-1
   */
  public static evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI) => number;

  // TODO 28.02.2017 | family and type might be a bit confusingly named here
  // type is used like this for templates, so it's used here as well at least for now
  public abstract readonly type: string;
  public abstract readonly family: ObjectiveFamily;
  public readonly id: number;
  /**
   * score relative to other objectives of same type
   */
  public get score(): number
  {
    return this.isOngoing ? this.baseScore * this.ongoingMultiplier : this.baseScore;
  }
  public set score(priority: number)
  {
    this.baseScore = priority;
  }
  public isOngoing: boolean = false; // used to slightly prioritize old objectives

  protected readonly ongoingMultiplier: number = 1.25;

  private baseScore: number;

  protected constructor(score: number)
  {
    this.id = idGenerators.objective++;
    this.score = score;
  }

  public static makeCreatorTemplate(): ObjectiveCreatorTemplate
  {
    return(
    {
      type: this.prototype.type,
      family: this.prototype.family,
      getObjectives: this.getObjectives.bind(this),
      evaluatePriority: this.evaluatePriority.bind(this),
    });
  }

  protected static getObjectivesByTarget<O extends Objective & {target: T}, T extends {id: number}>(objectives: O[]): IDDictionary<T, O>
  {
    const byStar = new IDDictionary<T, O>();

    objectives.forEach(objective =>
    {
      if (byStar.has(objective.target))
      {
        throw new Error(`Duplicate target star '${objective.target.id}' for objectives of type '${objective.type}'`);
      }
      else
      {
        byStar.set(objective.target, objective);
      }
    });

    return byStar;
  }

  public abstract execute(afterDoneCallback: () => void): void;
}
