import {CombatAction} from "../../src/combat/CombatAction";
import { primitives, resultTemplates, resultModifiers, makeDummyCombatAction, makeDummyUnit } from "./templates";
import { Unit } from "../../src/unit/Unit";


describe("CombatAction", () =>
{
  let action: CombatAction;
  let sourceUnit: Unit;
  let targetUnit: Unit;

  beforeEach(() =>
  {
    sourceUnit = makeDummyUnit();
    targetUnit = makeDummyUnit();

    action = makeDummyCombatAction(sourceUnit, targetUnit);
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
    action.result.apply(sourceUnit, targetUnit, null, action);

    expect(targetUnit.currentHealth).toBe(500 - 50);
  });
});
