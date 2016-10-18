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

  resourceType?: string;
  manufactory?: ManufactorySaveData;

  buildings: StarBuildingsSaveData;

  raceKey: string;
}

export default StarSaveData;
