import {MapGenResult} from "../map/MapGenResult";
import {Player} from "../player/Player";

import {MapGenOptionValues} from "./MapGenOptionValues";

export declare type MapGenFunction = (options: MapGenOptionValues, players: Player[]) => MapGenResult;
