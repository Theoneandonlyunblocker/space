import MapGenOptions from "./MapGenOptions.d.ts";
import MapGenFunction from "./MapGenFunction.d.ts";

declare interface MapGenTemplate
{
  key: string;
  displayName: string;
  description?: string;

  minPlayers: number;
  maxPlayers: number;

  options: MapGenOptions;

  mapGenFunction: MapGenFunction;
}

export default MapGenTemplate;
