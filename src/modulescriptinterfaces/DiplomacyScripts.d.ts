import Player from "../Player";

export interface DiplomacyScripts
{
  onWarDeclaration: ((aggressor: Player, defender: Player) => void);
  onFirstMeeting: ((a: Player, b: Player) => void);
}
