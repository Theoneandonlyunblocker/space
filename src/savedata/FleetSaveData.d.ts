import NameSaveData from "./NameSaveData";

declare interface FleetSaveData
{
  id: number;
  name: NameSaveData;
  locationId: number;
  playerId: number;
  unitIds: number[];
}

export default FleetSaveData;
