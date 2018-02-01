import
{
  UnboundEffectAction
} from "./effectActionBinding";
import
{
  getAdjustedDamage,
} from "./damageAdjustment";
import
{
  calculateHealthAdjustment,
  HealthAdjustment,
} from "./healthAdjustment";
import {ResultType} from "./ResultType";

import Battle from "../../../src/Battle";
import DamageType from "../../../src/DamageType";
import FlatAndMultiplierAdjustment from "../../../src/FlatAndMultiplierAdjustment";
import GuardCoverage from "../../../src/GuardCoverage";
import StatusEffect from "../../../src/StatusEffect";
import Unit from "../../../src/Unit";
import {UnitAttributeAdjustments} from "../../../src/UnitAttributes";
import
{
  ExecutedEffectsResult,
} from "../../../src/templateinterfaces/AbilityEffectAction";
import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";
import
{
  clamp,
} from "../../../src/utility";

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

interface ExecutedEffectsResultAdjustment
{
  executedEffectsResultAdjustment?: (executedEffectsResult: ExecutedEffectsResult) => number;
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

  if (!executedEffectsResult[ResultType.HealthChanged])
  {
    executedEffectsResult[ResultType.HealthChanged] = 0;
  }
  executedEffectsResult[ResultType.HealthChanged] -= adjustedDamage;

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

export const addStatusEffect: UnboundEffectAction<{template: UnitEffectTemplate, duration: number}> = function(
  data: {template: UnitEffectTemplate, duration: number},
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

  if (!executedEffectsResult[ResultType.HealthChanged])
  {
    executedEffectsResult[ResultType.HealthChanged] = 0;
  }
  executedEffectsResult[ResultType.HealthChanged] += clamped;

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

export const adjustBattleEvaluationAdjustment: UnboundEffectAction<Adjustment> = (
  data: Adjustment,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
): void =>
{
  const adjustment = user.attributes.modifyValueByAttributes(data.flat, data.perAttribute);
  const sign = target.battleStats.side === "side1" ? 1 : -1;

  battle.evaluationAdjustment += adjustment * sign;
};

export const adjustDefenderBattleEvaluationAdjustment: UnboundEffectAction<{amount: number}> = (
  data: {amount: number},
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
): void =>
{
  const defender = battle.battleData.defender.player;
  const defendingSide = battle.getSideForPlayer(defender);

  const sign = defendingSide === "side1" ? 1 : -1;

  battle.evaluationAdjustment += data.amount * sign;
};

