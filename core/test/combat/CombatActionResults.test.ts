import { CombatActionResults } from "../../src/combat/CombatActionResults";
import { resultTemplates } from "./templates";


describe("CombatActionResults", () =>
{
  it("uses template default value for undefined values", () =>
  {
    const results = new CombatActionResults();
    const value = results.get(resultTemplates.damageDealt);

    expect(value).toBe(resultTemplates.damageDealt.defaultValue);
  });
});
