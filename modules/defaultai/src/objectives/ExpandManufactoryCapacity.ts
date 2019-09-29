import {Manufactory} from "core/src/production/Manufactory";
import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";

import {EconomicObjective} from "./common/EconomicObjective";
import {Objective} from "./common/Objective";


// @ts-ignore 2417
export class ExpandManufactoryCapacity extends EconomicObjective
{
  public static readonly type = "ExpandManufactoryCapacity";
  public readonly type = "ExpandManufactoryCapacity";

  public readonly target: Star;

  private readonly player: Player;

  constructor(score: number, player: Player, target: Star)
  {
    super(score);

    this.player = player;
    this.target = target;
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): ExpandManufactoryCapacity[]
  {
    const starsThatCanExpand = mapEvaluator.player.controlledLocations.filter(star =>
    {
      return !star.manufactory || star.manufactory.capacity < star.manufactory.maxCapacity;
    });

    return starsThatCanExpand.map(star =>
    {
      const upgradeScore = star.manufactory ?
        1 * star.manufactory.unitStatsModifier * star.manufactory.unitHealthModifier :
        1;

      const upgradeCost = ExpandManufactoryCapacity.getCostForStar(star);
      const costScore = Manufactory.getBuildCost() / upgradeCost;

      const score = costScore + Math.pow(upgradeScore, 2);

      return new ExpandManufactoryCapacity(score, mapEvaluator.player, star);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    // TODO 2017.02.25 | manufacturing demand / manufacturing capacity
    return grandStrategyAi.desireForConsolidation;
  }
  protected static updateOngoingObjectivesList(
    allOngoingObjectives: Objective[],
    createdObjectives: ExpandManufactoryCapacity[],
  ): Objective[]
  {
    return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
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
    const canAffordUpgrade = upgradeCost <= this.player.resources.money;

    if (canAffordUpgrade)
    {
      if (this.target.manufactory)
      {
        this.target.manufactory.upgradeCapacity(1);
      }
      else
      {
        this.target.buildManufactory();
        this.player.resources.money -= Manufactory.getBuildCost();
      }
    }

    afterDoneCallback();
  }
}

