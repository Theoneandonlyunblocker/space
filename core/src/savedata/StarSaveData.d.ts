import {BuildingSaveData} from "./BuildingSaveData";
import {ManufactorySaveData} from "./ManufactorySaveData";
import { Resources } from "../player/PlayerResources";

export interface StarSaveData
{
  id: number;
  x: number;
  y: number;

  baseIncome: Resources;
  name: string;
  ownerId: number;
  linksToIds: number[];
  linksFromIds: number[];
  seed: string;

  resource?: string;
  manufactory?: ManufactorySaveData;

  buildings: BuildingSaveData[];

  race: string;
  terrain: string;
}
