import GalaxyMapSaveData from "./GalaxyMapSaveData";
import ItemSaveData from "./ItemSaveData";
import NotificationLogSaveData from "./NotificationLogSaveData";
import PlayerSaveData from "./PlayerSaveData";
import UnitSaveData from "./UnitSaveData";

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
