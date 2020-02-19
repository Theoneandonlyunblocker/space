import
{
  primitives,
  resultTemplates,
} from "./templates";
import { resolveCombatActionPrimitiveAdjustments, applyCombatActionPrimitivesToResult } from "../../src/combat/CombatActionPrimitiveTemplate";
import {CombatActionResults} from "../../src/combat/CombatActionResults";


describe("CombatActionPrimitive", () =>
{
  describe("resolveCombatActionPrimitiveAdjustments", () =>
  {
    it("handles no arguments", () =>
    {
      expect(resolveCombatActionPrimitiveAdjustments()).toEqual({});
    });
    it("handles an empty object as its only argument", () =>
    {
      expect(resolveCombatActionPrimitiveAdjustments({})).toEqual({});
    });
    it("reduces adjustments down to their resolved values", () =>
    {
      const resolved = resolveCombatActionPrimitiveAdjustments(
        {
          [primitives.physicalDamage.key]:
          {
            primitive: primitives.physicalDamage,
            value: {flat: 50, multiplicativeMultiplier: 10},
          },
        },
        {
          [primitives.physicalDamage.key]:
          {
            primitive: primitives.physicalDamage,
            value: {flat: 100},
          },
          [primitives.fireDamage.key]:
          {
            primitive: primitives.fireDamage,
            value: {flat: 4},
          },
        },
      );

      expect(resolved[primitives.physicalDamage.key].value).toBe((50 + 100) * 10);
      expect(resolved[primitives.fireDamage.key].value).toBe(4);
    });
  });

  describe("applyCombatActionPrimitivesToResult", () =>
  {
    it("handles empty arguments", () =>
    {
      const result = new CombatActionResults();
      applyCombatActionPrimitivesToResult(result, {});

      const emptyResult = new CombatActionResults();
      expect(result).toEqual(emptyResult);
    });
    it("applies primitives to result without clobbering existing results", () =>
    {
      const result = new CombatActionResults();
      result.set(resultTemplates.damageDealt, 100);
      result.set(resultTemplates.damageBlocked, 50);

      applyCombatActionPrimitivesToResult(result,
      {
        [primitives.physicalDamage.key]:
        {
          primitive: primitives.physicalDamage,
          value: 100,
        },
      });

      expect(result.get(resultTemplates.damageDealt)).toBe(100 + 100);
      expect(result.get(resultTemplates.damageBlocked)).toBe(50);
    });
  });
});
