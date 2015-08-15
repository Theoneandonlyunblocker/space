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

      options: MapGen.IMapGenOptions;

      mapGenFunction?: (options: MapGen.IMapGenOptionValues) => Star[]; // TODO remove ?. shouldnt be optional
    }
  }
}
