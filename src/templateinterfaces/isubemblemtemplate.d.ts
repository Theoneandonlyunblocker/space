declare module Rance
{
  module Templates
  {
    interface ISubEmblemTemplate
    {
      type: string;
      position: string; //inner, outer, inner-or-both, outer-or-both, both
      foregroundOnly: boolean;
      imageSrc: string;
    }
  }
}
