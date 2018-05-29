declare interface MapGenData
{
  connectedness?: number;
  // TODO 2018.05.29 | rename distanceFromCenter
  mapGenDistance?: number;
  distanceFromPlayerOwnedLocation?: number;
  tags?: string[];
  isFiller?: boolean;
}

export default MapGenData;
