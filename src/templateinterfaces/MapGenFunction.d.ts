import MapGenOptionValues from "./MapGenOptionValues";
import Player from "../Player";
import MapGenResult from "../mapgencore/MapGenResult";

declare interface MapGenFunction
{
  (options: MapGenOptionValues, players: Player[]): MapGenResult;
}

export default MapGenFunction;
