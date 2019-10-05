import {Unit} from "core/src/unit/Unit";
import { getBaseValuablenessOfResources } from "core/src/player/PlayerResources";


export class UnitEvaluator
{
  constructor()
  {

  }
  public evaluateCombatStrength(...units: Unit[]): number
  {
    let strength = 0;

    // TODO 2017.02.20 | take more than health into account
    units.forEach(unit =>
    {
      strength += unit.currentHealth;
    });

    return strength;
  }
  public evaluateMapStrength(...units: Unit[]): number
  {
    return this.evaluateCombatStrength(...units);
  }
  public evaluateUnitScoutingAbility(unit: Unit): number
  {
    let score = 0;

    // ++ vision
    const visionRange = unit.getVisionRange();
    if (visionRange < 0)
    {
      return -Infinity;
    }
    else
    {
      score += Math.pow(visionRange, 1.5) / 2;
    }

    // ++ stealth
    const isStealthy = unit.isStealthy();
    if (isStealthy)
    {
      score *= 1.5;
    }

    // -- cost
    score /= getBaseValuablenessOfResources(unit.getTotalCost());

    return score;
  }
}
