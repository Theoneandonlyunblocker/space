import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatAction } from "./CombatAction";



export class CombatManager
{
  public currentPhase: CombatPhase;

  private readonly queuedActions:
  {
    [phaseKey: string]: CombatAction[];
  } = {};

  constructor()
  {

  }

  public setPhase(phaseInfo: CombatPhaseInfo): void
  {
    this.currentPhase = new CombatPhase(phaseInfo, this);
    if (this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key].forEach(queuedAction =>
      {
        this.currentPhase.addActionToBack(queuedAction);
      });

      this.queuedActions[phaseInfo.key] = [];
    }
  }
  public addQueuedAction(action: CombatAction, phaseInfo: CombatPhaseInfo): void
  {
    if (!this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key] = [];
    }

    this.queuedActions[phaseInfo.key].push(action);
  }
}
