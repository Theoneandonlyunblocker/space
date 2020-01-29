import { CombatAction } from "./CombatAction";
import { PhaseFinishCallback, CombatActionListener, CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatManager } from "./CombatManager";


export class CombatPhase
{
  public readonly name: string;
  /**
   * do not manipulate directly. use methods on CombatActionListener instead.
   */
  public readonly actions: CombatAction[] = [];
  public afterPhaseIsFinished: PhaseFinishCallback;

  private readonly combatManager: CombatManager;
  private readonly actionListenersByFlag:
  {
    [flag: string]:
    {
      onAdd: CombatActionListener["onAdd"][];
      onRemove: CombatActionListener["onRemove"][];
    };
  } = {};

  constructor(
    info: CombatPhaseInfo,
    manager: CombatManager,
  )
  {
    this.combatManager = manager;
    // TODO 2020.01.28 | implement

  }

  public addActionToFront(action: CombatAction): void
  {
    this.actions.unshift(action);
    this.triggerActionListeners(action, "onAdd");
  }
  public addActionToBack(action: CombatAction): void
  {
    this.actions.push(action);
    this.triggerActionListeners(action, "onAdd");
  }
  public removeAction(action: CombatAction): void
  {
    const index = this.actions.indexOf(action);
    if (index === -1)
    {
      throw new Error(`Tried to remove nonexistent combat action from combat phase.`);
    }

    this.actions.splice(index, 1);
    this.triggerActionListeners(action, "onRemove");
  }
  public addActionListener(listener: CombatActionListener): void
  {
    listener.flagsToListenTo.forEach(flag =>
    {
      if (!this.actionListenersByFlag[flag])
      {
        this.actionListenersByFlag[flag] =
        {
          onAdd: [],
          onRemove: [],
        };
      }

      if (listener.onAdd)
      {
        this.actionListenersByFlag[flag].onAdd.push(listener.onAdd);
      }
      if (listener.onRemove)
      {
        this.actionListenersByFlag[flag].onRemove.push(listener.onRemove);
      }
    });
  }

  private triggerActionListeners(action: CombatAction, type: "onAdd" | "onRemove"): void
  {
    if (action.mainAction.flags)
    {
      action.mainAction.flags.forEach(flag =>
      {
        if (this.actionListenersByFlag[flag])
        {
          this.actionListenersByFlag[flag][type].forEach(listener =>
          {
            listener(action, this.combatManager);
          });
        }
      });
    }
  }
}
