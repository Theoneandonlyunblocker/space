import Point from "../Point";
import {IdGeneratorValues} from "../idGenerators";
import {ModuleSaveData} from "../ModuleFile";

import GameSaveData from "./GameSaveData";

declare interface FullSaveData
{
  name: string;
  date: string;
  appVersion: string;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point | undefined;
  moduleData: ModuleSaveData[];
}

export default FullSaveData;
