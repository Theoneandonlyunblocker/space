import AttitudeModifierSaveData from "./AttitudeModifierSaveData.d.ts";
import DiplomacyState from "../DiplomacyState.ts";

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
