declare namespace Rance
{
  interface IFlagSaveData
  {
    mainColor: number;
    secondaryColor?: number;
    tetriaryColor?: number;

    customImage?: string;

    seed?: any;

    foregroundEmblem?: IEmblemSaveData;
    backgroundEmblem?: IEmblemSaveData;
  }
}
