/// <reference path="istarsavedata.d.ts" />
/// <reference path="../point.ts" />

declare namespace Rance
{
  interface IGalaxyMapSaveData
  {
    width: number;
    height: number;
    seed: string;
    stars: IStarSaveData[];
    fillerPoints: Point[];
  }
}
