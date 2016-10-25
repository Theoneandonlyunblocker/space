import GalaxyMapSaveData from "./GalaxyMapSaveData";
import PlayerSaveData from "./PlayerSaveData";
import UnitSaveData from "./UnitSaveData";
import NotificationLogSaveData from "./NotificationLogSaveData";

declare interface GameSaveData
{
  turnNumber: number;
  galaxyMap: GalaxyMapSaveData;
  players: PlayerSaveData[];
  units: UnitSaveData[];
  humanPlayerId: number;
  notificationLog: NotificationLogSaveData;
}

export default GameSaveData;
