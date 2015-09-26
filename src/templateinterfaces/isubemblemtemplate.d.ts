declare module Rance
{
  module Templates
  {
    interface ISubEmblemTemplate
    {
      key: string;
      src: string;
      coverage: SubEmblemCoverage[];
      position: SubEmblemPosition[];
      onlyCombineWith?: string[];
    }
  }
}
