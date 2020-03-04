import
{
  getBaseAdjustment,
  squashFlatAndMultiplierAdjustments,
  applyFlatAndMultiplierAdjustments,
} from "../src/generic/FlatAndMultiplierAdjustment";


describe("FlatAndMultiplierAdjustment", () =>
{
  describe("baseAdjustment", () =>
  {
    it("should squash cleanly with copies of itself", () =>
    {
      const squashed = squashFlatAndMultiplierAdjustments(getBaseAdjustment(), getBaseAdjustment(), getBaseAdjustment());
      expect(squashed).toEqual(getBaseAdjustment());
    });
  });

  describe("squashFlatAndMultiplierAdjustments", () =>
  {
    it("should return BaseAdjustment when no arguments are passed", () =>
    {
      expect(squashFlatAndMultiplierAdjustments()).toEqual(getBaseAdjustment());
    });
    it("should use BaseAdjustment for missing properties", () =>
    {
      const baseAdjustment = getBaseAdjustment();
      const squashed = squashFlatAndMultiplierAdjustments({flat: 5});
      expect(squashed.additiveMultiplier).toBe(baseAdjustment.additiveMultiplier);
      expect(squashed.multiplicativeMultiplier).toBe(baseAdjustment.multiplicativeMultiplier);
    });
    it("squashes flat adjustments correctly", () =>
    {
      const squashed = squashFlatAndMultiplierAdjustments({flat: 5}, {flat: 20}, {flat: -100});
      expect(squashed.flat).toBe(5 + 20 - 100);
    });
    it("squashes additive multipliers correctly", () =>
    {
      const squashed = squashFlatAndMultiplierAdjustments({additiveMultiplier: 0.5}, {additiveMultiplier: 1}, {additiveMultiplier: -1.5});
      expect(squashed.flat).toBeCloseTo(0.5 + 1 - 1.5);
    });
    it("squashes multiplicative multipliers correctly", () =>
    {
      const squashed = squashFlatAndMultiplierAdjustments({multiplicativeMultiplier: 5}, {multiplicativeMultiplier: 20}, {multiplicativeMultiplier: 0});
      expect(squashed.flat).toEqual(1 * 5 * 20 * 0);
    });
  });

  describe("applyFlatAndMultiplierAdjustments", () =>
  {
    it("applies flat adjustments correctly", () =>
    {
      const adjustedValue = applyFlatAndMultiplierAdjustments(20, {flat: 5}, {flat: 20}, {flat: -100});
      expect(adjustedValue).toBe(20 + 5 + 20 - 100);
    });
    it("applies additive multipliers correctly", () =>
    {
      const adjustedValue = applyFlatAndMultiplierAdjustments(20, {additiveMultiplier: 0.5}, {additiveMultiplier: 1}, {additiveMultiplier: -1.5});
      expect(adjustedValue).toBeCloseTo(20 * (1 + 0.5 + 1 - 1.5));
    });
    it("applies multiplicative multipliers correctly", () =>
    {
      const adjustedValue = applyFlatAndMultiplierAdjustments(20, {multiplicativeMultiplier: 5}, {multiplicativeMultiplier: 20}, {multiplicativeMultiplier: 0});
      expect(adjustedValue).toEqual(20 * (1 * 5 * 20 * 0));
    });
    it("applies all multipliers together correctly", () =>
    {
      const adjustedValue = applyFlatAndMultiplierAdjustments(
        20,
        {flat: 50, additiveMultiplier: 0.5, multiplicativeMultiplier: 0.15},
        {flat: 50, additiveMultiplier: -0.25, multiplicativeMultiplier: 2},
      );
      expect(adjustedValue).toBeCloseTo((20 + 50 + 50) * (1 + 0.5 - 0.25) * (0.15 * 2));
    });
  });
});
