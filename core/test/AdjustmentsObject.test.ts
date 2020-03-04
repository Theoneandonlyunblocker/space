import
{
  squashAdjustmentsObjects,
  applyAdjustmentsObjects,
} from "../src/generic/AdjustmentsObject";


describe("AdjustmentsObject", () =>
{
  describe("squashAdjustmentsObjects", () =>
  {
    it("handles partial adjustments", () =>
    {
      const squashed = squashAdjustmentsObjects({a: {flat: 20}});
      expect(squashed.a.flat).toBe(20);
      expect(squashed.a.additiveMultiplier).toBe(undefined);
      expect(squashed.a.multiplicativeMultiplier).toBe(undefined);
    });
    it("squashes objects together correctly", () =>
    {
      const squashed = squashAdjustmentsObjects({a: {flat: 20}}, {b: {flat: 20}}, {a: {flat: 20}});
      expect(squashed.a.flat).toBe(40);
      expect(squashed.b.flat).toBe(20);
    });
  });
  describe("applyAdjustmentsObjects", () =>
  {
    it("handles empty base values & no adjustments", () =>
    {
      expect(applyAdjustmentsObjects({})).toEqual({});
    });
    it("handles base values & no adjustments", () =>
    {
      expect(applyAdjustmentsObjects({a: 20})).toEqual({a: 20});
    });
    it("handles empty base values with adjustments", () =>
    {
      const adjustedValues = applyAdjustmentsObjects({}, {a: {flat: 5, additiveMultiplier: 2}});
      expect(adjustedValues.a).toEqual(5 * (1 + 2));
    });
    it("handles lack of adjustments for given base value", () =>
    {
      const adjustedValues = applyAdjustmentsObjects({a: 5, b: 5}, {b: {multiplicativeMultiplier: 2}});
      expect(adjustedValues.a).toBe(5);
      expect(adjustedValues.b).toBe(10);
    });
    it("merges adjustments for same key", () =>
    {
      const adjustedValues = applyAdjustmentsObjects({}, {a: {flat: 10}}, {a: {flat: 10, multiplicativeMultiplier: 2}});
      expect(adjustedValues.a).toBe((10 + 10) * 2);
    });
  });
});
