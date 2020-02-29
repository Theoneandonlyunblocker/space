import { CombatAction } from "./CombatAction";
import { CombatManager } from "./CombatManager";


export interface CombatActionListener<AllPhases extends string>
{
  key: string;

  /**
   * f.ex removeAllGuardOnAbilityUse IF flags.abilityUse
   */
  // TODO 2020.02.29 | rename flagsWhichTrigger
  flagsToListenTo?: string[];

  /**
   * f.ex DO NOT removeAllGuardFromUser IF flags.preserveUserGuard
   * will override flagsToListenTo
   */
  flagsWhichPrevent?: string[];
  onAdd?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
  onRemove?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
}
