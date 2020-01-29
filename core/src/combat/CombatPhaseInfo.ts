import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatManager } from "./CombatManager";


export interface CombatActionListener<AllPhases extends string>
{
  key: string;
  flagsToListenTo: string[];
  onAdd?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
  onRemove?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
}

// probably needs other params too
export type PhaseFinishCallback<AllPhases extends string> =
  (combatManager: CombatManager<AllPhases>) => void;

export type CombatActionListenerFetcher<AllPhases extends string> =
  (activeUnit: Unit, battle: Battle) => CombatActionListener<AllPhases>[];
export type CombatActionFetcher =
  (activeUnit: Unit, battle: Battle) => CombatAction[];

export interface CombatPhaseInfo<AllPhases extends string>
{
  key: string;

  /**
   * used for controlling control flow of combat
   */
  defaultPhaseFinishCallback: PhaseFinishCallback<AllPhases>;

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
    [key: string]: CombatActionListenerFetcher<AllPhases>;
  };
}
