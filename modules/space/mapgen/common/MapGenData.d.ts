declare interface MapGenData
{
  connectedness?: number;
  distanceFromCenter?: number;
  distanceFromPlayerOwnedLocation?: number;
  tags?: string[];
  isFiller?: boolean;
}

export default MapGenData;
