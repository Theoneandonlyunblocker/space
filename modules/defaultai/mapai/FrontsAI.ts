import {Front} from "./Front";
import MapEvaluator from "./MapEvaluator";
import ObjectivesAI from "./ObjectivesAI";
import Objective from "./Objective";

import Unit from "../../../src/Unit";
import Game from "../../../src/Game";
import Player from "../../../src/Player";
import GalaxyMap from "../../../src/GalaxyMap";
import Personality from "../../../src/Personality";

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
    var scores: IFrontUnitScore[] = [];

    for (let i = 0; i < units.length; i++)
    {
      scores.push(
      {
        unit: units[i],
        score: front.scoreUnitFit(units[i]),
        front: front
      });
    }

    return scores;
  }

  assignUnits()
  {
    var units = this.player.units;

    var allUnitScores: IFrontUnitScore[] = [];
    var unitScoresByFront:
    {
      [frontId: number]: any[];
    } = {};

    var recalculateScoresForFront = function(front: Front)
    {
      var frontScores = unitScoresByFront[front.id];

      for (let i = 0; i < frontScores.length; i++)
      {
        frontScores[i].score = front.scoreUnitFit(frontScores[i].unit);
      }
    }

    var removeUnit = function(unit: Unit)
    {
      for (let frontId in unitScoresByFront)
      {
        unitScoresByFront[frontId] = unitScoresByFront[frontId].filter(function(score)
        {
          return score.unit !== unit;
        });
      }
    }

    // ascending
    var sortByScoreFN = function(a: IFrontUnitScore, b: IFrontUnitScore)
    {
      return a.score - b.score;
    }

    for (let i = 0; i < this.fronts.length; i++)
    {
      var frontScores = this.getUnitScoresForFront(units, this.fronts[i]);
      unitScoresByFront[this.fronts[i].id] = frontScores;
      allUnitScores = allUnitScores.concat(frontScores);
    }

    var alreadyAdded:
    {
      [unitId: number]: boolean;
    } = {};


    while (allUnitScores.length > 0)
    {
      // sorted in loop as scores get recalculated every iteration
      allUnitScores.sort(sortByScoreFN);

      var bestScore = allUnitScores.pop();
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
    var musterLocation = objective.target ?
      this.player.getNearestOwnedStarTo(objective.target) :
      null;
    var unitsDesired = objective.getUnitsDesired(this.mapEvaluator);

    var front = new Front(
    {
      id: objective.id,
      objective: objective,

      minUnitsDesired: unitsDesired.min,
      idealUnitsDesired: unitsDesired.ideal,

      targetLocation: objective.target,
      musterLocation: musterLocation
    });

    return front;
  }

  removeInactiveFronts()
  {
    // loop backwards because splicing
    for (let i = this.fronts.length - 1; i >= 0; i--)
    {
      var front = this.fronts[i];
      var hasActiveObjective = false;

      for (let j = 0; j < this.objectivesAI.objectives.length; j++)
      {
        var objective = this.objectivesAI.objectives[j];
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
      var objective = this.objectivesAI.objectives[i];
      if (!objective.template.moveRoutineFN)
      {
        continue;
      }

      if (!this.getFrontWithId(objective.id))
      {
        var front = this.createFront(objective);
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
    var front = this.frontsToMove.pop();

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
      var front = this.fronts[i];
      if (front.units.length < front.idealUnitsDesired)
      {
        this.frontsRequestingUnits.push(front);
      }
    }
  }
}
