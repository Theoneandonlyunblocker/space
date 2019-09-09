import {AbilityTemplate} from "core/src/templateinterfaces/AbilityTemplate";

import
{
  AbilityTargetEffect,
  AbilityTargetType,
} from "core/src/abilities/AbilityTargetDisplayData";
import {DamageType} from "../effectactions/DamageType";
import {GuardCoverage} from "core/src/unit/GuardCoverage";
import {Unit} from "core/src/unit/Unit";
import {UnitAttribute} from "core/src/unit/UnitAttributes";
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
} from "core/src/abilities/targeting";

import * as BattleVfx from "../battlevfx/templates/battleVfx";

import * as EffectActions from "../effectactions/effectActions";

import * as SnipeStatusEffects from "../uniteffects/snipe";
import { localize } from "./localization/localize";


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
  get displayName()
  {
    return localize("closeAttack_displayName").toString();
  },
  get description()
  {
    return localize("closeAttack_description").toString();
  },
  moveDelay: 90,
  actionsUse: 2,
  getPossibleTargets: (user, battle) =>
  {
    return targetNextRow(user, battle).filter(unit =>
    {
      return unit !== null && unit.battleStats.side !== user.battleStats.side;
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
  get displayName()
  {
    return localize("beamAttack_displayName").toString();
  },
  get description()
  {
    return localize("beamAttack_description").toString();
  },
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
  get displayName()
  {
    return localize("bombAttack_displayName").toString();
  },
  get description()
  {
    return localize("bombAttack_description").toString();
  },
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
  get displayName()
  {
    return localize("guardRow_displayName").toString();
  },
  get description()
  {
    return localize("guardRow_description").toString();
  },
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
  get displayName()
  {
    return localize("boardingHook_displayName").toString();
  },
  get description()
  {
    return localize("boardingHook_description").toString();
  },
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
    vfx: BattleVfx.boardingHook,
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
  get displayName()
  {
    return localize("debugAbility_displayName").toString();
  },
  get description()
  {
    return localize("debugAbility_description").toString();
  },
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
    executeAction: EffectActions.increaseCaptureChance.bind(null,
    {
      flat: 1,
    }),
    vfx: BattleVfx.guard,
  },
};

export const rangedAttack: AbilityTemplate =
{
  type: "rangedAttack",
  get displayName()
  {
    return localize("rangedAttack_displayName").toString();
  },
  get description()
  {
    return localize("rangedAttack_description").toString();
  },
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

const snipeStatusEffectTemplateByAttribute =
{
  [UnitAttribute.Attack]: SnipeStatusEffects.snipeAttack,
  [UnitAttribute.Defence]: SnipeStatusEffects.snipeDefence,
  [UnitAttribute.Intelligence]: SnipeStatusEffects.snipeIntelligence,
  [UnitAttribute.Speed]: SnipeStatusEffects.snipeSpeed,
};
function makeSnipeTemplate(attribute: UnitAttribute): AbilityTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const key = `snipe${capitalizedAttributeName}`;
  // TODO 2019.09.04 | missing localization
  const displayName = `Snipe: ${capitalizedAttributeName}`;
  const description = `Deals damage and lowers target ${attributeName}`;

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
            template: snipeStatusEffectTemplateByAttribute[attribute],
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
  get displayName()
  {
    return localize("standBy_displayName").toString();
  },
  get description()
  {
    return localize("standBy_description").toString();
  },
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
