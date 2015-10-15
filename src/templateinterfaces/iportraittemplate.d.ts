/// <reference path="../randomgenunitrarity.ts" />

declare module Rance
{
  module Templates
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
