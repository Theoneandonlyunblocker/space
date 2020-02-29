import { GetBattleTargetsFN, GetUnitsInAreaFN } from "../abilities/targeting";
import { AbilityTargetDisplayDataById } from "../abilities/AbilityTargetDisplayData";
import { BattleVfxTemplate } from "./BattleVfxTemplate";
import { Unit } from "../unit/Unit";
import { CombatManager } from "../combat/CombatManager";
import { CorePhase } from "../combat/core/coreCombatPhases";
import { AbilityBase } from "./AbilityBase";


export interface CombatAbilityTemplate<Phase extends string = CorePhase> extends AbilityBase
{
  key: string;
  displayName: string;
  description: string;
  moveDelay: number;
  actionsUse: number;

  getPossibleTargets: GetBattleTargetsFN;
  getDisplayDataForTarget: GetUnitsInAreaFN<AbilityTargetDisplayDataById>;
  use: (user: Unit, target: Unit, combatManager: CombatManager<Phase>) => void;

  // should eventually rework vfx system to defer vfx to actions & action results
  vfx: BattleVfxTemplate;

  // can be done using actions possibly
  targetCannotBeDiverted?: boolean;

  preparation?:
  {
    turnsToPrep: number;
    interruptsNeeded: number;
    /**
     * Delay added for each turn spent preparing. including final turn when ability is executed
     * moveDelay is used when preparation is complete and effects are executed
     */
    prepDelay: number;
  };

  /**
   * how likely the AI will consider using this ability relative to other available abilities
   * doesn't affect AI's final decision on which ability to use, but can guide it in the right direction
   * @default 1
   */
  AiEvaluationPriority?: number;
  /**
   * prevent from being used in AI vs AI battles.
   * helps when simulation depth is too low to let AiEvaluationPriority kick in
   */
  disableInAiBattles?: boolean;
  /**
   * adjusts the final score of this ability. AI picks move with highest score
   * used to penalize moves that might be optimal but boring (e.g. skip turn) or otherwise unpleasant for the player
   * @default 1
   */
  AiScoreMultiplier?: number;
}
