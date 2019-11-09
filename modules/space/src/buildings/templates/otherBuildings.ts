import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";

import * as technologies from "modules/space/src/technologies/technologyTemplates";
import { localize } from "modules/space/localization/localize";
import {moneyResource} from "modules/money/src/moneyResource";
import { testResource1, testResource2, testResource3, testResource4, testResource5 } from "../../resources/resourceTemplates";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";


export const commercialPort: BuildingTemplate =
{
  type: "commercialPort",
  kind: "building",
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
  kind: "building",
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
  kind: "building",
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
  kind: "building",
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
export const thePyramids: BuildingTemplate =
{
  type: "thePyramids",
  kind: "building",
  get displayName()
  {
    return localize("thePyramids_displayName").toString();
  },
  get description()
  {
    return localize("thePyramids_description").toString();
  },
  families: [],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },

  onBuild: (star, player) =>
  {
    player.addResources({[moneyResource.type]: 1000});
  },

  buildCost:
  {
    [testResource1.type]: 1,
    [testResource2.type]: 1,
    [testResource3.type]: 1,
    [testResource4.type]: 1,
    [testResource5.type]: 1,
  },
  mapLevelModifiers:
  [
    {
      key: "thePyramids",
      propagations:
      {
        localStar:
        [
          {
            key: "localPyramids",
            self:
            {
              adjustments: {researchPoints: {flat: 500}},
            },
            propagations:
            {
              localUnits:
              [
                {
                  key: "locationHasPyramids",
                  filter: unit =>
                  {
                    return unit.mapLevelModifiers.getSelfModifiers().flags.has("tombGuard");
                  },
                  // self:
                  // {
                  //   adjustments:
                  //   {
                  //     vision: {flat: 3},
                  //     detection: {flat: 20},
                  //   },
                  // },
                  propagations:
                  {
                    localStar:
                    [
                      {
                        key: "localTombGuard",
                        self:
                        {
                          income: {[testResource5.type]: {flat: 10}},
                          adjustments: {vision: {flat: 3}},
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        owningPlayer:
        [
          {
            key: "ownedPyramids",
            propagations:
            {
              ownedUnits:
              [
                {
                  key: "ownerHasPyramids",
                  self:
                  {
                    flags: new Set(["tombGuard"]),
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],

  maxBuiltAtLocation: 1,
  maxBuiltGlobally: 1,
};
export const nationalEpic: BuildingTemplate =
{
  type: "nationalEpic",
  kind: "building",
  get displayName()
  {
    return localize("nationalEpic_displayName").toString();
  },
  get description()
  {
    return localize("nationalEpic_description").toString();
  },
  families: [],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },

  onBuild: (star, player) =>
  {
    player.addResources(
    {
      [moneyResource.type]: 999,
      [testResource1.type]: 2,
      [testResource2.type]: 2,
      [testResource3.type]: 2,
      [testResource4.type]: 2,
      [testResource5.type]: 2,
    });
  },
  mapLevelModifiers:
  [
    {
      key: "nationalEpic",
      propagations:
      {
        owningPlayer:
        [
          {
            key: "hasNationalEpic",
            self:
            {
              income:
              {
                [moneyResource.type]: {multiplicativeMultiplier: 0.5},
              },
              adjustments:
              {
                researchPoints: {additiveMultiplier: 1},
              },
            },
            propagations:
            {
              ownedStars:
              [
                {
                  key: "ownerHasNationalEpic",
                  self:
                  {
                    income:
                    {
                      [testResource1.type]: {flat: 10},
                    },
                  },
                },
              ],
            },
          },
        ],
        localStar:
        [
          {
            key: "localNationalEpic",
            self:
            {
              income:
              {
                [testResource2.type]: {flat: 100},
              },
            },
          },
        ],
      },
    },
  ],

  buildCost:
  {
    [moneyResource.type]: 0,
  },

  maxBuiltAtLocation: 1,
  maxBuiltForPlayer: 1,
};
