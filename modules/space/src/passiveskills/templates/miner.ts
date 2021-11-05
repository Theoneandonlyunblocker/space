import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";


export const miner: PassiveSkillTemplate =
{
  key: "miner",
  get displayName()
  {
    return localize("miner_displayName").toString();
  },
  get description()
  {
    return localize("miner_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "miner",
      // TODO 2019.11.05 | never gets rechecked if the star is captured while the unit is in it. same problem with other modifiers relying on checks outside their own scope
      filter: unit =>
      {
        const locationHasResources = Boolean(unit.fleet.location.resource);
        const locationIsControlledByOwner = unit.fleet.player === unit.fleet.location.owner;

        return locationHasResources && locationIsControlledByOwner;
      },
      propagations:
      {
        localStar:
        [
          {
            key: "localMiner",
            self:
            {
              adjustments:
              {
                mining: {flat: 1},
              },
            },
          },
        ],
      },
    },
  ],
};
