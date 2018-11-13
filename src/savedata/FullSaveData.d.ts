import Point from "../Point";
import {IdGeneratorValues} from "../idGenerators";
import {ModuleFileGameSaveData} from "../ModuleFile";

import GameSaveData from "./GameSaveData";

declare interface FullSaveData
{
  name: string;
  date: string;
  appVersion: string;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point | undefined;
  moduleData: ModuleFileGameSaveData[];
}

export default FullSaveData;
