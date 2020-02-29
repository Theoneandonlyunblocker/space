import { CombatAction } from "./CombatAction";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatManager } from "./CombatManager";
import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";
import { CombatActionListener } from "./CombatActionListener";


type ActionListenersByFlag<AllPhases extends string> =
{
  [flag: string]:
  {
    [listenerKey: string]: CombatActionListener<AllPhases>;
  };
};

export class CombatPhase<AllPhases extends string>
{
  public readonly name: string;
  /**
   * do not manipulate directly. use methods on CombatActionListener instead.
   */
  public readonly actions: CombatAction[] = [];
  public afterPhaseIsFinished: CombatPhaseFinishCallback<AllPhases>;

  private readonly combatManager: CombatManager<AllPhases>;
  private readonly actionListenersByTriggeringFlag: ActionListenersByFlag<AllPhases> = {};

  constructor(
    info: CombatPhaseInfo<AllPhases>,
    manager: CombatManager<AllPhases>,
  )
  {
    this.combatManager = manager;
    // TODO 2020.01.29 | implement
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
  public addActionListener(listener: CombatActionListener<AllPhases>): void
  {
    if (listener.flagsToListenTo)
    {
      listener.flagsToListenTo.forEach(flag =>
      {
        if (!this.actionListenersByTriggeringFlag[flag])
        {
          this.actionListenersByTriggeringFlag[flag] = {};
        }

        this.actionListenersByTriggeringFlag[flag][listener.key] = listener;
      });
    }
  }

  private triggerActionListeners(action: CombatAction, event: "onAdd" | "onRemove"): void
  {
    if (action.mainAction.flags)
    {
      action.mainAction.flags.forEach(flag =>
      {
        if (this.actionListenersByTriggeringFlag[flag])
        {
          Object.keys(this.actionListenersByTriggeringFlag[flag]).forEach(listenerKey =>
          {
            const listener = this.actionListenersByTriggeringFlag[flag][listenerKey];

            const isPrevented = listener.flagsWhichPrevent && listener.flagsWhichPrevent.some(preventingFlag =>
            {
              return action.mainAction.flags.has(preventingFlag);
            });

            if (!isPrevented && listener[event])
            {
              listener[event](action, this.combatManager);
            }
          });
        }
      });
    }
  }
}
