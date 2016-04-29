import Region from "./Region";
import MapGenDataByStarID from "./MapGenDataByStarID";
import
{
  addDefenceBuildings
} from "./mapGenUtils";

import Player from "../../../src/Player";
import Star from "../../../src/Star";

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
  
  independentStars.forEach(star =>
  {
    props.player.addStar(star);
    addDefenceBuildings(star, 1, false);
  });
  
  
  
  const commanderStar = getCommanderStar(independentStars, props.mapGenDataByStarID);
}

function getCommanderStar(
  stars: Star[],
  mapGenDataByStarID: MapGenDataByStarID
): Star
{
  const region = new Region(null, stars);
  const starsByDistance:
  {
    [distance: number]: Star[];
  } = region.getStarsByDistanceToQualifier(star =>
  {
    return star.owner && !star.owner.isIndependent;
  });
  
  const numericDistances = Object.keys(starsByDistance).map(distanceString =>
  {
    return parseInt(distanceString);
  });
  const maxDistance = Math.max.apply(null, numericDistances);
  
  const starsAtMaxDistance = starsByDistance[maxDistance];

  return starsAtMaxDistance.sort((a, b) =>
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
