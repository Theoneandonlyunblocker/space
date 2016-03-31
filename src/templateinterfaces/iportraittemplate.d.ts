/// <reference path="../randomgenunitrarity.ts" />

declare namespace Rance
{
  namespace Templates
  {
    interface IPortraitTemplate
    {
      // TODO portraits
      key: string;
      imageSrc: string;
      generatedFor: RandomGenUnitRarity[];
    }
  }
}
