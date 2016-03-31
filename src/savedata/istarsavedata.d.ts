/// <reference path="imanufactorysavedata.d.ts" />

declare namespace Rance
{
  interface IStarBuildingsSaveData
  {
    [category: string]: IBuildingSaveData[];
  }
  interface IStarSaveData
  {
    id: number;
    x: number;
    y: number;

    baseIncome: number;
    name: string;
    ownerId: number;
    linksToIds: number[];
    linksFromIds: number[];
    seed: string;
    buildableUnitTypes: string[];

    resourceType?: string;
    manufactory?: IManufactorySaveData;

    buildings: IStarBuildingsSaveData;
  }
}
