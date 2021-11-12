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


describe("CombatManager", () =>
{
  let manager: CombatManager;
  let sourceUnit: Unit;
  let targetUnit: Unit;

  beforeEach(() =>
  {
    manager = new CombatManager();
    manager.setPhase(mainPhase);
    manager.battle = <any>{activeUnit: sourceUnit};
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
  describe("clone", () =>
  {
    it("creates a deep clone", () =>
    {
      // TODO 2021.11.12 | implement
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
