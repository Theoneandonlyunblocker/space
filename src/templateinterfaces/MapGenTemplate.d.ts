import MapGenOptions from "./MapGenOptions";
import MapGenFunction from "./MapGenFunction";

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
