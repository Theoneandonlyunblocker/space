import ColorSaveData from "./ColorSaveData";
import EmblemSaveData from "./EmblemSaveData";

declare interface FlagSaveData
{
  mainColor: ColorSaveData;
  secondaryColor?: ColorSaveData;
  tetriaryColor?: ColorSaveData;

  customImage?: string;

  seed?: any;

  foregroundEmblem?: EmblemSaveData;
  backgroundEmblem?: EmblemSaveData;
}

export default FlagSaveData;
