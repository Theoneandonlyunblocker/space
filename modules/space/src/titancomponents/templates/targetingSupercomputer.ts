// import { itemSlot } from "modules/space/src/items/itemSlot";
import { getItemIcon } from "modules/space/assets/items/itemAssets";
import { localize } from "modules/space/localization/localize";

import { TitanComponent } from "modules/titans/src/TitanComponent";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";
import { moneyResource } from "modules/money/src/moneyResource";


export const targetingSupercomputer: TitanComponent =
{
  type: "targetingSupercomputer",
  kind: "item",
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
  // TODO 2019.11.10 |
  slot: "asd",
  buildCost:
  {
    [moneyResource.type]: 100,
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};