import UnitSaveData from "./UnitSaveData";
import NameSaveData from "./NameSaveData";

declare interface FleetSaveData
{
  id: number;
  name: NameSaveData;
  locationId: number;
  playerId: number;
  units: UnitSaveData[];
}

export default FleetSaveData;
