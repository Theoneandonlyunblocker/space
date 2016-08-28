import Player from "./Player";
import IDDictionary from "./IDDictionary";


export default class ValuesByPlayer<T> extends IDDictionary<Player, T>
{
  constructor(players?: Player[], getValueFN?: (player: Player) => T)
  {
    super(players, getValueFN);
  }
}
