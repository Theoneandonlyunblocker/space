/// <reference path="../../src/range.ts" />

module Rance
{
  export module Templates
  {
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
        starCount: IRange;
      }
      export interface IMapSpecificOptions
      {
        [optionName: string]: IRange;
      }

      export interface IMapGenOptionValues
      {
        defaultOptions:
        {
          height: number;
          width: number;
          starCount: number;
        };
        basicOptions?:
        {
          [optionName: string]: number;
        };
        advancedOptions?:
        {
          [optionName: string]: number;
        };
      }
    }
  }
}
