/// <reference path="player.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="star.ts"/>
/// <reference path="building.ts"/>


module Rance
{
  export interface IBattleData
  {
    location: Star;
    building: Building;
    attacker:
    {
      player: Player;
      ships: Unit[];
    };
    defender:
    {
      player: Player;
      ships: Unit[];
    };
  }
}
