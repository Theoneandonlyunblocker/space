import {AttitudeModifier} from "core/src/diplomacy/AttitudeModifier";
import {Game} from "core/src/game/Game";
import {Player} from "core/src/player/Player";

import
{
  baseOpinion,
  declaredWar,
} from "./attitudeModifierTemplates";
import { PartialTriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScripts";


export const attitudeModifierModuleScripts: PartialTriggeredScriptsWithData =
{
  diplomacy:
  {
    onFirstMeeting:
    {
      addBaseOpinionAttitudeModifier:
      {
        triggerPriority: 0,
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
    },
    onWarDeclaration:
    {
      addDeclaredWarAttitudeModifier:
      {
        triggerPriority: 0,
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
    },
  },
};
