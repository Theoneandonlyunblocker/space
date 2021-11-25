import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";
import { moneyResource } from "modules/money/src/moneyResource";
// import { itemSlots } from "../itemSlots";
import { availabilityFlags as commonAvailabilityFlags } from "modules/baselib/src/availabilityFlags";
import { lifeLeechMultiplier } from "modules/baselib/src/combat/effects/lifeLeechMultiplier";
import { localize } from "modules/drones/localization/localize";


const multiplier = 1.1;

export const mantridCore: ItemTemplate =
{
  key: "mantridCore",
  get displayName()
  {
    return localize("mantridCore_displayName");
  },
  get description()
  {
    return localize("mantridCore_description");
  },
  getIcon: () =>
  {
    const el = new Image();

    return el;
  },
  techLevel: 1,
  buildCost:
  {
    [moneyResource.key]: 100,
  },
  slot: "high",
  // slot: itemSlots.core,
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
  mapLevelModifiers:
  [
    {
      key: "mantridCore",
      propagations:
      {
        equippingUnit:
        [
          {
            key: "equippedMantridCore",
            battlePrepEffects:
            [
              {
                adjustment: {flat: multiplier},
                effect:
                {
                  onBattlePrepStart: (effectStrength, unit) =>
                  {
                    unit.battleStats.combatEffects.get(lifeLeechMultiplier).strength += effectStrength;
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ]
};
