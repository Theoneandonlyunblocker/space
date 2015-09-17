/// <reference path="../range.ts" />

declare module Rance
{
  module Templates
  {
    interface IMapGenOptions
    {
      defaultOptions: IMapDefaultOptions;
      basicOptions?: IMapSpecificOptions;
      advancedOptions?: IMapSpecificOptions;
    }
    interface IMapDefaultOptions
    {
      height: IRange; // pixels
      width: IRange; // pixels
      starCount: IRange;
    }
    interface IMapSpecificOptions
    {
      [optionName: string]: IRange;
    }

    interface IMapGenOptionValues
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
