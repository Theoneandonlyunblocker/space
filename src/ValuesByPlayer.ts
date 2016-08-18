import Player from "./Player";
import IDDictionary from "./IDDictionary";

interface Zipped<T>
{
  player: Player;
  value: T;
}

export default class ValuesByPlayer<T> extends IDDictionary<Player, T, Zipped<T>>
{
  [playerID: number]: T;

  constructor(players: Player[], getValueFN: (player: Player) => T)
  {
    super("player", "value", players, getValueFN);
  }
}
