import GrandStrategyAI from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";

import idGenerators from "../../../../src/idGenerators";


export abstract class Objective
{
  // TODO 25.02.2017 | these should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/10603
  public static createObjectives: (mapEvaluator: MapEvaluator) => Objective[];
  /**
   * should return player's current priority for this type of objetive. 0-1
   */
  public static evaluatePriority: (mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI) => number;


  public abstract readonly type: string;
  public readonly id: number;
  /**
   * score relative to other objectives of same type
   */
  public get score(): number
  {
    return this.isOngoing ? this.baseScore * 1.25 : this.baseScore;
  }
  public set score(priority: number)
  {
    this.baseScore = priority;
  }
  public isOngoing: boolean = false; // used to slightly prioritize old objectives

  private baseScore: number;

  constructor(score: number)
  {
    this.id = idGenerators.objective++;
    this.score = score;
  }

  public abstract execute(afterDoneCallback: () => void): void;
}
