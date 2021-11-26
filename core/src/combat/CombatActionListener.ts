import { Battle } from "../battle/Battle";
import { Unit } from "../unit/Unit";
import { UnitBattleSide } from "../unit/UnitBattleSide";
import { CombatAction } from "./CombatAction";
import { CombatManager } from "./CombatManager";
import { CombatPhaseInfo } from "./CombatPhaseInfo";


type CombatActionListener<AllPhases extends string, Source> =
{
  key: string;
  phasesToApplyTo: Set<CombatPhaseInfo<AllPhases>>;

  /**
   * f.ex removeAllGuardOnAbilityUse IF flags.abilityUse
   */
  flagsWhichTrigger: string[];

  /**
   * f.ex DO NOT removeAllGuardFromUser IF flags.preserveUserGuard
   * will override flagsWhichTrigger
   */
  flagsWhichPrevent?: string[];

  /**
   * checked after flags
   * default: () => true
   */
  shouldActivate?: (action: CombatAction, listenerSource: Source) => boolean;
  onAdd?: (action: CombatAction, combatManager: CombatManager<AllPhases>, listenerSource: Source) => void;
  onRemove?: (action: CombatAction, combatManager: CombatManager<AllPhases>, listenerSource: Source) => void;
};

export type UnitAttachedCombatActionListener<AllPhases extends string> =
  CombatActionListener<AllPhases, Unit>;

export type BattleWideCombatActionListener<AllPhases extends string> =
  CombatActionListener<AllPhases, Battle<AllPhases>>;

export type SideAttachedCombatActionListener<AllPhases extends string> =
  CombatActionListener<AllPhases, UnitBattleSide>;

export type CombatActionListenerWithSource<AllPhases extends string, Source> =
{
  listener: CombatActionListener<AllPhases, Source>;
  source: Source;
};
