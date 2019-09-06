import {Player} from "../player/Player";
import {Unit} from "../unit/Unit";
import { TerritoryBuilding } from "../building/Building";

export interface FleetAttackTarget
{
  type: string;
  enemy: Player;
  building?: TerritoryBuilding;
  units: Unit[];
}
