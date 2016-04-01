/// <reference path="igalaxymapsavedata.d.ts" />
/// <reference path="iplayersavedata.d.ts" />
/// <reference path="inotificationlogsavedata.d.ts" />

declare interface IGameSaveData
{
  turnNumber: number;
  galaxyMap: IGalaxyMapSaveData;
  players: IPlayerSaveData[];
  humanPlayerId: number;
  notificationLog: INotificationLogSaveData;
}
