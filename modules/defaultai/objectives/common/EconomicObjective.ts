import {Objective} from "./Objective";

import Player from "../../../../src/Player";

export abstract class EconomicObjective extends Objective
{
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
