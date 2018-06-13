import Player from "./Player";
import Unit from "./Unit";
import { TerritoryBuilding } from "./Building";

declare interface FleetAttackTarget
{
  type: string;
  enemy: Player;
  building?: TerritoryBuilding;
  units: Unit[];
}

export default FleetAttackTarget;
