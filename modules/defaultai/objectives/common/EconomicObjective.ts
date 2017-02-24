import {Objective} from "./Objective";

import Star from "../../../../src/Star";

export abstract class EconomicObjective extends Objective
{
  public target: Star;
  public estimatedCost: number;

  constructor(priority: number, target: Star, estimatedCost: number)
  {
    super(priority);
    this.target = target;
    this.estimatedCost = estimatedCost;
  }

  public abstract execute(afterDoneCallback: () => void): void;
}
