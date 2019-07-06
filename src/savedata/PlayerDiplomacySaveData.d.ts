import {DiplomacyState} from "../DiplomacyState";

import {AttitudeModifierSaveData} from "./AttitudeModifierSaveData";

export interface PlayerDiplomacySaveData
{
  statusByPlayer:
  {
    [playerId: number]: DiplomacyState;
  };
  attitudeModifiersByPlayer:
  {
    [playerId: number]: AttitudeModifierSaveData[];
  };
}
