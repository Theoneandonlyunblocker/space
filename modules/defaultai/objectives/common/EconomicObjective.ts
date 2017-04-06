import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

export abstract class EconomicObjective extends Objective
{
  public static readonly family = ObjectiveFamily.Economic;
  public readonly family = ObjectiveFamily.Economic;

  protected constructor(
    priority: number,
  )
  {
    super(priority);
  }
}
