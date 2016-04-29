declare interface MapGenData
{
  connectedness?: number;
  mapGenDistance?: number;
  distanceFromPlayerOwnedLocation?: number;
  tags?: string[];
  isFiller?: boolean;
}

export default MapGenData;
