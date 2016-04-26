import GameSaveData from "./GameSaveData";
import {IDGeneratorValues} from "../idGenerators";
import Point from "../Point";

declare interface FullSaveData
{
  name: string;
  date: Date;
  gameData: GameSaveData;
  idGenerators: IDGeneratorValues;
  cameraLocation: Point;
}

export default FullSaveData;
