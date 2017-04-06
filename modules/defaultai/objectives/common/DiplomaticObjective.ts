import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

import DiplomacyStatus from "../../../../src/DiplomacyStatus";

export abstract class DiplomaticObjective extends Objective
{
  public static readonly family = ObjectiveFamily.Diplomatic;
  public readonly family = ObjectiveFamily.Diplomatic;

  protected readonly diplomacyStatus: DiplomacyStatus;

  protected constructor(
    priority: number,
  )
  {
    super(priority);
  }
}
