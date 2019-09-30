import {Player} from "core/src/player/Player";
import
{
  getRandomArrayItem,
} from "core/src/generic/utility";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";

import {EconomicObjective} from "./common/EconomicObjective";
import {FrontObjective} from "./common/FrontObjective";
import {Objective} from "./common/Objective";
import {ObjectiveFamily} from "./common/ObjectiveFamily";


// can't actually ignore specific errors
// https://github.com/Microsoft/TypeScript/issues/19139
// @ts-ignore 2417
export class BuildUnitsForFront extends EconomicObjective
{
  public static readonly type = "BuildUnitsForFront";
  public readonly type = "BuildUnitsForFront";

  protected readonly ongoingMultiplier = 1;

  private objective: FrontObjective;
  private player: Player;

  constructor(objective: FrontObjective, player: Player)
  {
    super(objective.finalPriority);

    this.objective = objective;
    this.player = player;
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): BuildUnitsForFront[]
  {
    const frontObjectives = <FrontObjective[]> allOngoingObjectives.filter(objective =>
    {
      return objective.family === ObjectiveFamily.Front;
    });

    const frontObjectivesRequestingUnits = frontObjectives.filter(objective =>
    {
      return objective.evaluateCurrentCombatStrength() < objective.getIdealRequiredCombatStrength();
    });

    return frontObjectivesRequestingUnits.map(objective =>
    {
      return new BuildUnitsForFront(objective, mapEvaluator.player);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    // todo
    return 0.66;
  }
  protected static updateOngoingObjectivesList(
    allOngoingObjectives: Objective[],
    createdObjectives: BuildUnitsForFront[],
  ): Objective[]
  {
    return this.replaceObjectives(allOngoingObjectives, createdObjectives);
  }

  public execute(afterDoneCallback: () => void): void
  {
    // TODO 2017.04.10 | no logic behind unit selection
    // have to balance building location, target fleet & unit type.
    // too expensive without approximation?
    // probably just reuse monte carlo tree search approach from battle ai
    // heuristic: money required, unit composition (global & local), strength, objective priority, etc.

    // TODO 2017.04.10 | what about unit assignment for fronts?
    // actually solvable since we only need to match unit to front?
    // it's still done stupidly for now

    const manufactoryLocation = this.objective.getRallyPoint().getNearestStarForQualifier(location =>
    {
      return location.owner === this.player && location.manufactory && !location.manufactory.queueIsFull();
    });

    if (!manufactoryLocation)
    {
      afterDoneCallback();

      return;
    }

    const manufactory = manufactoryLocation.manufactory;

    const unitType = getRandomArrayItem(manufactory.getManufacturableUnits());

    if (this.player.canAfford({money: unitType.buildCost}))
    {
      manufactory.addThingToQueue(unitType, "unit");
    }

    afterDoneCallback();
  }
}

