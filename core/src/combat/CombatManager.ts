import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { Battle } from "../battle/Battle";
import { CombatAction } from "./CombatAction";
import { CorePhase } from "./core/coreCombatPhases";



export class CombatManager<Phase extends string = CorePhase>
{
  public currentPhase: CombatPhase<Phase>;
  public readonly battle: Battle;

  private readonly queuedActions:
  {
    [P in Phase]?: CombatAction[];
  } = {};

  constructor()
  {

  }

  public setPhase(phaseInfo: CombatPhaseInfo<Phase>): void
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
  public addQueuedAction(phaseInfo: CombatPhaseInfo<Phase>, action: CombatAction): void
  {
    if (this.currentPhase.template === phaseInfo)
    {
      this.currentPhase.addActionToBack(action);

      return;
    }

    if (!this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key] = [];
    }

    this.queuedActions[phaseInfo.key].push(action);
  }
  public attachAction(child: CombatAction, parent: CombatAction): void
  {
    if (this.currentPhase.hasAction(parent))
    {
      CombatManager.spliceAttachedAction(child, parent, this.currentPhase.actions);

      return;
    }

    const phase = this.getQueuedActionPhase(parent);
    if (!phase)
    {
      throw new Error("Tried to attach child action to parent that was not part of combat manager queue.");
    }

    CombatManager.spliceAttachedAction(child, parent, this.queuedActions[phase]);
    child.actionAttachedTo = parent;
  }

  private getQueuedActionPhase(action: CombatAction): Phase | null
  {
    for (const phase in this.queuedActions)
    {
      const index = this.queuedActions[phase].indexOf(action);
      if (index !== -1)
      {
        return phase;
      }
    }

    return null;
  }

  private static spliceAttachedAction(child: CombatAction, parent: CombatAction, actions: CombatAction[]): void
  {
    const parentIndex = actions.indexOf(parent);

    const firstUnConnectedActionIndex = (() =>
    {
      for (let i = parentIndex + 1; i < actions.length; i++)
      {
        const action = actions[i];
        if (!action.isConnectedToAction(parent))
        {
          return i;
        }
      }

      return actions.length;
    })();

    actions.splice(firstUnConnectedActionIndex, 0, child);
  }
}
