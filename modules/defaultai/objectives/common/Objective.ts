import MapEvaluator from "../../mapai/MapEvaluator";

import idGenerators from "../../../../src/idGenerators";


export abstract class Objective
{
  // TODO 25.02.2017 | should be abstract static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/10603
  public static createObjectives: (mapEvaluator: MapEvaluator) => Objective[];

  public abstract type: string;
  public id: number;
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
