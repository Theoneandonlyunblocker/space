import {MapGenOptionValues} from "core/src/templateinterfaces/MapGenOptionValues";


export declare interface SpiralGalaxyOptionValues extends MapGenOptionValues
{
  basicOptions:
  {
    [optionName: string]: number;
    arms: number;
    starSizeRegularity: number;
    centerDensity: number;
  };
}
