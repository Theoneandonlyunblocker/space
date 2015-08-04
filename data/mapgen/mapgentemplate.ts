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

      defaultOptions: MapGen.IDefaultOptions;
      basicOptions?: MapGen.IMapSpecificOptions;
    }
    export module MapGen
    {
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
