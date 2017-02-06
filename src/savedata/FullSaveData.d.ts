import Point from "../Point";
import {IDGeneratorValues} from "../idGenerators";
import GameSaveData from "./GameSaveData";

declare interface FullSaveData
{
  name: string;
  date: Date;
  gameData: GameSaveData;
  idGenerators: IDGeneratorValues;
  cameraLocation: Point;
}

export default FullSaveData;
