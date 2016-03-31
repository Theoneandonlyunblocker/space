/// <reference path="iunitsavedata.d.ts" />

declare namespace Rance
{
  interface IFleetSaveData
  {
    id: number;
    name: string;
    locationId: number;
    playerId: number;
    units: IUnitSaveData[];
  }
}
