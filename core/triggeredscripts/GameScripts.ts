import {Game} from "../game/Game";

export interface GameScripts
{
  afterInit: (game: Game) => void;
  beforePlayerTurnEnd: (game: Game) => void;
}
