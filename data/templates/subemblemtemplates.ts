module Rance
{
  export module Templates
  {
    export interface ISubEmblemTemplate
    {
      type: string; //inner, outer, inner-or-both, outer-or-both, both
      foregroundOnly: boolean;
      imageSrc: string;
    }

    export module SubEmblems
    {
      export var comm3 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "../img/emblems/comm3.png"
      }
      export var fasc8 =
      {
        type: "inner-or-both",
        foregroundOnly: true,
        imageSrc: "../img/emblems/fasc8.png"
      }
    }
  }
}
