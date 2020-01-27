import {CombatAction} from "../../src/combat/CombatAction";
import { primitives, resultTemplates, resultModifiers } from "./templates";
import { Unit } from "../../src/unit/Unit";


describe("CombatAction", () =>
{
  let action: CombatAction;
  let sourceUnit: Unit;
  let targetUnit: Unit;

  function makeDummyUnit(): Unit
  {
    let health: number = 500;

    return <Unit><unknown>{
      get currentHealth()
      {
        return health;
      },
      removeHealth: (amount: number) => health -= amount,
    };
  }

  beforeEach(() =>
  {
    sourceUnit = makeDummyUnit();
    targetUnit = makeDummyUnit();

    action = new CombatAction(
    {
      mainAction:
      {
        primitives:
        {
          [primitives.physicalDamage.key]:
          {
            primitive: primitives.physicalDamage,
            value: {flat: 50},
          },
        },
      },
      source: sourceUnit,
      target: targetUnit,
    });
  });

  it("applies modifiers", () =>
  {
    expect(action.result.get(resultTemplates.damageDealt)).toBe(50);

    action.modifiers.push(
    {
      primitives:
      {
        [primitives.physicalDamage.key]:
        {
          primitive: primitives.physicalDamage,
          value: {multiplicativeMultiplier: 2},
        },
      },
    });

    expect(action.result.get(resultTemplates.damageDealt)).toBe(100);
  });
  it("applies result modifiers", () =>
  {
    action.resultModifiers.push(
    {
      modifier: resultModifiers.blockDamage,
      value: 20,
    });

    expect(action.result.get(resultTemplates.damageDealt)).toBe(50 - 20);
    expect(action.result.get(resultTemplates.damageBlocked)).toBe(20);
  });
  it("applies result to target unit", () =>
  {
    action.result.apply(sourceUnit, targetUnit, null);

    expect(targetUnit.currentHealth).toBe(500 - 50);
  });
});
