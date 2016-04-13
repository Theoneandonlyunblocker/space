import GalaxyMapSaveData from "./GalaxyMapSaveData";
import PlayerSaveData from "./PlayerSaveData";
import NotificationLogSaveData from "./NotificationLogSaveData";

declare interface GameSaveData
{
  turnNumber: number;
  galaxyMap: GalaxyMapSaveData;
  players: PlayerSaveData[];
  humanPlayerId: number;
  notificationLog: NotificationLogSaveData;
}

export default GameSaveData;
