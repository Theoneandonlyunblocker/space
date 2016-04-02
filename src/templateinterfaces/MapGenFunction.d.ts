import MapGenOptionValues from "./MapGenOptionValues.d.ts";
import Player from "../Player.ts";
import MapGenResult from "../mapgencore/MapGenResult.ts";

declare interface MapGenFunction
{
  (options: MapGenOptionValues, players: Player[]): MapGenResult;
}

export default MapGenFunction;
