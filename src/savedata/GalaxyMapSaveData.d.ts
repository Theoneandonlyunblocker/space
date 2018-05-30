import Point from "../Point";

import StarSaveData from "./StarSaveData";

declare interface GalaxyMapSaveData
{
  width: number;
  height: number;
  seed: string;
  stars: StarSaveData[];
  fillerPoints: Point[];
}

export default GalaxyMapSaveData;
