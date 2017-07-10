import {Front} from "./Front";
import MapEvaluator from "./MapEvaluator";
import {ObjectivesAI} from "./ObjectivesAI";

import {FrontObjective} from "../objectives/common/FrontObjective";

import GalaxyMap from "../../../src/GalaxyMap";
import Game from "../../../src/Game";
import {IDDictionary} from "../../../src/IDDictionary";
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

    const objectivesByFront = new IDDictionary<Front, FrontObjective>();
    this.objectivesAI.getFrontObjectives().forEach(objective =>
    {
      objectivesByFront.set(objective.front, objective);
    });

    const recalculateScoresForFront = (front: Front) =>
    {
      const frontScores = unitScoresByFront[front.id];
      const objective = objectivesByFront.get(front);

      for (let i = 0; i < frontScores.length; i++)
      {
        frontScores[i].score = objective.evaluateUnitFit(frontScores[i].unit);
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
    this.destroyInactiveFronts();

    this.fronts = this.objectivesAI.getFrontObjectives().map(objective => objective.front);
  }

  private getUnitScoresForFront(units: Unit[], front: Front): FrontUnitScore[]
  {
    const scores: FrontUnitScore[] = [];

    // TODO 2017.04.06 | this is really stupid
    const activeObjectives = this.objectivesAI.getFrontObjectives();
    let objective: FrontObjective;

    for (let i = 0; i < activeObjectives.length; i++)
    {
      if (activeObjectives[i].front === front)
      {
        objective = activeObjectives[i];
        break;
      }
    }

    for (let i = 0; i < units.length; i++)
    {
      scores.push(
      {
        unit: units[i],
        score: objective.evaluateUnitFit(units[i]),
        front: front,
      });
    }

    return scores;
  }
  private destroyInactiveFronts(): void
  {
    const activeObjectives = this.objectivesAI.getFrontObjectives();

    const activeFrontsWithObjective = new IDDictionary<Front, FrontObjective>();

    activeObjectives.forEach(objective =>
    {
      activeFrontsWithObjective.set(objective.front, objective);
    });

    this.fronts.filter(front =>
    {
      return !activeFrontsWithObjective.has(front);
    }).forEach(front =>
    {
      front.destroy();
    });
  }
}
