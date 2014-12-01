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
      export var comm =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/comm.png"
      }
      export var comm3 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/comm3.png"
      }
      export var fasc12 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/fasc12.png"
      }
      export var fasc2 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/fasc2.png"
      }
      export var fasc8 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/fasc8.png"
      }
      export var fasc9 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/fasc9.png"
      }
      export var mon13 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/mon13.png"
      }
      export var mon16 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/mon16.png"
      }
      export var mon18 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/mon18.png"
      }
      export var mon26 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/mon26.png"
      }
      export var mon9 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "img\/emblems\/mon9.png"
      }

    }
  }
}
