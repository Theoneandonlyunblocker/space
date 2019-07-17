import {Point} from "../Point";
import {IdGeneratorValues} from "../idGenerators";
import {ModuleSaveData} from "../GameModule";

import {GameSaveData} from "./GameSaveData";

export interface FullSaveData
{
  name: string;
  date: string;
  appVersion: string;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point | undefined;
  moduleData: ModuleSaveData[];
}
