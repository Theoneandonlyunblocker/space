/// <reference path="iunitsavedata.d.ts" />

declare module Rance
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
