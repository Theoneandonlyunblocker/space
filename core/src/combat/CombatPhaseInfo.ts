import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatManager } from "./CombatManager";


export interface CombatActionListener
{
  flagsToListenTo: string[];
  onAdd?: (action: CombatAction, combatManager: CombatManager) => void;
  onRemove?: (action: CombatAction, combatManager: CombatManager) => void;
}

// probably needs other params too
export type PhaseFinishCallback = (combatManager: CombatManager) => void;

export type CombatActionListenerFetcher = (activeUnit: Unit, battle: Battle) => CombatActionListener[];
export type CombatActionFetcher = (activeUnit: Unit, battle: Battle) => CombatAction[];

export interface CombatPhaseInfo
{
  key: string;

  /**
   * used for controlling control flow of combat
   */
  defaultPhaseFinishCallback: PhaseFinishCallback;

  /**
   * f.ex would fetch poisonDamage action if unit has poisoned status effect
   * also do getDefaultBeforeUseEffects and stuff here
   */
  combatActionFetchers:
  {
    [key: string]: CombatActionFetcher;
  };

  /**
   * f.ex would fetch poison damage reduction modifier if unit had an item with poison resist equipped
   */
  combatListenerFetchers:
  {
    [key: string]: CombatActionListenerFetcher;
  };
}
