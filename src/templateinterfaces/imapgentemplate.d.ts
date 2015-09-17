/// <reference path="../mapgen2/mapgenresult.ts" />
/// <reference path="../player.ts" />
/// <reference path="mapgenoptions.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IMapGenTemplate
    {
      key: string;
      displayName: string;
      description?: string;

      minPlayers: number;
      maxPlayers: number;

      options: IMapGenOptions;

      mapGenFunction: (options: IMapGenOptionValues,
        players: Player[], independents: Player[]) => MapGen2.MapGenResult;
    }
  }
}
