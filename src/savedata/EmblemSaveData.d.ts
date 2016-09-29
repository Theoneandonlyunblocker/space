import ColorSaveData from "./ColorSaveData";

declare interface EmblemSaveData
{
  alpha: number;
  colors: ColorSaveData[];
  templateKey: string;
}

export default EmblemSaveData;
