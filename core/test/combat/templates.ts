import {CombatActionResultTemplate} from "../../src/combat/CombatActionResultTemplate";
import {CombatActionPrimitiveTemplate} from "../../src/combat/CombatActionPrimitiveTemplate";
import {CombatActionResultModifier} from "../../src/combat/CombatActionResultModifier";


const flags =
{
  damageModifier: "damageModifier",
  initialDamageModifier: "initialDamageModifier",
  finalDamageModifier: "finalDamageModifier",
};
export const resultTemplates:
{
  damageDealt: CombatActionResultTemplate<number>;
  damageBlocked: CombatActionResultTemplate<number>;
} =
{
  damageDealt:
  {
    key: "damageDealt",
    defaultValue: 0,
    applyResult: (value, source, target, combatManager) =>
    {
      target.removeHealth(value);
    },
  },
  damageBlocked:
  {
    key: "damageBlocked",
    defaultValue: 0,
    applyResult: (value, source, target, combatManager) =>
    {
      // pass
    },
  },
};
export const primitives:
{
  physicalDamage: CombatActionPrimitiveTemplate<number>;
  fireDamage: CombatActionPrimitiveTemplate<number>;
} =
{
  physicalDamage:
  {
    key: "physicalDamage",
    applyToResult: (value, result) =>
    {
      result.set(
        resultTemplates.damageDealt,
        result.get(resultTemplates.damageDealt) + value,
      );
    },
  },
  fireDamage:
  {
    key: "fireDamage",
    applyToResult: (value, result) =>
    {
      result.set(
        resultTemplates.damageDealt,
        result.get(resultTemplates.damageDealt) + value,
      );
    },
  },
};
export const resultModifiers:
{
  blockDamage: CombatActionResultModifier<number>;
} =
{
  blockDamage:
  {
    key: "blockDamage",
    flags: new Set([flags.damageModifier, flags.initialDamageModifier]),
    modifyResult: (result, maxAmountToBlock) =>
    {
      const incomingDamage = result.get(resultTemplates.damageDealt);
      const amountBlocked = Math.min(maxAmountToBlock, incomingDamage);

      result.set(
        resultTemplates.damageDealt,
        result.get(resultTemplates.damageDealt) - amountBlocked,
      );

      result.set(
        resultTemplates.damageBlocked,
        result.get(resultTemplates.damageBlocked) + amountBlocked,
      );
    },
  },
};
