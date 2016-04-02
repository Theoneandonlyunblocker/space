import Star from "./Star.ts";
import Building from "./Building.ts";
import Player from "./Player.ts";
import Unit from "./Unit.ts";

declare interface BattleData
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

export default BattleData;
