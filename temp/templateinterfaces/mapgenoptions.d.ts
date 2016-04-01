/// <reference path="../range.ts" />

namespace Templates
{
  declare interface IMapGenOption
  {
    displayName: string;
    range: IRange;
  }
  declare interface IMapGenOptions
  {
    defaultOptions: IMapDefaultOptions;
    basicOptions?: IMapSpecificOptions;
    advancedOptions?: IMapSpecificOptions;
  }
  declare interface IMapDefaultOptions
  {
    height: IMapGenOption; // pixels
    width: IMapGenOption; // pixels
    starCount: IMapGenOption;
  }
  declare interface IMapSpecificOptions
  {
    [optionName: string]: IMapGenOption;
  }

  declare interface IMapGenOptionValues
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
