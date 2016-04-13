import Building from "./Building";
import Player from "./Player";
import Unit from "./Unit";

declare interface FleetAttackTarget
{
  type: string;
  enemy: Player;
  building?: Building;
  units: Unit[];
}

export default FleetAttackTarget;
