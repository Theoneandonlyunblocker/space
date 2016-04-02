declare interface MapGenOptionValues
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

export default MapGenOptionValues;
