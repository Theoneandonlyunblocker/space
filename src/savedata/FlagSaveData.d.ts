import ColorSaveData from "./ColorSaveData.d.ts";
import EmblemSaveData from "./EmblemSaveData.d.ts";

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
