import
{
  getAdjustedDamage,
  getAttackDamageIncrease,
} from "./damageAdjustments";

import Battle from "../../../src/Battle";
import DamageType from "../../../src/DamageType";
import FlatAndMultiplierAdjustment from "../../../src/FlatAndMultiplierAdjustment";
import GuardCoverage from "../../../src/GuardCoverage";
import StatusEffect from "../../../src/StatusEffect";
import Unit from "../../../src/Unit";
import {UnitAttributeAdjustments} from "../../../src/UnitAttributes";
import
{
  AbilityEffectAction,
  ExecutedEffectsResult,
} from "../../../src/templateinterfaces/AbilityEffectAction";
import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";
import
{
  clamp,
} from "../../../src/utility";


interface UnboundEffectAction<T>
{
  (
    data: T,
    user: Unit,
    target: Unit,
    battle: Battle,
    executedEffectsResult: ExecutedEffectsResult
  ): void;
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

interface HealthAdjustment
{
  flat?: number;
  maxHealthPercentage?: number;
  perUserUnit?: number;
}
const calculateHealthAdjustment = (user: Unit, target: Unit, data: HealthAdjustment) =>
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
    healAmount += data.perUserUnit * getAttackDamageIncrease(user, DamageType.Magical);
  }

  return healAmount;
};

interface ExecutedEffectsResultAdjustment
{
  executedEffectsResultAdjustment?: (executedEffectsResult: ExecutedEffectsResult) => number;
}
export enum resultType
{
  HealthChanged,
}


export const inflictDamage: UnboundEffectAction<DamageWithType> = function(
  data: DamageWithType,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  const adjustedDamage = getAdjustedDamage(user, target, data.baseDamage, data.damageType);

  if (!executedEffectsResult[resultType.HealthChanged])
  {
    executedEffectsResult[resultType.HealthChanged] = 0;
  }
  executedEffectsResult[resultType.HealthChanged] -= adjustedDamage;

  target.receiveDamage(adjustedDamage);
};

export const addGuard: UnboundEffectAction<Adjustment & GuardCoverageObj> = function(
  data: Adjustment & GuardCoverageObj,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  const guardAmount = user.attributes.modifyValueByAttributes(data.flat, data.perAttribute);
  target.addGuard(guardAmount, data.coverage);
};

export const receiveCounterAttack: UnboundEffectAction<{baseDamage: number}> = function(
  data: {baseDamage: number},
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  const counterStrength = target.getCounterAttackStrength();

  if (counterStrength)
  {
    inflictDamage(
      {
        baseDamage: data.baseDamage * counterStrength,
        damageType: DamageType.Physical,
      },
      target,
      user,
      battle,
      executedEffectsResult,
    );
  }
};


export const increaseCaptureChance: UnboundEffectAction<FlatAndMultiplierAdjustment> = function(
  data: FlatAndMultiplierAdjustment,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  if (data.flat)
  {
    target.battleStats.captureChance += data.flat;
  }
  if (isFinite(data.multiplier))
  {
    target.battleStats.captureChance *= data.multiplier;
  }
};
export const addStatusEffect: UnboundEffectAction<{template: StatusEffectTemplate, duration: number}> = function(
  data: {template: StatusEffectTemplate, duration: number},
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  target.addStatusEffect(new StatusEffect(
  {
    template: data.template,
    turnsToStayActiveFor: data.duration,
    sourceUnit: user,
  }));
};
export const adjustHealth: UnboundEffectAction<ExecutedEffectsResultAdjustment & HealthAdjustment> = function(
  data: ExecutedEffectsResultAdjustment & HealthAdjustment,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  let healAmount = calculateHealthAdjustment(user, target, data);
  if (data.executedEffectsResultAdjustment)
  {
    healAmount += data.executedEffectsResultAdjustment(executedEffectsResult);
  }

  const minAdjustment = -target.currentHealth;
  const maxAdjustment = target.maxHealth - target.currentHealth;
  const clamped = clamp(healAmount, minAdjustment, maxAdjustment);

  if (!executedEffectsResult[resultType.HealthChanged])
  {
    executedEffectsResult[resultType.HealthChanged] = 0;
  }
  executedEffectsResult[resultType.HealthChanged] += clamped;

  target.addHealth(clamped);
};
export const adjustCurrentAndMaxHealth: UnboundEffectAction<ExecutedEffectsResultAdjustment & HealthAdjustment> = function(
  data: ExecutedEffectsResultAdjustment & HealthAdjustment,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
)
{
  let healAmount = calculateHealthAdjustment(user, target, data);

  if (data.executedEffectsResultAdjustment)
  {
    healAmount += data.executedEffectsResultAdjustment(executedEffectsResult);
  }

  target.addMaxHealth(healAmount);
  target.addHealth(healAmount);
};

