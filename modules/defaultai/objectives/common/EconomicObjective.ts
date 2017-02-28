import {Objective} from "./Objective";
import {ObjectiveFamily} from "./ObjectiveFamily";

import Player from "../../../../src/Player";

export abstract class EconomicObjective extends Objective
{
  public readonly family: ObjectiveFamily.Economic;

  public estimatedCost: number;

  protected player: Player;

  protected constructor(
    priority: number,
    estimatedCost: number,
    player: Player,
  )
  {
    super(priority);
    this.estimatedCost = estimatedCost;
    this.player = player;
  }
}
