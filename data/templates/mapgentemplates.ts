/// <reference path="../../src/range.ts" />

module Rance
{
  export module Templates
  {
    export interface IMapGenTemplate
    {
      key: string;
      displayName: string;
      description?: string;

      defaultOptions: MapGen.IDefaultOptions;
      basicOptions?: MapGen.IMapSpecificOptions;
    }
    export module MapGen
    {
      export interface IDefaultOptions
      {
        height: IRange; // pixels
        width: IRange; // pixels
        starDenstity: IRange; // stars per 1000 pixels
        playerAmount: IRange;
      }
      export interface IMapSpecificOptions
      {
        [optionName: string]: IRange;
      }

      export var newTest: IMapGenTemplate =
      {
        key: "newTest",
        displayName: "Test Map",
        description: "just testing",

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
          starDenstity:
          {
            min: 0.1,
            max: 0.12,
            step: 0.001
          },
          playerAmount:
          {
            min: 2,
            max: 5,
            step: 1
          }
        },
        basicOptions:
        {
          arms:
          {
            min: 3,
            max: 5,
            step: 1
          }
        }
      }

      export var newTestSmall: IMapGenTemplate =
      {
        key: "newTestSmall",
        displayName: "Small Test Map",
        description: "just testing but small",

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
          starDenstity:
          {
            min: 0.1,
            max: 0.12,
            step: 0.001
          },
          playerAmount:
          {
            min: 2,
            max: 4,
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

      export var defaultMap =
      {
        mapOptions:
        {
          width: 600,
          height: 600
        },
        starGeneration:
        {
          galaxyType: "spiral",
          totalAmount: 40,
          arms: 5,
          centerSize: 0.4,
          amountInCenter: 0.3
        },
        relaxation:
        {
          timesToRelax: 5,
          dampeningFactor: 2
        }
      }
    }
  }
}
