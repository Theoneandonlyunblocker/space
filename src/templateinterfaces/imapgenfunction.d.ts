/// <reference path="../mapgen2/mapgenresult.ts" />
/// <reference path="../player.ts" />
/// <reference path="mapgenoptions.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IMapGenFunction
    {
      (options: IMapGenOptionValues, players: Player[]): MapGen2.MapGenResult;
    }
  }
}
