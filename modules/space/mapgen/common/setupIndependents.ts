import {Player} from "core/player/Player";
import {Region} from "core/map/Region";
import {Star} from "core/map/Star";
import {activeModuleData} from "core/app/activeModuleData";
import
{
  randRange,
} from "core/generic/utility";

import {MapGenDataByStarId} from "./MapGenDataByStarId";
import
{
  addTerritoryBuildings,
} from "./mapGenUtils";


export function setupIndependents(props:
{
  player: Player;
  region: Region;
  intensity: number;
  variance: number;
  mapGenDataByStarId: MapGenDataByStarId;
}): void
{
  const independentStars = props.region.stars.filter(star =>
  {
    return !star.owner || star.owner.isIndependent;
  });

  // add buildings
  independentStars.forEach(star =>
  {
    props.player.addStar(star);
    addTerritoryBuildings(star, 1, false);
  });

  // add units
  const starsByDistance = getStarsByDistanceToPlayer(independentStars, props.mapGenDataByStarId);
  const maxDistanceFromPlayer = getMaxDistanceFromStarsByDistance(starsByDistance);

  const starsAtMaxDistance = starsByDistance[maxDistanceFromPlayer];
  const commanderStar = getMostSuitableCommanderStarFromStars(starsAtMaxDistance, props.mapGenDataByStarId);

  const globalMaxDistanceFromPlayer: number = (() =>
  {
    let maxDistance = 0;

    for (const starId in props.mapGenDataByStarId)
    {
      const distance = props.mapGenDataByStarId[starId].distanceFromPlayerOwnedLocation;
      maxDistance = Math.max(maxDistance, distance);
    }

    return maxDistance;
  })();

  independentStars.forEach(star =>
  {
    const mapGenData = props.mapGenDataByStarId[star.id];
    const distanceFromPlayer = mapGenData.distanceFromPlayerOwnedLocation - 1;
    const relativeDistanceFromPlayer = distanceFromPlayer / globalMaxDistanceFromPlayer;

    const globalStrength = Math.pow(relativeDistanceFromPlayer, 1.8) * props.intensity + randRange(-props.variance, props.variance);
    const localStrength = star === commanderStar ? 1 : 0.5;


    star.localRace.generateIndependentFleets(
      props.player,
      star,
      globalStrength,
      localStrength,
      activeModuleData.ruleSet.battle.maxUnitsPerSide,
    );
  });
}

function getStarsByDistanceToPlayer(
  stars: Star[],
  mapGenDataByStarId: MapGenDataByStarId,
): {[distance: number]: Star[]}
{
  const starsByDistance:
  {
    [distance: number]: Star[];
  } = {};

  stars.forEach(star =>
  {
    const distance = mapGenDataByStarId[star.id].distanceFromPlayerOwnedLocation;

    if (!starsByDistance[distance])
    {
      starsByDistance[distance] = [];
    }

    starsByDistance[distance].push(star);
  });

  return starsByDistance;
}
function getMaxDistanceFromStarsByDistance(
  starsByDistance: {[distance: number]: Star[]},
): number
{
  const numericDistances = Object.keys(starsByDistance).map(distanceString =>
  {
    return parseInt(distanceString);
  });

  const maxDistance = Math.max.apply(null, numericDistances);

  return maxDistance;
}
function getMostSuitableCommanderStarFromStars(
  stars: Star[],
  mapGenDataByStarId: MapGenDataByStarId,
): Star
{
  return stars.sort((a, b) =>
  {
    const connectednessSort = mapGenDataByStarId[b.id].connectedness - mapGenDataByStarId[a.id].connectedness;
    if (connectednessSort)
    {
      return connectednessSort;
    }
    else
    {
      return mapGenDataByStarId[b.id].distanceFromCenter - mapGenDataByStarId[a.id].distanceFromCenter;
    }
  })[0];
}
