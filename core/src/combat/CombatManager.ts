import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { Battle } from "../battle/Battle";
import { CombatAction } from "./CombatAction";
import { CorePhase } from "./core/coreCombatPhases";



export class CombatManager<Phase extends string = CorePhase>
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
  public addQueuedAction(phaseInfo: CombatPhaseInfo<Phase>, action: CombatAction): void
  {
    // TODO 2020.03.04 | should add to current phase if active, shouldn't it?
    if (!this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key] = [];
    }

    this.queuedActions[phaseInfo.key].push(action);
  }
  public attachAction(child: CombatAction, parent: CombatAction): void
  {
    // TODO 2020.03.04 | same here
    const phase = this.getQueuedActionPhase(parent);
    if (!phase)
    {
      throw new Error("Tried to attach child action to parent that was not part of combat manager queue.");
    }

    const parentIndex = this.queuedActions[phase].indexOf(parent);
    const firstUnConnectedActionIndex = (() =>
    {
      for (let i = parentIndex + 1; i < this.queuedActions[phase].length; i++)
      {
        const action = this.queuedActions[phase][i];
        if (!action.isConnectedToAction(parent))
        {
          return i;
        }
      }

      return this.queuedActions[phase].length;
    })();

    this.queuedActions[phase].splice(firstUnConnectedActionIndex, 0, child);

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
}
