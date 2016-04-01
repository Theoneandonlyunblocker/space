/// <reference path="player.ts" />
/// <reference path="building.ts" />
/// <reference path="unit.ts" />

declare namespace Rance
{
  interface IFleetAttackTarget
  {
    type: string;
    enemy: Player;
    building?: Building;
    units: Unit[]
  }
}
