import GrandStrategyAI from "../../mapai/GrandStrategyAI";
import MapEvaluator from "../../mapai/MapEvaluator";
import ObjectivesAI from "../../mapai/ObjectivesAI";

import idGenerators from "../../../../src/idGenerators";


export abstract class Objective
{
  public static createObjectives: (
    grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator,
  ) => Objective[];

  public abstract type: string;
  public id: number;
  public get priority(): number
  {
    return this.isOngoing ? this.basePriority * 1.25 : this.basePriority;
  }
  public set priority(priority: number)
  {
    this.basePriority = priority;
  }
  public isOngoing: boolean = false; // used to slightly prioritize old objectives

  private basePriority: number;

  constructor(priority: number)
  {
    this.id = idGenerators.objective++;
    this.priority = priority;
  }

  public abstract execute(afterDoneCallback: () => void): void;
}
