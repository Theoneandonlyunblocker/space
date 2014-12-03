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
        imageSrc: "comm.png"
      }
      export var comm3 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "comm3.png"
      }
      export var fasc12 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "fasc12.png"
      }
      export var fasc2 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "fasc2.png"
      }
      export var fasc8 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "fasc8.png"
      }
      export var fasc9 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "fasc9.png"
      }
      export var mon13 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "mon13.png"
      }
      export var mon16 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "mon16.png"
      }
      export var mon18 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "mon18.png"
      }
      export var mon26 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "mon26.png"
      }
      export var mon9 =
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "mon9.png"
      }

    }
  }
}
