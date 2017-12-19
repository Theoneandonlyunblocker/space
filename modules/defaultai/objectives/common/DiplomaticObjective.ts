import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

import PlayerDiplomacy from "../../../../src/PlayerDiplomacy";

export abstract class DiplomaticObjective extends Objective
{
  public static readonly family = ObjectiveFamily.Diplomatic;
  public readonly family = ObjectiveFamily.Diplomatic;

  protected readonly playerDiplomacy: PlayerDiplomacy;

  protected constructor(
    priority: number,
    playerDiplomacy: PlayerDiplomacy,
  )
  {
    super(priority);
    this.playerDiplomacy = playerDiplomacy;
  }
}
