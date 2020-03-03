import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatActionListener } from "./CombatActionListener";


export type CombatActionFetcher =
  (battle: Battle, activeUnit: Unit) => CombatAction[];

export type CombatActionListenerFetcher<AllPhases extends string> =
  (battle: Battle, activeUnit: Unit) => CombatActionListener<AllPhases>[];
