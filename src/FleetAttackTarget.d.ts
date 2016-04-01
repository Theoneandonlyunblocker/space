import Building from "./Building.ts";
import Player from "./Player.ts";
import Unit from "./Unit.ts";

declare interface FleetAttackTarget
{
  type: string;
  enemy: Player;
  building?: Building;
  units: Unit[];
}

export default FleetAttackTarget;
