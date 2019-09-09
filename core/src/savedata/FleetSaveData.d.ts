import {NameSaveData} from "./NameSaveData";

export interface FleetSaveData
{
  id: number;
  name: NameSaveData;
  locationId: number;
  playerId: number;
  unitIds: number[];
}
