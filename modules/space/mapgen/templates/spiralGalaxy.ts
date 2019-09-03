import {MapGenTemplate} from "../../../../src/templateinterfaces/MapGenTemplate";

import {spiralGalaxyGeneration} from "../spiralGalaxy/spiralGalaxyGeneration";
import { localize } from "../localization/localize";


export const spiralGalaxy: MapGenTemplate =
{
  key: "spiralGalaxy",
  get displayName()
  {
  return localize("spiralGalaxy_displayName")();
  },
  get description()
  {
  return localize("spiralGalaxy_description")();
  },

  minPlayers: 2,
  maxPlayers: 5,

  mapGenFunction: spiralGalaxyGeneration,

  options:
  {
    defaultOptions:
    {
      height:
      {
        get displayName()
        {
          return localize("height")();
        },
        range:
        {
          min: 800,
          max: 1600,
          step: 1,
        },
      },
      width:
      {
        get displayName()
        {
          return localize("width")();
        },
        range:
        {
          min: 800,
          max: 1600,
          step: 1,
        },
      },
      starCount:
      {
        get displayName()
        {
          return localize("starCount")();
        },
        range:
        {
          min: 20,
          max: 40,
          step: 1,
        },
      },
    },
    basicOptions:
    {
      arms:
      {
        get displayName()
        {
          return localize("arms")();
        },
        range:
        {
          min: 3,
          max: 6,
          step: 1,
          defaultValue: 5,
        },
      },
      starSizeRegularity:
      {
        get displayName()
        {
          return localize("starSizeRegularity")();
        },
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
        get displayName()
        {
          return localize("centerDensity")();
        },
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
