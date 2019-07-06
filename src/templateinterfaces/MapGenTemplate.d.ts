import {MapGenFunction} from "./MapGenFunction";
import {MapGenOptions} from "./MapGenOptions";

export interface MapGenTemplate
{
  key: string;
  displayName: string;
  description?: string;

  minPlayers: number;
  maxPlayers: number;

  options: MapGenOptions;

  mapGenFunction: MapGenFunction;
}
