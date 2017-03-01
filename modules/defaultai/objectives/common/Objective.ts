import {ObjectiveFamily} from "./ObjectiveFamily";

import {GrandStrategyAI} from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";

import Star from "../../../../src/Star";
import ValuesByStar from "../../../../src/ValuesByStar";
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

  protected static getObjectivesByTargetStar<T extends Objective & {target: Star}>(objectives: T[]): ValuesByStar<T>
  {
    const byStar = new ValuesByStar<T>();

    objectives.forEach(objective =>
    {
      if (byStar.has(objective.target))
      {
        throw new Error(`Duplicate target star ${objective.target.id} for objectives of type ${objective.type}`);
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
