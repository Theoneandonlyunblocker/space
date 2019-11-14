import { moneyResource } from "modules/money/src/moneyResource";
import { localize } from "../localization/localize";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import { getItemIcon } from "modules/space/assets/items/itemAssets";


export const debugItem: ItemTemplate =
{
  type: "debugItem",
  get displayName()
  {
    return localize("debugItem_displayName").toString();
  },
  get description()
  {
    return localize("debugItem_description").toString();
  },
  getIcon: getItemIcon.bind(null, "armor", 1),
  techLevel: 1,
  buildCost:
  {
    [moneyResource.type]: 0,
  },

  slot: "high",
  availabilityData:
  {
    flags: [coreAvailabilityFlags.alwaysInDebugMode],
  },
  mapLevelModifiers:
  [
    {
      key: "debugItem",
      propagations:
      {
        owningPlayer:
        [
          {
            key: "ownedDebugItem",
            self:
            {
              income:
              {
                [moneyResource.type]: {flat: 200},
              },
            },
          },
        ],
        equippingUnit:
        [
          {
            key: "equippedDebugItem",
            propagations:
            {
              owningPlayer:
              [
                {
                  key: "ownedUnitHasEquippedDebugItem",
                  self:
                  {
                    income:
                    {
                      [moneyResource.type]: {multiplicativeMultiplier: 1.3333},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
