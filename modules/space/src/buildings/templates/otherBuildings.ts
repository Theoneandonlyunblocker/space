import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";

import * as technologies from "modules/space/src/technologies/technologyTemplates";
import { localize } from "modules/space/localization/localize";
import {moneyResource} from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";


export const commercialPort: BuildingTemplate =
{
  type: "commercialPort",
  get displayName()
  {
    return localize("commercialPort_displayName").toString();
  },
  get description()
  {
    return localize("commercialPort_description").toString();
  },
  families: [],

  buildCost:
  {
    [moneyResource.type]: 200,
  },
  maxBuiltAtLocation: 1,

  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
  mapLevelModifiers:
  [
    {
      key: "commercialPort",
      propagations:
      {
        localStar:
        [
          {
            key: "localCommercialPort",
            self:
            {
              income:
              {
                [moneyResource.type]: {flat: 20},
              },
            },
          },
        ],
      },
    },
  ],
};
export const deepSpaceRadar: BuildingTemplate =
{
  type: "deepSpaceRadar",
  get displayName()
  {
    return localize("deepSpaceRadar_displayName").toString();
  },
  get description()
  {
    return localize("deepSpaceRadar_description").toString();
  },
  families: [],

  buildCost:
  {
    [moneyResource.type]: 200,
  },

  maxBuiltAtLocation: 1,

  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
  mapLevelModifiers:
  [
    {
      key: "deepSpaceRadar",
      propagations:
      {
        localStar:
        [
          {
            key: "localDeepSpaceRadar",
            self:
            {
              adjustments:
              {
                vision: {flat: 1},
                detection: {flat: 1},
              },
            },
          },
        ],
      }
    },
  ],
  techRequirements:
  [
    {
      technology: technologies.stealth,
      level: 1,
    }
  ]
};
export const resourceMine: BuildingTemplate =
{
  type: "resourceMine",
  get displayName()
  {
    return localize("resourceMine_displayName").toString();
  },
  get description()
  {
    return localize("resourceMine_description").toString();
  },
  families: [],

  buildCost:
  {
    [moneyResource.type]: 500,
  },

  maxBuiltAtLocation: 1,
  canBeBuiltInLocation: (star) =>
  {
    return Boolean(star.resource);
  },

  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike, coreAvailabilityFlags.crucial],
  },
  mapLevelModifiers:
  [
    {
      key: "resourceMine",
      propagations:
      {
        localStar:
        [
          {
            key: "localResourceMine",
            self:
            {
              adjustments:
              {
                mining: {flat: 1},
              },
            },
          },
        ],
      },
    },
  ],
};
export const reserachLab: BuildingTemplate =
{
  type: "reserachLab",
  get displayName()
  {
    return localize("reserachLab_displayName").toString();
  },
  get description()
  {
    return localize("reserachLab_description").toString();
  },
  families: [],

  buildCost:
  {
    [moneyResource.type]: 300,
  },

  maxBuiltAtLocation: 1,

  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
  mapLevelModifiers:
  [
    {
      key: "researchLab",
      propagations:
      {
        localStar:
        [
          {
            key: "localResearchLab",
            self:
            {
              adjustments:
              {
                researchPoints: {flat: 10},
              },
            },
          },
        ],
      },
    },
  ],
};

