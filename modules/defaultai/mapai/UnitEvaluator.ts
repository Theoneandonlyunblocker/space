import {Front} from "./Front";

import Unit from "../../../src/Unit";

export class UnitEvaluator
{
  constructor()
  {

  }
  public evaluateCombatStrength(...units: Unit[]): number
  {
    let strength = 0;

    // TODO 20.02.2017 |
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

  public evaluateDefaultFrontFit(
    unit: Unit,
    front: Front,
    lowHealthThreshhold: number = 0.75,
    healthAdjust: number = 1,
    distanceAdjust: number = 1,
  )
  {
    let score = 1;

    // penalize units on low health
    const healthPercentage = unit.currentHealth / unit.maxHealth;

    if (healthPercentage < lowHealthThreshhold)
    {
      score *= healthPercentage * healthAdjust;
    }

    // prioritize units closer to front target
    let turnsToReach = unit.getTurnsToReachStar(front.targetLocation);
    if (turnsToReach > 0)
    {
      turnsToReach *= distanceAdjust;
      const distanceMultiplier = 1 / (Math.log(turnsToReach + 2.5) / Math.log(2.5));
      score *= distanceMultiplier;
    }

    return score;
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
    score /= unit.getTotalCost();

    return score;
  }
}
