import {Game} from "../game/Game";
import {Player} from "../player/Player";

export interface DiplomacyScripts
{
  onWarDeclaration: ((aggressor: Player, defender: Player, game: Game) => void);
  onFirstMeeting: ((a: Player, b: Player, game: Game) => void);
}
