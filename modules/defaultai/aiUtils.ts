import DiplomacyState from "../../src/DiplomacyState";
import Player from "../../src/Player";
import Star from "../../src/Star";
import Unit from "../../src/Unit";
import evaluateUnitStrength from "../../src/evaluateUnitStrength";
import
{
  clamp,
  getRelativeValue,
} from "../../src/utility";
import {Front} from "./mapai/Front";
import GrandStrategyAI from "./mapai/GrandStrategyAI";
import MapEvaluator from "./mapai/MapEvaluator";
import Objective from "./mapai/Objective";
import ObjectivesAI from "./mapai/ObjectivesAI";
import ObjectiveTemplate from "./objectives/common/ObjectiveTemplate";
export interface ScoresByStar
{
  [starId: number]:
  {
    star: Star;
    score: number;
  };
}
export function defaultUnitDesireFN(front: Front)
{
  let desire = 1;

  // lower desire if front requirements already met
  // more important fronts get priority but dont hog units
  const unitsOverMinimum = front.units.length - front.minUnitsDesired;
  const unitsOverIdeal = front.units.length - front.idealUnitsDesired;
  const unitsUnderMinimum = front.minUnitsDesired - front.units.length;
  if (unitsOverMinimum > 0)
  {
    desire *= 0.85 / unitsOverMinimum;
  }
  if (unitsOverIdeal > 0)
  {
    desire *= 0.6 / unitsOverIdeal;
  }

  // penalize initial units for front
  // inertia at beginning of adding units to front
  // so ai prioritizes fully formed fronts to incomplete ones
  if (unitsUnderMinimum > 0)
  {
    const intertiaPerMissingUnit = 0.5 / front.minUnitsDesired;
    const newUnitInertia = intertiaPerMissingUnit * (unitsUnderMinimum - 1);
    desire *= 1 - newUnitInertia;
  }

  return desire;
}
export function defaultUnitFitFN(unit: Unit, front: Front, lowHealthThreshhold: number = 0.75,
  healthAdjust: number = 1, distanceAdjust: number = 1)
{
  let score = 1;

  // penalize units on low health
  const healthPercentage = unit.currentHealth / unit.maxHealth;

  if (healthPercentage < lowHealthThreshhold)
  {
    score *= healthPercentage * healthAdjust;
  }

  // prioritize units closer to front target
  let turnsToReach = unit.getTurnsToReachStar(front.targetLocation);
  if (turnsToReach > 0)
  {
    turnsToReach *= distanceAdjust;
    const distanceMultiplier = 1 / (Math.log(turnsToReach + 2.5) / Math.log(2.5));
    score *= distanceMultiplier;
  }

  return score;
}
export function scoutingUnitDesireFN(front: Front)
{
  if (front.units.length < 1) return 1;
  else return 0;
}
export function scoutingUnitFitFN(unit: Unit, front: Front)
{
  let baseScore = 0;
  // ++ stealth
  const isStealthy = unit.isStealthy();
  if (isStealthy) baseScore += 0.2;
  // ++ vision
  const visionRange = unit.getVisionRange();
  if (visionRange <= 0)
  {
    return -1;
  }
  else
  {
    baseScore += Math.pow(visionRange, 1.5) / 2;
  }

  // -- strength
  const strength = evaluateUnitStrength(unit);
  baseScore -= strength / 1000;
  // -- cost
  const cost = unit.getTotalCost();
  baseScore -= cost / 1000;

  const score = baseScore * defaultUnitFitFN(unit, front, -1, 0, 2);

  return clamp(score, 0, 1);
}
export function mergeScoresByStar(merged: ScoresByStar, scores: {star: Star; score: number;}[])
{
  for (let i = 0; i < scores.length; i++)
  {
    const star = scores[i].star;
    if (!merged[star.id])
    {
      merged[star.id] = scores[i];
    }
    else
    {
      merged[star.id].score += scores[i].score;
    }
  }

  return merged;
}
export function makeObjectivesFromScores(template: ObjectiveTemplate,
  evaluationScores: {star?: Star; player?: Player; score: number;}[], basePriority: number)
{
  const allObjectives: Objective[] = [];

  const minScore: number = 0;
  let maxScore: number;

  for (let i = 0; i < evaluationScores.length; i++)
  {
    const score = evaluationScores[i].score;
    maxScore = isFinite(maxScore) ? Math.max(maxScore, score) : score;
  }

  for (let i = 0; i < evaluationScores.length; i++)
  {
    if (evaluationScores[i].score < 0.04)
    {
      continue;
    }
    const star = evaluationScores[i].star || null;
    const player = evaluationScores[i].player || null;
    const relativeScore = getRelativeValue(evaluationScores[i].score, minScore, maxScore);
    const priority = relativeScore * basePriority;

    allObjectives.push(new Objective(template, priority, star, player));
  }

  return allObjectives;
}
export function perimeterObjectiveCreation(template: ObjectiveTemplate, isForScouting: boolean,
  basePriority: number, grandStrategyAI: GrandStrategyAI, mapEvaluator: MapEvaluator,
  objectivesAI: ObjectivesAI)
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

  const allScoresByStar: ScoresByStar = {};
  for (let i = 0; i < playersToEstablishPerimeterAgainst.length; i++)
  {
    const player = playersToEstablishPerimeterAgainst[i];
    const scores = mapEvaluator.getScoredPerimeterLocationsAgainstPlayer(player, 1, isForScouting);

    mergeScoresByStar(allScoresByStar, scores);
  }

  const allScores:
  {
    star: Star;
    score: number;
  }[] = [];
  for (let starId in allScoresByStar)
  {
    if (allScoresByStar[starId].score > 0.04)
    {
      allScores.push(allScoresByStar[starId]);
    }
  }

  const objectives: Objective[] = makeObjectivesFromScores(template, allScores, basePriority);


  return objectives;
}
export function getUnitsToBeatImmediateTarget(mapEvaluator: MapEvaluator,
  objective: Objective)
{
  let min: number;
  let ideal: number;
  const star = objective.target;
  const hostileUnits = mapEvaluator.getHostileUnitsAtStar(star);

  if (hostileUnits.length <= 1)
  {
    min = hostileUnits.length + 1;
    ideal = hostileUnits.length + 1;
  }
  else
  {
    min = Math.min(hostileUnits.length + 2, 6);
    ideal = 6;
  }

  return(
  {
    min: min,
    ideal: ideal,
  });
}
