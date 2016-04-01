/// <reference path="inametemplate.d.ts" />
/// <reference path="iportraittemplate.d.ts" />

namespace Templates
{
  declare interface ICultureTemplate
  {
    key: string;
    nameGenerator?: (unit: Unit) => string;

    firstNames?:
    {
      [key: string]: INameTemplate;
    };
    middleNames?:
    {
      [key: string]: INameTemplate;
    };
    lastNames?:
    {
      [key: string]: INameTemplate;
    };
    
    portraits?:
    {
      [key: string]: IPortraitTemplate;
    };
  }
}
