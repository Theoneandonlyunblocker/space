import {Manufactory} from "core/src/production/Manufactory";
import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";

import {EconomicObjective} from "./common/EconomicObjective";
import {Objective} from "./common/Objective";
import { Resources, getBaseValuablenessOfResources } from "core/src/player/PlayerResources";


// @ts-ignore 2417
export class ExpandManufactoryCapacity extends EconomicObjective
{
  public static override readonly type = "ExpandManufactoryCapacity";
  public readonly type = "ExpandManufactoryCapacity";

  public readonly target: Star;

  private readonly player: Player;

  constructor(score: number, player: Player, target: Star)
  {
    super(score);

    this.player = player;
    this.target = target;
  }

  protected static override createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): ExpandManufactoryCapacity[]
  {
    const starsThatCanExpand = mapEvaluator.player.controlledLocations.filter(star =>
    {
      return !star.manufactory || star.manufactory.capacity < star.manufactory.maxCapacity;
    });

    return starsThatCanExpand.map(star =>
    {
      const upgradeScore = 1;

      const upgradeCost = ExpandManufactoryCapacity.getCostForStar(star);
      const baseManufactoryBuildCost = Manufactory.getBuildCost();
      const costScore = getBaseValuablenessOfResources(baseManufactoryBuildCost) / getBaseValuablenessOfResources(upgradeCost);

      const score = costScore + Math.pow(upgradeScore, 2);

      return new ExpandManufactoryCapacity(score, mapEvaluator.player, star);
    });
  }
  protected static override evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    // TODO 2017.02.25 | manufacturing demand / manufacturing capacity
    return grandStrategyAi.desireForConsolidation;
  }
  protected static override updateOngoingObjectivesList(
    allOngoingObjectives: Objective[],
    createdObjectives: ExpandManufactoryCapacity[],
  ): Objective[]
  {
    return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
  }

  private static getCostForStar(star: Star): Resources
  {
    return star.manufactory ?
      star.manufactory.getCapacityUpgradeCost() :
      Manufactory.getBuildCost();
  }

  public execute(afterDoneCallback: () => void): void
  {
    const upgradeCost = ExpandManufactoryCapacity.getCostForStar(this.target);
    const canAffordUpgrade = this.player.canAfford(upgradeCost);

    if (canAffordUpgrade)
    {
      if (this.target.manufactory)
      {
        this.target.manufactory.upgradeCapacity(1);
      }
      else
      {
        this.target.buildManufactory();
        this.player.removeResources(Manufactory.getBuildCost());
      }
    }

    afterDoneCallback();
  }
}

