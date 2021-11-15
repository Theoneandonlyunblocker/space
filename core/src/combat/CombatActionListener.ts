import { CombatAction } from "./CombatAction";
import { CombatManager } from "./CombatManager";


export type CombatActionListener<AllPhases extends string> =
{
  key: string;

  /**
   * f.ex removeAllGuardOnAbilityUse IF flags.abilityUse
   */
  flagsWhichTrigger: string[];

  /**
   * f.ex DO NOT removeAllGuardFromUser IF flags.preserveUserGuard
   * will override flagsWhichTrigger
   */
  flagsWhichPrevent?: string[];
} &
(
  {onAdd: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void} |
  {onRemove: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void}
);
