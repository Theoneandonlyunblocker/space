import
{
  getAttackDamageIncrease,
  getAdjustedDamage
} from "./damageAdjustments";



import AbilityEffectAction from "../../../src/templateinterfaces/AbilityEffectAction";
import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";
import Battle from "../../../src/Battle";
import DamageType from "../../../src/DamageType";
import FlatAndMultiplierAdjustment from "../../../src/FlatAndMultiplierAdjustment";
import GuardCoverage from "../../../src/GuardCoverage";
import StatusEffect from "../../../src/StatusEffect";
import Unit from "../../../src/Unit";
import {UnitAttributeAdjustments} from "../../../src/UnitAttributes";


interface UnboundEffectAction<T>
{
  (data: T, user: Unit, target: Unit, battle: Battle): void;
}

// so we preserve typing for bound data
// https://github.com/Microsoft/TypeScript/issues/212
export function bindEffectActionData<T>(toBind: UnboundEffectAction<T>, data: T): AbilityEffectAction
{
  return toBind.bind(null, data);
}


interface DamageWithType
{
  baseDamage: number;
  damageType: DamageType;
}

interface Adjustment 
{
  flat?: number;
  perAttribute?: UnitAttributeAdjustments;
}

interface GuardCoverageObj
{
  coverage: GuardCoverage;
}



export const inflictDamage: UnboundEffectAction<DamageWithType> = function(
  data: DamageWithType,
  user: Unit, target: Unit, battle: Battle)
{
  const adjustedDamage = getAdjustedDamage(user, target, data.baseDamage, data.damageType);

  target.receiveDamage(adjustedDamage);
}

export const addGuard: UnboundEffectAction<Adjustment & GuardCoverageObj> = function(
  data: Adjustment & GuardCoverageObj,
  user: Unit, target: Unit, battle: Battle)
{
  const guardAmount = user.attributes.modifyValueByAttributes(data.flat, data.perAttribute);
  target.addGuard(guardAmount, data.coverage);
}

export const receiveCounterAttack: UnboundEffectAction<{baseDamage: number}> = function(
  data: {baseDamage: number},
  user: Unit, target: Unit, battle: Battle)
{
  const counterStrength = target.getCounterAttackStrength();

  if (counterStrength)
  {
    inflictDamage(
      {
        baseDamage: data.baseDamage * counterStrength,
        damageType: DamageType.physical
      },
      target, user, battle
    );
  }
}


export const increaseCaptureChance: UnboundEffectAction<FlatAndMultiplierAdjustment> = function(
  data: FlatAndMultiplierAdjustment,
  user: Unit, target: Unit, battle: Battle)
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
export const addStatusEffect: UnboundEffectAction<{template: StatusEffectTemplate, duration: number}> = function(
  data: {template: StatusEffectTemplate, duration: number},
  user: Unit, target: Unit, battle: Battle)
{
  target.addStatusEffect(new StatusEffect(data.template, data.duration));
}
export const adjustHealth: UnboundEffectAction<{flat?: number; maxHealthPercentage?: number; perUserUnit?: number}> = function(
  data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number},
  user: Unit, target: Unit, battle: Battle)
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
