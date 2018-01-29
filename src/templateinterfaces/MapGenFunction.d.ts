import MapGenResult from "../MapGenResult";
import Player from "../Player";
import MapGenOptionValues from "./MapGenOptionValues";

declare type MapGenFunction = (options: MapGenOptionValues, players: Player[]) => MapGenResult;

export default MapGenFunction;
