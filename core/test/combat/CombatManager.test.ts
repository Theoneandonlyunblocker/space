import { TemplateCollection } from "core/src/generic/TemplateCollection";
import { CombatActionFetcher, CombatActionListenerFetcher } from "core/src/combat/CombatActionFetcher";

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
import { makeDummyCombatAction } from "./templates";
import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";


describe("CombatManager", () =>
{
  let manager: CombatManager;
  let sourceUnit: Unit;
  let targetUnit: Unit;

  function makeMockBattle()
  {
    return <any>{
      activeUnit: sourceUnit,
    };
  }

  beforeEach(() =>
  {
    manager = new CombatManager();
    manager.setPhase(mainPhase);
    manager.battle = makeMockBattle();
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
  });
  describe("clone", () =>
  {
    const clonedUnitsById: {[id: number]: Unit} =
    {
      0: sourceUnit,
      1: targetUnit,
    };
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

      clone = original.clone(clonedUnitsById);
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
      expect(original).toEqual(clone);

      compareCurrentPhaseActions();

      original.setPhase(afterMainPhase);
      clone.setPhase(afterMainPhase);

      compareCurrentPhaseActions();

      function compareCurrentPhaseActions()
      {
        const originalActions = original.currentPhase.actions;
        const cloneActions = clone.currentPhase.actions;
        expect(originalActions).not.toBe(cloneActions);
        expect(originalActions.length).toBe(cloneActions.length);

        for (let i = 0; i < originalActions.length; i++)
        {
          expect(originalActions[i]).not.toBe(cloneActions[i]);
          expect(originalActions[i]).toEqual(cloneActions[i]);
        }
      }
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
    // TODO 2021.11.12 | implement
  });
  describe("fetchCombatActionListeners", () =>
  {
    // TODO 2021.11.12 | implement
  });
});
