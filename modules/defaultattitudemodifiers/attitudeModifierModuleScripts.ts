import {AttitudeModifier} from "../../src/AttitudeModifier";
import Game from "../../src/Game";
import Player from "../../src/Player";

import
{
  baseOpinion,
  declaredWar,
} from "./AttitudeModifierTemplates";


export const attitudeModifierModuleScripts =
{
  diplomacy:
  {
    onFirstMeeting:
    [
      {
        key: "addBaseOpinionAttitudeModifier",
        priority: 0,
        script: (a: Player, b: Player, game: Game) =>
        {
          const friendliness = a.AIController.personality.friendliness;

          const opinion = Math.round((friendliness - 0.5) * 10);

          const modifier = new AttitudeModifier(
          {
            template: baseOpinion,
            startTurn: game.turnNumber,
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
        script: (aggressor: Player, defender: Player, game: Game) =>
        {
          const modifier = new AttitudeModifier(
          {
            template: declaredWar,
            startTurn: game.turnNumber,
          });

          defender.diplomacy.addAttitudeModifier(aggressor, modifier);
        },
      }
    ]
  },
};
