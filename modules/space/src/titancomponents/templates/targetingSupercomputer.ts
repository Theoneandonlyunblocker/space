// import { itemSlot } from "modules/space/src/items/itemSlot";
import { getItemIcon } from "modules/space/assets/items/itemAssets";
import { localize } from "modules/space/localization/localize";

import { TitanComponentTemplate } from "modules/titans/src/TitanComponentTemplate";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { moneyResource } from "modules/money/src/moneyResource";


export const targetingSupercomputer: TitanComponentTemplate =
{
  type: "targetingSupercomputer",
  get displayName()
  {
    return localize("targetingSupercomputer_displayName");
  },
  get description()
  {
    return localize("targetingSupercomputer_description");
  },
  getIcon: () => getItemIcon("targetingSupercomputer", 1),
  techLevel: 69,
  isLockedToUnit: true,
  // TODO 2019.11.10 |
  slot: "mid",
  buildCost:
  {
    [moneyResource.type]: 100,
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
  attributeAdjustments:
  {
    attack: {flat: 2},
    intelligence: {flat: 1},
  },
};
