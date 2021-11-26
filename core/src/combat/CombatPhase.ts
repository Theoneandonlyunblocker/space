import { CombatAction } from "./CombatAction";
import { CombatPhaseInfo } from "./CombatPhaseInfo";
import { CombatManager } from "./CombatManager";
import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";
import { Unit } from "../unit/Unit";
import {  CombatActionListenerWithSource, UnitAttachedCombatActionListener } from "./CombatActionListener";
import { UnitBattleSide, unitBattleSides } from "../unit/UnitBattleSide";
import { Battle } from "../battle/Battle";



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
  public clone(
    combatManager: CombatManager<AllPhases>,
    allClonedActionsById: {[id: number]: CombatAction},
    clonedUnitsById: {[id: number]: Unit},
  ): CombatPhase<AllPhases>
  {
    const cloned = new CombatPhase<AllPhases>(this.template, combatManager);

    this.actions.forEach(action =>
    {
      cloned.actions.push(action.clone(allClonedActionsById, clonedUnitsById));
    });

    return cloned;
  }


  private getUnitAttachedListeners(): CombatActionListenerWithSource<AllPhases, Unit>[]
  {
    const battle = this.combatManager.battle;
    const allListeners: CombatActionListenerWithSource<AllPhases, Unit>[] = [];

    battle.forEachUnit(unit =>
    {
      const listenersForUnit = <UnitAttachedCombatActionListener<AllPhases>[]><unknown>
        unit.battleStats.combatEffects.getActionListeners();

      allListeners.push(...listenersForUnit.map(listener =>
      {
        return {
          source: unit,
          listener: listener,
        };
      }));
    });

    return allListeners;
  }
  private getBattleWideListeners(): CombatActionListenerWithSource<AllPhases, Battle<AllPhases>>[]
  {
    const battle = this.combatManager.battle;

    return battle.actionListeners.battleWide.map(listener =>
    {
      return {
        source: battle,
        listener: listener,
      };
    });
  }
  private getSideAttachedUnitListeners(): CombatActionListenerWithSource<AllPhases, UnitBattleSide>[]
  {
    const battle = this.combatManager.battle;
    const allListeners: CombatActionListenerWithSource<AllPhases, UnitBattleSide>[] = [];

    unitBattleSides.forEach(side =>
    {
      const listenersForSide = battle.actionListeners.bySide[side];

      allListeners.push(...listenersForSide.map(listener =>
      {
        return {
          source: side,
          listener: listener,
        };
      }));
    });

    return allListeners;
  }
  private getAllUnitListeners(): CombatActionListenerWithSource<AllPhases, any>[]
  {
    return [
      ...this.getUnitAttachedListeners(),
      ...this.getSideAttachedUnitListeners(),
      ...this.getBattleWideListeners(),
    ];
  }
  private getListenersToTriggerForAction(action: CombatAction): CombatActionListenerWithSource<AllPhases, any>[]
  {
    const actionFlags = action.getFlags();
    const allListeners = this.getAllUnitListeners();

    const listenersWithRightFlags = allListeners.filter(listenerWithSource =>
    {
      const listener = listenerWithSource.listener;

      const hasTriggeringFlag = listener.flagsWhichTrigger.some(flag => actionFlags.has(flag));
      if (hasTriggeringFlag)
      {
        const isPrevented = listener.flagsWhichPrevent?.some(flag => actionFlags.has(flag));
        if (!isPrevented)
        {
          return true;
        }
      }

      return false;
    });

    const listenersThatShouldActivate = listenersWithRightFlags.filter(listenerWithSource =>
    {
      if (!listenerWithSource.listener.shouldActivate)
      {
        return true;
      }

      return listenerWithSource.listener.shouldActivate(action, listenerWithSource.source);
    });

    return listenersThatShouldActivate;
  }
  private triggerActionListeners(action: CombatAction, event: "onAdd" | "onRemove"): void
  {
    const listenersToTrigger = this.getListenersToTriggerForAction(action);

    listenersToTrigger.forEach(listenerWithSource =>
    {
      const listener = listenerWithSource.listener;
      switch (event)
      {
        case "onAdd":
        {
          if (listener.onAdd)
          {
            listener.onAdd(action, this.combatManager, listenerWithSource.source);
          }
          break;
        }
        case "onRemove":
        {
          if (listener.onRemove)
          {
            listener.onRemove(action, this.combatManager, listenerWithSource.source);
          }
          break;
        }
      }
    });
  }
}
