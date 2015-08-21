/// <reference path="../../src/mapgen/mapgenresult.ts" />
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

      mapGenFunction?: (options: MapGen2.IMapGenOptionValues,
        players: Player[], independents: Player[]) => MapGen.MapGenResult; // TODO remove ?
    }
  }
}
