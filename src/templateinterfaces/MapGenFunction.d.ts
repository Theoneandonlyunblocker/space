import {MapGenResult} from "../MapGenResult";
import {Player} from "../Player";

import {MapGenOptionValues} from "./MapGenOptionValues";

export declare type MapGenFunction = (options: MapGenOptionValues, players: Player[]) => MapGenResult;
