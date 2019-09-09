import {ColorSaveData} from "./ColorSaveData";
import {EmblemSaveData} from "./EmblemSaveData";

export interface FlagSaveData
{
  mainColor: ColorSaveData;
  emblems: EmblemSaveData[];
}
