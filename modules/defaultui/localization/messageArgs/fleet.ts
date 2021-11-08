export type Fleet =
{
  unidentifiedShip: [];
  unidentifiedFleet: [];
  merge: [];
  reorganize: [];
  reorganizeFleets: [];
  fleet_movesRemaining: [currentMovePoints: number | string, maxMovePoints: number | string];
  select_fleet: [];
  deselect_fleet: [];
  split_fleet: [];
};
