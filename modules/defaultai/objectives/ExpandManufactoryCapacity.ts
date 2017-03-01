import {EconomicObjective} from "./common/EconomicObjective";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Manufactory from "../../../src/Manufactory";
import Player from "../../../src/Player";
import Star from "../../../src/Star";

export class ExpandManufactoryCapacity extends EconomicObjective
{
  public readonly type = "ExpandManufactoryCapacity";

  public readonly target: Star;

  constructor(score: number, player: Player, target: Star)
  {
    super(score, ExpandManufactoryCapacity.getCostForStar(target), player);

    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: ExpandManufactoryCapacity[]): ExpandManufactoryCapacity[]
  {
    const starsThatCanExpand = mapEvaluator.player.controlledLocations.filter(star =>
    {
      return !star.manufactory || star.manufactory.capacity < star.manufactory.maxCapacity;
    });

    const currentObjectivesByTarget = this.getObjectivesByTarget(currentObjectives);

    return starsThatCanExpand.map(star =>
    {
      const upgradeScore = star.manufactory ?
        1 * star.manufactory.unitStatsModifier * star.manufactory.unitHealthModifier :
        1;

      const upgradeCost = ExpandManufactoryCapacity.getCostForStar(star);
      const costScore = Manufactory.getBuildCost() / upgradeCost;

      const score = costScore + Math.pow(upgradeScore, 2);

      if (currentObjectivesByTarget.has(star))
      {
        const ongoing = currentObjectivesByTarget.get(star);
        ongoing.score = score;
        return ongoing;
      }
      else
      {
        return new ExpandManufactoryCapacity(score, mapEvaluator.player, star);
      }
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    // TODO 25.02.2017 | manufacturing demand / manufacturing capacity
    return grandStrategyAI.desireForConsolidation;
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
    const canAffordUpgrade = upgradeCost <= this.player.money;

    if (canAffordUpgrade)
    {
      if (this.target.manufactory)
      {
        this.target.manufactory.upgradeCapacity(1);
      }
      else
      {
        this.target.buildManufactory();
        this.player.money -= Manufactory.getBuildCost();
      }
    }

    afterDoneCallback();
  }
}

