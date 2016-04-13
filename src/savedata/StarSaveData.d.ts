import ManufactorySaveData from "./ManufactorySaveData";
import StarBuildingsSaveData from "./StarBuildingsSaveData";

declare interface StarSaveData
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
  manufactory?: ManufactorySaveData;

  buildings: StarBuildingsSaveData;
}

export default StarSaveData;
