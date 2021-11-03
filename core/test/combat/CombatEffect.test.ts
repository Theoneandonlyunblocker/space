import {CombatEffectTemplate} from "../../src/combat/CombatEffectTemplate";
import {CombatEffect} from "../../src/combat/CombatEffect";


describe("CombatEffect", () =>
{
  const dummyTemplate: CombatEffectTemplate =
  {
    key: "dummy",
    getDisplayName: () => "",
    getDescription: () => "",
    isActive: () => true,
  };

  it("clamps strength to template limits", () =>
  {
    const limitedTemplate = {
      ...dummyTemplate,
      limit: {min: 0, max: 10},
    };

    const effectThatIsOverLimit = new CombatEffect({
      template: limitedTemplate,
      initialStrength: 15,
    });
    expect(effectThatIsOverLimit.strength).toBe(10);

    const effectThatIsUnderLimit = new CombatEffect({
      template: limitedTemplate,
      initialStrength: -Infinity,
    });
    expect(effectThatIsUnderLimit.strength).toBe(0);
  });

  it("rounds strength value", () =>
  {
    const nearestIntegerEffect = new CombatEffect({
      template: {
        ...dummyTemplate,
        roundingFN: Math.round,
      },
      initialStrength: 0.5,
    });
    expect(nearestIntegerEffect.strength).toBe(1);
  });

  it("clones cleanly", () =>
  {
    const original = new CombatEffect({
      template: dummyTemplate,
      initialStrength: 50,
    });
    const clone = original.clone();

    expect(clone).toEqual(original);
  });
});
