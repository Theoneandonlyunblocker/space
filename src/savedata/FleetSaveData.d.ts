import UnitSaveData from "./UnitSaveData.d.ts";

declare interface FleetSaveData
{
  id: number;
  name: string;
  locationId: number;
  playerId: number;
  units: UnitSaveData[];
}

export default FleetSaveData;
