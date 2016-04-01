declare interface IDiplomacyStatusSaveData
{
  metPlayerIds: number[];
  statusByPlayer:
  {
    [playerId: number]: DiplomaticState
  };

  attitudeModifiersByPlayer:
  {
    [playerId: number]: IAttitudeModifierSaveData[];
  };
}
