import GalaxyMapSaveData from "./GalaxyMapSaveData";
import PlayerSaveData from "./PlayerSaveData";
import UnitSaveData from "./UnitSaveData";
import NotificationLogSaveData from "./NotificationLogSaveData";
import ItemSaveData from "./ItemSaveData";

declare interface GameSaveData
{
  turnNumber: number;
  galaxyMap: GalaxyMapSaveData;
  players: PlayerSaveData[];
  units: UnitSaveData[];
  items: ItemSaveData[];
  humanPlayerId: number;
  notificationLog: NotificationLogSaveData;
}

export default GameSaveData;
