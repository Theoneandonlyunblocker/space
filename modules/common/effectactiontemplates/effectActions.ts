import
{
  getAttackDamageIncrease,
  getReducedDamageFactor,
  getAdjustedDamage
} from "./damageAdjustments";

import poisonedStatusEffect from "../statuseffecttemplates/poisoned";

import EffectActionTemplate from "../../../src/templateinterfaces/EffectActionTemplate";

import Battle from "../../../src/Battle";
import DamageType from "../../../src/DamageType";
import GuardCoverage from "../../../src/GuardCoverage";
import StatusEffect from "../../../src/StatusEffect";
import Unit from "../../../src/Unit";
import {UnitAttributeAdjustments} from "../../../src/UnitAttributes";
import
{
  areaColumn,
  areaOrthogonalNeighbors,
  areaRowNeighbors,
  areaSingle,
} from "../../../src/targeting";

export const singleTargetDamage: EffectActionTemplate =
{
  name: "singleTargetDamage",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {baseDamage: number; damageType: number;})
  {
    const adjustedDamage = getAdjustedDamage(user, target, data.baseDamage, data.damageType);

    target.receiveDamage(adjustedDamage);
  }
}
export const closeAttack: EffectActionTemplate =
{
  name: "closeAttack",
  getUnitsInArea: areaRowNeighbors,
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    singleTargetDamage.executeAction(user, target, battle,
    {
      baseDamage: 0.66,
      damageType: DamageType.physical
    });
  }
}
export const beamAttack: EffectActionTemplate =
{
  name: "beamAttack",
  getUnitsInArea: areaColumn,
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    const baseDamage = 0.75;
    const damageType = DamageType.magical;

    singleTargetDamage.executeAction(user, target, battle,
    {
      baseDamage: 0.75,
      damageType: DamageType.magical
    });
  }
}

export const bombAttack: EffectActionTemplate =
{
  name: "bombAttack",
  getUnitsInArea: (user, target, battle) =>
  {
    return areaOrthogonalNeighbors(user, target, battle).filter(unit =>
    {
      return !unit || unit.battleStats.side !== user.battleStats.side;
    });
  },
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    singleTargetDamage.executeAction(user, target, battle,
    {
      baseDamage: 0.5,
      damageType: DamageType.physical
    });
  }
}
export const guardRow: EffectActionTemplate =
{
  name: "guardRow",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle, data: {perInt?: number, flat?: number})
  {
    const guardPerInt = data.perInt || 0;
    const flat = data.flat || 0;

    const guardAmount = guardPerInt * user.attributes.intelligence + flat;
    user.addGuard(guardAmount, GuardCoverage.row);
  }
}
export const receiveCounterAttack: EffectActionTemplate =
{
  name: "receiveCounterAttack",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {baseDamage: number; damageType: number;})
  {
    const counterStrength = target.getCounterAttackStrength();

    if (counterStrength)
    {
      singleTargetDamage.executeAction(target, user, battle,
      {
        baseDamage: data.baseDamage * counterStrength,
        damageType: DamageType.physical
      });
    }
  }
}
export const increaseCaptureChance: EffectActionTemplate =
{
  name: "increaseCaptureChance",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {flat?: number; multiplier?: number;})
  {
    if (data.flat)
    {
      target.battleStats.captureChance += data.flat;
    }
    if (isFinite(data.multiplier))
    {
      target.battleStats.captureChance *= data.multiplier;
    }

  }
}
export const addAttributeStatusEffect: EffectActionTemplate =
{
  name: "addAttributeStatusEffect",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {adjustments: UnitAttributeAdjustments, sourceName: string, duration: number})
  {
    target.addStatusEffect(new StatusEffect(
    {
      type: data.sourceName,
      displayName: data.sourceName,

      attributes: data.adjustments
    }, data.duration));
  }
}
export const buffTest: EffectActionTemplate =
{
  name: "buffTest",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    target.addStatusEffect(new StatusEffect(poisonedStatusEffect, 2));
  }
}
export const healTarget: EffectActionTemplate =
{
  name: "healTarget",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number})
  {
    let healAmount = 0;
    if (data.flat)
    {
      healAmount += data.flat;
    }
    if (data.maxHealthPercentage)
    {
      healAmount += target.maxHealth * data.maxHealthPercentage;
    }
    if (data.perUserUnit)
    {
      healAmount += data.perUserUnit * getAttackDamageIncrease(user, DamageType.magical);
    }

    target.removeStrength(-healAmount);
  }
}

export const healSelf: EffectActionTemplate =
{
  name: "healSelf",
  getUnitsInArea: areaSingle,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number})
  {
    healTarget.executeAction(user, user, battle, data);
  }
}

export const standBy: EffectActionTemplate =
{
  name: "standBy",
  getUnitsInArea: areaSingle,
  executeAction: function(){}
}
