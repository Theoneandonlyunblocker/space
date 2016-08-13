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
import
{
  TargetFormation,
  areaColumn,
  areaNeighbors,
  areaRowNeighbors,
  areaSingle,
  targetAll,
  targetNextRow,
  targetSelf
} from "../../../src/targeting";

export const singleTargetDamage: EffectActionTemplate =
{
  name: "singleTargetDamage",
  targetFormations: TargetFormation.enemy,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetAll,
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
  targetFormations: TargetFormation.enemy,
  battleAreaFunction: areaRowNeighbors,
  targetRangeFunction: targetNextRow,
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
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaColumn,
  targetRangeFunction: targetAll,
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
  targetFormations: TargetFormation.enemy,
  battleAreaFunction: areaNeighbors,
  targetRangeFunction: targetAll,
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
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetSelf,
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
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetSelf,
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
  targetFormations: TargetFormation.enemy,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetAll,
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
export const buffTest: EffectActionTemplate =
{
  name: "buffTest",
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetAll,
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    target.addStatusEffect(new StatusEffect(poisonedStatusEffect, 2));
  }
}
export const healTarget: EffectActionTemplate =
{
  name: "healTarget",
  targetFormations: TargetFormation.ally,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetAll,
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
  targetFormations: TargetFormation.ally,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetSelf,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number})
  {
    healTarget.executeAction(user, user, battle, data);
  }
}

export const standBy: EffectActionTemplate =
{
  name: "standBy",
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetSelf,
  executeAction: function(){}
}
