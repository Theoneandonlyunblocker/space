import MapGenDataByStarID from "./MapGenDataByStarID";
import
{
  addDefenceBuildings
} from "./mapGenUtils";

import app from "../../../src/App"; // TODO global
import Player from "../../../src/Player";
import Region from "../../../src/Region";
import Star from "../../../src/Star";
import
{
  randRange,
} from "../../../src/utility";

export default function setupIndependents(props:
{
  player: Player;
  region: Region;
  intensity: number;
  variance: number;
  mapGenDataByStarID: MapGenDataByStarID;
}): void
{
  const independentStars = props.region.stars.filter((star) =>
  {
    return !star.owner || star.owner.isIndependent;
  });

  // add buildings
  independentStars.forEach((star) =>
  {
    props.player.addStar(star);
    addDefenceBuildings(star, 1, false);
  });

  // add units
  const starsByDistance = getStarsByDistanceToPlayer(independentStars, props.mapGenDataByStarID);
  const maxDistanceFromPlayer = getMaxDistanceFromStarsByDistance(starsByDistance);

  const starsAtMaxDistance = starsByDistance[maxDistanceFromPlayer];
  const commanderStar = getMostSuitableCommanderStarFromStars(starsAtMaxDistance, props.mapGenDataByStarID);

  const globalMaxDistanceFromPlayer: number = (function()
  {
    let maxDistance = 0;

    for (let starID in props.mapGenDataByStarID)
    {
      const distance = props.mapGenDataByStarID[starID].distanceFromPlayerOwnedLocation;
      maxDistance = Math.max(maxDistance, distance);
    }

    return maxDistance;
  })();

  independentStars.forEach((star) =>
  {
    const mapGenData = props.mapGenDataByStarID[star.id];
    const distanceFromPlayer = mapGenData.distanceFromPlayerOwnedLocation - 1;
    const relativeDistanceFromPlayer = distanceFromPlayer / globalMaxDistanceFromPlayer;

    const globalStrength = Math.pow(relativeDistanceFromPlayer, 1.8) * props.intensity + randRange(-props.variance, props.variance);
    const localStrength = star === commanderStar ? 1 : 0.5;


    star.race.generateIndependentFleet(
      props.player,
      star,
      globalStrength,
      localStrength,
      app.moduleData.ruleSet.battle.maxUnitsPerSide,
    );
  });
}

function getStarsByDistanceToPlayer(
  stars: Star[],
  mapGenDataByStarID: MapGenDataByStarID
): {[distance: number]: Star[]}
{
  const starsByDistance:
  {
    [distance: number]: Star[];
  } = {};

  stars.forEach((star) =>
  {
    const distance = mapGenDataByStarID[star.id].distanceFromPlayerOwnedLocation;

    if (!starsByDistance[distance])
    {
      starsByDistance[distance] = [];
    }

    starsByDistance[distance].push(star);
  });

  return starsByDistance;
}
function getMaxDistanceFromStarsByDistance(
  starsByDistance: {[distance: number]: Star[]}
): number
{
  const numericDistances = Object.keys(starsByDistance).map((distanceString) =>
  {
    return parseInt(distanceString);
  });

  const maxDistance = Math.max.apply(null, numericDistances);

  return maxDistance;
}
function getMostSuitableCommanderStarFromStars(
  stars: Star[],
  mapGenDataByStarID: MapGenDataByStarID
): Star
{
  return stars.sort((a, b) =>
  {
    const connectednessSort = mapGenDataByStarID[b.id].connectedness - mapGenDataByStarID[a.id].connectedness;
    if (connectednessSort)
    {
      return connectednessSort;
    }
    else
    {
      return mapGenDataByStarID[b.id].mapGenDistance - mapGenDataByStarID[a.id].mapGenDistance;
    }
  })[0];
}
