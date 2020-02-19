import { CombatEffectManager } from "../../src/combat/CombatEffectManager";
import { CombatEffectTemplate } from "../../src/combat/CombatEffectTemplate";

describe("CombatEffectManager", () =>
{
  const dummyTemplate: CombatEffectTemplate =
  {
    key: "dummy",
    getDisplayName: () => "",
    getDescription: () => "",
  };

  describe("get", () =>
  {
    it("intiializes effects not present", () =>
    {
      const manager = new CombatEffectManager();

      const effect = manager.get(dummyTemplate);

      expect(effect).toBeDefined();
      expect(effect.strength).toBe(0);
    });
    it("doesn't intitialize effects already present", () =>
    {
      const manager = new CombatEffectManager();

      const firstGet = manager.get(dummyTemplate);
      firstGet.strength += 10;

      const secondGet = manager.get(dummyTemplate);
      expect(secondGet).toBe(firstGet);
      expect(secondGet.strength).toBe(10);
    });
  });
});
