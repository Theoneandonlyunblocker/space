import MapGenTemplate from "../../../src/templateinterfaces/mapgentemplate";

import spiralGalaxyGeneration from "../spiralGalaxy/spiralGalaxyGeneration";

const spiralGalaxy: MapGenTemplate =
{
  key: "spiralGalaxy",
  displayName: "Spiral galaxy",
  description: "Create a spiral galaxy with arms",

  minPlayers: 2,
  maxPlayers: 5,

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
          min: 800,
          max: 1600,
          step: 1
        }
      },
      width:
      {
        displayName: "Width",
        range:
        {
          min: 800,
          max: 1600,
          step: 1
        }
      },
      starCount:
      {
        displayName: "Star count",
        range:
        {
          min: 20,
          max: 40,
          step: 1
        }
      }
    },
    basicOptions:
    {
      arms:
      {
        displayName: "Arms",
        range:
        {
          min: 3,
          max: 6,
          step: 1,
          defaultValue: 5
        }
      },
      starSizeRegularity:
      {
        displayName: "Star size regularity",
        range:
        {
          min: 1,
          max: 100,
          step: 1,
          defaultValue: 100
        }
      },
      centerDensity:
      {
        displayName: "Center density",
        range:
        {
          min: 1,
          max: 90,
          step: 1,
          defaultValue: 50
        }
      }
    }
  }
}

export default spiralGalaxy;
