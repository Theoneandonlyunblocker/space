import MapGenTemplate from "../../../../src/templateinterfaces/MapGenTemplate";

import spiralGalaxyGeneration from "../spiralGalaxy/spiralGalaxyGeneration";


const tinierSpiralGalaxy: MapGenTemplate =
{
  key: "tinierSpiralGalaxy",
  displayName: "Tinier Spiral galaxy",
  description: "Create a spiral galaxy with arms but tinier (just for testing)",

  minPlayers: 2,
  maxPlayers: 4,

  mapGenFunction: spiralGalaxyGeneration,

  options:
  {
    defaultOptions:
    {
      height:
      {
        displayName: "Height",
        range:
        {
          min: 500,
          max: 1000,
          step: 1,
        },
      },
      width:
      {
        displayName: "Width",
        range:
        {
          min: 500,
          max: 1000,
          step: 1,
        },
      },
      starCount:
      {
        displayName: "Star count",
        range:
        {
          min: 15,
          max: 30,
          step: 1,
          defaultValue: 20,
        },
      },
    },
    basicOptions:
    {
      arms:
      {
        displayName: "Arms",
        range:
        {
          min: 2,
          max: 5,
          step: 1,
          defaultValue: 4,
        },
      },
      starSizeRegularity:
      {
        displayName: "Star size regularity",
        range:
        {
          min: 1,
          max: 100,
          step: 1,
          defaultValue: 100,
        },
      },
      centerDensity:
      {
        displayName: "Center density",
        range:
        {
          min: 1,
          max: 90,
          step: 1,
          defaultValue: 50,
        },
      },
    },
  },
};

export default tinierSpiralGalaxy;
