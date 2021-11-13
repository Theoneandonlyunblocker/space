import { TemplateCollection } from "core/src/generic/TemplateCollection";
import { CombatActionFetcher, CombatActionListenerFetcher } from "core/src/combat/CombatActionFetcher";
import { actionFetchers, actionListenerFetchers, makeDummyCombatAction, makeDummyUnit } from "./templates";

jest.doMock("core/src/app/activeModuleData", () =>
{
  return {
    activeModuleData:
    {
      templates:
      {
        combatActionFetchers: new TemplateCollection<CombatActionFetcher>("mock"),
        combatActionListenerFetchers: new TemplateCollection<CombatActionListenerFetcher>("mock"),
      }
    }
  };
});

import { CombatManager } from "core/src/combat/CombatManager";
import { mainPhase } from "core/src/combat/core/phases/mainPhase";
import { afterMainPhase } from "core/src/combat/core/phases/afterMainPhase";
import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { UnitBattleSide } from "core/src/unit/UnitBattleSide";
import { Battle } from "core/src/battle/Battle";
import { activeModuleData } from "core/src/app/activeModuleData";
import { battleStartPhase } from "core/src/combat/core/phases/battleStartPhase";


describe("CombatManager", () =>
{
  let manager: CombatManager;
  let sourceUnit: Unit;
  let targetUnit: Unit;

  function makeMockBattle()
  {
    return <Battle><Partial<Battle>>{
      activeUnit: sourceUnit,
      getUnitsForSide: (side: UnitBattleSide) =>
      {
        const units =
        {
          side1: [sourceUnit],
          side2: [targetUnit],
        };

        return units[side];
      }
    };
  }

  beforeEach(() =>
  {
    sourceUnit = makeDummyUnit();
    sourceUnit.id = 0;
    targetUnit = makeDummyUnit();
    targetUnit.id = 1;

    manager = new CombatManager();
    manager.battle = makeMockBattle();
    manager.setPhase(mainPhase);
  });

  describe("addQueuedAction", () =>
  {
    it("can queue actions for an inactive phase", () =>
    {
      const action = makeDummyCombatAction(sourceUnit, targetUnit);
      manager.addQueuedAction(afterMainPhase, action);

      expect(manager.currentPhase.hasAction(action)).toBe(false);

      manager.setPhase(afterMainPhase);
      expect(manager.currentPhase.hasAction(action)).toBe(true);
    });
    it("adds actions into current phase", () =>
    {
      const action = makeDummyCombatAction(sourceUnit, targetUnit);
      manager.addQueuedAction(mainPhase, action);

      expect(manager.currentPhase.hasAction(action)).toBe(true);
    });
  });
  describe("setPhase", () =>
  {
    it("adds queued actions to new phase", () =>
    {
      const action = makeDummyCombatAction(sourceUnit, targetUnit);
      manager.addQueuedAction(afterMainPhase, action);
      manager.setPhase(afterMainPhase);

      expect(manager.currentPhase.hasAction(action)).toBe(true);
    });
  });
  describe("attachAction", () =>
  {
    let parent: CombatAction;
    let child: CombatAction;

    beforeEach(() =>
    {
      parent = makeDummyCombatAction(sourceUnit, targetUnit);
      child = makeDummyCombatAction(sourceUnit, targetUnit);
    });
    it("adds action to current phase", () =>
    {
      manager.addQueuedAction(mainPhase, parent);
      manager.attachAction(child, parent);

      expect(manager.currentPhase.hasAction(child)).toBe(true);
    });
    it("adds action to different phase", () =>
    {
      manager.addQueuedAction(afterMainPhase, parent);
      manager.attachAction(child, parent);
      manager.setPhase(afterMainPhase);

      expect(manager.currentPhase.hasAction(child)).toBe(true);
    });
    it("sets child.actionAttachedTo to be parent action", () =>
    {
      manager.addQueuedAction(mainPhase, parent);
      manager.attachAction(child, parent);

      expect(child.actionAttachedTo).toBe(parent);
    });
    it("throws when parent is not part of combatManager", () =>
    {
      expect(() =>
      {
        manager.attachAction(child, parent);
      }).toThrow();
    });
  });
  describe("clone", () =>
  {
    let original: CombatManager;
    let clone: CombatManager;

    let parentAction: CombatAction;
    let childAction: CombatAction;
    let queuedParentAction: CombatAction;
    let queuedChildAction: CombatAction;

    beforeEach(() =>
    {
      original = manager;

      parentAction = makeDummyCombatAction(sourceUnit, targetUnit);
      childAction = makeDummyCombatAction(sourceUnit, targetUnit);
      original.addQueuedAction(mainPhase, parentAction);
      original.attachAction(childAction, parentAction);

      queuedParentAction = makeDummyCombatAction(sourceUnit, targetUnit);
      queuedChildAction = makeDummyCombatAction(sourceUnit, targetUnit);
      original.addQueuedAction(afterMainPhase, queuedParentAction);
      original.attachAction(queuedChildAction, queuedParentAction);

      clone = original.clone({[sourceUnit.id]: sourceUnit, [targetUnit.id]: targetUnit});
      clone.battle = makeMockBattle();
    });
    describe("current phase", () =>
    {
      it("is recreated", () =>
      {
        expect(original.currentPhase).not.toBe(clone.currentPhase);
      });
      it("but with the same template", () =>
      {
        expect(original.currentPhase.template).toBe(clone.currentPhase.template);
      });
    });
    it("creates a deep clone", () =>
    {
      expect(original).not.toBe(clone);

      expect(original.currentPhase).not.toBe(clone.currentPhase);
      expect(original.currentPhase.template).toBe(clone.currentPhase.template);

      const originalActions = original.currentPhase.actions;
      const cloneActions = clone.currentPhase.actions;
      expect(originalActions).not.toBe(cloneActions);
      expect(originalActions.length).toBe(cloneActions.length);
      for (let i = 0; i < originalActions.length; i++)
      {
        expect(originalActions[i]).not.toBe(cloneActions[i]);
        expect(originalActions[i]).toEqual(cloneActions[i]);
      }

      // TODO 2021.11.13 | check action listeners after they're implemented
    });
    describe("links attached actions", () =>
    {
      it("in current phase", () =>
      {
        const cloneParent = clone.currentPhase.actions[0];
        const cloneChild = clone.currentPhase.actions[1];

        expect(cloneChild.actionAttachedTo).toBe(cloneParent);
      });
      it("in other phases", () =>
      {
        manager.setPhase(afterMainPhase);
        clone.setPhase(afterMainPhase);

        const cloneParent = clone.currentPhase.actions[0];
        const cloneChild = clone.currentPhase.actions[1];

        expect(cloneChild.actionAttachedTo).toBe(cloneParent);
      });
    });
    describe("links clone child with clone parent", () =>
    {
      it("in current phase", () =>
      {
        const originalParent = original.currentPhase.actions[0];
        const cloneChild = clone.currentPhase.actions[1];

        expect(cloneChild.actionAttachedTo).not.toBe(originalParent);
        expect(cloneChild.actionAttachedTo).toEqual(originalParent);
      });
      it("in other phases", () =>
      {
        manager.setPhase(afterMainPhase);
        clone.setPhase(afterMainPhase);

        const originalParent = original.currentPhase.actions[0];
        const cloneChild = clone.currentPhase.actions[1];

        expect(cloneChild.actionAttachedTo).not.toBe(originalParent);
        expect(cloneChild.actionAttachedTo).toEqual(originalParent);
      });
    });
  });
  describe("fetchCombatActions", () =>
  {
    activeModuleData.templates.combatActionFetchers.copyTemplates(actionFetchers);
    // takePhysicalDamageAfterAction
    // dealPhysicalDamageToEnemiesAtBattleStart

    it("fetches actions for current phase", () =>
    {
      manager.setPhase(battleStartPhase);
      expect(manager.currentPhase.actions.length).toBe(1);
    });
    it("doesn't fetch actions for other phases", () =>
    {
      manager.setPhase(mainPhase);
      expect(manager.currentPhase.actions.length).toBe(0);
    });
  });
  describe("fetchCombatActionListeners", () =>
  {
    activeModuleData.templates.combatActionListenerFetchers.copyTemplates(actionListenerFetchers);
    // duplicateAllBattleStartActions
    // alwaysBlockSomeDamage

    it("fetches listeners for current phase", () =>
    {
      manager.setPhase(battleStartPhase);
      expect(manager.currentPhase.hasListenerWithKey("blockSomeDamage")).toBeTruthy();
      expect(manager.currentPhase.hasListenerWithKey("duplicateAction")).toBeTruthy();
    });
    it("doesn't fetch listeners for other phases", () =>
    {
      manager.setPhase(mainPhase);
      expect(manager.currentPhase.hasListenerWithKey("blockSomeDamage")).toBeTruthy();
      expect(manager.currentPhase.hasListenerWithKey("duplicateAction")).toBeFalsy();
    });
  });
});
