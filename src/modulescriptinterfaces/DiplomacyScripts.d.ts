import {Game} from "../Game";
import {Player} from "../Player";

export interface DiplomacyScripts
{
  onWarDeclaration: ((aggressor: Player, defender: Player, game: Game) => void);
  onFirstMeeting: ((a: Player, b: Player, game: Game) => void);
}
