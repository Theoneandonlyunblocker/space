import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { Battle } from "../battle/Battle";
import { CombatAction } from "./CombatAction";
import { CorePhase } from "./core/coreCombatPhases";
import { Unit } from "../unit/Unit";
import { CombatActionFetcher, CombatActionListenerFetcher } from "./CombatActionFetcher";
import { TemplateCollection } from "../generic/TemplateCollection";
import { CombatActionListener } from "./CombatActionListener";
import { flatten2dArray } from "../generic/utility";
import { activeModuleData } from "../app/activeModuleData";


export class CombatManager<Phase extends string = CorePhase>
{
  public battle: Battle;
  public get currentPhase(): CombatPhase<Phase>
  {
    return this._currentPhase;
  }

  private _currentPhase: CombatPhase<Phase>;
  private readonly queuedActions:
  {
    [P in Phase]?: CombatAction[];
  } = {};
  private executedActionsInCurrentPhase: CombatAction[] = [];

  constructor()
  {

  }

  public setPhase(phaseInfo: CombatPhaseInfo<Phase>): void
  {
    this._currentPhase = new CombatPhase(phaseInfo, this);
    this.initCurrentPhase();
  }
  // TODO 2021.11.23 | temporary
  public advancePhase(afterActionUse?: (action: CombatAction) => void): void
  {
    while(this.currentPhase.actions.length > 0)
    {
      const action = this.currentPhase.actions[0];

      action.result.apply(
        action.source,
        action.target,
        <any>this,
        action.actionAttachedTo,
      );
      this.executedActionsInCurrentPhase.push(this.currentPhase.actions.shift());

      if (afterActionUse)
      {
        afterActionUse(action);
      }
    }

    this.currentPhase.afterPhaseIsFinished(this);
  }
  public addAction(phaseInfo: CombatPhaseInfo<Phase>, action: CombatAction): void
  {
    if (this.currentPhase && this.currentPhase.template === phaseInfo)
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
    }
    else if (this.executedActionsInCurrentPhase.indexOf(parent) !== -1)
    {
      this.currentPhase.addActionToBack(child);
    }
    else
    {
      const phase = this.getQueuedActionPhase(parent);
      if (!phase)
      {
        throw new Error("Tried to attach child action to parent that was not part of combat manager queue.");
      }

      CombatManager.spliceAttachedAction(child, parent, this.queuedActions[phase]);
    }

    child.actionAttachedTo = parent;
  }
  public clone(clonedUnitsById: {[id: number]: Unit}): CombatManager<Phase>
  {
    const cloned = new CombatManager<Phase>();

    const clonedActionsById: {[id: number]: CombatAction} = {};

    for (const phase in this.queuedActions)
    {
      const actionsForPhase = this.queuedActions[phase];
      cloned.queuedActions[phase] = actionsForPhase.map(action =>
      {
        const clonedAction = action.clone(clonedActionsById, clonedUnitsById);
        clonedActionsById[action.id] = clonedAction;

        return clonedAction;
      });
    }

    cloned._currentPhase = this.currentPhase.clone(cloned, clonedActionsById, clonedUnitsById);

    return cloned;
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
  private fetchCombatActionListeners(
    battle: Battle,
    activeUnit: Unit,
  ): CombatActionListener<Phase>[]
  {
    const relevantFetchers = this.getRelevantFetchersForCurrentPhase(activeModuleData.templates.combatActionListenerFetchers);
    const allListeners = relevantFetchers.map(fetcher => fetcher.fetch(battle, activeUnit));

    return flatten2dArray(allListeners);
  }
  private fetchCombatActions(
    battle: Battle,
    activeUnit: Unit,
  ): CombatAction[]
  {
    const relevantFetchers = this.getRelevantFetchersForCurrentPhase(activeModuleData.templates.combatActionFetchers);
    const allActions = relevantFetchers.map(fetcher => fetcher.fetch(battle, activeUnit));

    return flatten2dArray(allActions);
  }
  private getRelevantFetchersForCurrentPhase<T extends CombatActionFetcher<Phase> | CombatActionListenerFetcher<Phase>>(
    allFetchers: TemplateCollection<T>,
  ): T[]
  {
    return allFetchers.filter(fetcher =>
    {
      return fetcher.phasesToApplyTo.has(this.currentPhase.template);
    });
  }
  private initCurrentPhase(): void
  {
    this.executedActionsInCurrentPhase = [];

    const phaseInfo = this.currentPhase.template;

    if (this.queuedActions[phaseInfo.key])
    {
      this.queuedActions[phaseInfo.key].forEach(queuedAction =>
      {
        this.currentPhase.addActionToBack(queuedAction);
      });

      this.queuedActions[phaseInfo.key] = [];
    }

    // important to do listeners first
    const listenersToAdd = this.fetchCombatActionListeners(this.battle, this.battle.activeUnit);
    listenersToAdd.forEach(listener => this.currentPhase.addActionListener(listener));

    const actionsToAdd = this.fetchCombatActions(this.battle, this.battle.activeUnit);
    actionsToAdd.forEach(action => this.addAction(this.currentPhase.template, action));
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
