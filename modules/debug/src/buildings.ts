import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";
import {moneyResource} from "modules/money/src/moneyResource";
import { testResource1, testResource2, testResource3, testResource4, testResource5 } from "modules/space/src/resources/resourceTemplates";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { localize } from "../localization/localize";


export const thePyramids: BuildingTemplate =
{
  key: "thePyramids",
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
    player.addResources({[moneyResource.key]: 1000});
  },

  buildCost:
  {
    [testResource1.key]: 1,
    [testResource2.key]: 1,
    [testResource3.key]: 1,
    [testResource4.key]: 1,
    [testResource5.key]: 1,
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
                  propagations:
                  {
                    localStar:
                    [
                      {
                        key: "localTombGuard",
                        self:
                        {
                          income: {[testResource5.key]: {flat: 10}},
                          adjustments: {vision: {flat: 3}},
                        },
                      },
                    ],
                  },
                },
                {
                  key: "graveRobber",
                  propagations:
                  {
                    global:
                    [
                      {
                        key: "curseOfTheMummy",
                        propagations:
                        {
                          players:
                          [
                            {
                              key: "locustSwarm",
                              self:
                              {
                                income: {[moneyResource.key]: {multiplicativeMultiplier: 0}}
                              },
                            },
                          ],
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
              ownedStars:
              [
                {
                  key: "ownerHasPyramids",
                  self:
                  {
                    income:
                    {
                      [testResource3.key]: {flat: 333},
                    },
                  },
                },
              ],
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
  key: "nationalEpic",
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
      [moneyResource.key]: 999,
      [testResource1.key]: 2,
      [testResource2.key]: 2,
      [testResource3.key]: 2,
      [testResource4.key]: 2,
      [testResource5.key]: 2,
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
                [moneyResource.key]: {multiplicativeMultiplier: 0.5},
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
                      [testResource1.key]: {flat: 10},
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
                [testResource2.key]: {flat: 100},
              },
            },
          },
        ],
      },
    },
  ],

  buildCost:
  {
    [moneyResource.key]: 0,
  },

  maxBuiltAtLocation: 1,
  maxBuiltForPlayer: 1,
};
