import {Front} from "./Front";
import MapEvaluator from "./MapEvaluator";
import Objective from "./Objective";
import {ObjectivesAI} from "./ObjectivesAI";

import GalaxyMap from "../../../src/GalaxyMap";
import Game from "../../../src/Game";
import Personality from "../../../src/Personality";
import Player from "../../../src/Player";
import Unit from "../../../src/Unit";

interface IFrontUnitScore
{
  unit: Unit;
  front: Front;
  score: number;
}
export default class FrontsAI
{
  player: Player;
  map: GalaxyMap;
  game: Game;
  mapEvaluator: MapEvaluator;
  objectivesAI: ObjectivesAI;
  personality: Personality;

  fronts: Front[] = [];
  frontsRequestingUnits: Front[] = [];
  frontsToMove: Front[] = [];

  constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI,
    personality: Personality, game: Game)
  {
    this.mapEvaluator = mapEvaluator;
    this.map = mapEvaluator.map;
    this.player = mapEvaluator.player;
    this.objectivesAI = objectivesAI;
    this.personality = personality;
    this.game = game;
  }

  private getUnitScoresForFront(units: Unit[], front: Front)
  {
    const scores: IFrontUnitScore[] = [];

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

  assignUnits()
  {
    const units = this.player.units;

    const allUnitScores: IFrontUnitScore[] = [];
    const unitScoresByFront:
    {
      [frontId: number]: any[];
    } = {};

    const recalculateScoresForFront = function(front: Front)
    {
      const frontScores = unitScoresByFront[front.id];

      for (let i = 0; i < frontScores.length; i++)
      {
        frontScores[i].score = front.scoreUnitFit(frontScores[i].unit);
      }
    };

    const removeUnit = function(unit: Unit)
    {
      for (let frontId in unitScoresByFront)
      {
        unitScoresByFront[frontId] = unitScoresByFront[frontId].filter(function(score)
        {
          return score.unit !== unit;
        });
      }
    };

    // ascending
    const sortByScoreFN = function(a: IFrontUnitScore, b: IFrontUnitScore)
    {
      return a.score - b.score;
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

  getFrontWithId(id: number)
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

  createFront(objective: Objective)
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

  removeInactiveFronts()
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

  formFronts()
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

  organizeFleets()
  {
    for (let i = 0; i < this.fronts.length; i++)
    {
      this.fronts[i].organizeAllFleets();
    }
  }

  setFrontsToMove()
  {
    this.frontsToMove = this.fronts.slice(0);

    this.frontsToMove.sort(function(a: Front, b: Front)
    {
      return a.objective.template.movePriority - b.objective.template.movePriority;
    });
  }

  moveFleets(afterMovingAllCallback: Function)
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

  setUnitRequests()
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
}
