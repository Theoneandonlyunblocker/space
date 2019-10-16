import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";

import * as technologies from "modules/space/src/technologies/technologyTemplates";
import { localize } from "modules/space/localization/localize";
import {moneyResource} from "modules/money/src/moneyResource";
import { testResource1, testResource2, testResource3, testResource4, testResource5 } from "../../resources/resourceTemplates";

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

  mapLevelModifier:
  {
    localStar:
    {
      self:
      {
        income:
        {
          [moneyResource.type]: {flat: 20},
        },
      },
    },
  },
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

  mapLevelModifier:
  {
    localStar:
    {
      self:
      {
        adjustments:
        {
          vision: {flat: 1},
          detection: {flat: 1},
        },
      },
    },
  },
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

  mapLevelModifier:
  {
    localStar:
    {
      self:
      {
        adjustments:
        {
          mining: {flat: 1},
        },
      },
    },
  },
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

  mapLevelModifier:
  {
    localStar:
    {
      self:
      {
        adjustments:
        {
          researchPoints: {flat: 10},
        },
      },
    },
  },
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
  mapLevelModifier:
  {
    owningPlayer:
    {
      ownedStars:
      {
        self:
        {
          income:
          {
            [testResource1.type]: {flat: 10},
          }
        }
      }
    },
    localStar:
    {
      self:
      {
        income:
        {
          [testResource2.type]: {flat: 100},
        }
      }
    }
  },

  buildCost:
  {
    [moneyResource.type]: 0,
  },

  maxBuiltAtLocation: 1,
  maxBuiltForPlayer: 1,
};
