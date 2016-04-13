import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

declare interface QueuedActionData
{
  ability: AbilityTemplate;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}

export default QueuedActionData;
