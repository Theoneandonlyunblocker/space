/// <reference path="../mapgencore/mapgenresult.ts" />
/// <reference path="../player.ts" />
/// <reference path="mapgenoptions.d.ts" />

namespace Templates
{
  declare interface IMapGenFunction
  {
    (options: IMapGenOptionValues, players: Player[]): MapGenCore.MapGenResult;
  }
}
