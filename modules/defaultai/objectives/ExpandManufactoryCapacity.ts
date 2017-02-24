import {EconomicObjective} from "./common/EconomicObjective";

import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Manufactory from "../../../src/Manufactory";
import Star from "../../../src/Star";
import ValuesByStar from "../../../src/ValuesByStar";

export class ExpandManufactoryCapacity extends EconomicObjective
{
  public type = "ExpandManufactoryCapacity";

  constructor(priority: number, target: Star)
  {
    super(priority, target, ExpandManufactoryCapacity.getCostForStar(target));
  }

  public static createObjectives(
    grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator,
  ): ExpandManufactoryCapacity[]
  {
    const baseDesire = grandStrategyAI.desireForConsolidation;
    // TODO 24.02.2017 | baseDesire += manufacturing demand / manufacturing capacity

    const starsThatCanExpand = mapEvaluator.player.controlledLocations.filter(star =>
    {
      return !star.manufactory || star.manufactory.capacity < star.manufactory.maxCapacity;
    });

    const scoresByStar = new ValuesByStar<number>(starsThatCanExpand, star =>
    {
      const upgradeScore = star.manufactory ?
        1 * star.manufactory.unitStatsModifier * star.manufactory.unitHealthModifier :
        1;

      const upgradeCost = ExpandManufactoryCapacity.getCostForStar(star);
      const costScore = Manufactory.getBuildCost() / upgradeCost;

      return costScore + Math.pow(upgradeScore, 2);
    });

    const starsSortedByScore = scoresByStar.sort((a, b) =>
    {
      return b - a;
    });

    // TODO 24.02.2017 | create multiple objectives if enough money
    const starsToCreateObjectiveFor = [starsSortedByScore[0]];

    return starsToCreateObjectiveFor.map(star =>
    {
      return new ExpandManufactoryCapacity(baseDesire, star);
    });
  }
  private static getCostForStar(star: Star): number
  {
    return star.manufactory ?
      star.manufactory.getCapacityUpgradeCost() :
      Manufactory.getBuildCost();
  }
  public execute(afterDoneCallback: () => void): void
  {
    const upgradeCost = ExpandManufactoryCapacity.getCostForStar(this.target);
    const canAffordUpgrade = upgradeCost <= player.money;

    if (canAffordUpgrade)
    {
      if (this.target.manufactory)
      {
        this.target.manufactory.upgradeCapacity(1);
      }
      else
      {
        this.target.buildManufactory();
        player.money -= Manufactory.getBuildCost();
      }
    }

    afterDoneCallback();
  }
}

