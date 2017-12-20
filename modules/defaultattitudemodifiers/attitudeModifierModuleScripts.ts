import
{
  declaredWar,
} from "./AttitudeModifierTemplates";

import {AttitudeModifier} from "../../src/AttitudeModifier";
import Player from "../../src/Player";


export const attitudeModifierModuleScripts =
{
  diplomacy:
  {
    onWarDeclaration:
    [
      {
        key: "addDeclaredWarAttitudeModifier",
        priority: 0,
        script: (aggressor: Player, defender: Player) =>
        {
          const modifier = new AttitudeModifier(
          {
            template: declaredWar,
            // TODO 2017.12.19 |
            startTurn: 0,
          });

          defender.diplomacy.addAttitudeModifier(aggressor, modifier);
        },
      }
    ]
  },
};
