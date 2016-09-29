import ColorSaveData from "./ColorSaveData";
import EmblemSaveData from "./EmblemSaveData";

declare interface FlagSaveData
{
  mainColor: ColorSaveData;
  emblems: EmblemSaveData[];
}

export default FlagSaveData;
