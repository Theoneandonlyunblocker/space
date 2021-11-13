import { CombatAction } from "./CombatAction";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatManager } from "./CombatManager";
import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";
import { CombatActionListener } from "./CombatActionListener";


type ActionListenersByFlag<AllPhases extends string> =
{
  [flag: string]: CombatActionListener<AllPhases>[];
};

export class CombatPhase<AllPhases extends string>
{
  public readonly template: CombatPhaseInfo<AllPhases>;
  /**
   * do not manipulate directly, use methods in CombatManager instead
   */
  public readonly actions: CombatAction[] = [];
  // TODO 2021.11.07 | never called
  public afterPhaseIsFinished: CombatPhaseFinishCallback<AllPhases>;

  private readonly combatManager: CombatManager<AllPhases>;
  private readonly actionListenersByTriggeringFlag: ActionListenersByFlag<AllPhases> = {};

  constructor(
    template: CombatPhaseInfo<AllPhases>,
    combatManager: CombatManager<AllPhases>,
  )
  {
    this.template = template;
    this.combatManager = combatManager;

    this.afterPhaseIsFinished = template.defaultPhaseFinishCallback;
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
  public hasAction(action: CombatAction): boolean
  {
    return this.actions.indexOf(action) !== -1;
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
    listener.flagsWhichTrigger.forEach(flag =>
    {
      if (!this.actionListenersByTriggeringFlag[flag])
      {
        this.actionListenersByTriggeringFlag[flag] = [];
      }

      this.actionListenersByTriggeringFlag[flag].push(listener);
    });
  }
  public hasListenerWithKey(key: string): boolean
  {
    return Object.keys(this.actionListenersByTriggeringFlag).some(flag =>
    {
      const listenersForFlag = this.actionListenersByTriggeringFlag[flag];

      return listenersForFlag.some(listener => listener.key === key);
    });
  }

  private triggerActionListeners(action: CombatAction, event: "onAdd" | "onRemove"): void
  {
    const allFlags = action.getFlags();

    allFlags.forEach(flag =>
    {
      if (this.actionListenersByTriggeringFlag[flag])
      {
        this.actionListenersByTriggeringFlag[flag].forEach(listener =>
        {
          const isPrevented = listener.flagsWhichPrevent && listener.flagsWhichPrevent.some(preventingFlag =>
          {
            return allFlags.has(preventingFlag);
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
