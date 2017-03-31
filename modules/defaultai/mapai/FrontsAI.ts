import {Front} from "./Front";
import MapEvaluator from "./MapEvaluator";
import Objective from "./Objective";
import {ObjectivesAI} from "./ObjectivesAI";

import GalaxyMap from "../../../src/GalaxyMap";
import Game from "../../../src/Game";
import Personality from "../../../src/Personality";
import Player from "../../../src/Player";
import Unit from "../../../src/Unit";

interface FrontUnitScore
{
  unit: Unit;
  front: Front;
  score: number;
}
export default class FrontsAI
{
  private player: Player;
  private map: GalaxyMap;
  private game: Game;
  private mapEvaluator: MapEvaluator;
  private objectivesAI: ObjectivesAI;
  private personality: Personality;

  private fronts: Front[] = [];
  private frontsRequestingUnits: Front[] = [];
  private frontsToMove: Front[] = [];

  constructor(
    mapEvaluator: MapEvaluator,
    objectivesAI: ObjectivesAI,
    personality: Personality,
    game: Game,
  )
  {
    this.mapEvaluator = mapEvaluator;
    this.map = mapEvaluator.map;
    this.player = mapEvaluator.player;
    this.objectivesAI = objectivesAI;
    this.personality = personality;
    this.game = game;
  }

  public assignUnits(): void
  {
    const units = this.player.units;

    const allUnitScores: FrontUnitScore[] = [];
    const unitScoresByFront:
    {
      [frontId: number]: FrontUnitScore[];
    } = {};

    const recalculateScoresForFront = (front: Front) =>
    {
      const frontScores = unitScoresByFront[front.id];

      for (let i = 0; i < frontScores.length; i++)
      {
        frontScores[i].score = front.scoreUnitFit(frontScores[i].unit);
      }
    };

    const removeUnit = (unit: Unit) =>
    {
      for (let frontId in unitScoresByFront)
      {
        unitScoresByFront[frontId] = unitScoresByFront[frontId].filter(score =>
        {
          return score.unit !== unit;
        });
      }
    };

    for (let i = 0; i < this.fronts.length; i++)
    {
      const frontScores = this.getUnitScoresForFront(units, this.fronts[i]);
      unitScoresByFront[this.fronts[i].id] = frontScores;
      allUnitScores.push(...frontScores);
    }

    const alreadyAdded:
    {
      [unitId: number]: boolean;
    } = {};

    // ascending
    const sortByScoreFN = (a: FrontUnitScore, b: FrontUnitScore) =>
    {
      return a.score - b.score;
    };

    while (allUnitScores.length > 0)
    {
      // sorted in loop as scores get recalculated every iteration
      allUnitScores.sort(sortByScoreFN);

      const bestScore = allUnitScores.pop();
      if (alreadyAdded[bestScore.unit.id])
      {
        continue;
      }

      bestScore.front.addUnit(bestScore.unit);

      removeUnit(bestScore.unit);
      alreadyAdded[bestScore.unit.id] = true;
      recalculateScoresForFront(bestScore.front);
    }
  }
  public organizeFleets(): void
  {
    for (let i = 0; i < this.fronts.length; i++)
    {
      this.fronts[i].organizeAllFleets();
    }
  }
  public formFronts(): void
  {
    /*
    dissolve old fronts without an active objective
    create new fronts for every objective not already assoicated with one
     */
    this.removeInactiveFronts();

    for (let i = 0; i < this.objectivesAI.objectives.length; i++)
    {
      const objective = this.objectivesAI.objectives[i];
      if (!objective.template.moveRoutineFN)
      {
        continue;
      }

      if (!this.getFrontWithId(objective.id))
      {
        const front = this.createFront(objective);
        this.fronts.push(front);
      }
    }
  }
  public setFrontsToMove(): void
  {
    this.frontsToMove = this.fronts.slice(0);

    this.frontsToMove.sort((a, b) =>
    {
      return a.objective.template.movePriority - b.objective.template.movePriority;
    });
  }
  public moveFleets(afterMovingAllCallback: () => void): void
  {
    if (this.game.hasEnded)
    {
      return;
    }
    const front = this.frontsToMove.pop();

    if (!front)
    {
      afterMovingAllCallback();

      return;
    }

    front.moveFleets(this.moveFleets.bind(this, afterMovingAllCallback));
  }
  public setUnitRequests()
  {
    /*for each front that doesnt fulfill minimum unit requirement
      make request with same priority of front
    */

    this.frontsRequestingUnits = [];

    for (let i = 0; i < this.fronts.length; i++)
    {
      const front = this.fronts[i];
      if (front.units.length < front.idealUnitsDesired)
      {
        this.frontsRequestingUnits.push(front);
      }
    }
  }

  private getUnitScoresForFront(units: Unit[], front: Front): FrontUnitScore[]
  {
    const scores: FrontUnitScore[] = [];

    for (let i = 0; i < units.length; i++)
    {
      scores.push(
      {
        unit: units[i],
        score: front.scoreUnitFit(units[i]),
        front: front,
      });
    }

    return scores;
  }
  private getFrontWithId(id: number): Front | null
  {
    for (let i = 0; i < this.fronts.length; i++)
    {
      if (this.fronts[i].id === id)
      {
        return this.fronts[i];
      }
    }

    return null;
  }
  private createFront(objective: Objective): Front
  {
    const musterLocation = objective.target ?
      this.player.getNearestOwnedStarTo(objective.target) :
      null;
    const unitsDesired = objective.getUnitsDesired(this.mapEvaluator);

    const front = new Front(
    {
      id: objective.id,
      objective: objective,

      minUnitsDesired: unitsDesired.min,
      idealUnitsDesired: unitsDesired.ideal,

      targetLocation: objective.target,
      musterLocation: musterLocation,
    });

    return front;
  }
  private removeInactiveFronts(): void
  {
    // loop backwards because splicing
    for (let i = this.fronts.length - 1; i >= 0; i--)
    {
      const front = this.fronts[i];
      let hasActiveObjective = false;

      for (let j = 0; j < this.objectivesAI.objectives.length; j++)
      {
        const objective = this.objectivesAI.objectives[j];
        if (objective.id === front.id)
        {
          hasActiveObjective = true;
          break;
        }
      }

      if (!hasActiveObjective)
      {
        this.fronts.splice(i, 1);
      }
    }
  }
}
