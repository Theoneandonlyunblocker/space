import {AbilityTemplate} from "../../../src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "../../../src/AbilityTargetDisplayData";
import {DamageType} from "../../../src/DamageType";
import {GuardCoverage} from "../../../src/GuardCoverage";
import {Unit} from "../../../src/Unit";
import {UnitAttribute} from "../../../src/UnitAttributes";
import
{
  areaColumn,
  areaOrthogonalNeighbors,
  areaRow,
  areaRowNeighbors,
  areaSingle,
  GetUnitsInAreaFN,
  makeGetAbilityTargetDisplayDataFN,
  targetAll,
  targetEnemies,
  targetNextRow,
  targetSelf,
} from "../../../src/targeting";

import * as BattleVfx from "../battlevfx/templates/battleVfx";

import * as EffectActions from "../effectactions/effectActions";

import * as SnipeStatusEffects from "../uniteffects/snipe";


// tslint:disable:no-any
function makeFilteringUnitSelectFN<T extends (...args: any[]) => Unit[]>(baseFN: T, filterFN: (unit: Unit | null) => boolean): T;
function makeFilteringUnitSelectFN(baseFN: ((...args: any[]) => Unit[]), filterFN: (unit: Unit | null) => boolean)
{
  return (...args: any[]) =>
  {
    return baseFN(...args).filter(filterFN);
  };
}
// tslint:enable:no-any

function activeUnitsFilter(unit: Unit | null): unit is Unit
{
  return unit && unit.isActiveInBattle();
}

export const closeAttack: AbilityTemplate =
{
  type: "closeAttack",
  displayName: "Close Attack",
  description: "Close range attack that hits adjacent targets in the same row",
  moveDelay: 90,
  actionsUse: 2,
  getPossibleTargets: (user, battle) =>
  {
    return targetNextRow(user, battle).filter(unit =>
    {
      return unit.battleStats.side !== user.battleStats.side;
    });
  },
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 0.66,
      damageType: DamageType.Physical,
    }),
    getUnitsInArea: makeFilteringUnitSelectFN(areaRowNeighbors, activeUnitsFilter),
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: makeFilteringUnitSelectFN(areaRowNeighbors, activeUnitsFilter),
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    vfx: BattleVfx.rocketAttack,
  },
};
export const beamAttack: AbilityTemplate =
{
  type: "beamAttack",
  displayName: "Beam Attack",
  description: "Attack units in a line",
  moveDelay: 300,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 0.75,
      damageType: DamageType.Magical,
    }),
    getUnitsInArea: makeFilteringUnitSelectFN(areaColumn, activeUnitsFilter),
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: makeFilteringUnitSelectFN(areaColumn, activeUnitsFilter),
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    vfx: BattleVfx.beam,
  },

  targetCannotBeDiverted: true,
};

const bombAttackAreaFN: GetUnitsInAreaFN = (user, target, battle) =>
{
  return areaOrthogonalNeighbors(user, target, battle).filter(unit =>
    {
      return unit && unit.battleStats.side !== user.battleStats.side;
    });
};
export const bombAttack: AbilityTemplate =
{
  type: "bombAttack",
  displayName: "Bomb Attack",
  description: "Ranged attack that hits all adjacent enemy units",
  moveDelay: 120,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 0.5,
      damageType: DamageType.Physical,
    }),
    getUnitsInArea: makeFilteringUnitSelectFN(bombAttackAreaFN, activeUnitsFilter),
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: makeFilteringUnitSelectFN(bombAttackAreaFN, activeUnitsFilter),
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    vfx: BattleVfx.rocketAttack,
  },
};
export const guardRow: AbilityTemplate =
{
  type: "guardRow",
  displayName: "Guard Row",
  description: "Protect allies in the same row and boost defence against physical attacks",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetSelf,
  mainEffect:
  {
    id: "addGuard",
    executeAction: EffectActions.addGuard.bind(null,
    {
      perAttribute:
      {
        intelligence: {flat: 20},
      },
      coverage: GuardCoverage.Row,
    }),
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
      {
        areaFN: makeFilteringUnitSelectFN(areaRow, activeUnitsFilter),
        targetType: AbilityTargetType.Primary,
        targetEffect: AbilityTargetEffect.Positive,
      }),
    vfx: BattleVfx.guard,
  },

  doesNotRemoveUserGuard: true,
};
export const boardingHook: AbilityTemplate =
{
  type: "boardingHook",
  displayName: "Boarding Hook",
  description: "0.8x damage but increases target capture chance",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 0.8,
      damageType: DamageType.Physical,
    }),
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Negative,
    }),
    vfx: BattleVfx.rocketAttack,
    attachedEffects:
    [
      {
        id: "captureChance",
        getUnitsInArea: areaSingle,
        executeAction: EffectActions.increaseCaptureChance.bind(null,
        {
          flat: 0.5,
        }),
      },
      {
        id: "counter",
        getUnitsInArea: areaSingle,
        executeAction: EffectActions.receiveCounterAttack.bind(null,
        {
          baseDamage: 0.5,
        }),
      },
    ],
  },
};

