import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";


export const medic: PassiveSkillTemplate =
{
  key: "medic",
  get displayName()
  {
    return localize("medic_displayName").toString();
  },
  get description()
  {
    return localize("medic_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "medic",
      // TODO 2020.02.29 | implement

      // atTurnStart:
      // const star = user.fleet.location;
      // const allFriendlyUnits = star.getUnits(player => player === user.fleet.player);
      // for (let i = 0; i < allFriendlyUnits.length; i++)
      // {
      //   allFriendlyUnits[i].addHealth(allFriendlyUnits[i].maxHealth);
      // }
    },
  ],
};
