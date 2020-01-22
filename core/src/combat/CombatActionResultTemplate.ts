import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";


export interface CombatActionResultTemplate<T>
{
  key: string;
  defaultValue: T;
  applyResult: (
    value: T,
    source: Unit,
    target: Unit,
    battle: Battle,
  ) => void;
}
