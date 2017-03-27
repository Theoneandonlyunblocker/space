import {IDDictionary} from "./IDDictionary";
import Player from "./Player";


export default class ValuesByPlayer<T> extends IDDictionary<Player, T>
{
  constructor(players?: Player[], getValueFN?: (player: Player) => T)
  {
    super(players, getValueFN);
  }
}
