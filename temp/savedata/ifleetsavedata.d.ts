/// <reference path="iunitsavedata.d.ts" />

interface IFleetSaveData
{
  id: number;
  name: string;
  locationId: number;
  playerId: number;
  units: IUnitSaveData[];
}
