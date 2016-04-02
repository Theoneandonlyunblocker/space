import AbilityTemplate from "./templateinterfaces/AbilityTemplate.d.ts";

declare interface QueuedActionData
{
  ability: AbilityTemplate;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}

export default QueuedActionData;
