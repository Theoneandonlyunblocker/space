import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";

export interface QueuedActionData
{
  ability: AbilityTemplate;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}
