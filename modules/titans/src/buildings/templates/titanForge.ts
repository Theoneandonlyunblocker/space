import { localize } from "../../../localization/localize";
import { TitansStarModifierAdjustments } from "../../mapLevelModifiers";

import { BuildingTemplate } from "core/src/templateinterfaces/BuildingTemplate";
import { StarModifierAdjustments } from "core/src/maplevelmodifiers/StarModifier";
import { PartialMapLevelModifier } from "core/src/maplevelmodifiers/MapLevelModifiers";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import {moneyResource} from "modules/money/src/moneyResource";


const localTitanForgeEffect: PartialMapLevelModifier<StarModifierAdjustments & TitansStarModifierAdjustments> =
{
  adjustments:
  {
    titanAssemblingCapacity: {flat: 1},
  },
};

export const titanForge: BuildingTemplate =
{
  type: "titanForge",
  kind: "building",
  get displayName()
  {
    return localize("titanForge_displayName");
  },
  get description()
  {
    return localize("titanForge_description");
  },
  families: [],

  buildCost:
  {
    [moneyResource.type]: 1000,
  },
  maxBuiltAtLocation: 1,
  availabilityData:
  {
    flags: [coreAvailabilityFlags.crucial],
  },
  mapLevelModifiers:
  [
    {
      key: "titanForge",
      propagations:
      {
        localStar:
        [
          {
            key: "localTitanForge",
            self: localTitanForgeEffect,
          },
        ],
      },
    },
  ],
};
