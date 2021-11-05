import { CombatEffectMap } from "../../src/combat/CombatEffectMap";
import { CombatEffectTemplate } from "../../src/combat/CombatEffectTemplate";

describe("CombatEffectMap", () =>
{
  const dummyTemplate: CombatEffectTemplate =
  {
    key: "dummy",
    displayName: "",
    getDescription: () => "",
    isActive: (strength) => strength > 0,
  };

  describe("get", () =>
  {
    it("intiializes effects not present", () =>
    {
      const map = new CombatEffectMap();

      const effect = map.get(dummyTemplate);

      expect(effect).toBeDefined();
      expect(effect.strength).toBe(0);
    });
    it("doesn't intitialize effects already present", () =>
    {
      const map = new CombatEffectMap();

      const firstGet = map.get(dummyTemplate);
      firstGet.strength += 10;

      const secondGet = map.get(dummyTemplate);
      expect(secondGet).toBe(firstGet);
      expect(secondGet.strength).toBe(10);
    });
    it("filters out inactive effects", () =>
    {
      const map = new CombatEffectMap();

      map.get(dummyTemplate).strength = 5;
      expect(map.getAllActiveEffects().length).toBe(1);

      map.get(dummyTemplate).strength = 0;
      expect(map.getAllActiveEffects().length).toBe(0);
    });
  });
});
