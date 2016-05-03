import MapGenDataByStarID from "./MapGenDataByStarID";
import
{
  addDefenceBuildings
} from "./mapGenUtils";

import Region from "../../../src/Region";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";
import Fleet from "../../../src/Fleet";
import
{
  randRange,
  clamp,
  getRandomArrayItem,
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
  const independentStars = props.region.stars.filter(star =>
  {
    return !star.owner || star.owner.isIndependent;
  });
  
  // add buildings
  independentStars.forEach(star =>
  {
    props.player.addStar(star);
    addDefenceBuildings(star, 1, false);
  });
  
  // add units
  const starsByDistance = getStarsByDistanceToPlayer(independentStars, props.mapGenDataByStarID);
  const maxDistanceFromPlayer = getMaxDistanceFromStarsByDistance(starsByDistance);
  
  const starsAtMaxDistance = starsByDistance[maxDistanceFromPlayer];
  const commanderStar = getMostSuitableCommanderStarFromStars(starsAtMaxDistance, props.mapGenDataByStarID);

  const minUnits = 2;
  const maxUnits = 5;
  
  const globalBuildableUnitTypes = props.player.getGloballyBuildableUnits();
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
  
  independentStars.forEach(star =>
  {
    const localBuildableUnitTypes = star.buildableUnitTypes.filter(unitTemplate =>
    {
      const techRequirements = unitTemplate.technologyRequirements;
      return !techRequirements || props.player.meetsTechnologyRequirements(techRequirements);
    });
    
    const unitTypes = globalBuildableUnitTypes.concat(localBuildableUnitTypes);
    
    const mapGenData = props.mapGenDataByStarID[star.id];
    const inverseMapGenDistance = 1 - mapGenData.mapGenDistance;
    const distanceFromPlayer = mapGenData.distanceFromPlayerOwnedLocation - 1;
    const relativeDistanceFromPlayer = Math.pow(distanceFromPlayer / globalMaxDistanceFromPlayer, 1.6);
    const unitCountFromVariance = randRange(-1, 1) * props.variance;
    
    let unitCount = minUnits + (maxUnits - minUnits) * relativeDistanceFromPlayer;
    unitCount += unitCountFromVariance;
    unitCount *= props.intensity;
    unitCount = clamp(unitCount, minUnits, maxUnits);
    unitCount = Math.round(unitCount);
    
    const eliteCount = unitCount < 3 ? 0 : unitCount < 5 ? 1 : 2;
    
    const units: Unit[] = [];
    
    if (star === commanderStar)
    {
      const template = getRandomArrayItem(unitTypes);
      const unit = new Unit(template);
      unit.name = "Pirate commander";
      
      unit.setAttributes(1.35);
      unit.setBaseHealth(1.35 + inverseMapGenDistance);
      props.player.addUnit(unit);
      
      units.push(unit);
    }
    
    for (let i = 0; i < unitCount; i++)
    {
      const isElite = i < eliteCount;
      
      const unitHealthModifier = (isElite ? 1.2 : 1) + inverseMapGenDistance;
      const unitStatsModifier = (isElite ? 1.2 : 1);
      
      const template = getRandomArrayItem(unitTypes);
      
      const unit = new Unit(template);
      unit.name = (isElite ? "Pirate elite" : "Pirate");
      
      unit.setAttributes(unitStatsModifier);
      unit.setBaseHealth(unitHealthModifier);
      props.player.addUnit(unit);
      
      units.push(unit);
    }
    
    const fleet = new Fleet(props.player, units, star, undefined, false);
    fleet.name = "Pirates";
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
  
  stars.forEach(star =>
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
  const numericDistances = Object.keys(starsByDistance).map(distanceString =>
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
