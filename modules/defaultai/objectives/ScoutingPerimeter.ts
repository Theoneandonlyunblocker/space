import {FrontObjective} from "./common/FrontObjective";
import {movePriority} from "./common/movePriority";

import {moveToTarget} from "./common/moveroutines/moveToTarget";

import {Front} from "../mapai/Front";
import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import DiplomacyState from "../../../src/DiplomacyState";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";
import ValuesByStar from "../../../src/ValuesByStar";


export class ScoutingPerimeter extends FrontObjective
{
  public readonly type = "Discovery";
  public readonly movePriority = movePriority.scoutingPerimeter;

  public readonly target: Star;

  protected constructor(score: number, target: Star)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: ScoutingPerimeter[]): ScoutingPerimeter[]
  {
    const playersToEstablishPerimeterAgainst: Player[] = [];
    const diplomacyStatus = mapEvaluator.player.diplomacyStatus;
    const statusByPlayer = diplomacyStatus.statusByPlayer;
    for (let playerId in statusByPlayer)
    {
      if (statusByPlayer[playerId] >= DiplomacyState.war)
      {
        playersToEstablishPerimeterAgainst.push(diplomacyStatus.metPlayers[playerId]);
      }
    }

    const allScores = playersToEstablishPerimeterAgainst.map(player =>
    {
      return mapEvaluator.getScoredPerimeterLocationsAgainstPlayer(player, 1, true);
    });

    const mergedScores = new ValuesByStar<number>();

    mergedScores.merge((...scores) =>
    {
      return scores.reduce((total, current) =>
      {
        return total + current;
      }, 0);
    }, ...allScores);

    return mergedScores.map((star, score) =>
    {
      return new ScoutingPerimeter(score, star);
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForConsolidation;
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.moveUnits(this.front, this.mapEvaluator, afterDoneCallback);
  }

  protected moveUnits(
    front: Front,
    mapEvaluator: MapEvaluator,
    afterDoneCallback: () => void,
  ): void
  {
    moveToTarget(front, afterDoneCallback, fleet =>
    {
      return this.target;
    });
  }
  protected evaluateUnitFit(unit: Unit): number
  {
    const scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);;

    return scoutingScore * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
  }
  protected getMinimumRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
  protected getIdealRequiredCombatStrength(mapEvaluator: MapEvaluator): number
  {
    return 0;
  }
}
