import DiplomacyState from "../DiplomacyState";

import AttitudeModifierSaveData from "./AttitudeModifierSaveData";

declare interface PlayerDiplomacySaveData
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

export default PlayerDiplomacySaveData;
