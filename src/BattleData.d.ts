import Building from "./Building";
import Player from "./Player";
import Star from "./Star";
import Unit from "./Unit";

declare interface BattleData
{
  location: Star;
  building?: Building;
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

export default BattleData;
