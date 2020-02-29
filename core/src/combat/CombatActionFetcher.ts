import { CombatAction } from "./CombatAction";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";
import { CombatActionListener } from "./CombatActionListener";


export type CombatActionFetcher =
  (activeUnit: Unit, battle: Battle) => CombatAction[];

export type CombatActionListenerFetcher<AllPhases extends string> =
  (activeUnit: Unit, battle: Battle) => CombatActionListener<AllPhases>[];
