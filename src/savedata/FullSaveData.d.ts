import Point from "../Point";
import {IdGeneratorValues} from "../idGenerators";

import GameSaveData from "./GameSaveData";

declare interface FullSaveData
{
  name: string;
  date: Date;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point;
}

export default FullSaveData;
