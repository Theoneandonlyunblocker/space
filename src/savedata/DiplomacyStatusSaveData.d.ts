import DiplomacyState from "../DiplomacyState";
import AttitudeModifierSaveData from "./AttitudeModifierSaveData";

declare interface DiplomacyStatusSaveData
{
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
