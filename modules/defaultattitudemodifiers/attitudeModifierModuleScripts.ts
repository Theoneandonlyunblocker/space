import
{
  baseOpinion,
  declaredWar,
} from "./AttitudeModifierTemplates";

import {AttitudeModifier} from "../../src/AttitudeModifier";
import Player from "../../src/Player";


export const attitudeModifierModuleScripts =
{
  diplomacy:
  {
    onFirstMeeting:
    [
      {
        key: "addBaseOpinionAttitudeModifier",
        priority: 0,
        script: (a: Player, b: Player) =>
        {
          const friendliness = a.AIController.personality.friendliness;

          const opinion = Math.round((friendliness - 0.5) * 10);

          const modifier = new AttitudeModifier(
          {
            template: baseOpinion,
            // TODO 2017.12.19 |
            startTurn: 0,
            strength: opinion,
            hasFixedStrength: true,
          });

          a.diplomacy.addAttitudeModifier(b, modifier);
        },
      },
    ],
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
