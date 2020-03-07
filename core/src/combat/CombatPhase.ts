import { CombatAction } from "./CombatAction";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatManager } from "./CombatManager";
import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";
import { CombatActionListener } from "./CombatActionListener";
import { CombatActionListenerFetcher, CombatActionFetcher } from "./CombatActionFetcher";
import { Battle } from "../battle/Battle";
import { Unit } from "../unit/Unit";
import { activeModuleData } from "../app/activeModuleData";
import { TemplateCollection } from "../templateinterfaces/TemplateCollection";
import { flatten2dArray } from "../generic/utility";


type ActionListenersByFlag<AllPhases extends string> =
{
  [flag: string]:
  {
    [listenerKey: string]: CombatActionListener<AllPhases>;
  };
};

export class CombatPhase<AllPhases extends string>
{
  public readonly template: CombatPhaseInfo<AllPhases>;
  /**
   * do not manipulate directly
   */
  public readonly actions: CombatAction[] = [];
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

    const battle = combatManager.battle;
    const activeUnit = battle.activeUnit;

    const combatActionListeners = this.fetchCombatActionListeners(battle, activeUnit);
    combatActionListeners.forEach(listener => this.addActionListener(listener));

    const combatActionsToAdd = this.fetchCombatActions(battle, activeUnit);
    combatActionsToAdd.forEach(action => combatManager.addQueuedAction(this.template, action));
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
    if (listener.flagsWhichTrigger)
    {
      listener.flagsWhichTrigger.forEach(flag =>
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
  private getRelevantFetchers<T extends CombatActionFetcher<AllPhases> | CombatActionListenerFetcher<AllPhases>>(
    fetchersByKey: TemplateCollection<T>,
  ): T[]
  {
    const fetchers = Object.keys(fetchersByKey).map(key => fetchersByKey[key]);
    const relevantFetchers = fetchers.filter(fetcher =>
    {
      fetcher.phasesToApplyTo.has(this.template);
    });

    return relevantFetchers;
  }
  private fetchCombatActionListeners(
    battle: Battle,
    activeUnit: Unit,
  ): CombatActionListener<AllPhases>[]
  {
    const relevantFetchers = this.getRelevantFetchers(activeModuleData.templates.combatActionListenerFetchers);
    const allListeners = relevantFetchers.map(fetcher => fetcher.fetch(battle, activeUnit));

    return flatten2dArray(allListeners);
  }
  private fetchCombatActions(
    battle: Battle,
    activeUnit: Unit,
  ): CombatAction[]
  {
    const relevantFetchers = this.getRelevantFetchers(activeModuleData.templates.combatActionFetchers);
    const allActions = relevantFetchers.map(fetcher => fetcher.fetch(battle, activeUnit));

    return flatten2dArray(allActions);
  }
}
