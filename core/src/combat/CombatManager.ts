import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { Battle } from "../battle/Battle";
import { CombatAction } from "./CombatAction";



export class CombatManager<Phase extends string>
{
  public currentPhase: CombatPhase<Phase>;
  public readonly battle: Battle;

  private readonly allCombatPhases: {[P in Phase]: CombatPhaseInfo<Phase>};
  private readonly queuedActions:
  {
    [P in Phase]?: CombatAction[];
  } = {};

  constructor(allCombatPhases: {[P in Phase]: CombatPhaseInfo<Phase>})
  {
    this.allCombatPhases = allCombatPhases;
  }

  public setPhase(phase: Phase): void
  {
    this.currentPhase = new CombatPhase(this.allCombatPhases[phase], this);
    if (this.queuedActions[phase])
    {
      this.queuedActions[phase].forEach(queuedAction =>
      {
        this.currentPhase.addActionToBack(queuedAction);
      });

      this.queuedActions[phase] = [];
    }
  }
  public addQueuedAction(action: CombatAction, phaseInfo: CombatPhaseInfo<Phase>): void
  {
    if (!this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key] = [];
    }

    this.queuedActions[phaseInfo.key].push(action);
  }
}
