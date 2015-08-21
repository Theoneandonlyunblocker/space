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
              min: 400,
              max: 800,
              step: 1
            },
            width:
            {
              min: 400,
              max: 800,
              step: 1
            },
            starCount:
            {
              min: 20,
              max: 40,
              step: 1
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