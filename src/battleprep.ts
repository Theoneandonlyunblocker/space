/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>

module Rance
{
  export class BattlePrep
  {
    player: Player;
    fleet: Unit[][];

    constructor(player: Player)
    {
      this.player = player;
      this.fleet =
      [
        [null, null, null, null],
        [null, null, null, null]
      ];
    }

    setUnit(position: number[], unit: Unit)
    {
      this.fleet[position[0]][position[1]] = unit;
    }
  }
}
