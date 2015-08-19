/// <reference path="mapgentemplate.ts" />

module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export var newTestSmall: IMapGenTemplate =
      {
        key: "newTestSmall",
        displayName: "Small Test Map",
        description: "(not implemented yet) just testing but small",

        minPlayers: 2,
        maxPlayers: 4,

        options:
        {
          defaultOptions:
          {
            height:
            {
              min: 200,
              max: 400,
              step: 1
            },
            width:
            {
              min: 200,
              max: 400,
              step: 1
            },
            starDensity:
            {
              min: 0.1,
              max: 0.12,
              step: 0.001
            }
          },
          basicOptions:
          {
            tinyness:
            {
              min: 69,
              max: 420,
              step: 1
            }
          }
        }
      }
    }
  }
}