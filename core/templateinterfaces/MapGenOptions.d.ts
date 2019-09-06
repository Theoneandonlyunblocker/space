import {MapGenOption} from "./MapGenOption";

export interface MapDefaultOptions
{
  height: MapGenOption; // pixels
  width: MapGenOption; // pixels
  starCount: MapGenOption;
}
export interface MapSpecificOptions
{
  [optionName: string]: MapGenOption;
}
export interface MapGenOptions
{
  defaultOptions: MapDefaultOptions;
  basicOptions?: MapSpecificOptions;
  advancedOptions?: MapSpecificOptions;
}
