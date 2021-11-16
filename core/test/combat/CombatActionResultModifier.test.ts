import { CombatActionResultModifierWithValue, getOrderedResultModifiers } from "core/src/combat/CombatActionResultModifier";

describe("CombatActionResultModifier", () =>
{
  // probably belong in OrderedGraph tests instead
  describe("getOrderedResult", () =>
  {
    function makeDummyModifier(key: string, ...parents: string[]): CombatActionResultModifierWithValue<number>
    {
      return {
        modifier:
        {
          key: key,
          flags: new Set([key]),
          flagsThatShouldBeExecutedBefore: parents,
          modifyResult: () => {},
        },
        value: 1,
      };
    }
    it("throws when all modifiers form a cycle", () =>
    {
      expect(() =>
      {
        getOrderedResultModifiers(
        [
          makeDummyModifier("a", "b"),
          makeDummyModifier("b", "c"),
          makeDummyModifier("c", "a"),
        ]);
      }).toThrow("No starting node could be found");
    });
    it("throws when a group connected to a valid parent forms a cycle", () =>
    {
      expect(() =>
      {
        getOrderedResultModifiers(
        [
          makeDummyModifier("a"),
          makeDummyModifier("b", "c", "a"),
          makeDummyModifier("c", "b"),
        ]);
      }).toThrow("Cyclical ordering");
    });
    it("throws when an isolated group forms a cycle", () =>
    {
      expect(() =>
      {
        getOrderedResultModifiers(
        [
          makeDummyModifier("a"),
          makeDummyModifier("b", "c"),
          makeDummyModifier("c", "b"),
        ]);
      }).toThrow("isolated nodes that form a cycle");
    });
  });
});
