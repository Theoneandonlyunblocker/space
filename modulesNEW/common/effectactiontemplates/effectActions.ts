import testStatusEffect from "../statuseffecttemplates/test.ts";

import EffectActionTemplate from "../../../src/templateinterfaces/EffectActionTemplate.d.ts";

import Battle from "../../../src/Battle.ts";
import DamageType from "../../../src/DamageType.ts";
import GuardCoverage from "../../../src/GuardCoverage.ts";
import StatusEffect from "../../../src/StatusEffect.ts";
import Unit from "../../../src/Unit.ts";
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
} from "../../../src/targeting.ts";

export const singleTargetDamage: EffectActionTemplate =
{
  name: "singleTargetDamage",
  targetFormations: TargetFormation.enemy,
  battleAreaFunction: areaSingle,
  targetRangeFunction: targetAll,
  executeAction: function(user: Unit, target: Unit, battle: Battle,
    data: {baseDamage: number; damageType: number;})
  {
    const baseDamage = data.baseDamage;
    const damageType = data.damageType;

    const damageIncrease = user.getAttackDamageIncrease(damageType);
    const damage = baseDamage * damageIncrease;

    target.receiveDamage(damage, damageType);
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
    const baseDamage = 0.66;
    const damageType = DamageType.physical;

    const damageIncrease = user.getAttackDamageIncrease(damageType);
    const damage = baseDamage * damageIncrease;

    target.receiveDamage(damage, damageType);
  }
}
export const wholeRowAttack: EffectActionTemplate =
{
  name: "wholeRowAttack",
  targetFormations: TargetFormation.either,
  battleAreaFunction: areaColumn,
  targetRangeFunction: targetAll,
  executeAction: function(user: Unit, target: Unit, battle: Battle)
  {
    const baseDamage = 0.75;
    const damageType = DamageType.magical;

    const damageIncrease = user.getAttackDamageIncrease(damageType);
    const damage = baseDamage * damageIncrease;

    target.receiveDamage(damage, damageType);
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
    const baseDamage = 0.5;
    const damageType = DamageType.physical;

    const damageIncrease = user.getAttackDamageIncrease(damageType);
    const damage = baseDamage * damageIncrease;

    target.receiveDamage(damage, damageType);
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
    if (!data) return;
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
    target.addStatusEffect(new StatusEffect(testStatusEffect, 2));
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
      healAmount += data.perUserUnit * user.getAttackDamageIncrease(DamageType.magical);
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
