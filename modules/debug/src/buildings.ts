import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";
import {moneyResource} from "modules/money/src/moneyResource";
import { testResource1, testResource2, testResource3, testResource4, testResource5 } from "modules/space/src/resources/resourceTemplates";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { localize } from "../localization/localize";


export const thePyramids: BuildingTemplate =
{
  type: "thePyramids",
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
                                income: {[moneyResource.type]: {multiplicativeMultiplier: 0}}
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
                      [testResource3.type]: {flat: 333},
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
  type: "nationalEpic",
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
