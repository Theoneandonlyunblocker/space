import { CombatActionResults } from "core/src/combat/CombatActionResults";
import {combatEffectChanges} from "modules/baselib/src/combat/resultTemplates/combatEffectChanges";

import {blockNegativeCombatEffectChanges} from "modules/baselib/src/combat/resultModifiers/blockNegativeCombatEffectChanges";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { combatEffectFlags } from "modules/baselib/src/combat/combatEffectFlags";


jest.mock("modules/baselib/localization/localize.ts", () => {});

const dummyNegativeEffect: CombatEffectTemplate =
{
  key: "dummyNegativeEffect",
  displayName: "",
  getDescription: () => "",
  isActive: strength => strength > 0,
  flags: new Set([combatEffectFlags.negative]),
};
const dummyNegativeEffect2: CombatEffectTemplate =
{
  key: "dummyNegativeEffect2",
  displayName: "",
  getDescription: () => "",
  isActive: strength => strength > 0,
  flags: new Set([combatEffectFlags.negative]),
};

const dummyPositiveEffect: CombatEffectTemplate =
{
  key: "dummyPositiveEffect",
  displayName: "",
  getDescription: () => "",
  isActive: strength => strength > 0,
  flags: new Set([combatEffectFlags.positive]),
};

describe("blockNegativeEffects", () =>
{
  describe("resultModifier", () =>
  {
    let results: CombatActionResults;
    let changes: Map<CombatEffectTemplate, number>;
    beforeEach(() =>
    {
      results = new CombatActionResults();
      changes = results.get(combatEffectChanges);
      results.set(combatEffectChanges, changes);
    });

    it("blocks increase of negative effect", () =>
    {
      changes.set(dummyNegativeEffect, 1);
      blockNegativeCombatEffectChanges.modifyResult(results, 1);

      expect(changes.get(dummyNegativeEffect)).toBeFalsy();
    });
    it("ignores decrease of negative effect", () =>
    {
      changes.set(dummyNegativeEffect, -1);
      blockNegativeCombatEffectChanges.modifyResult(results, 1);

      expect(changes.get(dummyNegativeEffect)).toBe(-1);
    });
    it("blocks decrease of positive effect", () =>
    {
      changes.set(dummyPositiveEffect, -1);
      blockNegativeCombatEffectChanges.modifyResult(results, 1);

      expect(changes.get(dummyPositiveEffect)).toBeFalsy();
    });
    it("ignores increase of positive effect", () =>
    {
      changes.set(dummyPositiveEffect, 1);
      blockNegativeCombatEffectChanges.modifyResult(results, 1);

      expect(changes.get(dummyPositiveEffect)).toBe(1);
    });
    it("doesn't throw when no effects are added", () =>
    {
      blockNegativeCombatEffectChanges.modifyResult(results, 1);
    });
    it("blocks only as many effects as it should", () =>
    {
      changes.set(dummyNegativeEffect, 1);
      changes.set(dummyNegativeEffect2, 1);
      blockNegativeCombatEffectChanges.modifyResult(results, 1);

      expect(changes.get(dummyNegativeEffect)).toBeFalsy();
      expect(changes.get(dummyNegativeEffect2)).toBe(1);
    });
  });
});
