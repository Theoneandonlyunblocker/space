import Point from "../Point.ts";
import StarSaveData from "./StarSaveData.d.ts";

declare interface GalaxyMapSaveData
{
  width: number;
  height: number;
  seed: string;
  stars: StarSaveData[];
  fillerPoints: Point[];
}

export default GalaxyMapSaveData;
