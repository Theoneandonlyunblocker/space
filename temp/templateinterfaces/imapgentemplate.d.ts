/// <reference path="mapgenoptions.d.ts" />
/// <reference path="imapgenfunction.d.ts" />

namespace Templates
{
  interface IMapGenTemplate
  {
    key: string;
    displayName: string;
    description?: string;

    minPlayers: number;
    maxPlayers: number;

    options: IMapGenOptions;

    mapGenFunction: IMapGenFunction;
  }
}
