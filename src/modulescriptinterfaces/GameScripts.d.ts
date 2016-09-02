import Game from "../Game";

export interface PartialGameScripts
{
  afterInit?: ((game: Game) => void)[];
}

export interface GameScripts extends PartialGameScripts
{
  afterInit: ((game: Game) => void)[];
}

export default GameScripts