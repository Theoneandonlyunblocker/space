import EmblemSaveData from "./EmblemSaveData.d.ts";

declare interface FlagSaveData
{
  mainColor: number;
  secondaryColor?: number;
  tetriaryColor?: number;

  customImage?: string;

  seed?: any;

  foregroundEmblem?: EmblemSaveData;
  backgroundEmblem?: EmblemSaveData;
}

export default FlagSaveData;
