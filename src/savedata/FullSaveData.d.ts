import Point from "../Point";
import {IdGeneratorValues} from "../idGenerators";
import {ModuleFileSaveData} from "../ModuleFile";

import GameSaveData from "./GameSaveData";

declare interface FullSaveData
{
  name: string;
  date: Date;
  appVersion: string;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point | undefined;
  moduleData: ModuleFileSaveData[];
}

export default FullSaveData;
