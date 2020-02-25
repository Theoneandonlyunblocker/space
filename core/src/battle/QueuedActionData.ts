import { CombatAbilityTemplate } from "../templateinterfaces/CombatAbilityTemplate";


export interface QueuedActionData
{
  ability: CombatAbilityTemplate;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}
