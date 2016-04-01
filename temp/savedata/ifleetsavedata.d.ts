/// <reference path="iunitsavedata.d.ts" />

declare interface IFleetSaveData
{
  id: number;
  name: string;
  locationId: number;
  playerId: number;
  units: IUnitSaveData[];
}
