import {Point} from "../math/Point";

import {StarSaveData} from "./StarSaveData";

export interface GalaxyMapSaveData
{
  width: number;
  height: number;
  seed: string;
  stars: StarSaveData[];
  fillerPoints: Point[];
}
