// import { itemSlot } from "modules/space/src/items/itemSlot";
import { getItemIcon } from "modules/space/assets/items/itemAssets";
import { localize } from "modules/space/localization/localize";

import { TitanComponentTemplate } from "modules/titans/src/TitanComponentTemplate";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";
import { moneyResource } from "modules/money/src/moneyResource";


export const monoblocArmor: TitanComponentTemplate =
{
  type: "monoblocArmor",
  kind: "item",
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
