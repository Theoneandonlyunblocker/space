import AbilityTemplate from "../../../src/templateinterfaces/AbilityTemplate";

import DamageType from "../../../src/DamageType";
import GuardCoverage from "../../../src/GuardCoverage";
import {UnitAttribute} from "../../../src/UnitAttributes";
import
{
  areaColumn,
  areaOrthogonalNeighbors,
  areaRowNeighbors,
  areaSingle,

  targetAll,
  targetEnemies,
  targetNextRow,
  targetSelf,
} from "../../../src/targeting";

import * as BattleSFX from "../battlesfxtemplates/battleSFX";

import * as EffectActions from "../effectactiontemplates/effectActions";
import {bindEffectActionData} from "../effectactiontemplates/effectActions";

import * as SnipeStatusEffects from "../statuseffecttemplates/snipe";

export var closeAttack: AbilityTemplate =
{
  type: "closeAttack",
  displayName: "Close Attack",
  description: "Close range attack that hits adjacent targets in the same row",
  moveDelay: 90,
  actionsUse: 2,
  getPossibleTargets: (user, battle) =>
  {
    return targetNextRow(user, battle).filter((unit) =>
    {
      unit.battleStats.side !== user.battleStats.side
    });
  },
  mainEffect:
  {
    id: "damage",
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 0.66,
      damageType: DamageType.physical
    }),
    getUnitsInArea: areaRowNeighbors,
    sfx: BattleSFX.rocketAttack
  }
}
export var beamAttack: AbilityTemplate =
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
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 0.75,
      damageType: DamageType.magical
    }),
    getUnitsInArea: areaColumn,
    sfx: BattleSFX.beam
  },

  targetCannotBeDiverted: true,
}

export var bombAttack: AbilityTemplate =
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
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 0.5,
      damageType: DamageType.physical
    }),
    getUnitsInArea: (user, target, battle) =>
    {
      return areaOrthogonalNeighbors(user, target, battle).filter((unit) =>
      {
        return !unit || unit.battleStats.side !== user.battleStats.side;
      });
    },
    sfx: BattleSFX.rocketAttack
  }
}
export var guardRow: AbilityTemplate =
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
    executeAction: bindEffectActionData(EffectActions.addGuard,
    {
      perAttribute:
      {
        intelligence: {flat: 20}
      },
      coverage: GuardCoverage.row
    }),
    getUnitsInArea: areaSingle,
    sfx: BattleSFX.guard,
  },

  doesNotRemoveUserGuard: true,
}
export var boardingHook: AbilityTemplate =
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
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 0.8,
      damageType: DamageType.physical
    }),
    getUnitsInArea: areaSingle,
    sfx: BattleSFX.rocketAttack,
    attachedEffects:
    [
      {
        id: "captureChance",
        getUnitsInArea: areaSingle,
        executeAction: bindEffectActionData(EffectActions.increaseCaptureChance,
        {
          flat: 0.5
        })
      },
      {
        id: "counter",
        getUnitsInArea: areaSingle,
        executeAction: bindEffectActionData(EffectActions.receiveCounterAttack,
        {
          baseDamage: 0.5,
        })
      }
    ]
  }
}

export var debugAbility: AbilityTemplate =
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
    executeAction: () => {},
    sfx: BattleSFX.guard,
  }
}

export var rangedAttack: AbilityTemplate =
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
    executeAction: bindEffectActionData(EffectActions.inflictDamage,
    {
      baseDamage: 1,
      damageType: DamageType.physical
    }),
    getUnitsInArea: areaSingle,
    sfx: BattleSFX.rocketAttack,
    attachedEffects:
    [
      {
        id: "counter",
        executeAction: bindEffectActionData(EffectActions.receiveCounterAttack,
        {
          baseDamage: 0.5
        }),
        getUnitsInArea: areaSingle,
      }
    ]
  },

  canUpgradeInto:
  [
    bombAttack,
    boardingHook,
  ]
}
function makeSnipeTemplate(attribute: UnitAttribute): AbilityTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const key = `snipe${capitalizedAttributeName}`;
  const displayName = `Snipe: ${capitalizedAttributeName}`;
  const description = `Deals damage and lowers target ${attributeName}`;

  const statusEffectTemplateByAttribute =
  {
    [UnitAttribute.attack]: SnipeStatusEffects.snipeAttack,
    [UnitAttribute.defence]: SnipeStatusEffects.snipeDefence,
    [UnitAttribute.intelligence]: SnipeStatusEffects.snipeIntelligence,
    [UnitAttribute.speed]: SnipeStatusEffects.snipeSpeed,
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
      executeAction: bindEffectActionData(EffectActions.inflictDamage,
      {
        baseDamage: 0.6,
        damageType: DamageType.physical
      }),
      getUnitsInArea: areaSingle,
      sfx: BattleSFX[key],
      attachedEffects:
      [
        {
          id: "statusEffect",
          executeAction: bindEffectActionData(EffectActions.addStatusEffect,
          {
            template: statusEffectTemplateByAttribute[attribute],
            duration: -1,
          }),
          getUnitsInArea: areaSingle,
        }
      ]
    },
  });
}
export const snipeAttack = makeSnipeTemplate(UnitAttribute.attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.speed);

export var standBy: AbilityTemplate =
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
    executeAction: () => {},
    sfx:
    {
      duration: 750
    }
  },

  doesNotRemoveUserGuard: true,
  AIEvaluationPriority: 0.6,
  AIScoreAdjust: -0.1,
  disableInAIBattles: true,
}
