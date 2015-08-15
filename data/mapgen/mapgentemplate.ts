/// <reference path="../../src/range.ts" />

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

      mapGenFunction?: (any) => Star[]; // TODO remove ?. shouldnt be optional
    }
    export module MapGen
    {
      export interface IMapGenOptions
      {
        defaultOptions: IDefaultOptions;
        basicOptions?: IMapSpecificOptions;
        advancedOptions?: IMapSpecificOptions;
      }
      export interface IDefaultOptions
      {
        height: IRange; // pixels
        width: IRange; // pixels
        starDensity: IRange; // stars per 1000 pixels
        playerAmount: IRange;
      }
      export interface IMapSpecificOptions
      {
        [optionName: string]: IRange;
      }
    }
  }
}