export const debugAbility: AbilityTemplate =
{
  type: "debugAbility",
  displayName: "Debug Ability",
  description: "who knows what its going to do today",
  moveDelay: 0,
  actionsUse: 1,
  getPossibleTargets: targetAll,
  mainEffect:
  {
    id: "debugAbility",
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
    {
      areaFN: areaSingle,
      targetType: AbilityTargetType.Primary,
      targetEffect: AbilityTargetEffect.Positive,
    }),
    executeAction: EffectActions.addStatusEffect.bind(null,
    {
      duration: Infinity,
      template:
      {
        type: "debug",
        displayName: "Debug",
        attributes:
        {
          attack: {flat: 1},
          defence: {flat: 1},
          intelligence: {flat: 1},
          speed: {flat: 1},
        },
      }
    }),
    vfx: BattleVfx.guard,
  },
};

export const rangedAttack: AbilityTemplate =
{
  type: "rangedAttack",
  displayName: "Ranged Attack",
  description: "Standard ranged attack",
  moveDelay: 100,
  actionsUse: 1,
  getPossibleTargets: targetEnemies,
  mainEffect:
  {
    id: "damage",
    executeAction: EffectActions.inflictDamage.bind(null,
    {
      baseDamage: 1,
      damageType: DamageType.Physical,
    }),
    getUnitsInArea: areaSingle,
    getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
      {
        areaFN: areaSingle,
        targetType: AbilityTargetType.Primary,
        targetEffect: AbilityTargetEffect.Negative,
      }),
    vfx: BattleVfx.rocketAttack,
    attachedEffects:
    [
      {
        id: "counter",
        executeAction: EffectActions.receiveCounterAttack.bind(null,
        {
          baseDamage: 0.5,
        }),
        getUnitsInArea: areaSingle,
      },
    ],
  },

  defaultUpgrades:
  [
    {
      weight: 1,
      probabilityItems: [bombAttack],
    },
    {
      weight: 1,
      probabilityItems: [boardingHook],
    },
  ],
};
function makeSnipeTemplate(attribute: UnitAttribute): AbilityTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const key = `snipe${capitalizedAttributeName}`;
  const displayName = `Snipe: ${capitalizedAttributeName}`;
  const description = `Deals damage and lowers target ${attributeName}`;

  const statusEffectTemplateByAttribute =
  {
    [UnitAttribute.Attack]: SnipeStatusEffects.snipeAttack,
    [UnitAttribute.Defence]: SnipeStatusEffects.snipeDefence,
    [UnitAttribute.Intelligence]: SnipeStatusEffects.snipeIntelligence,
    [UnitAttribute.Speed]: SnipeStatusEffects.snipeSpeed,
  };

  return(
  {
    type: key,
    displayName: displayName,
    description: description,
    moveDelay: 100,
    actionsUse: 1,
    getPossibleTargets: targetEnemies,
    mainEffect:
    {
      id: "damage",
      executeAction: EffectActions.inflictDamage.bind(null,
      {
        baseDamage: 0.6,
        damageType: DamageType.Physical,
      }),
      getUnitsInArea: areaSingle,
      getDisplayDataForTarget: makeGetAbilityTargetDisplayDataFN(
      {
        areaFN: areaSingle,
        targetType: AbilityTargetType.Primary,
        targetEffect: AbilityTargetEffect.Negative,
      }),
      vfx: BattleVfx[key],
      attachedEffects:
      [
        {
          id: "statusEffect",
          executeAction: EffectActions.addStatusEffect.bind(null,
          {
            template: statusEffectTemplateByAttribute[attribute],
            duration: Infinity,
          }),
          getUnitsInArea: areaSingle,
        },
      ],
    },
  });
}
export const snipeAttack = makeSnipeTemplate(UnitAttribute.Attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.Speed);

export const standBy: AbilityTemplate =
{
  type: "standBy",
  displayName: "Standby",
  description: "Skip a turn but next one comes faster",
  moveDelay: 50,
  actionsUse: 1,
  getPossibleTargets: targetSelf,
  mainEffect:
  {
    id: "standBy",
    getUnitsInArea: areaSingle,
    // tslint:disable-next-line
    getDisplayDataForTarget: () => {return {}},
    executeAction: () => {},
    vfx:
    {
      duration: 750,
    },
  },

  doesNotRemoveUserGuard: true,
  AiEvaluationPriority: 0.6,
  AiScoreMultiplier: 0.6,
  disableInAiBattles: true,
};
