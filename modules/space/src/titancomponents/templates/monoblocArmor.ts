// import { itemSlot } from "modules/space/src/items/itemSlot";
import { getItemIcon } from "modules/space/assets/items/itemAssets";
import { localize } from "modules/space/localization/localize";

import { TitanComponentTemplate } from "modules/titans/src/TitanComponentTemplate";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { moneyResource } from "modules/money/src/moneyResource";


export const monoblocArmor: TitanComponentTemplate =
{
  key: "monoblocArmor",
  get displayName()
  {
    return localize("monoblocArmor_displayName");
  },
  get description()
  {
    return localize("monoblocArmor_description");
  },
  getIcon: () => getItemIcon("monoblocArmor", 1),
  techLevel: 69,
  isLockedToUnit: true,
  // TODO 2019.11.10 |
  slot: "low",
  buildCost:
  {
    [moneyResource.key]: 100,
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
