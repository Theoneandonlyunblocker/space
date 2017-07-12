import {IdDictionary} from "./IdDictionary";
import Player from "./Player";


export default class ValuesByPlayer<T> extends IdDictionary<Player, T>
{
  constructor(players?: Player[], getValueFN?: (player: Player) => T)
  {
    super(players, getValueFN);
  }
}
