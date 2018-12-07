import DamageType from "../../../src/DamageType";
import Unit from "../../../src/Unit";

import
{
  getAttackDamageIncrease,
} from "./damageAdjustment";


export interface HealthAdjustment
{
  flat?: number;
  maxHealthPercentage?: number;
  perUserUnit?: number;
}

export function calculateHealthAdjustment(user: Unit, target: Unit, data: HealthAdjustment): number
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
}
