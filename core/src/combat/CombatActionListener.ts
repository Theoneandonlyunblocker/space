import { CombatAction } from "./CombatAction";
import { CombatManager } from "./CombatManager";


export interface CombatActionListener<AllPhases extends string>
{
  key: string;
  flagsToListenTo: string[];
  onAdd?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
  onRemove?: (action: CombatAction, combatManager: CombatManager<AllPhases>) => void;
}
