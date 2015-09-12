/// <reference path="../../src/mapgen2/mapgenresult.ts" />
/// <reference path="../../src/player.ts" />
/// <reference path="mapgenoptions.ts" />

module Rance
{
  export module Templates
  {
    export interface IMapGenTemplate
    {
      key: string;
      displayName: string;
      description?: string;

      minPlayers: number;
      maxPlayers: number;

      options: MapGen.IMapGenOptions;

      mapGenFunction: (options: MapGen.IMapGenOptionValues,
        players: Player[], independents: Player[]) => MapGen2.MapGenResult;
    }
  }
}
