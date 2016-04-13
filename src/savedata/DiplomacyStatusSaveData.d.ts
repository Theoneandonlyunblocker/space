import AttitudeModifierSaveData from "./AttitudeModifierSaveData";
import DiplomacyState from "../DiplomacyState";

declare interface DiplomacyStatusSaveData
{
  metPlayerIds: number[];
  statusByPlayer:
  {
    [playerId: number]: DiplomacyState
  };

  attitudeModifiersByPlayer:
  {
    [playerId: number]: AttitudeModifierSaveData[];
  };
}

export default DiplomacyStatusSaveData;
