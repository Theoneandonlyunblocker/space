import {MapGenTemplate} from "src/templateinterfaces/MapGenTemplate";

import {spiralGalaxyGeneration} from "../spiralGalaxy/spiralGalaxyGeneration";
import { localize } from "../localization/localize";


export const spiralGalaxy: MapGenTemplate =
{
  key: "spiralGalaxy",
  get displayName()
  {
  return localize("spiralGalaxy_displayName").toString().toString();
  },
  get description()
  {
  return localize("spiralGalaxy_description").toString().toString();
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
          return localize("height").toString();
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
          return localize("width").toString();
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
          return localize("starCount").toString();
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
          return localize("arms").toString();
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
          return localize("starSizeRegularity").toString();
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
          return localize("centerDensity").toString();
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
