import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatManager } from "./CombatManager";
import { CombatPhase } from "./CombatPhase";


export interface CombatActionListener
{
  flagsToListenTo: string[];
  onAdd?: (action: CombatAction, combatPhase: CombatPhase) => void;
  onRemove?: (action: CombatAction, combatPhase: CombatPhase) => void;
}

// probably needs other params too
export type PhaseFinishCallback = (combatManager: CombatManager) => void;

export type CombatListenerFetcher = (activeUnit: Unit, battle: Battle) => CombatActionListener[];
export type CombatActionFetcher = (activeUnit: Unit, battle: Battle) => CombatAction[];

export interface CombatPhaseInfo
{
  name: string;

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
    [key: string]: CombatListenerFetcher;
  };
}
