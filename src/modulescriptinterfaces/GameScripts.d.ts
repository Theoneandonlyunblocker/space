import {Game} from "../Game";

export interface GameScripts
{
  afterInit: (game: Game) => void;
  beforePlayerTurnEnd: (game: Game) => void;
}
