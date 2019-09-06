import {TerritoryBuilding} from "../building/Building";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {Unit} from "../unit/Unit";

export interface BattleData
{
  location: Star;
  building?: TerritoryBuilding;
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
