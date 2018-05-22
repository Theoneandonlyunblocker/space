import GalaxyMapSaveData from "./GalaxyMapSaveData";
import ItemSaveData from "./ItemSaveData";
import NotificationStoreSaveData from "./NotificationStoreSaveData";
import PlayerSaveData from "./PlayerSaveData";
import UnitSaveData from "./UnitSaveData";

declare interface GameSaveData
{
  turnNumber: number;
  galaxyMap: GalaxyMapSaveData;
  players: PlayerSaveData[];
  units: UnitSaveData[];
  items: ItemSaveData[];
  notificationStore: NotificationStoreSaveData;
}

export default GameSaveData;
