import Player from "./Player";
import IDDictionary from "./IDDictionary";

interface PlayerWithValue<T>
{
  player: Player;
  value: T;
}

export default class ValuesByPlayer<T> extends IDDictionary<Player, T, PlayerWithValue<T>>
{
  constructor(players?: Player[], getValueFN?: (player: Player) => T)
  {
    super(players, getValueFN);
    this.keyName = "player";
    this.valueName = "value";
  }
}
