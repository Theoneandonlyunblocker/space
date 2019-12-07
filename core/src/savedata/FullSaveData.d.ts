import {Point} from "../math/Point";
import {IdGeneratorValues} from "../app/idGenerators";
import {ModuleSaveData} from "../modules/GameModule";

import {GameSaveData} from "./GameSaveData";

export interface FullSaveData
{
  name: string;
  date: string;
  appVersion: string;
  gameData: GameSaveData;
  idGenerators: IdGeneratorValues;
  cameraLocation: Point | undefined;
  moduleData: {[moduleKey: string]: ModuleSaveData};
}
