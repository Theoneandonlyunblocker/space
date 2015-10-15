/// <reference path="../range.ts" />

declare module Rance
{
  module Templates
  {
    interface IMapGenOption
    {
      displayName: string;
      range: IRange;
    }
    interface IMapGenOptions
    {
      defaultOptions: IMapDefaultOptions;
      basicOptions?: IMapSpecificOptions;
      advancedOptions?: IMapSpecificOptions;
    }
    interface IMapDefaultOptions
    {
      height: IMapGenOption; // pixels
      width: IMapGenOption; // pixels
      starCount: IMapGenOption;
    }
    interface IMapSpecificOptions
    {
      [optionName: string]: IMapGenOption;
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
