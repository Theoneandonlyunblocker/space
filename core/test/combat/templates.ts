import {CombatActionResultTemplate} from "core/src/combat/CombatActionResultTemplate";
import {CombatActionPrimitiveTemplate} from "core/src/combat/CombatActionPrimitiveTemplate";
import {CombatActionResultModifier} from "core/src/combat/CombatActionResultModifier";
import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";
import { CombatActionFetcher, CombatActionListenerFetcher } from "core/src/combat/CombatActionFetcher";
import { battleStartPhase } from "core/src/combat/core/phases/battleStartPhase";
import { allCoreCombatPhases } from "core/src/combat/core/coreCombatPhases";
import { coreCombatActionFlags } from "core/src/combat/core/coreCombatActionFlags";
import { afterMainPhase } from "core/src/combat/core/phases/afterMainPhase";


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
export const actionFetchers:
{
  takePhysicalDamageAfterAction: CombatActionFetcher;
  dealPhysicalDamageToEnemiesAtBattleStart: CombatActionFetcher;
} =
{
  takePhysicalDamageAfterAction:
  {
    key: "takePhysicalDamageAfterAction",
    phasesToApplyTo: new Set([afterMainPhase]),
    fetch: (battle, unit) =>
    {
      return [makeDummyCombatAction(undefined, unit)];
    },
  },
  dealPhysicalDamageToEnemiesAtBattleStart:
  {
    key: "dealPhysicalDamageToEnemiesAtBattleStart",
    phasesToApplyTo: new Set([battleStartPhase]),
    fetch: (battle) =>
    {
      const enemyUnits = battle.getUnitsForSide("side2");
      const dealDamageActions = enemyUnits.map(unit => makeDummyCombatAction(undefined, unit));

      return dealDamageActions;
    },
  },
};
export const actionListenerFetchers:
{
  duplicateAllBattleStartActions: CombatActionListenerFetcher;
  alwaysBlockSomeDamage: CombatActionListenerFetcher;
} =
{
  duplicateAllBattleStartActions:
  {
    key: "duplicateAllBattleStartActions",
    phasesToApplyTo: new Set([battleStartPhase]),
    fetch: () =>
    [
      {
        key: "duplicateAction",
        flagsWhichTrigger: [coreCombatActionFlags.ability],
        flagsWhichPrevent: [coreCombatActionFlags.duplicated],
        onAdd: (action, combatManager) =>
        {
          const duplicated = action.duplicate();
          combatManager.attachAction(duplicated, action);
        },
      },
    ],
  },
  alwaysBlockSomeDamage:
  {
    key: "alwaysBlockSomeDamage",
    phasesToApplyTo: new Set(allCoreCombatPhases),
    fetch: () =>
    [
      {
        key: "blockSomeDamage",
        flagsWhichTrigger: [coreCombatActionFlags.ability],
        onAdd: (action) =>
        {
          action.resultModifiers.push({modifier: resultModifiers.blockDamage, value: 5});
        },
      },
    ],
  },
};
export function makeDummyUnit(): Unit
{
  let health: number = 500;

  return <Unit><Partial<Unit>>{
    get currentHealth()
    {
      return health;
    },
    removeHealth: (amount: number) => health -= amount,
  };
}
export function makeDummyCombatAction(source?: Unit, target?: Unit): CombatAction
{
  return new CombatAction(
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
    source: source,
    target: target,
  });
}
