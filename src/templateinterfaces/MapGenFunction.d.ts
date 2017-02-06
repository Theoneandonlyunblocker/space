import MapGenResult from "../MapGenResult";
import Player from "../Player";
import MapGenOptionValues from "./MapGenOptionValues";

declare interface MapGenFunction
{
  (options: MapGenOptionValues, players: Player[]): MapGenResult;
}

export default MapGenFunction;
