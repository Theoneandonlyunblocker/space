/// <reference path="player.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="star.ts"/>
/// <reference path="building.ts"/>


declare namespace Rance
{
  interface IBattleData
  {
    location: Star;
    building: Building;
    attacker:
    {
      player: Player;
      units: Unit[];
    };
    defender:
    {
      player: Player;
      units: Unit[];
    };
  }
}
