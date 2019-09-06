import {AttitudeModifier} from "src/diplomacy/AttitudeModifier";
import {Game} from "src/game/Game";
import {Player} from "src/player/Player";

import
{
  baseOpinion,
  declaredWar,
} from "./attitudeModifierTemplates";


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
          const friendliness = a.aiController.personality.friendliness;

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
