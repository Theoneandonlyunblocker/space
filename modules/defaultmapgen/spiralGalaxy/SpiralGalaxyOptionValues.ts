import MapGenOptionValues from "../../../src/templateinterfaces/MapGenOptionValues";

declare interface SpiralGalaxyOptionValues extends MapGenOptionValues
{
  basicOptions:
  {
    [optionName: string]: number;
    arms: number;
    starSizeRegularity: number;
    centerDensity: number
  }
}

export default SpiralGalaxyOptionValues;
