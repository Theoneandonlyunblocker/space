import DiplomacyState from "../DiplomacyState";
import AttitudeModifierSaveData from "./AttitudeModifierSaveData";

declare interface DiplomacyStatusSaveData
{
  metPlayerIds: number[];
  statusByPlayer:
  {
    [playerId: number]: DiplomacyState,
  };

  attitudeModifiersByPlayer:
  {
    [playerId: number]: AttitudeModifierSaveData[];
  };
}

export default DiplomacyStatusSaveData;
